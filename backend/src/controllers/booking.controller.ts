import mongoose from "mongoose";

import {
  NextFunction,
  Response,
} from "express";

import {
  HoldSeatsSchema,
} from "../dtos/booking.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  AuthRequest,
} from "../middlewares/auth.middlewares";

import {
  BookingModel,
  BookingStatus,
} from "../models/booking.model";

import {
  SeatModel,
} from "../models/seat.model";

import {
  BookingService,
} from "../services/booking.service";

const bookingService =
  new BookingService();

function requireUserId(
  req: AuthRequest,
): string {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Authentication is required",
    );
  }

  return req.userId;
}

export async function holdBookingSeats(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId =
      requireUserId(req);

    const data =
      HoldSeatsSchema.parse(
        req.body,
      );

    const booking =
      await bookingService
        .holdSeats(
          userId,
          data,
        );

    res.status(201).json({
      success: true,

      message:
        "Seats held for 10 minutes",

      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId =
      requireUserId(req);

    const booking =
      await bookingService
        .getBooking(
          req.params.id,
          userId,
        );

    res.status(200).json({
      success: true,

      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyBookings(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId =
      requireUserId(req);

    const bookings =
      await bookingService
        .getUserBookings(
          userId,
        );

    res.status(200).json({
      success: true,

      data: {
        items: bookings,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelHeldBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId =
      requireUserId(req);

    const booking =
      await bookingService
        .cancelHeldBooking(
          req.params.id,
          userId,
        );

    res.status(200).json({
      success: true,

      message:
        "Booking cancelled successfully",

      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminListBookings(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page =
      Math.max(
        1,
        Number(
          req.query.page || 1,
        ),
      );

    const limit =
      Math.min(
        100,
        Math.max(
          1,
          Number(
            req.query.limit || 20,
          ),
        ),
      );

    const skip =
      (page - 1) * limit;

    const query: Record<
      string,
      unknown
    > = {};

    if (
      typeof req.query.status ===
        "string" &&
      req.query.status.trim()
    ) {
      query.status =
        req.query.status.trim();
    }

    if (
      typeof req.query
        .paymentStatus ===
        "string" &&
      req.query.paymentStatus.trim()
    ) {
      query.paymentStatus =
        req.query.paymentStatus.trim();
    }

    if (
      typeof req.query.search ===
        "string" &&
      req.query.search.trim()
    ) {
      query.bookingCode = {
        $regex:
          req.query.search.trim(),

        $options: "i",
      };
    }

    const [
      bookings,
      total,
    ] =
      await Promise.all([
        BookingModel.find(query)
          .populate(
            "userId",
            "fullName email phone",
          )
          .populate(
            "movieId",
            "title posterUrl duration language rating",
          )
          .populate(
            "cinemaId",
            "name city address",
          )
          .populate(
            "screenId",
            "name",
          )
          .populate(
            "showtimeId",
            "startsAt endsAt",
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        BookingModel.countDocuments(
          query,
        ),
      ]);

    res.status(200).json({
      success: true,

      data: {
        items: bookings,

        page,

        limit,

        total,

        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminGetBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (
      !mongoose.Types.ObjectId
        .isValid(req.params.id)
    ) {
      throw new HttpError(
        400,
        "Invalid booking ID",
      );
    }

    const booking =
      await BookingModel
        .findById(
          req.params.id,
        )
        .populate(
          "userId",
          "fullName email phone",
        )
        .populate(
          "movieId",
          "title posterUrl duration language rating",
        )
        .populate(
          "cinemaId",
          "name city address",
        )
        .populate(
          "screenId",
          "name capacity rows seatsPerRow",
        )
        .populate(
          "showtimeId",
          "startsAt endsAt regularPrice premiumPrice reclinerPrice",
        );

    if (!booking) {
      throw new HttpError(
        404,
        "Booking was not found",
      );
    }

    res.status(200).json({
      success: true,

      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateBookingStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (
      !mongoose.Types.ObjectId
        .isValid(req.params.id)
    ) {
      throw new HttpError(
        400,
        "Invalid booking ID",
      );
    }

    const allowedStatuses:
      BookingStatus[] = [
        "held",
        "payment_pending",
        "confirmed",
        "cancelled",
        "expired",
      ];

    const requestedStatus =
      req.body.status as
        | BookingStatus
        | undefined;

    if (
      !requestedStatus ||
      !allowedStatuses.includes(
        requestedStatus,
      )
    ) {
      throw new HttpError(
        400,
        "Invalid booking status",
      );
    }

    const booking =
      await BookingModel.findById(
        req.params.id,
      );

    if (!booking) {
      throw new HttpError(
        404,
        "Booking was not found",
      );
    }

    if (
      requestedStatus ===
        "cancelled" ||
      requestedStatus ===
        "expired"
    ) {
      await SeatModel.updateMany(
        {
          bookingId:
            booking._id,

          status: "held",
        },
        {
          $set: {
            status:
              "available",
          },

          $unset: {
            heldBy: "",
            holdExpiresAt: "",
            bookingId: "",
          },
        },
      );
    }

    if (
      requestedStatus ===
      "confirmed"
    ) {
      await SeatModel.updateMany(
        {
          bookingId:
            booking._id,
        },
        {
          $set: {
            status:
              "booked",
          },

          $unset: {
            heldBy: "",
            holdExpiresAt: "",
          },
        },
      );
    }

    booking.status =
      requestedStatus;

    if (
      requestedStatus ===
        "confirmed" &&
      booking.paymentStatus ===
        "unpaid"
    ) {
      booking.paymentStatus =
        "paid";
    }

    if (
      requestedStatus ===
        "cancelled" &&
      booking.paymentStatus ===
        "pending"
    ) {
      booking.paymentStatus =
        "failed";
    }

    await booking.save();

    res.status(200).json({
      success: true,

      message:
        "Booking status updated successfully",

      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}