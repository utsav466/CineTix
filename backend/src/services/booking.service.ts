import crypto from "crypto";

import mongoose from "mongoose";

import {
  HoldSeatsDTO,
} from "../dtos/booking.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  BookingModel,
} from "../models/booking.model";

import {
  ScreenModel,
} from "../models/screen.model";

import {
  SeatModel,
  ShowtimeSeatType,
} from "../models/seat.model";

import {
  ShowtimeModel,
} from "../models/showtime.model";

const HOLD_MINUTES = 10;

function createBookingCode(): string {
  const timePart =
    Date.now()
      .toString()
      .slice(-8);

  const randomPart =
    crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase();

  return `CTX-${timePart}-${randomPart}`;
}

export class BookingService {
  private validateObjectId(
    value: string,
    label: string,
  ): void {
    if (
      !mongoose.Types.ObjectId
        .isValid(value)
    ) {
      throw new HttpError(
        400,
        `Invalid ${label} ID`,
      );
    }
  }

  private getSeatPrice(
    seatType:
      ShowtimeSeatType,

    prices: {
      regularPrice: number;
      premiumPrice: number;
      reclinerPrice: number;
    },
  ): number {
    switch (seatType) {
      case "premium":
        return prices.premiumPrice;

      case "recliner":
        return prices.reclinerPrice;

      case "regular":
      default:
        return prices.regularPrice;
    }
  }

  async ensureShowtimeSeats(
    showtimeId: string,
  ): Promise<void> {
    this.validateObjectId(
      showtimeId,
      "showtime",
    );

    const existingSeatCount =
      await SeatModel.countDocuments({
        showtimeId,
      });

    if (existingSeatCount > 0) {
      return;
    }

    const showtime =
      await ShowtimeModel.findById(
        showtimeId,
      );

    if (!showtime) {
      throw new HttpError(
        404,
        "Showtime was not found",
      );
    }

    const screen =
      await ScreenModel.findById(
        showtime.screenId,
      );

    if (!screen) {
      throw new HttpError(
        404,
        "Cinema hall was not found",
      );
    }

    const seats =
      screen.seatLayout
        .filter(
          (seat) =>
            !seat.isDisabled,
        )
        .map((seat) => ({
          showtimeId:
            showtime._id,

          screenId:
            screen._id,

          seatCode:
            seat.seatCode,

          row:
            seat.row,

          number:
            seat.number,

          type:
            seat.type,

          price:
            this.getSeatPrice(
              seat.type,
              showtime,
            ),

          status:
            "available" as const,
        }));

    if (seats.length === 0) {
      throw new HttpError(
        400,
        "This hall contains no active seats",
      );
    }

    try {
      await SeatModel.insertMany(
        seats,
        {
          ordered: false,
        },
      );
    } catch (error) {
      const mongoError =
        error as {
          code?: number;
        };

      /*
       * Two customers may open the same
       * showtime simultaneously.
       *
       * The unique showtime-seat index
       * safely prevents duplicate seats.
       */
      if (
        mongoError.code !== 11000
      ) {
        throw error;
      }
    }
  }

