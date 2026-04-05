import { Request, Response } from "express";
import { sendResponse } from "../shared/sendResponse";

import status from "http-status";
import { catchAsync } from "../shared/catchAsync";
import { IRequestUser } from "../../interface";
import { ReviewsService } from "./review.service";


const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const user = req.user as IRequestUser;

  const result = await ReviewsService.getAllReview(user, query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsService.getSingleReview(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review fetched successfully",
    data: result,
  });
});

const getReviewByMediaId = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsService.getReviewByMediaId(
    req.params.mediaId as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review fetched successfully",
    data: result,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsService.createReview(
    req.user as IRequestUser,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsService.updateReview(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  console.log(req.params.id);

  const result = await ReviewsService.deleteReview(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

const updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsService.updateReviewStatus(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review status updated successfully",
    data: result,
  });
});

const deleteReviewByAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsService.deleteReviewByAdmin(
    req.params.id as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

const getAllReviewAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewsService.getAllReviewAdmin(req.query);
  sendResponse(res, {
    httpStatusCode:status .OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

export const ReviewsController = {
  getAllReview,
  getSingleReview,
  getReviewByMediaId,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  deleteReviewByAdmin,
  getAllReviewAdmin,
};