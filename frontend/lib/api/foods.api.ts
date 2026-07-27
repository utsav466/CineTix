import {
  apiClient,
} from "./client";

import {
  appendFormValue,
} from "./form-data";

import type {
  Food,
  FoodCategory,
  FoodInput,
} from "./foods.types";

type FoodListResponse = {
  success: true;

  data: {
    items: Food[];
  };
};

type FoodResponse = {
  success: true;
  message?: string;

  data: {
    food: Food;
  };
};

function foodFormData(
  payload:
    Partial<FoodInput>,
): FormData {
  const formData =
    new FormData();

  for (
    const [
      key,
      value,
    ] of Object.entries(
      payload,
    )
  ) {
    appendFormValue(
      formData,
      key,
      value,
    );
  }

  return formData;
}

export async function getFoods(
  params?: {
    search?: string;
    category?: FoodCategory | "";
    available?: boolean;
  },
): Promise<Food[]> {
  const response =
    await apiClient.get<FoodListResponse>(
      "/foods",
      {
        params,
      },
    );

  return response.data.data.items;
}

export async function getFood(
  foodId: string,
): Promise<Food> {
  const response =
    await apiClient.get<FoodResponse>(
      `/foods/${foodId}`,
    );

  return response.data.data.food;
}

export async function createFood(
  payload: FoodInput,
): Promise<Food> {
  const response =
    await apiClient.post<FoodResponse>(
      "/foods",
      foodFormData(
        payload,
      ),
    );

  return response.data.data.food;
}

export async function updateFood(
  foodId: string,
  payload:
    Partial<FoodInput>,
): Promise<Food> {
  const response =
    await apiClient.patch<FoodResponse>(
      `/foods/${foodId}`,
      foodFormData(
        payload,
      ),
    );

  return response.data.data.food;
}

export async function deleteFood(
  foodId: string,
): Promise<void> {
  await apiClient.delete(
    `/foods/${foodId}`,
  );
}