  async releaseExpiredHolds(
    showtimeId?: string,
  ): Promise<void> {
    const query: Record<
      string,
      unknown
    > = {
      status: "held",

      holdExpiresAt: {
        $lte: new Date(),
      },
    };

    if (showtimeId) {
      this.validateObjectId(
        showtimeId,
        "showtime",
      );

      query.showtimeId =
        showtimeId;
    }

    const expiredSeats =
      await SeatModel.find(
        query,
      ).select(
        "_id bookingId",
      );

    if (
      expiredSeats.length === 0
    ) {
      return;
    }

    const seatIds:
      mongoose.Types.ObjectId[] =
        expiredSeats.map(
          (seat) =>
            seat._id,
        );

    const bookingIds:
      mongoose.Types.ObjectId[] =
        expiredSeats
          .map(
            (seat) =>
              seat.bookingId,
          )
          .filter(
            (
              bookingId,
            ): bookingId is mongoose.Types.ObjectId =>
              bookingId !== undefined &&
              bookingId !== null,
          );

    const operations:
      Promise<unknown>[] = [
        SeatModel.updateMany(
          {
            _id: {
              $in: seatIds,
            },

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
        ),
      ];

    if (bookingIds.length > 0) {
      operations.push(
        BookingModel.updateMany(
          {
            _id: {
              $in: bookingIds,
            },

            status: {
              $in: [
                "held",
                "payment_pending",
              ],
            },
          },
          {
            $set: {
              status:
                "expired",
            },
          },
        ),
      );
    }

    await Promise.all(
      operations,
    );
  }

  async getSeatAvailability(
    showtimeId: string,
    userId?: string,
  ) {
    await this.ensureShowtimeSeats(
      showtimeId,
    );

    await this.releaseExpiredHolds(
      showtimeId,
    );

    const showtime =
      await ShowtimeModel
        .findById(
          showtimeId,
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
          "name rows seatsPerRow capacity",
        );

    if (!showtime) {
      throw new HttpError(
        404,
        "Showtime was not found",
      );
    }

    const seats =
      await SeatModel.find({
        showtimeId,
      }).sort({
        row: 1,
        number: 1,
      });

    return {
      showtime,

      seats:
        seats.map(
          (seat) => ({
            id:
              seat._id.toString(),

            seatCode:
              seat.seatCode,

            row:
              seat.row,

            number:
              seat.number,

            type:
              seat.type,

            price:
              seat.price,

            status:
              seat.status,

            heldByCurrentUser:
              Boolean(
                userId &&
                  seat.heldBy &&
                  seat.heldBy.toString() ===
                    userId,
              ),

            holdExpiresAt:
              seat.holdExpiresAt,
          }),
        ),
    };
  }

  async holdSeats(
    userId: string,
    data: HoldSeatsDTO,
  ) {
    this.validateObjectId(
      userId,
      "user",
    );

    this.validateObjectId(
      data.showtimeId,
      "showtime",
    );

    await this.ensureShowtimeSeats(
      data.showtimeId,
    );

    await this.releaseExpiredHolds(
      data.showtimeId,
    );

    const showtime =
      await ShowtimeModel.findById(
        data.showtimeId,
      );

    if (!showtime) {
      throw new HttpError(
        404,
        "Showtime was not found",
      );
    }

    if (
      showtime.status !==
        "scheduled" ||
      !showtime.isActive
    ) {
      throw new HttpError(
        400,
        "This showtime is unavailable for booking",
      );
    }

    if (
      showtime.startsAt <=
      new Date()
    ) {
      throw new HttpError(
        400,
        "This showtime has already started",
      );
    }

    const requestedSeats =
      await SeatModel.find({
        showtimeId:
          data.showtimeId,

        seatCode: {
          $in:
            data.seatCodes,
        },
      });

    if (
      requestedSeats.length !==
      data.seatCodes.length
    ) {
      throw new HttpError(
        400,
        "One or more selected seats do not exist",
      );
    }

    const unavailableSeat =
      requestedSeats.find(
        (seat) =>
          seat.status !==
          "available",
      );

    if (unavailableSeat) {
      throw new HttpError(
        409,
        `Seat ${unavailableSeat.seatCode} is no longer available`,
      );
    }

    const ticketSubtotal =
      requestedSeats.reduce(
        (
          total,
          seat,
        ) =>
          total +
          seat.price,
        0,
      );

    const holdExpiresAt =
      new Date(
        Date.now() +
          HOLD_MINUTES *
            60 *
            1000,
      );

    const booking =
      await BookingModel.create({
        bookingCode:
          createBookingCode(),

        userId:
          new mongoose.Types.ObjectId(
            userId,
          ),

        showtimeId:
          showtime._id,

        movieId:
          showtime.movieId,

        cinemaId:
          showtime.cinemaId,

        screenId:
          showtime.screenId,

        seats:
          requestedSeats.map(
            (seat) => ({
              seatId:
                seat._id,

              seatCode:
                seat.seatCode,

              type:
                seat.type,

              price:
                seat.price,
            }),
          ),

        ticketSubtotal,

        foodSubtotal: 0,

        discountAmount: 0,

        totalAmount:
          ticketSubtotal,

        couponCode: "",

        status: "held",

        paymentStatus:
          "unpaid",

        holdExpiresAt,
      });

    const successfullyHeldSeatIds:
      mongoose.Types.ObjectId[] =
        [];

    try {
      for (
        const seat of
        requestedSeats
      ) {
        const heldSeat =
          await SeatModel
            .findOneAndUpdate(
              {
                _id:
                  seat._id,

                status:
                  "available",
              },
              {
                $set: {
                  status:
                    "held",

                  heldBy:
                    new mongoose.Types.ObjectId(
                      userId,
                    ),

                  holdExpiresAt,

                  bookingId:
                    booking._id,
                },
              },
              {
                new: true,
              },
            );

        if (!heldSeat) {
          throw new HttpError(
            409,
            `Seat ${seat.seatCode} was selected by another customer`,
          );
        }

        successfullyHeldSeatIds.push(
          seat._id,
        );
      }
    } catch (error) {
      await Promise.all([
        SeatModel.updateMany(
          {
            _id: {
              $in:
                successfullyHeldSeatIds,
            },

            bookingId:
              booking._id,
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
        ),

        BookingModel.findByIdAndDelete(
          booking._id,
        ),
      ]);

      throw error;
    }

    return BookingModel
      .findById(
        booking._id,
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
      );
  }

  async getBooking(
    bookingId: string,
    userId: string,
  ) {
    this.validateObjectId(
      bookingId,
      "booking",
    );

    this.validateObjectId(
      userId,
      "user",
    );

    await this.releaseExpiredHolds();

    const booking =
      await BookingModel
        .findOne({
          _id:
            bookingId,

          userId,
        })
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
        );

    if (!booking) {
      throw new HttpError(
        404,
        "Booking was not found",
      );
    }

    return booking;
  }

  async getUserBookings(
    userId: string,
  ) {
    this.validateObjectId(
      userId,
      "user",
    );

    await this.releaseExpiredHolds();

    return BookingModel
      .find({
        userId,
      })
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
      });
  }

  async cancelHeldBooking(
    bookingId: string,
    userId: string,
  ) {
    this.validateObjectId(
      bookingId,
      "booking",
    );

    this.validateObjectId(
      userId,
      "user",
    );

    const booking =
      await BookingModel.findOne({
        _id:
          bookingId,

        userId,
      });

    if (!booking) {
      throw new HttpError(
        404,
        "Booking was not found",
      );
    }

    if (
      booking.status !==
        "held" &&
      booking.status !==
        "payment_pending"
    ) {
      throw new HttpError(
        400,
        "Only active seat holds can be cancelled",
      );
    }

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

    booking.status =
      "cancelled";

    if (
      booking.paymentStatus ===
      "pending"
    ) {
      booking.paymentStatus =
        "failed";
    }

    await booking.save();

    return booking;
  }
}