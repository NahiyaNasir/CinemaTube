import status from "http-status";
import { MediaPurchaseStatus, MediaPurchaseType } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";


const RENTAL_DURATION_HOURS = 48;

const getMyPayments = async (user: IRequestUser) => {
  return await prisma.payment.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      subscription: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(prisma.payment, query as any, {
    searchableFields: ["stripePaymentId", "status"],
    filterableFields: ["status", "currency"],
  })
    .search()
    .filter()
    .sort()
    .include({
      user: true,
      subscription: true,
      mediaPurchase: {
        include: { media: true },
      },
      rental: {
        include: { media: true },
      }
    })
    .paginate()
    .fields();

  const result = await paymentQuery.execute();
  return result;
};

const getMyMediaPurchases = async (user: IRequestUser) => {
  return await prisma.mediaPurchase.findMany({
    where: { userId: user.userId },
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });
};

const createMediaCheckoutSession = async (
  user: IRequestUser,
  mediaId: string,
  type: MediaPurchaseType,
) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError(status.NOT_FOUND, "Media not found");

  if (media.pricing === "FREE")
    throw new AppError(
      status.BAD_REQUEST,
      "This media is free, no purchase needed",
    );

  if (type === MediaPurchaseType.RENTAL && media.pricing !== "RENTAL")
    throw new AppError(
      status.BAD_REQUEST,
      "This media is not available for rental",
    );

  // Check for existing active purchase
  const existing = await prisma.mediaPurchase.findFirst({
    where: {
      userId: user.userId,
      mediaId,
      type,
      status: MediaPurchaseStatus.ACTIVE,
      ...(type === MediaPurchaseType.RENTAL
        ? { expiresAt: { gt: new Date() } }
        : {}),
    },
  });

  if (existing)
    throw new AppError(
      status.CONFLICT,
      "You already have active access to this media",
    );

  const price =
    type === MediaPurchaseType.RENTAL ? media.rentalPrice : media.buyPrice;

  if (!price)
    throw new AppError(
      status.BAD_REQUEST,
      `No ${type.toLowerCase()} price set for this media`,
    );

  const unitAmount = Math.round(Number(price) * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${type === MediaPurchaseType.RENTAL ? "Rent" : "Buy"} — ${media.title}`,
            description:
              type === MediaPurchaseType.RENTAL
                ? `${RENTAL_DURATION_HOURS}-hour rental access`
                : "Permanent access",
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.userId,
      mediaId,
      type,
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
  });

  return { session_url: session.url };
};

const expireOldMediaPurchases = async (userId: string) => {
  await prisma.mediaPurchase.updateMany({
    where: {
      userId,
      type: MediaPurchaseType.RENTAL,
      status: MediaPurchaseStatus.ACTIVE,
      expiresAt: { lt: new Date() },
    },
    data: { status: MediaPurchaseStatus.EXPIRED },
  });
};

const checkMediaAccess = async (user: IRequestUser, mediaId: string) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError(status.NOT_FOUND, "Media not found");

  if (media.pricing === "FREE") return { hasAccess: true, reason: "FREE" };

  if (media.pricing === "PREMIUM") {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.userId },
    });
    const hasAccess =
      subscription?.status === "ACTIVE" &&
      (subscription.plan === "MONTHLY" || subscription.plan === "YEARLY");
    return { hasAccess, reason: "PREMIUM" };
  }

  if (media.pricing === "RENTAL") {
    await expireOldMediaPurchases(user.userId);
    const purchase = await prisma.mediaPurchase.findFirst({
      where: {
        userId: user.userId,
        mediaId,
        type: MediaPurchaseType.RENTAL,
        status: MediaPurchaseStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
    });
    return {
      hasAccess: !!purchase,
      reason: "RENTAL",
      expiresAt: purchase?.expiresAt,
    };
  }

  return { hasAccess: false, reason: "UNKNOWN" };
};

export const PaymentService = {
  getMyPayments,
  getAllPayments,
  getMyMediaPurchases,
  createMediaCheckoutSession,
  checkMediaAccess,
  expireOldMediaPurchases,
};