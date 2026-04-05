



import httpStatus from "http-status";
import { catchAsync } from "../shared/catchAsync";
import { sendResponse } from "../shared/sendResponse";
import { SubscriptionService } from "./sub.service";

const getPlans = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getPlans();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plans retrieved successfully",
    data: result,
  });
});

const createCheckoutSession = catchAsync(async (req, res) => {
  // Using user metadata attached to the request (from authentication middleware)
  const user = req.user as any;
  const { plan } = req.body;

  const result = await SubscriptionService.createCheckoutSession(
    user.userId,
    user.email,
    plan,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
});

const webhook = catchAsync(async (req, res) => {
  // Accessing raw body from express.raw() configured in app.ts
  const signature = req.headers["stripe-signature"] as string;
  const result = await SubscriptionService.handleWebhook(req.body, signature);

  res.status(httpStatus.OK).json(result);
});

const getSubscriptionStatus = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await SubscriptionService.getSubscriptionStatus(user.userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription status retrieved successfully",
    data: result,
  });
});

// const getPaymentHistory = catchAsync(async (req, res) => {
//   const user = req.user as any;
//   const result = await SubscriptionService.getPaymentHistory(user.userId);

//   sendResponse(res, {
//     httpStatusCode: httpStatus.OK,
//     success: true,
//     message: "Payment history retrieved successfully",
//     data: result,
//   });
// });
const cancelSubscription = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await SubscriptionService.cancelSubscription(user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription cancelled and refund initiated",
    data: result,
  });
});
export const SubscriptionController = {
  getPlans,
  createCheckoutSession,
  webhook,
  getSubscriptionStatus,
//   getPaymentHistory,
  cancelSubscription,
};