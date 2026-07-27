import mongoose from "mongoose";

import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  CreateCinemaSchema,
  UpdateCinemaSchema,
} from "../dtos/cinema.dto";

import {
  CinemaModel,
} from "../models/cinema.model";

import {
  ScreenModel,
} from "../models/screen.model";

import {
  HttpError,
} from "../errors/http-error";

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

async function generateUniqueSlug(
  name: string,
  ignoredCinemaId?: string,
): Promise<string> {
  const baseSlug =
    createSlug(name) ||
    "cinema";

  let slug =
    baseSlug;

  let counter =
    1;

  while (true) {
    const existing =
      await CinemaModel.findOne({
        slug,
      });

    if (
      !existing ||
      existing._id.toString() ===
        ignoredCinemaId
    ) {
      return slug;
    }

    slug =
      `${baseSlug}-${counter}`;

    counter += 1;
  }
}

function validateCinemaId(
  id: string,
): void {
  if (
    !mongoose.Types.ObjectId
      .isValid(id)
  ) {
    throw new HttpError(
      400,
      "Invalid cinema ID",
    );
  }
}

export async function listCinemas(
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
      request.query.active ===
      "true"
    ) {
      query.isActive =
        true;
    }

    if (
      typeof request.query.city ===
        "string" &&
      request.query.city.trim()
    ) {
      query.city = {
        $regex:
          request.query.city.trim(),

        $options: "i",
      };
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
          city: {
            $regex: search,
            $options: "i",
          },
        },
        {
          address: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const cinemas =
      await CinemaModel.find(
        query,
      ).sort({
        createdAt: -1,
      });

    const cinemaIds =
      cinemas.map(
        (cinema) =>
          cinema._id,
      );

    const screenCounts =
      await ScreenModel.aggregate([
        {
          $match: {
            cinemaId: {
              $in: cinemaIds,
            },
          },
        },
        {
          $group: {
            _id:
              "$cinemaId",

            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const countMap =
      new Map(
        screenCounts.map(
          (item) => [
            item._id.toString(),
            item.count,
          ],
        ),
      );

    const items =
      cinemas.map(
        (cinema) => ({
          ...cinema.toJSON(),

          hallCount:
            countMap.get(
              cinema._id.toString(),
            ) || 0,
        }),
      );

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

export async function getCinema(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateCinemaId(
      request.params.id,
    );

    const cinema =
      await CinemaModel.findById(
        request.params.id,
      );

    if (!cinema) {
      throw new HttpError(
        404,
        "Cinema was not found",
      );
    }

    const screens =
      await ScreenModel.find({
        cinemaId:
          cinema._id,
      }).sort({
        name: 1,
      });

    response.status(200).json({
      success: true,

      data: {
        cinema,
        screens,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateCinema(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!request.file) {
      throw new HttpError(
        400,
        "A cinema image is required.",
      );
    }

    const body =
      parseMultipartBody(
        request.body,
        {
          arrayFields: [
            "facilities",
          ],

          booleanFields: [
            "isActive",
          ],
        },
      );

    const data =
      CreateCinemaSchema.parse({
        ...body,

        imageUrl:
          createPublicUploadUrl(
            request.file,
          ),
      });

    const slug =
      await generateUniqueSlug(
        data.name,
      );

    const cinema =
      await CinemaModel.create({
        ...data,
        slug,
      });

    response.status(201).json({
      success: true,
      message:
        "Cinema created successfully",

      data: {
        cinema,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateCinema(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateCinemaId(
      request.params.id,
    );

    const existingCinema =
      await CinemaModel.findById(
        request.params.id,
      );

    if (!existingCinema) {
      throw new HttpError(
        404,
        "Cinema was not found",
      );
    }

    const body =
      parseMultipartBody(
        request.body,
        {
          arrayFields: [
            "facilities",
          ],

          booleanFields: [
            "isActive",
            "removeImage",
          ],
        },
      );

    const data =
      UpdateCinemaSchema.parse(
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
        await generateUniqueSlug(
          data.name,
          request.params.id,
        );
    }

    const cinema =
      await CinemaModel
        .findByIdAndUpdate(
          request.params.id,
          updateData,
          {
            new: true,
            runValidators: true,
          },
        );

    if (!cinema) {
      throw new HttpError(
        404,
        "Cinema was not found",
      );
    }

    if (
      request.file ||
      body.removeImage === true
    ) {
      await deleteUploadedFile(
        existingCinema.imageUrl,
      );
    }

    response.status(200).json({
      success: true,
      message:
        "Cinema updated successfully",

      data: {
        cinema,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteCinema(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateCinemaId(
      request.params.id,
    );

    const hallCount =
      await ScreenModel.countDocuments({
        cinemaId:
          request.params.id,
      });

    if (hallCount > 0) {
      throw new HttpError(
        409,
        "Delete the cinema halls before deleting this cinema",
      );
    }

    const cinema =
      await CinemaModel
        .findByIdAndDelete(
          request.params.id,
        );

    if (!cinema) {
      throw new HttpError(
        404,
        "Cinema was not found",
      );
    }

    await deleteUploadedFile(
      cinema.imageUrl,
    );

    response.status(200).json({
      success: true,
      message:
        "Cinema deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}