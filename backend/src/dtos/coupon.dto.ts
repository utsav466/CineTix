import { z } from "zod";

export const CouponDiscountTypeSchema =
  z.enum([
    "percentage",
    "fixed",
  ]);

export const CreateCouponSchema =
  z
    .object({
      code: z
        .string()
        .trim()
        .toUpperCase()
        .min(3)
        .max(30),

      name: z
        .string()
        .trim()
        .min(
          2,
          "Coupon name is required",
        )
        .max(100),

      description: z
        .string()
        .trim()
        .max(500)
        .optional()
        .default(""),

      discountType:
        CouponDiscountTypeSchema,

      discountValue: z.coerce
        .number()
        .positive(
          "Discount value must be greater than zero",
        ),

      minimumOrderAmount:
        z.coerce
          .number()
          .min(0)
          .default(0),

      maximumDiscountAmount:
        z.coerce
          .number()
          .positive()
          .optional(),

      usageLimit: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

      perUserLimit: z.coerce
        .number()
        .int()
        .positive()
        .default(1),

      startsAt: z.coerce.date(),

      expiresAt: z.coerce.date(),

      isActive: z.coerce
        .boolean()
        .default(true),
    })
    .refine(
      (data) =>
        data.expiresAt >
        data.startsAt,
      {
        message:
          "Coupon expiry must be after its start date",
        path: ["expiresAt"],
      },
    )
    .refine(
      (data) =>
        data.discountType !==
          "percentage" ||
        data.discountValue <= 100,
      {
        message:
          "Percentage discount cannot exceed 100",
        path: ["discountValue"],
      },
    );

export const UpdateCouponSchema =
  z.object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .min(3)
      .max(30)
      .optional(),

    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .max(500)
      .optional(),

    discountType:
      CouponDiscountTypeSchema.optional(),

    discountValue: z.coerce
      .number()
      .positive()
      .optional(),

    minimumOrderAmount:
      z.coerce
        .number()
        .min(0)
        .optional(),

    maximumDiscountAmount:
      z.coerce
        .number()
        .positive()
        .optional(),

    usageLimit: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    perUserLimit: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    startsAt:
      z.coerce.date().optional(),

    expiresAt:
      z.coerce.date().optional(),

    isActive:
      z.coerce
        .boolean()
        .optional(),
  });

export const ValidateCouponSchema =
  z.object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .min(1),

    orderAmount: z.coerce
      .number()
      .min(0),
  });