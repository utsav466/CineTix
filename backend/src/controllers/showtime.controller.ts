import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  CreateShowtimeSchema,
  UpdateShowtimeSchema,
} from "../dtos/showtime.dto";

import type {
  ShowtimeStatus,
} from "../models/showtime.model";

import {
  ShowtimeService,
} from "../services/showtime.service";

const showtimeService =
  new ShowtimeService();

export async function listShowtimes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const showtimes =
      await showtimeService
        .listShowtimes({
          movieId:
            typeof req.query
              .movieId ===
            "string"
              ? req.query.movieId
              : undefined,

          cinemaId:
            typeof req.query
              .cinemaId ===
            "string"
              ? req.query.cinemaId
              : undefined,

          screenId:
            typeof req.query
              .screenId ===
            "string"
              ? req.query.screenId
              : undefined,

          date:
            typeof req.query.date ===
            "string"
              ? req.query.date
              : undefined,

          status:
            typeof req.query
              .status ===
            "string"
              ? (req.query
                  .status as ShowtimeStatus)
              : undefined,

          includeInactive:
            req.query
              .includeInactive ===
            "true",
        });

    res.status(200).json({
      success: true,
      data: {
        items: showtimes,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getShowtime(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const showtime =
      await showtimeService
        .getShowtime(
          req.params.id,
        );

    res.status(200).json({
      success: true,
      data: {
        showtime,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createShowtime(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data =
      CreateShowtimeSchema.parse(
        req.body,
      );

    const showtime =
      await showtimeService
        .createShowtime(data);

    res.status(201).json({
      success: true,
      message:
        "Showtime created successfully",
      data: {
        showtime,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateShowtime(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data =
      UpdateShowtimeSchema.parse(
        req.body,
      );

    const showtime =
      await showtimeService
        .updateShowtime(
          req.params.id,
          data,
        );

    res.status(200).json({
      success: true,
      message:
        "Showtime updated successfully",
      data: {
        showtime,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteShowtime(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await showtimeService
      .deleteShowtime(
        req.params.id,
      );

    res.status(200).json({
      success: true,
      message:
        "Showtime deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}