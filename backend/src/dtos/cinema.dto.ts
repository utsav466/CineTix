import { z } from "zod";

export const CreateCinemaSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Cinema name must contain at least 2 characters",
      )
      .max(120),

    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(100),

    address: z
      .string()
      .trim()
      .min(3, "Address is required")
      .max(300),

    phone: z
      .string()
      .trim()
      .max(30)
      .optional()
      .default(""),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .default(""),

    facilities: z
      .array(
        z
          .string()
          .trim()
          .min(1),
      )
      .default([]),

    imageUrl: z
      .string()
      .trim()
      .optional()
      .default(""),

    isActive: z.coerce
      .boolean()
      .default(true),
  });

export const UpdateCinemaSchema =
  CreateCinemaSchema.partial();

export type CreateCinemaDTO =
  z.infer<
    typeof CreateCinemaSchema
  >;

export type UpdateCinemaDTO =
  z.infer<
    typeof UpdateCinemaSchema
  >;