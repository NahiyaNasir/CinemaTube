import { z } from "zod";

export const createMediaValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  type: z.string().min(1, "Type is required"),
  releaseYear: z.number({ error: "Release year is required" }),
  director: z.string().min(1, "Director is required"),
  posterUrl: z.string().min(1, "Poster URL is required"),
  backdropUrl: z.string().optional(),
  trailerUrl: z.string().optional(),
  streamingUrl: z.string().optional(),
  runtimeMinutes: z.number().optional(),
  seasons: z.number().optional(),
  pricing: z.enum(["FREE", "PREMIUM", "RENTAL"]),
  rentalPrice: z.coerce.number().nonnegative().optional().nullable(),
  buyPrice: z.coerce.number().nonnegative().optional().nullable(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  cast: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        image: z.string().optional(),
      }),
    )
    .optional(),
  genres: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
});

const updateMediaValidation = z.object({
  title: z.string().min(1, "Title is required").optional(),
  synopsis: z.string().min(1, "Synopsis is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  type: z.string().min(1, "Type is required").optional(),
  releaseYear: z.string({ error: "Release year is required" }).optional(),
  director: z.string().min(1, "Director is required").optional(),
  posterUrl: z.string().min(1, "Poster URL is required").optional(),
  backdropUrl: z.string().optional(),
  trailerUrl: z.string().optional(),
  streamingUrl: z.string().optional(),
  runtimeMinutes: z.string().optional(),
  seasons: z.string().optional(),
  pricing: z.enum(["FREE", "PREMIUM", "RENTAL"]).optional(),
  rentalPrice: z.coerce.number().nonnegative().optional().nullable(),
  buyPrice: z.coerce.number().nonnegative().optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  cast: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        image: z.string().optional(),
      }),
    )
    .optional(),
  genres: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
});

const changePublishStatusValidation = z.object({
  isPublished: z.boolean("isPublished is required"),
});

const changeFeaturedStatusValidation = z.object({
  isFeatured: z.boolean("isFeatured is required"),
});

export const MediaValidation = {
  createMediaValidationSchema,
  updateMediaValidation,
  changePublishStatusValidation,
  changeFeaturedStatusValidation,
};