export type AdminDashboardMetrics = {
  totalUsers: number;
  totalMovies: number;
  totalCinemas: number;
  totalShowtimes: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
};

export type AdminDashboardBooking = {
  id: string;
  bookingCode: string;

  userId:
    | string
    | {
        id?: string;
        _id?: string;
        name?: string;
        email?: string;
      };

  movieId:
    | string
    | {
        id?: string;
        _id?: string;
        title?: string;
      };

  totalAmount: number;

  status:
    | "held"
    | "payment_pending"
    | "confirmed"
    | "cancelled"
    | "expired"
    | string;

  paymentStatus:
    | "unpaid"
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | string;

  createdAt: string;
};

export type AdminDashboardData = {
  metrics: AdminDashboardMetrics;
  recentBookings: AdminDashboardBooking[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;

  role:
    | "customer"
    | "admin"
    | string;

  isActive: boolean;

  createdAt: string;
  updatedAt?: string;
};

export type AdminBooking = {
  id: string;
  bookingCode: string;

  userId:
    | string
    | {
        id?: string;
        _id?: string;
        name?: string;
        email?: string;
      };

  movieId:
    | string
    | {
        id?: string;
        _id?: string;
        title?: string;
      };

  cinemaId:
    | string
    | {
        id?: string;
        _id?: string;
        name?: string;
        city?: string;
      };

  seats: {
    seatCode: string;
    type: string;
    price: number;
  }[];

  totalAmount: number;

  status: string;
  paymentStatus: string;

  paymentMethod?:
    | "KHALTI"
    | "ESEWA"
    | "CASH";

  paymentRef?: string;

  createdAt: string;
};