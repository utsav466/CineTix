import { z } from "zod";

export const HoldSeatsSchema =
  z
    .object({
      showtimeId: z
        .string()
        .min(
          1,
          "Showtime is required",
        ),

      seatCodes: z
        .array(
          z
            .string()
            .trim()
            .toUpperCase()
            .min(1),
        )
        .min(
          1,
          "Select at least one seat",
        )
        .max(
          10,
          "A maximum of 10 seats can be booked at once",
        ),
    })
    .transform((data) => ({
      ...data,

      seatCodes: [
        ...new Set(
          data.seatCodes,
        ),
      ],
    }));

export const BookingFoodItemSchema =
  z.object({
    foodId: z
      .string()
      .trim()
      .min(
        1,
        "Food ID is required",
      ),

    quantity: z.coerce
      .number()
      .int()
      .min(1)
      .max(20),
  });

export const UpdateBookingCheckoutSchema =
  z.object({
    foodItems: z
      .array(
        BookingFoodItemSchema,
      )
      .max(30)
      .default([]),

    couponCode: z
      .string()
      .trim()
      .toUpperCase()
      .max(30)
      .optional()
      .default(""),
  });

export type HoldSeatsDTO =
  z.infer<
    typeof HoldSeatsSchema
  >;

export type UpdateBookingCheckoutDTO =
  z.infer<
    typeof UpdateBookingCheckoutSchema
  >;