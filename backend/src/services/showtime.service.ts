import mongoose from "mongoose";

import {
  CreateShowtimeDTO,
  UpdateShowtimeDTO,
} from "../dtos/showtime.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  CinemaModel,
} from "../models/cinema.model";

import {
  MovieModel,
} from "../models/movie.model";

import {
  ScreenModel,
} from "../models/screen.model";

import type {
  IShowtime,
  ShowtimeStatus,
} from "../models/showtime.model";

import {
  ShowtimeRepository,
} from "../repositories/showtime.repository";

export class ShowtimeService {
  constructor(
    private repository =
      new ShowtimeRepository(),
  ) {}

  private validateId(
    id: string,
    name: string,
  ): void {
    if (
      !mongoose.Types.ObjectId
        .isValid(id)
    ) {
      throw new HttpError(
        400,
        `Invalid ${name} ID`,
      );
    }
  }

  private calculateEndTime(
    startsAt: Date,
    movieDuration: number,
    cleanupMinutes: number,
  ): Date {
    return new Date(
      startsAt.getTime() +
        (movieDuration +
          cleanupMinutes) *
          60 *
          1000,
    );
  }

  private async validateRelations(
    movieId: string,
    cinemaId: string,
    screenId: string,
  ) {
    this.validateId(
      movieId,
      "movie",
    );

    this.validateId(
      cinemaId,
      "cinema",
    );

    this.validateId(
      screenId,
      "hall",
    );

    const [
      movie,
      cinema,
      screen,
    ] =
      await Promise.all([
        MovieModel.findById(
          movieId,
        ),

        CinemaModel.findById(
          cinemaId,
        ),

        ScreenModel.findById(
          screenId,
        ),
      ]);

    if (!movie) {
      throw new HttpError(
        404,
        "Movie was not found",
      );
    }

    if (!cinema) {
      throw new HttpError(
        404,
        "Cinema was not found",
      );
    }

    if (!screen) {
      throw new HttpError(
        404,
        "Hall was not found",
      );
    }

    if (
      screen.cinemaId.toString() !==
      cinemaId
    ) {
      throw new HttpError(
        400,
        "The selected hall does not belong to the selected cinema",
      );
    }

    if (!movie.isModified) {
      // No action. This line can be removed.
    }

    if (!cinema.isActive) {
      throw new HttpError(
        400,
        "The selected cinema is inactive",
      );
    }

    if (!screen.isActive) {
      throw new HttpError(
        400,
        "The selected hall is inactive",
      );
    }

    return {
      movie,
      cinema,
      screen,
    };
  }

  async createShowtime(
    data: CreateShowtimeDTO,
  ) {
    const {
      movie,
    } =
      await this.validateRelations(
        data.movieId,
        data.cinemaId,
        data.screenId,
      );

    const startsAt =
      new Date(data.startsAt);

    if (
      Number.isNaN(
        startsAt.getTime(),
      )
    ) {
      throw new HttpError(
        400,
        "Invalid showtime date",
      );
    }

    const endsAt =
      this.calculateEndTime(
        startsAt,
        movie.duration,
        data.cleanupMinutes,
      );

    const conflict =
      await this.repository
        .findConflict({
          screenId:
            data.screenId,
          startsAt,
          endsAt,
        });

    if (conflict) {
      throw new HttpError(
        409,
        "This hall already has another show during the selected time",
      );
    }

    return this.repository.create({
  movieId:
    new mongoose.Types.ObjectId(
      data.movieId,
    ),

  cinemaId:
    new mongoose.Types.ObjectId(
      data.cinemaId,
    ),

  screenId:
    new mongoose.Types.ObjectId(
      data.screenId,
    ),

  startsAt,
  endsAt,

  regularPrice:
    data.regularPrice,

  premiumPrice:
    data.premiumPrice,

  reclinerPrice:
    data.reclinerPrice,

  cleanupMinutes:
    data.cleanupMinutes,

  status:
    data.status,

  isActive:
    data.isActive,
});
  }

