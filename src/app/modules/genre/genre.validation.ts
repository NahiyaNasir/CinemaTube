import { z } from "zod";

const createGenreSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
  slug: z.string().min(1, "Genre slug is required"),
  description: z.string().min(1, "Genre description is required"),
  image: z.string().min(1, "Genre image is required"),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const updateGenreSchema = z.object({
  name: z.string().min(1, "Genre name is required").optional(),
  description: z.string().min(1, "Genre description is required").optional(),
  image: z.string().min(1, "Genre image is required").optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const GenreValidation = {
  createGenreSchema,
  updateGenreSchema,
};