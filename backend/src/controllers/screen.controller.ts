import mongoose from "mongoose";

import {
  NextFunction,
  Request,
  Response,
} from "express";



import {
  HttpError,
} from "../errors/http-error";

import {
  CinemaModel,
} from "../models/cinema.model";

import {
  ScreenModel,
} from "../models/screen.model";
import { CreateScreenSchema, UpdateScreenSchema } from "../dtos/creen.dto";

function validateObjectId(
  id: string,
  label: string,
): void {
  if (
    !mongoose.Types.ObjectId.isValid(
      id,
    )
  ) {
    throw new HttpError(
      400,
      `Invalid ${label} ID`,
    );
  }
}

function calculateCapacity(
  seatLayout: {
    isDisabled: boolean;
  }[],
): number {
  return seatLayout.filter(
    (seat) => !seat.isDisabled,
  ).length;
}

export async function listScreens(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query: Record<
      string,
      unknown
    > = {};

    if (
      typeof req.query.cinemaId ===
      "string"
    ) {
      validateObjectId(
        req.query.cinemaId,
        "cinema",
      );

      query.cinemaId =
        req.query.cinemaId;
    }

    const screens =
      await ScreenModel.find(query)
        .populate(
          "cinemaId",
          "name city address",
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      data: {
        items: screens,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getScreen(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateObjectId(
      req.params.id,
      "screen",
    );

    const screen =
      await ScreenModel.findById(
        req.params.id,
      ).populate(
        "cinemaId",
        "name city address",
      );

    if (!screen) {
      throw new HttpError(
        404,
        "Hall was not found",
      );
    }

    res.status(200).json({
      success: true,
      data: {
        screen,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createScreen(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data =
      CreateScreenSchema.parse(
        req.body,
      );

    validateObjectId(
      data.cinemaId,
      "cinema",
    );

    const cinema =
      await CinemaModel.findById(
        data.cinemaId,
      );

    if (!cinema) {
      throw new HttpError(
        404,
        "Cinema was not found",
      );
    }

    const capacity =
      calculateCapacity(
        data.seatLayout,
      );

    if (capacity < 1) {
      throw new HttpError(
        400,
        "The hall must contain at least one active seat",
      );
    }

    const screen =
      await ScreenModel.create({
        ...data,
        capacity,
      });

    res.status(201).json({
      success: true,
      message:
        "Hall created successfully",
      data: {
        screen,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateScreen(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateObjectId(
      req.params.id,
      "screen",
    );

    const data =
      UpdateScreenSchema.parse(
        req.body,
      );

    const existing =
      await ScreenModel.findById(
        req.params.id,
      );

    if (!existing) {
      throw new HttpError(
        404,
        "Hall was not found",
      );
    }

    const seatLayout =
      data.seatLayout ||
      existing.seatLayout;

    const capacity =
      calculateCapacity(
        seatLayout,
      );

    const screen =
      await ScreenModel.findByIdAndUpdate(
        req.params.id,
        {
          ...data,
          capacity,
        },
        {
          new: true,
          runValidators: true,
        },
      );

    res.status(200).json({
      success: true,
      message:
        "Hall updated successfully",
      data: {
        screen,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteScreen(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateObjectId(
      req.params.id,
      "screen",
    );

    const screen =
      await ScreenModel.findByIdAndDelete(
        req.params.id,
      );

    if (!screen) {
      throw new HttpError(
        404,
        "Hall was not found",
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Hall deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}