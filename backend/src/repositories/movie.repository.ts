import type {
  QueryFilter,
  SortOrder,
} from "mongoose";

import {
  IMovie,
  MovieModel,
} from "../models/movie.model";

export type MovieSort = Record<
  string,
  SortOrder
>;

export class MovieRepository {
  async create(
    data: Partial<IMovie>,
  ) {
    return MovieModel.create(data);
  }

  async findById(
    id: string,
  ) {
    return MovieModel.findById(id);
  }

  async findBySlug(
    slug: string,
  ) {
    return MovieModel.findOne({
      slug,
    });
  }

  async updateById(
    id: string,
    data: Partial<IMovie>,
  ) {
    return MovieModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteById(
    id: string,
  ) {
    return MovieModel.findByIdAndDelete(
      id,
    );
  }

  async list(
    query: QueryFilter<IMovie>,
    skip: number,
    limit: number,
    sort: MovieSort,
  ) {
    const [items, total] =
      await Promise.all([
        MovieModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit),

        MovieModel.countDocuments(
          query,
        ),
      ]);

    return {
      items,
      total,
    };
  }

  async countAll() {
    return MovieModel.countDocuments();
  }

  async countByStatus(
    status:
      | "now_showing"
      | "coming_soon"
      | "inactive",
  ) {
    return MovieModel.countDocuments({
      status,
    });
  }
}