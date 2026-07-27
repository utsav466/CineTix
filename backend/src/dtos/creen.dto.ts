import { z } from "zod";

const ScreenSeatSchema = z.object({
  seatCode: z
    .string()
    .trim()
    .min(1),

  row: z
    .string()
    .trim()
    .min(1),

  number: z.coerce
    .number()
    .int()
    .positive(),

  type: z.enum([
    "regular",
    "premium",
    "recliner",
  ]),

  priceMultiplier: z.coerce
    .number()
    .min(0),

  isDisabled: z.coerce.boolean(),
});

export const CreateScreenSchema =
  z.object({
    cinemaId: z
      .string()
      .min(
        1,
        "Cinema ID is required",
      ),

    name: z
      .string()
      .trim()
      .min(
        1,
        "Hall name is required",
      )
      .max(80),

    rows: z.coerce
      .number()
      .int()
      .min(1)
      .max(26),

    seatsPerRow: z.coerce
      .number()
      .int()
      .min(1)
      .max(40),

    seatLayout: z
      .array(ScreenSeatSchema)
      .default([]),

    isActive: z.coerce
      .boolean()
      .default(true),
  });

export const UpdateScreenSchema =
  CreateScreenSchema.partial();

export type CreateScreenDTO =
  z.infer<
    typeof CreateScreenSchema
  >;

export type UpdateScreenDTO =
  z.infer<
    typeof UpdateScreenSchema
  >;