import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AuthRequest,
} from "../middlewares/auth.middlewares";

import {
  BookingService,
} from "../services/booking.service";

const bookingService =
  new BookingService();

export async function getShowtimeSeats(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result =
      await bookingService
        .getSeatAvailability(
          req.params.showtimeId,
          req.auth?.userId,
        );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}