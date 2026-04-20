import status from "http-status";

import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interface";
import AppError from "../../errorHelpers/AppError";

const getAllWatchlist = async (user: IRequestUser, query: any) => {
  const result = await prisma.watchList.findMany({
    where: {
      userId: user.userId as any,
    },
    include: {
      media: true,
    },
  });
  return result;
};

const createWatchlist = async (payload: any, user: IRequestUser) => {
  const isExist = await prisma.watchList.findFirst({
    where: {
      userId: user.userId as any,
      mediaId: payload.mediaId,
    },
  });
  if (isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You already added this media to your watchlist",
    );
  }
  const result = await prisma.watchList.create({
    data: {
      userId: user.userId as any,
      ...payload,
    },
  });
  return result;
};

const deleteWatchlist = async (mediaId: string, user: IRequestUser) => {
  const isExist = await prisma.watchList.findFirst({
    where: {
      mediaId,
      userId: user.userId as any,
    },
  });

  if (!isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You didn't add this media to your watchlist",
    );
  }

  const result = await prisma.watchList.delete({
    where: {
      id: isExist.id,
    },
  });
  return result;
};

export const WatchlistService = {
  getAllWatchlist,
  createWatchlist,
  deleteWatchlist,
};