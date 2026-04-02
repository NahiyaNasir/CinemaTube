import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interface";
import { prisma } from "../../lib/prisma";


const getAllFavorite = async (user: IRequestUser, query: any) => {
  const result = await prisma.favorite.findMany({
    where: {
      userId: user.userId as any,
    },
    include: {
      media: true,
    },
  });
  return result;
};

const createFavorite = async (payload: any, user: IRequestUser) => {
  const isExist = await prisma.favorite.findFirst({
    where: {
      userId: user.userId as any,
      mediaId: payload.mediaId,
    },
  });
  if (isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You already added this media to your favorite",
    );
  }
  const result = await prisma.favorite.create({
    data: {
      userId: user.userId as any,
      ...payload,
    },
  });
  return result;
};

const deleteFavorite = async (mediaId: string, user: IRequestUser) => {
  const isExist = await prisma.favorite.findFirst({
    where: {
      mediaId,
      userId: user.userId as any,
    },
  });

  if (!isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You didn't add this media to your favorite",
    );
  }

  const result = await prisma.favorite.delete({
    where: {
      id: isExist.id,
    },
  });
  return result;
};

export const FavoriteService = {
  getAllFavorite,
  createFavorite,
  deleteFavorite,
};