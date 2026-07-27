import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  BookingModel,
} from "../models/booking.model";

import {
  CinemaModel,
} from "../models/cinema.model";

import {
  MovieModel,
} from "../models/movie.model";

import {
  ShowtimeModel,
} from "../models/showtime.model";

import {
  UserModel,
} from "../models/user.model";

type RevenueResult = {
  _id: null;
  totalRevenue: number;
};

export async function adminDashboardStats(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const [
      totalUsers,
      totalMovies,
      totalCinemas,
      totalShowtimes,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      revenueResult,
      recentBookings,
    ] =
      await Promise.all([
        UserModel.countDocuments(),

        MovieModel.countDocuments(),

        CinemaModel.countDocuments({
          isActive: true,
        }),

        ShowtimeModel.countDocuments({
          isActive: true,
        }),

        BookingModel.countDocuments(),

        BookingModel.countDocuments({
          status: "confirmed",
        }),

        BookingModel.countDocuments({
          status: {
            $in: [
              "held",
              "payment_pending",
            ],
          },
        }),

        BookingModel.aggregate<RevenueResult>([
          {
            $match: {
              paymentStatus: "paid",
            },
          },

          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum: "$totalAmount",
              },
            },
          },
        ]),

        BookingModel.find()
          .populate(
            "userId",
            "fullName email role",
          )
          .populate(
            "movieId",
            "title posterUrl language",
          )
          .populate(
            "cinemaId",
            "name city",
          )
          .sort({
            createdAt: -1,
          })
          .limit(8),
      ]);

    response.status(200).json({
      success: true,

      data: {
        metrics: {
          totalUsers,
          totalMovies,
          totalCinemas,
          totalShowtimes,
          totalBookings,
          confirmedBookings,
          pendingBookings,

          totalRevenue:
            revenueResult[0]
              ?.totalRevenue ?? 0,
        },

        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
}