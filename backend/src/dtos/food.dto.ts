import { z } from "zod";

export const FoodCategorySchema =
  z.enum([
    "popcorn",
    "beverage",
    "snack",
    "combo",
    "other",
  ]);

export const CreateFoodSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Food name must contain at least 2 characters",
      )
      .max(100),

    description: z
      .string()
      .trim()
      .max(500)
      .optional()
      .default(""),

    category:
      FoodCategorySchema.default(
        "other",
      ),

    price: z.coerce
      .number()
      .min(
        0,
        "Price cannot be negative",
      ),

    imageUrl: z
      .string()
      .trim()
      .optional()
      .default(""),

    isVegetarian: z.coerce
      .boolean()
      .default(true),

    isAvailable: z.coerce
      .boolean()
      .default(true),

    isFeatured: z.coerce
      .boolean()
      .default(false),
  });

export const UpdateFoodSchema =
  CreateFoodSchema.partial();

export type CreateFoodDTO =
  z.infer<
    typeof CreateFoodSchema
  >;

export type UpdateFoodDTO =
  z.infer<
    typeof UpdateFoodSchema
  >;