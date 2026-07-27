export type SeatAvailabilityStatus =
  | "available"
  | "held"
  | "booked";

export type BookingSeatType =
  | "regular"
  | "premium"
  | "recliner";

export type AvailableSeat = {
  id: string;
  seatCode: string;
  row: string;
  number: number;
  type: BookingSeatType;
  price: number;

  status:
    SeatAvailabilityStatus;

  heldByCurrentUser:
    boolean;

  holdExpiresAt?: string;
};

export type PopulatedMovie = {
  id?: string;
  _id?: string;
  title: string;
  posterUrl?: string;
  duration?: number;
  language?: string;
  rating?: string;
};

export type PopulatedCinema = {
  id?: string;
  _id?: string;
  name: string;
  city?: string;
  address?: string;
};

export type PopulatedScreen = {
  id?: string;
  _id?: string;
  name: string;
  capacity?: number;
};

export type PopulatedShowtime = {
  id?: string;
  _id?: string;
  startsAt: string;
  endsAt: string;
};

export type ShowtimeSeatData = {
  showtime: {
    id: string;
    startsAt: string;
    endsAt: string;

    movieId:
      | string
      | PopulatedMovie;

    cinemaId:
      | string
      | PopulatedCinema;

    screenId:
      | string
      | PopulatedScreen;
  };

  seats: AvailableSeat[];
};

export type BookingFoodItem = {
  foodId:
    | string
    | {
        id?: string;
        _id?: string;
      };

  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type HeldBooking = {
  id: string;
  bookingCode: string;

  movieId:
    | string
    | PopulatedMovie;

  cinemaId:
    | string
    | PopulatedCinema;

  screenId:
    | string
    | PopulatedScreen;

  showtimeId:
    | string
    | PopulatedShowtime;

  seats: {
    seatCode: string;
    type: BookingSeatType;
    price: number;
  }[];

  foodItems:
    BookingFoodItem[];

  ticketSubtotal: number;
  foodSubtotal: number;

  couponCode?: string;

  discountAmount: number;
  totalAmount: number;

  status:
    | "held"
    | "payment_pending"
    | "confirmed"
    | "cancelled"
    | "expired";

  paymentStatus:
    | "unpaid"
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  paymentMethod?:
    | "KHALTI"
    | "ESEWA"
    | "CASH";

  paymentRef?: string;
  khaltiPidx?: string;
  qrCode?: string;

  holdExpiresAt: string;
  confirmedAt?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type CheckoutFoodInput = {
  foodId: string;
  quantity: number;
};