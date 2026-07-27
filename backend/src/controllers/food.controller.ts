import {
  NextFunction,
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import {
  CreateFoodSchema,
  UpdateFoodSchema,
} from "../dtos/food.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  FoodModel,
} from "../models/food.model";

import {
  createPublicUploadUrl,
  deleteUploadedFile,
  parseMultipartBody,
} from "../utils/media";

function createSlug(
  name: string,
): string {
  return name
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

async function uniqueSlug(
  name: string,
  ignoredFoodId?: string,
): Promise<string> {
  const baseSlug =
    createSlug(name) ||
    "food";

  let slug =
    baseSlug;

  let counter =
    1;

  while (true) {
    const existing =
      await FoodModel.findOne({
        slug,
      });

    if (
      !existing ||
      existing._id.toString() ===
        ignoredFoodId
    ) {
      return slug;
    }

    slug =
      `${baseSlug}-${counter}`;

    counter += 1;
  }
}

function validateFoodId(
  id: string,
): void {
  if (
    !mongoose.Types.ObjectId
      .isValid(id)
  ) {
    throw new HttpError(
      400,
      "Invalid food ID",
    );
  }
}

export async function listFoods(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query: Record<
      string,
      unknown
    > = {};

    if (
      request.query.available ===
      "true"
    ) {
      query.isAvailable =
        true;
    }

    if (
      typeof request.query
        .category ===
        "string" &&
      request.query.category
    ) {
      query.category =
        request.query.category;
    }

    if (
      typeof request.query.search ===
        "string" &&
      request.query.search.trim()
    ) {
      const search =
        request.query.search.trim();

      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const items =
      await FoodModel.find(
        query,
      ).sort({
        isFeatured: -1,
        createdAt: -1,
      });

    response.status(200).json({
      success: true,

      data: {
        items,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getFood(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateFoodId(
      request.params.id,
    );

    const food =
      await FoodModel.findById(
        request.params.id,
      );

    if (!food) {
      throw new HttpError(
        404,
        "Food item was not found",
      );
    }

    response.status(200).json({
      success: true,

      data: {
        food,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createFood(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!request.file) {
      throw new HttpError(
        400,
        "A food image is required.",
      );
    }

    const body =
      parseMultipartBody(
        request.body,
        {
          booleanFields: [
            "isVegetarian",
            "isAvailable",
            "isFeatured",
          ],
        },
      );

    const data =
      CreateFoodSchema.parse({
        ...body,

        imageUrl:
          createPublicUploadUrl(
            request.file,
          ),
      });

    const slug =
      await uniqueSlug(
        data.name,
      );

    const food =
      await FoodModel.create({
        ...data,
        slug,
      });

    response.status(201).json({
      success: true,
      message:
        "Food item created successfully",

      data: {
        food,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFood(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateFoodId(
      request.params.id,
    );

    const existingFood =
      await FoodModel.findById(
        request.params.id,
      );

    if (!existingFood) {
      throw new HttpError(
        404,
        "Food item was not found",
      );
    }

    const body =
      parseMultipartBody(
        request.body,
        {
          booleanFields: [
            "isVegetarian",
            "isAvailable",
            "isFeatured",
            "removeImage",
          ],
        },
      );

    const data =
      UpdateFoodSchema.parse(
        body,
      );

    const updateData: Record<
      string,
      unknown
    > = {
      ...data,
    };

    if (request.file) {
      updateData.imageUrl =
        createPublicUploadUrl(
          request.file,
        );
    } else if (
      body.removeImage === true
    ) {
      updateData.imageUrl =
        "";
    }

    if (data.name) {
      updateData.slug =
        await uniqueSlug(
          data.name,
          request.params.id,
        );
    }

    const food =
      await FoodModel
        .findByIdAndUpdate(
          request.params.id,
          updateData,
          {
            new: true,
            runValidators: true,
          },
        );

    if (!food) {
      throw new HttpError(
        404,
        "Food item was not found",
      );
    }

    if (
      request.file ||
      body.removeImage === true
    ) {
      await deleteUploadedFile(
        existingFood.imageUrl,
      );
    }

    response.status(200).json({
      success: true,
      message:
        "Food item updated successfully",

      data: {
        food,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFood(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateFoodId(
      request.params.id,
    );

    const food =
      await FoodModel
        .findByIdAndDelete(
          request.params.id,
        );

    if (!food) {
      throw new HttpError(
        404,
        "Food item was not found",
      );
    }

    await deleteUploadedFile(
      food.imageUrl,
    );

    response.status(200).json({
      success: true,
      message:
        "Food item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}