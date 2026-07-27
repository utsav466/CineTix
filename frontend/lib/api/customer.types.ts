export type CustomerMovieStatus =
  | "now_showing"
  | "coming_soon"
  | "inactive"
  | "archived"
  | string;

export type CustomerMovie = {
  id: string;
  _id?: string;

  title: string;
  slug?: string;

  synopsis?: string;
  description?: string;

  posterUrl?: string;
  bannerUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;

  duration: number;

  language?: string;
  rating?: string;
  releaseDate?: string;

  genre?:
    | string[]
    | string;

  cast?: string[];
  director?: string;

  status:
    CustomerMovieStatus;

  isActive?: boolean;
};

export type CustomerCinema = {
  id: string;
  _id?: string;

  name: string;
  city?: string;
  address?: string;
  phone?: string;

  amenities?: string[];

  isActive?: boolean;
};

export type CustomerScreen = {
  id: string;
  _id?: string;

  name: string;
  capacity?: number;
};

export type CustomerShowtime = {
  id: string;
  _id?: string;

  movieId:
    | string
    | CustomerMovie;

  cinemaId:
    | string
    | CustomerCinema;

  screenId:
    | string
    | CustomerScreen;

  startsAt: string;
  endsAt: string;

  regularPrice: number;
  premiumPrice: number;
  reclinerPrice: number;

  status: string;
  isActive: boolean;
};

export type CustomerBooking = {
  id: string;
  _id?: string;

  bookingCode: string;

  movieId:
    | string
    | CustomerMovie;

  cinemaId:
    | string
    | CustomerCinema;

  screenId:
    | string
    | CustomerScreen;

  showtimeId:
    | string
    | {
        id?: string;
        _id?: string;
        startsAt: string;
        endsAt: string;
      };

  seats: {
    seatCode: string;
    type: string;
    price: number;
  }[];

  totalAmount: number;

  status: string;
  paymentStatus: string;

  createdAt?: string;
};