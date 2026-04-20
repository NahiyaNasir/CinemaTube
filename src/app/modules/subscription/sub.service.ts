import Stripe from "stripe";
import { MediaPurchaseStatus, MediaPurchaseType, SubscriptionPlan, SubscriptionStatus } from "../../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/email";

import httpStatus from "http-status";

const getPlans = async () => {
  return [
    {
      name: SubscriptionPlan.FREE,
      price: 0,
      badge: null,
      features: [
        "Access to free titles only",
        "480p streaming quality",
        "1 device at a time",
        "Ad-supported experience",
        "Limited new releases",
        "Community reviews & ratings",
      ],
    },
    {
      name: SubscriptionPlan.MONTHLY,
      price: 9.99,
      badge: "Most Popular",
      features: [
        "Access to all premium titles",
        "Full HD 1080p streaming",
        "2 devices simultaneously",
        "Ad-free experience",
        "New releases on day one",
        "Download for offline viewing",
        "Community reviews & ratings",
        "Cancel anytime",
      ],
    },
    {
      name: SubscriptionPlan.YEARLY,
      price: 99.99,
      badge: "Best Value",
      features: [
        "Everything in Monthly",
        "4K Ultra HD + HDR streaming",
        "4 devices simultaneously",
        "Ad-free experience",
        "Early access to new releases",
        "Download for offline viewing",
        "Priority customer support",
        "Exclusive member-only content",
        "Save 16% vs monthly billing",
      ],
    },
  ];
};

const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  plan: SubscriptionPlan,
) => {
  if (plan === SubscriptionPlan.FREE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Free plan does not require a checkout session.",
    );
  }

  const prices: Record<string, number> = {
    [SubscriptionPlan.MONTHLY]: 999, // $9.99 -> 999 cents
    [SubscriptionPlan.YEARLY]: 9999, // $99.99 -> 9999 cents
  };

  // 1. Create temporary stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `CinemaTube  ${plan} Plan`,
            description: `Unlock premium features with ${plan} subscription.`,
          },
          unit_amount: prices[plan],
          recurring: {
            interval: plan === SubscriptionPlan.MONTHLY ? "month" : "year",
          },
        },
        quantity: 1,
      },
    ],

    metadata: {
      userId,
      plan,
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
  });

  return { session_url: session.url };
};

