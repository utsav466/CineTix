import type {
  QueryFilter,
} from "mongoose";

import {
  IShowtime,
  ShowtimeModel,
} from "../models/showtime.model";

export class ShowtimeRepository {
  async create(
    data: Partial<IShowtime>,
  ) {
    return ShowtimeModel.create(
      data,
    );
  }

  async findById(
    id: string,
  ) {
    return ShowtimeModel.findById(
      id,
    )
      .populate(
        "movieId",
        "title posterUrl duration language rating",
      )
      .populate(
        "cinemaId",
        "name city address",
      )
      .populate(
        "screenId",
        "name capacity rows seatsPerRow",
      );
  }

  async updateById(
    id: string,
    data: Partial<IShowtime>,
  ) {
    return ShowtimeModel
      .findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        },
      )
      .populate(
        "movieId",
        "title posterUrl duration language rating",
      )
      .populate(
        "cinemaId",
        "name city address",
      )
      .populate(
        "screenId",
        "name capacity rows seatsPerRow",
      );
  }

  async deleteById(
    id: string,
  ) {
    return ShowtimeModel
      .findByIdAndDelete(id);
  }

  async list(
    query:
      QueryFilter<IShowtime>,
  ) {
    return ShowtimeModel
      .find(query)
      .populate(
        "movieId",
        "title posterUrl duration language rating",
      )
      .populate(
        "cinemaId",
        "name city address",
      )
      .populate(
        "screenId",
        "name capacity rows seatsPerRow",
      )
      .sort({
        startsAt: 1,
      });
  }

  async findConflict(params: {
    screenId: string;
    startsAt: Date;
    endsAt: Date;
    ignoredShowtimeId?: string;
  }) {
    const query:
      QueryFilter<IShowtime> = {
        screenId:
          params.screenId,

        status: {
          $ne: "cancelled",
        },

        startsAt: {
          $lt: params.endsAt,
        },

        endsAt: {
          $gt: params.startsAt,
        },
      };

    if (
      params.ignoredShowtimeId
    ) {
      query._id = {
        $ne:
          params.ignoredShowtimeId,
      };
    }

    return ShowtimeModel
      .findOne(query);
  }
}