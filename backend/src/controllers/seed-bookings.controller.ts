import crypto from "crypto";
import mongoose from "mongoose";

import { Response } from "express";

import { AuthRequest } from "../middlewares/auth.middlewares";

import {
  BookingModel,
  BookingPaymentStatus,
  BookingStatus,
} from "../models/booking.model";

import { SeatModel } from "../models/seat.model";
import { ShowtimeModel } from "../models/showtime.model";
import { UserModel } from "../models/user.model";

const BOOKING_STATUSES: BookingStatus[] = [
  "held",
  "confirmed",
  "cancelled",
];

function randomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error(
      "Cannot select an item from an empty list",
    );
  }

  const index = Math.floor(
    Math.random() * items.length,
  );

  return items[index] as T;
}

function randomInteger(
  minimum: number,
  maximum: number,
): number {
  return (
    Math.floor(
      Math.random() *
        (maximum - minimum + 1),
    ) + minimum
  );
}

function createBookingCode(): string {
  return `SEED-${Date.now()
    .toString()
    .slice(-7)}-${crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;
}

function getAuthenticatedUserId(
  request: AuthRequest,
): string | undefined {
  return (
    request.userId ??
    request.auth?.userId
  );
}

export async function seedBookings(
  request: AuthRequest,
  response: Response,
): Promise<Response> {
  try {
    const authenticatedUserId =
      getAuthenticatedUserId(
        request,
      );

    if (
      !authenticatedUserId ||
      !mongoose.isValidObjectId(
        authenticatedUserId,
      )
    ) {
      return response
        .status(401)
        .json({
          success: false,
          message:
            "Authentication is required",
        });
    }

    const rawCount = Number(
      request.query.count ?? 10,
    );

    const count = Number.isFinite(
      rawCount,
    )
      ? Math.min(
          50,
          Math.max(
            1,
            Math.floor(rawCount),
          ),
        )
      : 10;

    const [users, showtimes] =
      await Promise.all([
        UserModel.find({
          isActive: true,
        }).select("_id"),

        ShowtimeModel.find({
          isActive: true,
        }).select(
          "_id movieId cinemaId screenId startsAt regularPrice premiumPrice reclinerPrice",
        ),
      ]);

    if (users.length === 0) {
      return response
        .status(400)
        .json({
          success: false,
          message:
            "Create at least one active user before seeding bookings",
        });
    }

    if (showtimes.length === 0) {
      return response
        .status(400)
        .json({
          success: false,
          message:
            "Create at least one active showtime before seeding bookings",
        });
    }

    const insertedBookings = [];

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const showtime =
        randomItem(showtimes);

      const availableSeats =
        await SeatModel.find({
          showtimeId:
            showtime._id,

          status: "available",
        }).limit(5);

      if (
        availableSeats.length === 0
      ) {
        continue;
      }

      const seatCount = Math.min(
        randomInteger(1, 3),
        availableSeats.length,
      );

      const selectedSeats =
        availableSeats.slice(
          0,
          seatCount,
        );

      const status: BookingStatus =
        Math.random() < 0.7
          ? "confirmed"
          : randomItem(
              BOOKING_STATUSES,
            );

      const paymentStatus:
        BookingPaymentStatus =
          status === "confirmed"
            ? "paid"
            : status ===
                "cancelled"
              ? "failed"
              : "unpaid";

      const ticketSubtotal =
        selectedSeats.reduce(
          (total, seat) =>
            total +
            Number(seat.price),
          0,
        );

      const selectedUser =
        randomItem(users);

      const holdExpiresAt =
        status === "held"
          ? new Date(
              Date.now() +
                10 * 60 * 1000,
            )
          : new Date(
              Date.now() +
                24 * 60 * 60 * 1000,
            );

      const booking =
        await BookingModel.create({
          bookingCode:
            createBookingCode(),

          userId:
            selectedUser._id,

          showtimeId:
            showtime._id,

          movieId:
            showtime.movieId,

          cinemaId:
            showtime.cinemaId,

          screenId:
            showtime.screenId,

          seats:
            selectedSeats.map(
              (seat) => ({
                seatId:
                  seat._id,

                seatCode:
                  seat.seatCode,

                type:
                  seat.type,

                price:
                  Number(
                    seat.price,
                  ),
              }),
            ),

          ticketSubtotal,

          foodSubtotal: 0,

          discountAmount: 0,

          totalAmount:
            ticketSubtotal,

          couponCode: "",

          status,

          paymentStatus,

          paymentMethod:
            status === "confirmed"
              ? "ESEWA"
              : undefined,

          paymentRef:
            status === "confirmed"
              ? `SEED-TXN-${randomInteger(
                  10000,
                  99999,
                )}`
              : "",

          qrCode: "",

          holdExpiresAt,

          confirmedAt:
            status === "confirmed"
              ? new Date()
              : undefined,
        });

      const selectedSeatIds =
        selectedSeats.map(
          (seat) => seat._id,
        );

      if (
        status === "confirmed"
      ) {
        await SeatModel.updateMany(
          {
            _id: {
              $in:
                selectedSeatIds,
            },
          },
          {
            $set: {
              status: "booked",

              bookingId:
                booking._id,
            },

            $unset: {
              heldBy: "",

              holdExpiresAt:
                "",
            },
          },
        );
      } else if (
        status === "held"
      ) {
        await SeatModel.updateMany(
          {
            _id: {
              $in:
                selectedSeatIds,
            },
          },
          {
            $set: {
              status: "held",

              heldBy:
                selectedUser._id,

              holdExpiresAt,

              bookingId:
                booking._id,
            },
          },
        );
      }

      insertedBookings.push(
        booking,
      );
    }

    return response
      .status(201)
      .json({
        success: true,

        message:
          `Seeded ${insertedBookings.length} bookings`,

        data: {
          count:
            insertedBookings.length,

          items:
            insertedBookings,
        },
      });
  } catch (error) {
    console.error(
      "Seed bookings error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    return response
      .status(500)
      .json({
        success: false,
        message,
      });
  }
}