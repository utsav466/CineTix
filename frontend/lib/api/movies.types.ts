export type MovieStatus =
  | "now_showing"
  | "coming_soon"
  | "inactive";

export type Movie = {
  id: string;
  title: string;
  slug: string;
  description: string;

  genre: string[];
  language: string;
  duration: number;

  releaseDate: string;
  rating: string;

  director: string;
  cast: string[];

  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;

  status: MovieStatus;
  featured: boolean;

  createdAt: string;
  updatedAt: string;
};

export type MovieInput = {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number;
  releaseDate: string;
  rating: string;
  director: string;
  cast: string[];

  trailerUrl: string;

  posterImage?:
    | File
    | null;

  bannerImage?:
    | File
    | null;

  removePoster?: boolean;
  removeBanner?: boolean;

  status: MovieStatus;
  featured: boolean;
};

export type MoviesPage = {
  items: Movie[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type MovieStatistics = {
  total: number;
  nowShowing: number;
  comingSoon: number;
  inactive: number;
};