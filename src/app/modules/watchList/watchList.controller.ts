import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../shared/catchAsync";
import { IRequestUser } from "../../interface";
import { sendResponse } from "../shared/sendResponse";
import { WatchlistService } from "./watchList.service";

const getAllWatchlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const query = req.query;

  const result = await WatchlistService.getAllWatchlist(user, query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Watchlist fetched successfully",
    data: result,
  });
});

const createWatchlist = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await WatchlistService.createWatchlist({ mediaId }, user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Watchlist created successfully",
    data: result,
  });
});

const deleteWatchlist = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.params;
  const user = req.user as IRequestUser;

  const result = await WatchlistService.deleteWatchlist(
    mediaId as string,
    user,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Watchlist deleted successfully",
    data: result,
  });
});

export const WatchlistController = {
  getAllWatchlist,
  createWatchlist,
  deleteWatchlist,
};