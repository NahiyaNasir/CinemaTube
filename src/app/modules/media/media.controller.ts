import status from "http-status";
import { sendResponse } from "../shared/sendResponse";
import { catchAsync } from "../shared/catchAsync";
import { Request, Response } from "express";
import { MediaService } from "./media.service";






const createMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.createMedia(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Media created successfully",
    data: result,
  });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await MediaService.getAllMedia(query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Media fetched successfully",
    data: result,
  });
});

const getMediaById = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await MediaService.getMediaById(slug as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result,
  });
});

const updateMedia = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MediaService.updateMedia(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Media updated successfully",
    data: result,
  });
});

const deleteMedia = catchAsync (async (req: Request, res: Response) => {
  const { id } = req.params;
  await MediaService.deleteMedia(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Media deleted successfully",
    data: null,
  });
});

export const MediaController = {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
 
};