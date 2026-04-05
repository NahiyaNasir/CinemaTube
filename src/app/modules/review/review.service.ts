import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ReviewStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interface";
import { reviewIncludeConfig } from "./review.constsnt";




const getAllReview = async (
  user: IRequestUser,
  query: Record<string, unknown>,
) => {
  const reviewQuery = new QueryBuilder(prisma.review, query as any, {
    searchableFields: ["content", "rating"],
    filterableFields: ["status", "mediaId", "userId", "rating"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.execute();
  return result;
};

const getSingleReview = async (id: string) => {
  const result = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const getReviewByMediaId = async (mediaId: string) => {
  const isMediaExist = await prisma.media.findUnique({
    where: {
      id: mediaId,
    },
  });

  if (!isMediaExist) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  const result = await prisma.review.findMany({
    where: {
      mediaId,
      status: "APPROVED",
    },
    include: {
      user: true,
    },
  });
  return result;
};

const createReview = async (user: IRequestUser, data: any) => {
  const result = await prisma.review.create({
    data: {
      userId: user.userId,
      ...data,
    },
  });
  return result;
};

const updateReview = async (id: string, data: any) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });
  return result;
};

const deleteReview = async (id: string) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  if (isReviewExist.status === ReviewStatus.APPROVED) {
    throw new AppError(
      status.NOT_FOUND,
      "You can only delete pending or unpublished review",
    );
  }

  const result = await prisma.review.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateMediaRating = async (mediaId: string) => {
  const stats = await prisma.review.aggregate({
    where: {
      mediaId,
      status: ReviewStatus.APPROVED,
    },
    _avg: {
      rating: true,
    },
    _count: {
      id: true,
    },
  });

  await prisma.media.update({
    where: { id: mediaId },
    data: {
     averageRating: stats._avg.rating || 0,
      totalRatings: stats._count.id,
    },
  });
};

const updateReviewStatus = async (
  id: string,
  payload: { status: ReviewStatus },
) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });

  // Recalculate rating
  await updateMediaRating(isReviewExist.mediaId);

  return result;
};

const deleteReviewByAdmin = async (id: string) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.delete({
    where: {
      id,
    },
  });

  // Recalculate rating
  await updateMediaRating(isReviewExist.mediaId);

  return result;
};

const getAllReviewAdmin = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(prisma.review, query as any, {
    searchableFields: ["content", "rating"],
    filterableFields: ["status", "mediaId", "userId", "rating"],
  })
    .search()
    .filter()
    .include({
      user: true,
      media: true,
    })
    .dynamicInclude(reviewIncludeConfig)
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.execute();
  return result;
};

export const ReviewsService = {
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