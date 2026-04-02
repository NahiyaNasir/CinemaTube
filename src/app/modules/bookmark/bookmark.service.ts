import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interface";



const getAllBookmark = async (user: IRequestUser, query: any) => {
  const result = await prisma.bookmark.findMany({
    where: {
      userId: user.userId as any,
    },
    include: {
      media: true,
    },
  });
  return result;
};

const createBookmark = async (payload: any, user: IRequestUser) => {
  const isExist = await prisma.bookmark.findFirst({
    where: {
      userId: user.userId as any,
      mediaId: payload.mediaId,
    },
  });
  if (isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You already added this media to your bookmark",
    );
  }
  const result = await prisma.bookmark.create({
    data: {
      userId: user.userId as any,
      ...payload,
    },
  });
  return result;
};

const deleteBookmark = async (mediaId: string, user: IRequestUser) => {
  const isExist = await prisma.bookmark.findFirst({
    where: {
      mediaId,
      userId: user.userId as any,
    },
  });

  if (!isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "You didn't add this media to your bookmark",
    );
  }

  const result = await prisma.bookmark.delete({
    where: {
      id: isExist.id,
    },
  });
  return result;
};

export const BookmarkService = {
  getAllBookmark,
  createBookmark,
  deleteBookmark,
};