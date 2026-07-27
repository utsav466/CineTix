export type FoodCategory =
  | "popcorn"
  | "beverage"
  | "snack"
  | "combo"
  | "other";

export type Food = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: FoodCategory;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FoodInput = {
  name: string;
  description: string;
  category: FoodCategory;
  price: number;

  image?:
    | File
    | null;

  removeImage?: boolean;

  isVegetarian: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
};