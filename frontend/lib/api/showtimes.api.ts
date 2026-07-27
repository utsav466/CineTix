import {
  apiClient,
} from "./client";

import type {
  Showtime,
  ShowtimeInput,
  ShowtimeStatus,
} from "./showtimes.types";

type ShowtimeListResponse = {
  success: true;

  data: {
    items: Showtime[];
  };
};

type ShowtimeResponse = {
  success: true;
  message?: string;

  data: {
    showtime: Showtime;
  };
};

export async function getShowtimes(
  params?: {
    movieId?: string;
    cinemaId?: string;
    screenId?: string;
    date?: string;
    status?: ShowtimeStatus;
    includeInactive?: boolean;
  },
): Promise<Showtime[]> {
  const response =
    await apiClient.get<ShowtimeListResponse>(
      "/showtimes",
      {
        params,
      },
    );

  return response.data.data.items;
}

export async function getShowtime(
  showtimeId: string,
): Promise<Showtime> {
  const response =
    await apiClient.get<ShowtimeResponse>(
      `/showtimes/${showtimeId}`,
    );

  return response.data.data.showtime;
}

export async function createShowtime(
  payload: ShowtimeInput,
): Promise<Showtime> {
  const response =
    await apiClient.post<ShowtimeResponse>(
      "/showtimes",
      payload,
    );

  return response.data.data.showtime;
}

export async function updateShowtime(
  showtimeId: string,
  payload: Partial<ShowtimeInput>,
): Promise<Showtime> {
  const response =
    await apiClient.patch<ShowtimeResponse>(
      `/showtimes/${showtimeId}`,
      payload,
    );

  return response.data.data.showtime;
}

export async function deleteShowtime(
  showtimeId: string,
): Promise<void> {
  await apiClient.delete(
    `/showtimes/${showtimeId}`,
  );
}