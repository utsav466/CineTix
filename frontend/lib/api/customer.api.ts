import {
  apiClient,
} from "./client";

import type {
  CustomerBooking,
  CustomerCinema,
  CustomerMovie,
  CustomerShowtime,
} from "./customer.types";

type MovieListResponse = {
  success: true;

  data: {
    items:
      CustomerMovie[];

    total?: number;
    page?: number;
    limit?: number;
  };
};

type MovieResponse = {
  success: true;

  data: {
    movie:
      CustomerMovie;
  };
};

type ShowtimeListResponse = {
  success: true;

  data: {
    items:
      CustomerShowtime[];
  };
};

type CinemaListResponse = {
  success: true;

  data: {
    items:
      CustomerCinema[];
  };
};

type BookingListResponse = {
  success: true;

  data: {
    items:
      CustomerBooking[];
  };
};

function itemId(
  item: {
    id?: string;
    _id?: string;
  },
): string {
  return (
    item.id ||
    item._id ||
    ""
  );
}

function normalizeMovie(
  movie: CustomerMovie,
): CustomerMovie {
  return {
    ...movie,
    id:
      itemId(movie),
  };
}

function normalizeCinema(
  cinema: CustomerCinema,
): CustomerCinema {
  return {
    ...cinema,
    id:
      itemId(cinema),
  };
}

function normalizeShowtime(
  showtime: CustomerShowtime,
): CustomerShowtime {
  return {
    ...showtime,

    id:
      itemId(showtime),

    movieId:
      typeof showtime.movieId ===
      "string"
        ? showtime.movieId
        : normalizeMovie(
            showtime.movieId,
          ),

    cinemaId:
      typeof showtime.cinemaId ===
      "string"
        ? showtime.cinemaId
        : normalizeCinema(
            showtime.cinemaId,
          ),

    screenId:
      typeof showtime.screenId ===
      "string"
        ? showtime.screenId
        : {
            ...showtime.screenId,

            id:
              itemId(
                showtime.screenId,
              ),
          },
  };
}

function normalizeBooking(
  booking: CustomerBooking,
): CustomerBooking {
  return {
    ...booking,

    id:
      itemId(booking),

    movieId:
      typeof booking.movieId ===
      "string"
        ? booking.movieId
        : normalizeMovie(
            booking.movieId,
          ),

    cinemaId:
      typeof booking.cinemaId ===
      "string"
        ? booking.cinemaId
        : normalizeCinema(
            booking.cinemaId,
          ),

    screenId:
      typeof booking.screenId ===
      "string"
        ? booking.screenId
        : {
            ...booking.screenId,

            id:
              itemId(
                booking.screenId,
              ),
          },
  };
}

export async function getCustomerMovies(
  params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  },
): Promise<CustomerMovie[]> {
  const response =
    await apiClient.get<MovieListResponse>(
      "/movies",
      {
        params,
      },
    );

  return response.data.data.items
    .map(normalizeMovie)
    .filter(
      (movie) =>
        Boolean(movie.id),
    );
}

export async function getCustomerMovie(
  movieId: string,
): Promise<CustomerMovie> {
  const response =
    await apiClient.get<MovieResponse>(
      `/movies/${movieId}`,
    );

  return normalizeMovie(
    response.data.data.movie,
  );
}

export async function getCustomerShowtimes(
  params?: {
    movieId?: string;
    cinemaId?: string;
    date?: string;
  },
): Promise<CustomerShowtime[]> {
  const response =
    await apiClient.get<ShowtimeListResponse>(
      "/showtimes",
      {
        params,
      },
    );

  const now =
    Date.now();

  return response.data.data.items
    .map(
      normalizeShowtime,
    )
    .filter(
      (showtime) => {
        const startTime =
          new Date(
            showtime.startsAt,
          ).getTime();

        return (
          Boolean(
            showtime.id,
          ) &&
          showtime.isActive !==
            false &&
          showtime.status !==
            "cancelled" &&
          Number.isFinite(
            startTime,
          ) &&
          startTime > now
        );
      },
    );
}

export async function getCustomerCinemas():
  Promise<CustomerCinema[]> {
  const response =
    await apiClient.get<CinemaListResponse>(
      "/cinemas",
    );

  return response.data.data.items
    .map(
      normalizeCinema,
    )
    .filter(
      (cinema) =>
        Boolean(cinema.id),
    );
}

export async function getCustomerBookings():
  Promise<CustomerBooking[]> {
  const response =
    await apiClient.get<BookingListResponse>(
      "/bookings/my",
    );

  return response.data.data.items
    .map(
      normalizeBooking,
    )
    .filter(
      (booking) =>
        Boolean(booking.id),
    );
}