import {
  NextFunction,
  Response,
} from "express";

import {
  UpdateBookingCheckoutSchema,
} from "../dtos/booking.dto";

import {
  HttpError,
} from "../errors/http-error";

import * as authMiddlewares from "../middlewares/auth.middlewares";

import {
  CheckoutService,
} from "../services/checkout.service";

const checkoutService =
  new CheckoutService();

function getUserId(
  req: authMiddlewares.AuthRequest,
): string {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Authentication is required",
    );
  }

  return req.userId;
}

export async function updateBookingCheckout(
  req: authMiddlewares.AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId =
      getUserId(req);

    const data =
      UpdateBookingCheckoutSchema.parse(
        req.body,
      );

    const booking =
      await checkoutService
        .updateCheckout(
          req.params.id,
          userId,
          data,
        );

    res.status(200).json({
      success: true,

      message:
        "Checkout updated successfully",

      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function removeBookingCoupon(
  req: authMiddlewares.AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId =
      getUserId(req);

    const booking =
      await checkoutService
        .removeCoupon(
          req.params.id,
          userId,
        );

    res.status(200).json({
      success: true,

      message:
        "Coupon removed successfully",

      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}