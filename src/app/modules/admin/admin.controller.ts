import { Request, Response } from "express";
import { catchAsync } from "../shared/catchAsync";
import { sendResponse } from "../shared/sendResponse";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";
import { IQueryParams } from "../../interface/QueryBuilder.interface";
const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getStats();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Admin statistics retrieved successfully",
    data: result,
  });
});

const getSales = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSales();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Admin sales retrieved successfully",
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getReviews();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Admin reviews retrieved successfully",
    data: result,
  });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IQueryParams;
  const result = await AdminService.getAllMedia(query);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Admin media retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  getStats,
  getSales,
  getReviews,
  getAllMedia,
};