  async updateShowtime(
    id: string,
    data: UpdateShowtimeDTO,
  ) {
    this.validateId(
      id,
      "showtime",
    );

    const existing =
      await this.repository
        .findById(id);

    if (!existing) {
      throw new HttpError(
        404,
        "Showtime was not found",
      );
    }

    const existingMovieId =
      typeof existing.movieId ===
      "object" &&
      "_id" in existing.movieId
        ? String(
            existing.movieId._id,
          )
        : String(
            existing.movieId,
          );

    const existingCinemaId =
      typeof existing.cinemaId ===
      "object" &&
      "_id" in existing.cinemaId
        ? String(
            existing.cinemaId._id,
          )
        : String(
            existing.cinemaId,
          );

    const existingScreenId =
      typeof existing.screenId ===
      "object" &&
      "_id" in existing.screenId
        ? String(
            existing.screenId._id,
          )
        : String(
            existing.screenId,
          );

    const movieId =
      data.movieId ||
      existingMovieId;

    const cinemaId =
      data.cinemaId ||
      existingCinemaId;

    const screenId =
      data.screenId ||
      existingScreenId;

    const {
      movie,
    } =
      await this.validateRelations(
        movieId,
        cinemaId,
        screenId,
      );

    const startsAt =
      data.startsAt
        ? new Date(data.startsAt)
        : existing.startsAt;

    const cleanupMinutes =
      data.cleanupMinutes ??
      existing.cleanupMinutes;

    const endsAt =
      this.calculateEndTime(
        startsAt,
        movie.duration,
        cleanupMinutes,
      );

    const conflict =
      await this.repository
        .findConflict({
          screenId,
          startsAt,
          endsAt,
          ignoredShowtimeId: id,
        });

    if (conflict) {
      throw new HttpError(
        409,
        "This hall already has another show during the selected time",
      );
    }

    const updateData:
      Partial<IShowtime> = {
        ...data,
        movieId:
          new mongoose.Types.ObjectId(
            movieId,
          ),

        cinemaId:
          new mongoose.Types.ObjectId(
            cinemaId,
          ),

        screenId:
          new mongoose.Types.ObjectId(
            screenId,
          ),

        startsAt,
        endsAt,
      };

    return this.repository
      .updateById(
        id,
        updateData,
      );
  }

  async deleteShowtime(
    id: string,
  ) {
    this.validateId(
      id,
      "showtime",
    );

    const showtime =
      await this.repository
        .deleteById(id);

    if (!showtime) {
      throw new HttpError(
        404,
        "Showtime was not found",
      );
    }

    return showtime;
  }

  async getShowtime(
    id: string,
  ) {
    this.validateId(
      id,
      "showtime",
    );

    const showtime =
      await this.repository
        .findById(id);

    if (!showtime) {
      throw new HttpError(
        404,
        "Showtime was not found",
      );
    }

    return showtime;
  }

  async listShowtimes(params: {
    movieId?: string;
    cinemaId?: string;
    screenId?: string;
    date?: string;
    status?: ShowtimeStatus;
    includeInactive?: boolean;
  }) {
    const query: Record<
      string,
      unknown
    > = {};

    if (params.movieId) {
      this.validateId(
        params.movieId,
        "movie",
      );

      query.movieId =
        params.movieId;
    }

    if (params.cinemaId) {
      this.validateId(
        params.cinemaId,
        "cinema",
      );

      query.cinemaId =
        params.cinemaId;
    }

    if (params.screenId) {
      this.validateId(
        params.screenId,
        "hall",
      );

      query.screenId =
        params.screenId;
    }

    if (params.status) {
      query.status =
        params.status;
    }

    if (
      !params.includeInactive
    ) {
      query.isActive = true;

      if (!params.status) {
        query.status = {
          $ne: "cancelled",
        };
      }
    }

    if (params.date) {
      const startOfDay =
        new Date(
          `${params.date}T00:00:00`,
        );

      const endOfDay =
        new Date(
          `${params.date}T23:59:59.999`,
        );

      query.startsAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    return this.repository.list(
      query,
    );
  }
}