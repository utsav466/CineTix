import { z } from "zod";

const movieStatusSchema = z.enum([
  "now_showing",
  "coming_soon",
  "inactive",
]);

const urlField = z
  .string()
  .trim()
  .optional()
  .default("");

export const CreateMovieSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(1, "Movie title is required")
      .max(150),

    description: z
      .string()
      .trim()
      .min(
        10,
        "Description must contain at least 10 characters",
      )
      .max(3000),

    genre: z
      .array(
        z
          .string()
          .trim()
          .min(1),
      )
      .min(
        1,
        "Select at least one genre",
      ),

    language: z
      .string()
      .trim()
      .min(
        1,
        "Movie language is required",
      ),

    duration: z.coerce
      .number()
      .int()
      .positive(
        "Duration must be greater than zero",
      ),

    releaseDate: z.coerce.date(),

    rating: z
      .string()
      .trim()
      .default("PG"),

    director: z
      .string()
      .trim()
      .min(
        1,
        "Director name is required",
      ),

    cast: z
      .array(
        z
          .string()
          .trim()
          .min(1),
      )
      .default([]),

    posterUrl: urlField,

    bannerUrl: urlField,

    trailerUrl: urlField,

    status:
      movieStatusSchema.default(
        "coming_soon",
      ),

    featured: z.coerce
      .boolean()
      .default(false),
  });

export const UpdateMovieSchema =
  CreateMovieSchema.partial();

export type CreateMovieDTO =
  z.infer<
    typeof CreateMovieSchema
  >;

export type UpdateMovieDTO =
  z.infer<
    typeof UpdateMovieSchema
  >;