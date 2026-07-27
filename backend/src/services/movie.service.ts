import mongoose from "mongoose";

import type {
  QueryFilter,
} from "mongoose";

import {
  CreateMovieDTO,
  UpdateMovieDTO,
} from "../dtos/movie.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  IMovie,
  MovieStatus,
} from "../models/movie.model";

import {
  MovieRepository,
} from "../repositories/movie.repository";

function createSlug(
  title: string,
): string {
  return title
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

export class MovieService {
  constructor(
    private repo =
      new MovieRepository(),
  ) {}

  private validateId(
    id: string,
  ): void {
    if (
      !mongoose.Types.ObjectId.isValid(
        id,
      )
    ) {
      throw new HttpError(
        400,
        "Invalid movie ID",
      );
    }
  }

  private async createUniqueSlug(
    title: string,
    ignoreMovieId?: string,
  ): Promise<string> {
    const baseSlug =
      createSlug(title) ||
      "movie";

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing =
        await this.repo.findBySlug(
          slug,
        );

      if (
        !existing ||
        existing._id.toString() ===
          ignoreMovieId
      ) {
        return slug;
      }

      slug =
        `${baseSlug}-${counter}`;

      counter += 1;
    }
  }

  async createMovie(
    dto: CreateMovieDTO,
  ) {
    const slug =
      await this.createUniqueSlug(
        dto.title,
      );

    return this.repo.create({
      ...dto,
      slug,
    });
  }

  async getMovieById(
    id: string,
  ) {
    this.validateId(id);

    const movie =
      await this.repo.findById(id);

    if (!movie) {
      throw new HttpError(
        404,
        "Movie was not found",
      );
    }

    return movie;
  }

  async updateMovie(
    id: string,
    dto: UpdateMovieDTO,
  ) {
    this.validateId(id);

    const existing =
      await this.repo.findById(id);

    if (!existing) {
      throw new HttpError(
        404,
        "Movie was not found",
      );
    }

    const updateData: Partial<IMovie> =
      {
        ...dto,
      };

    if (dto.title) {
      updateData.slug =
        await this.createUniqueSlug(
          dto.title,
          id,
        );
    }

    const updated =
      await this.repo.updateById(
        id,
        updateData,
      );

    if (!updated) {
      throw new HttpError(
        404,
        "Movie was not found",
      );
    }

    return updated;
  }

  async deleteMovie(
    id: string,
  ) {
    this.validateId(id);

    const movie =
      await this.repo.deleteById(id);

    if (!movie) {
      throw new HttpError(
        404,
        "Movie was not found",
      );
    }

    return movie;
  }

  async listMovies(params: {
    search?: string;
    genre?: string;
    language?: string;
    status?: MovieStatus;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(
      1,
      Number(params.page || 1),
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(params.limit || 10),
      ),
    );

    const skip =
      (page - 1) * limit;

    const query:
      QueryFilter<IMovie> = {};

    if (params.status) {
      query.status =
        params.status;
    }

    if (params.genre) {
      query.genre =
        params.genre;
    }

    if (params.language) {
      query.language = {
        $regex:
          params.language,
        $options: "i",
      };
    }

    if (
      typeof params.featured ===
      "boolean"
    ) {
      query.featured =
        params.featured;
    }

    if (params.search?.trim()) {
      const search =
        params.search.trim();

      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          director: {
            $regex: search,
            $options: "i",
          },
        },
        {
          genre: {
            $regex: search,
            $options: "i",
          },
        },
        {
          cast: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const {
      items,
      total,
    } =
      await this.repo.list(
        query,
        skip,
        limit,
        {
          createdAt: -1,
        },
      );

    return {
      items,
      page,
      limit,
      total,
      totalPages:
        Math.ceil(
          total / limit,
        ),
    };
  }

  async getMovieStatistics() {
    const [
      total,
      nowShowing,
      comingSoon,
      inactive,
    ] =
      await Promise.all([
        this.repo.countAll(),

        this.repo.countByStatus(
          "now_showing",
        ),

        this.repo.countByStatus(
          "coming_soon",
        ),

        this.repo.countByStatus(
          "inactive",
        ),
      ]);

    return {
      total,
      nowShowing,
      comingSoon,
      inactive,
    };
  }
}