import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  CreateMovieSchema,
  UpdateMovieSchema,
} from "../dtos/movie.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  MovieStatus,
} from "../models/movie.model";

import {
  MovieService,
} from "../services/movie.service";

import {
  createPublicUploadUrl,
  deleteUploadedFile,
  getUploadedFile,
  parseMultipartBody,
} from "../utils/media";

const movieService =
  new MovieService();

function parseBoolean(
  value: unknown,
): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export async function listMovies(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result =
      await movieService.listMovies({
        search:
          request.query.search as
            | string
            | undefined,

        genre:
          request.query.genre as
            | string
            | undefined,

        language:
          request.query.language as
            | string
            | undefined,

        status:
          request.query.status as
            | MovieStatus
            | undefined,

        featured:
          parseBoolean(
            request.query.featured,
          ),

        page:
          Number(
            request.query.page ||
              1,
          ),

        limit:
          Number(
            request.query.limit ||
              12,
          ),
      });

    response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMovie(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const movie =
      await movieService.getMovieById(
        request.params.id,
      );

    response.status(200).json({
      success: true,

      data: {
        movie,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminListMovies(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  return listMovies(
    request,
    response,
    next,
  );
}

export async function adminGetMovie(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  return getMovie(
    request,
    response,
    next,
  );
}

export async function adminCreateMovie(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const posterImage =
      getUploadedFile(
        request,
        "posterImage",
      );

    const bannerImage =
      getUploadedFile(
        request,
        "bannerImage",
      );

    if (!posterImage) {
      throw new HttpError(
        400,
        "A movie poster image is required.",
      );
    }

    const body =
      parseMultipartBody(
        request.body,
        {
          arrayFields: [
            "genre",
            "cast",
          ],

          booleanFields: [
            "featured",
          ],
        },
      );

    const parsedData =
      CreateMovieSchema.parse({
        ...body,

        posterUrl:
          createPublicUploadUrl(
            posterImage,
          ),

        bannerUrl:
          bannerImage
            ? createPublicUploadUrl(
                bannerImage,
              )
            : "",
      });

    const movie =
      await movieService.createMovie(
        parsedData,
      );

    response.status(201).json({
      success: true,
      message:
        "Movie created successfully",

      data: {
        movie,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateMovie(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const previousMovie =
      await movieService.getMovieById(
        request.params.id,
      );

    const posterImage =
      getUploadedFile(
        request,
        "posterImage",
      );

    const bannerImage =
      getUploadedFile(
        request,
        "bannerImage",
      );

    const body =
      parseMultipartBody(
        request.body,
        {
          arrayFields: [
            "genre",
            "cast",
          ],

          booleanFields: [
            "featured",
            "removePoster",
            "removeBanner",
          ],
        },
      );

    const parsedData =
      UpdateMovieSchema.parse(
        body,
      );

    if (posterImage) {
      parsedData.posterUrl =
        createPublicUploadUrl(
          posterImage,
        );
    } else if (
      body.removePoster === true
    ) {
      parsedData.posterUrl = "";
    }

    if (bannerImage) {
      parsedData.bannerUrl =
        createPublicUploadUrl(
          bannerImage,
        );
    } else if (
      body.removeBanner === true
    ) {
      parsedData.bannerUrl = "";
    }

    const movie =
      await movieService.updateMovie(
        request.params.id,
        parsedData,
      );

    if (
      posterImage ||
      body.removePoster === true
    ) {
      await deleteUploadedFile(
        previousMovie.posterUrl,
      );
    }

    if (
      bannerImage ||
      body.removeBanner === true
    ) {
      await deleteUploadedFile(
        previousMovie.bannerUrl,
      );
    }

    response.status(200).json({
      success: true,
      message:
        "Movie updated successfully",

      data: {
        movie,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteMovie(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const movie =
      await movieService.deleteMovie(
        request.params.id,
      );

    await Promise.all([
      deleteUploadedFile(
        movie.posterUrl,
      ),

      deleteUploadedFile(
        movie.bannerUrl,
      ),
    ]);

    response.status(200).json({
      success: true,
      message:
        "Movie deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function adminMovieStatistics(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const statistics =
      await movieService
        .getMovieStatistics();

    response.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
}