import { Request, Response } from "express";
import { IRequestUser } from "../../interface";
import { catchAsync } from "../shared/catchAsync";
import { sendResponse } from "../shared/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";
import { MediaPurchaseType } from "../../../generated/prisma/enums";


const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyPayments(req.user as IRequestUser);
  console.log(result,"My payments");
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Payment history fetched successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.getAllPayments(query);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result,
  });
});

const getMyMediaPurchases = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyMediaPurchases(
    req.user as IRequestUser,
  );
  // console.log(result,"My media purchases");

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Media purchase history fetched successfully",
    data: result,
  });
});

const createMediaCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const { mediaId, type } = req.body;
    const result = await PaymentService.createMediaCheckoutSession(
      user,
      mediaId,
      type as MediaPurchaseType,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Media checkout session created successfully",
      data: result,
    });
  },
);

const checkMediaAccess = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const { mediaId } = req.params;
  const result = await PaymentService.checkMediaAccess(user, mediaId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Media access checked successfully",
    data: result,
  });
});

export const PaymentController = {
  getMyPayments,
  getAllPayments,
  getMyMediaPurchases,
  createMediaCheckoutSession,
  checkMediaAccess}