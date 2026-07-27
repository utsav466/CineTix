import mongoose from "mongoose";

import {
  HttpError,
} from "../errors/http-error";

import {
  SeatModel,
} from "../models/seat.model";

export class SeatService {
  private validateObjectId(
    id: string,
    label: string,
  ): void {
    if (
      !mongoose.Types.ObjectId.isValid(
        id,
      )
    ) {
      throw new HttpError(
        400,
        `Invalid ${label} ID`,
      );
    }
  }

  async getSeatsByShowtime(
    showtimeId: string,
  ) {
    this.validateObjectId(
      showtimeId,
      "showtime",
    );

    return SeatModel.find({
      showtimeId,
    }).sort({
      row: 1,
      number: 1,
    });
  }

  async getSeatById(
    seatId: string,
  ) {
    this.validateObjectId(
      seatId,
      "seat",
    );

    const seat =
      await SeatModel.findById(
        seatId,
      );

    if (!seat) {
      throw new HttpError(
        404,
        "Seat was not found",
      );
    }

    return seat;
  }

  async holdSeat(
    seatId: string,
    userId: string,
    holdExpiresAt: Date,
  ) {
    this.validateObjectId(
      seatId,
      "seat",
    );

    this.validateObjectId(
      userId,
      "user",
    );

    const seat =
      await SeatModel.findOneAndUpdate(
        {
          _id: seatId,
          status: "available",
        },
        {
          $set: {
            status: "held",

            heldBy:
              new mongoose.Types.ObjectId(
                userId,
              ),

            holdExpiresAt,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!seat) {
      throw new HttpError(
        409,
        "Seat is no longer available",
      );
    }

    return seat;
  }

  async releaseSeat(
    seatId: string,
  ) {
    this.validateObjectId(
      seatId,
      "seat",
    );

    const seat =
      await SeatModel.findByIdAndUpdate(
        seatId,
        {
          $set: {
            status: "available",
          },

          $unset: {
            heldBy: "",
            holdExpiresAt: "",
            bookingId: "",
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!seat) {
      throw new HttpError(
        404,
        "Seat was not found",
      );
    }

    return seat;
  }

  async bookSeat(
    seatId: string,
    bookingId: string,
  ) {
    this.validateObjectId(
      seatId,
      "seat",
    );

    this.validateObjectId(
      bookingId,
      "booking",
    );

    const seat =
      await SeatModel.findOneAndUpdate(
        {
          _id: seatId,

          status: {
            $in: [
              "available",
              "held",
            ],
          },
        },
        {
          $set: {
            status: "booked",

            bookingId:
              new mongoose.Types.ObjectId(
                bookingId,
              ),
          },

          $unset: {
            heldBy: "",
            holdExpiresAt: "",
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!seat) {
      throw new HttpError(
        409,
        "Seat cannot be booked",
      );
    }

    return seat;
  }

  async releaseExpiredSeats() {
    const now =
      new Date();

    return SeatModel.updateMany(
      {
        status: "held",

        holdExpiresAt: {
          $lte: now,
        },
      },
      {
        $set: {
          status: "available",
        },

        $unset: {
          heldBy: "",
          holdExpiresAt: "",
          bookingId: "",
        },
      },
    );
  }

  async releaseBookingSeats(
    bookingId: string,
  ) {
    this.validateObjectId(
      bookingId,
      "booking",
    );

    return SeatModel.updateMany(
      {
        bookingId,
        status: "held",
      },
      {
        $set: {
          status: "available",
        },

        $unset: {
          heldBy: "",
          holdExpiresAt: "",
          bookingId: "",
        },
      },
    );
  }

  async confirmBookingSeats(
    bookingId: string,
  ) {
    this.validateObjectId(
      bookingId,
      "booking",
    );

    return SeatModel.updateMany(
      {
        bookingId,
        status: "held",
      },
      {
        $set: {
          status: "booked",
        },

        $unset: {
          heldBy: "",
          holdExpiresAt: "",
        },
      },
    );
  }
}