import status from "http-status";
import { Media } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";


const createMedia = async (data: any): Promise<Media> => {
  const result = await prisma.media.create({
    data: {
      ...data,
      // Jodi genre relation thake
      genres: data.genreIds ? {
        connect: data.genreIds.map((id: string) => ({ id }))
      } : undefined,
    },
  });
  return result;
};

const getAllMedia = async (query: any): Promise<Media[]> => {
  const result = await prisma.media.findMany({
    include: {
      genres: true,
    },
  });
  return result;
};

const getMediaBySlug = async (slug: string): Promise<Media | null> => {
  const media = await prisma.media.findUnique({
    where: { slug },
    include: {
      genres: true,
      reviews: true,
      cast:true,
    },
  });

  if (!media) {
    return null; 
  }

  // increment view AFTER confirming existence
  await prisma.media.update({
    where: { slug },
    data: {
      viewCount: { increment: 1 },
    },
  });

  return media;
};
export const getMediaById = async (id: string) => {
  const result = await prisma.media.findUnique({
    where: { id },
    include: {
      genres: true,
      // platforms: { include: { platform: true } },
      cast: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Media not found");
  }

  return result;
}
const updateMedia = async (id: string, data: Partial<Media>): Promise<Media> => {
  const result = await prisma.media.update({
    where: { id },
    data,
  });
  return result;
};

const deleteMedia = async (id: string): Promise<Media> => {
  const result = await prisma.media.delete({
    where: { id },
  });
  return result;
};

export const MediaService = {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  getMediaBySlug
};