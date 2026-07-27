import type {
  Cinema,
  Screen,
} from "./cinemas.types";

import type {
  Movie,
} from "./movies.types";

export type ShowtimeStatus =
  | "scheduled"
  | "cancelled"
  | "completed";

export type PopulatedMovie =
  Pick<
    Movie,
    | "id"
    | "title"
    | "posterUrl"
    | "duration"
    | "language"
    | "rating"
  > & {
    _id?: string;
  };

export type Showtime = {
  id: string;

  movieId:
    | string
    | PopulatedMovie;

  cinemaId:
    | string
    | Partial<Cinema>;

  screenId:
    | string
    | Partial<Screen>;

  startsAt: string;
  endsAt: string;

  regularPrice: number;
  premiumPrice: number;
  reclinerPrice: number;

  cleanupMinutes: number;

  status: ShowtimeStatus;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

export type ShowtimeInput = {
  movieId: string;
  cinemaId: string;
  screenId: string;

  startsAt: string;

  regularPrice: number;
  premiumPrice: number;
  reclinerPrice: number;

  cleanupMinutes: number;

  status: ShowtimeStatus;
  isActive: boolean;
};