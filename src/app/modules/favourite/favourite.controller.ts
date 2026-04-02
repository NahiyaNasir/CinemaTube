import { Request, Response } from "express";
import { IRequestUser } from "../../interface";
import { catchAsync } from "../shared/catchAsync";
import { sendResponse } from "../shared/sendResponse";
import { FavoriteService } from "./favourite.service";
import status from "http-status";

const getAllFavourite = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const query = req.query;

  const result = await FavoriteService.getAllFavorite(user, query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Favorite fetched successfully",
    data: result,
  });
});

const createFavourite = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await FavoriteService.createFavorite({ mediaId }, user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Favorite created successfully",
    data: result,
  });
});

const deleteFavourite = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await FavoriteService.deleteFavorite(mediaId as string, user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Favourite deleted successfully",
    data: result,
  });
});

export const FavoriteController = {
  getAllFavourite,
  createFavourite,
  deleteFavourite,
};