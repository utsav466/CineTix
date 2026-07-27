import { z } from "zod";

export const ShowtimeStatusSchema =
  z.enum([
    "scheduled",
    "cancelled",
    "completed",
  ]);

export const CreateShowtimeSchema =
  z.object({
    movieId: z
      .string()
      .min(
        1,
        "Movie is required",
      ),

    cinemaId: z
      .string()
      .min(
        1,
        "Cinema is required",
      ),

    screenId: z
      .string()
      .min(
        1,
        "Hall is required",
      ),

    startsAt: z.coerce.date(),

    regularPrice: z.coerce
      .number()
      .min(
        0,
        "Regular price cannot be negative",
      ),

    premiumPrice: z.coerce
      .number()
      .min(
        0,
        "Premium price cannot be negative",
      ),

    reclinerPrice: z.coerce
      .number()
      .min(
        0,
        "Recliner price cannot be negative",
      ),

    cleanupMinutes: z.coerce
      .number()
      .int()
      .min(0)
      .max(120)
      .default(20),

    status:
      ShowtimeStatusSchema.default(
        "scheduled",
      ),

    isActive: z.coerce
      .boolean()
      .default(true),
  });

export const UpdateShowtimeSchema =
  CreateShowtimeSchema.partial();

export type CreateShowtimeDTO =
  z.infer<
    typeof CreateShowtimeSchema
  >;

export type UpdateShowtimeDTO =
  z.infer<
    typeof UpdateShowtimeSchema
  >;