export type Cinema = {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  facilities: string[];
  imageUrl: string;
  isActive: boolean;
  hallCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type CinemaInput = {
  name: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  facilities: string[];

  image?:
    | File
    | null;

  removeImage?: boolean;

  isActive: boolean;
};

export type SeatType =
  | "regular"
  | "premium"
  | "recliner";

export type ScreenSeat = {
  seatCode: string;
  row: string;
  number: number;
  type: SeatType;
  priceMultiplier: number;
  isDisabled: boolean;
};

export type Screen = {
  id: string;

  cinemaId:
    | string
    | {
        id?: string;
        _id?: string;
        name: string;
        city: string;
        address: string;
      };

  name: string;
  rows: number;
  seatsPerRow: number;
  capacity: number;
  seatLayout: ScreenSeat[];
  isActive: boolean;
};

export type ScreenInput = {
  cinemaId: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  seatLayout: ScreenSeat[];
  isActive: boolean;
};