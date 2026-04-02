import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createGenre = async (payload: Prisma.GenreCreateInput) => {
  const isExist = await prisma.genre.findUnique({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(status.BAD_REQUEST, "Genre already exists");
  }

  const result = await prisma.genre.create({
    data: payload,
  });
  return result;
};

const getAllGenres = async (query: Record<string, unknown>) => {
  const genreQuery = new QueryBuilder(prisma.genre, query as any, {
    searchableFields: ["name", "description"],
    filterableFields: ["isFeatured", "isPublished"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await genreQuery.execute();
  return result;
};

const updateGenre = async (id: string, payload: Prisma.GenreUpdateInput) => {
  const isExist = await prisma.genre.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Genre not found");
  }

  const result = await prisma.genre.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteGenre = async (id: string) => {
  const isExist = await prisma.genre.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Genre not found");
  }

  const result = await prisma.genre.delete({
    where: { id },
  });
  return result;
};

// -------------

const createManyGenre = async (payload: any) => {
  const result = await prisma.genre.createMany({
    data: payload,
    skipDuplicates: true,
  });
  return result;
};

export const GenreService = {
  createGenre,
  getAllGenres,
  updateGenre,
  deleteGenre,
  createManyGenre,
};