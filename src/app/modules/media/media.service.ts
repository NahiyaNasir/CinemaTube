import status from "http-status";
import { Media, Prisma } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interface/QueryBuilder.interface";

const createMedia = async (data: any): Promise<Media> => {
  // const { genreIds, cast, ...mediaData } = data;
  (console.log(data), "nedia service");
  const result = await prisma.media.create({
    data: {
      title: data.title,
      description: data.description,
      slug: data.slug,
      type: data.type,
      director: data.director,
      pricing: data.pricing,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,

      releaseYear: Number(data.releaseYear),

      runtimeMinutes: data.runtimeMinutes ? Number(data.runtimeMinutes) : null,
      seasons: data.seasons ? Number(data.seasons) : null,

      posterUrl: data.posterUrl || null,
      backdropUrl: data.backdropUrl || null,
       images: Array.isArray(data.images) ? data.images : [],
      trailerUrl: data.trailerUrl || null,
      streamingUrl: data.streamingUrl || null,
      rentalPrice:
        data.rentalPrice != null && data.rentalPrice !== ""
          ? new Prisma.Decimal(data.rentalPrice)
          : null,
      buyPrice:
        data.buyPrice != null && data.buyPrice !== ""
          ? new Prisma.Decimal(data.buyPrice)
          : null,

       genres: data.genres?.length
        ? { connect: data.genres.map((id: string) => ({ id })) }
        : undefined,

      cast: data.cast?.length
        ? {
            create: data.cast.map((member: any) => ({
              name: member.name,
              role: member.role,
              image: member.image || null, 
            })),
          }
        : undefined,
    },
    include: { genres: true, cast: true },
  });

  return result;
};

export const getAllMedia = async (query: IQueryParams) => {
  const { genre, minRating, ...remainingQuery } = query;
  const whereConditions: Prisma.MediaWhereInput = {};

  if (genre) {
    whereConditions.genres = {
      some: {
        slug: genre as string,
      },
    };
  }

  if (minRating) {
    whereConditions.avgRating = {
      gte: Number(minRating),
    };
  }

  const mediaQuery = new QueryBuilder(prisma.media, remainingQuery, {
    searchableFields: ["title", "description"],
    filterableFields: ["type", "releaseYear"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .where(whereConditions)
    .include({
      genres: true,
      cast: true,
    });
  // console.log(mediaQuery,"mediacon");
        
  return await mediaQuery.execute();
};

const getMediaBySlug = async (slug: string): Promise<Media | null> => {
  const media = await prisma.media.findUnique({
    where: { slug },
    include: {
      genres: true,
      reviews: true,
      cast: true,
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
};
const updateMedia = async (
  id: string,
  data: Partial<Media>,
): Promise<Media> => {
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
  getMediaBySlug,
};
