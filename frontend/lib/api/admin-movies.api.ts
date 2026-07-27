import {
  apiClient,
} from "./client";

import {
  appendFormValue,
} from "./form-data";

import type {
  Movie,
  MovieInput,
  MoviesPage,
  MovieStatistics,
  MovieStatus,
} from "./movies.types";

type MoviesResponse = {
  success: true;
  data: MoviesPage;
};

type MovieResponse = {
  success: true;
  message?: string;

  data: {
    movie: Movie;
  };
};

type StatisticsResponse = {
  success: true;
  data: MovieStatistics;
};

function movieFormData(
  payload:
    Partial<MovieInput>,
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

export async function getAdminMovies(
  params?: {
    search?: string;
    status?: MovieStatus | "";
    page?: number;
    limit?: number;
  },
): Promise<MoviesPage> {
  const response =
    await apiClient.get<MoviesResponse>(
      "/admin/movies",
      {
        params,
      },
    );

  return response.data.data;
}

export async function getAdminMovie(
  movieId: string,
): Promise<Movie> {
  const response =
    await apiClient.get<MovieResponse>(
      `/admin/movies/${movieId}`,
    );

  return response.data.data.movie;
}

export async function createAdminMovie(
  payload: MovieInput,
): Promise<Movie> {
  const response =
    await apiClient.post<MovieResponse>(
      "/admin/movies",
      movieFormData(
        payload,
      ),
    );

  return response.data.data.movie;
}

export async function updateAdminMovie(
  movieId: string,
  payload:
    Partial<MovieInput>,
): Promise<Movie> {
  const response =
    await apiClient.patch<MovieResponse>(
      `/admin/movies/${movieId}`,
      movieFormData(
        payload,
      ),
    );

  return response.data.data.movie;
}

export async function deleteAdminMovie(
  movieId: string,
): Promise<void> {
  await apiClient.delete(
    `/admin/movies/${movieId}`,
  );
}

export async function getMovieStatistics():
  Promise<MovieStatistics> {
  const response =
    await apiClient.get<StatisticsResponse>(
      "/admin/movies/statistics",
    );

  return response.data.data;
}