const handleWebhook = async (body: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Webhook Signature Error: ${err.message}`,
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plan, mediaId, type } = session.metadata || {};
    const stripePaymentId = (session.payment_intent as string) || session.id;
    const amount = (session.amount_total || 0) / 100;

    if (!userId) {
      console.error("❌ Webhook Error: No userId in metadata", session.id);
      return { received: true };
    }

    if (plan) {
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      if (plan === SubscriptionPlan.MONTHLY) {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }

      await prisma.$transaction(async (tx) => {
        const updatedSubscription = await tx.subscription.upsert({
          where: { userId },
          update: {
            plan: plan as SubscriptionPlan,
            status: SubscriptionStatus.ACTIVE,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            currentPeriodStart,
            currentPeriodEnd,
          },
          create: {
            userId,
            plan: plan as SubscriptionPlan,
            status: SubscriptionStatus.ACTIVE,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            currentPeriodStart,
            currentPeriodEnd,
          },
        });

        await tx.payment.create({
          data: {
            userId,
            subscriptionId: updatedSubscription.id,
            amount,
            currency: session.currency || "usd",
            stripePaymentId,
            status: "COMPLETED",
          },
        });
      });
    }

    // ─── CASE 2: MEDIA PURCHASE (BUY OR RENTAL) ──────────────────────
    if (mediaId && type) {
      await prisma.$transaction(async (tx) => {
        const expiresAt = type === MediaPurchaseType.RENTAL
          ? new Date(Date.now() + 48 * 60 * 60 * 1000)
          : null;

        // 1. Create the MediaPurchase record
        const mediaPurchase = await tx.mediaPurchase.create({
          data: {
            userId,
            mediaId,
            type: type as MediaPurchaseType,
            status: MediaPurchaseStatus.ACTIVE,
            price: amount,
            expiresAt,
            stripePaymentId,
          },
        });

        let rentalId = null;

        // 2. If it's a rental, explicitly create the Rental record
        if (type === MediaPurchaseType.RENTAL) {
          const rental = await tx.rental.create({
            data: {
              userId,
              mediaId,
              expiresAt: expiresAt!,
              price: amount,
              status: "ACTIVE",
            },
          });
          rentalId = rental.id;
        }

        // 3. Create the Payment record and LINK everything
        await tx.payment.create({
          data: {
            userId,
            amount,
            currency: session.currency || "usd",
            stripePaymentId,
            status: "COMPLETED",
            mediaPurchaseId: mediaPurchase.id, // Links Payment to MediaPurchase
            rentalId: rentalId,                // Links Payment to Rental
          },
        });
      });

      console.log(`✅ Media ${type} successful and connected for User: ${userId}`);
    }
  }

  return { received: true };
};

const getSubscriptionStatus = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return { status: SubscriptionStatus.EXPIRED, plan: SubscriptionPlan.FREE };
  }

  if (
    subscription.currentPeriodEnd &&
    new Date() > subscription.currentPeriodEnd &&
    subscription.status === SubscriptionStatus.ACTIVE
  ) {
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: SubscriptionStatus.EXPIRED },
    });
    return updated;
  }

  return subscription;
};

const getPaymentHistory = async (userId: string) => {
  
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return subscriptions;
};

const cancelSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "No active subscription found");
  }

  if (subscription.status !== SubscriptionStatus.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "Subscription is not active");
  }

  if (!subscription.stripeCustomerId) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Stripe customer found");
  }

  // 1. Find the Stripe subscription ID from the customer
  const stripeSubscriptions = await stripe.subscriptions.list({
    customer: subscription.stripeCustomerId,
    status: "active",
    limit: 1,
  });

  if (!stripeSubscriptions.data.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No active Stripe subscription found",
    );
  }

  const stripeSubscriptionId = stripeSubscriptions.data[0].id;

  // 2. Find the latest payment for refund
  const latestPayment = await prisma.payment.findFirst({
    where: { subscriptionId: subscription.id },
    orderBy: { createdAt: "desc" },
  });

  // 3. Cancel the Stripe subscription immediately
  await stripe.subscriptions.cancel(stripeSubscriptionId);

  // 4. Issue refund if there's a payment
  let refund = null;
  if (latestPayment?.stripePaymentId) {
    try {
      // Get the payment intent to find the charge
      const paymentIntent = await stripe.paymentIntents.retrieve(
        latestPayment.stripePaymentId,
      );

      if (paymentIntent.latest_charge) {
        refund = await stripe.refunds.create({
          charge: paymentIntent.latest_charge as string,
          // Remove amount for full refund, or specify partial:
          // amount: Math.round(latestPayment.amount * 100),
        });
      }
    } catch (refundError) {
      console.error("Refund failed:", refundError);
      // Don't throw — still cancel the subscription even if refund fails
    }
  }

  // 5. Update DB
  const updated = await prisma.subscription.update({
    where: { userId },
    data: {
      status: SubscriptionStatus.CANCELLED,
      cancelAtPeriodEnd: false,
      plan: SubscriptionPlan.FREE,
    },
  });

  // 6. Send cancellation email
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    try {
      await sendEmail({
        to: user.email,
        subject: "Your Cinema Tube Subscription Has Been Cancelled",
        templateName: "subscription-cancelled",
        templateData: {
          userName: user.name,
          refunded: !!refund,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });
    } catch (emailError) {
      console.error("Failed to send cancellation email", emailError);
    }
  }

  return {
    cancelled: true,
    refunded: !!refund,
    refundId: refund?.id ?? null,
  };
};

export const SubscriptionService = {
  getPlans,
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  getPaymentHistory,
  cancelSubscription,
};