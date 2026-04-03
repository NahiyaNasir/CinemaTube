

import { z } from "zod";

const createReviewValidation = z.object({
  mediaId: z.string("Media ID is required"),
  rating: z
    .number("Rating must be a number")
    .min(1, "Rating must be at least 1")
    .max(10, "Rating must be at most 10"),
  content: z.string("Content is required"),
  status: z
    .enum(
      ["APPROVED", "UNPUBLISHED", "PENDING"],
      "Status must be one of APPROVED, UNPUBLISHED, PENDING",
    )
    .optional(),
  userId: z.string("User ID is required"),
  tags: z.array(z.string("Tag is required")),
  hasSpoiler: z.boolean("Has spoiler must be a boolean"),
});

const updateReviewValidation = z.object({
  mediaId: z.string("Media ID is required"),
  rating: z
    .number("Rating must be a number")
    .min(1, "Rating must be at least 1")
    .max(10, "Rating must be at most 10"),
  content: z.string("Content is required"),
  status: z
    .enum(
      ["APPROVED", "UNPUBLISHED", "PENDING"],
      "Status must be one of APPROVED, UNPUBLISHED, PENDING",
    )
    .optional(),
  userId: z.string("User ID is required"),
  tags: z.array(z.string("Tag is required")),
  hasSpoiler: z.boolean("Has spoiler must be a boolean"),
});

const updateReviewStatusValidation = z.object({
  status: z.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING",
  ),
});

export const ReviewsValidation = {
  createReviewValidation,
  updateReviewValidation,
  updateReviewStatusValidation,
};