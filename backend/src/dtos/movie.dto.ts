export type CreateMovieDTO = {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number;
  releaseDate: Date;
  rating?: string;
  director: string;
  cast: string[];
  posterUrl?: string;
  trailerUrl?: string;
  status?: "now_showing" | "coming_soon";
};

export type UpdateMovieDTO = Partial<CreateMovieDTO>;