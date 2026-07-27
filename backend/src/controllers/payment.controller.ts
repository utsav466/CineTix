import mongoose from "mongoose";

import {
  Request,
  Response,
} from "express";

import {
  AuthRequest,
} from "../middlewares/auth.middlewares";

import {
  BookingModel,
} from "../models/booking.model";

import {
  CouponModel,
} from "../models/coupon.model";

import {
  SeatModel,
} from "../models/seat.model";

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:3000";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";

const KHALTI_BASE_URL =
  process.env.KHALTI_BASE_URL ||
  "https://dev.khalti.com/api/v2";

const KHALTI_SECRET_KEY =
  process.env.KHALTI_SECRET_KEY ||
  "";

type KhaltiInitiateResponse = {
  pidx?: string;
  payment_url?: string;
  expires_at?: string;
  expires_in?: number;

  detail?: string;
  error_key?: string;

  [key: string]: unknown;
};

type KhaltiLookupResponse = {
  pidx?: string;
  total_amount?: number;

  status?:
    | "Completed"
    | "Pending"
    | "Initiated"
    | "Refunded"
    | "Expired"
    | "User canceled"
    | "Canceled";

  transaction_id?:
    | string
    | null;

  fee?: number;
  refunded?: boolean;

  detail?: string;
  error_key?: string;

  [key: string]: unknown;
};

function khaltiHeaders() {
  if (!KHALTI_SECRET_KEY) {
    throw new Error(
      "KHALTI_SECRET_KEY is missing from backend environment variables",
    );
  }

  return {
    Authorization:
      `Key ${KHALTI_SECRET_KEY}`,

    "Content-Type":
      "application/json",
  };
}

function rupeesToPaisa(
  amount: number,
): number {
  return Math.round(
    amount * 100,
  );
}

async function parseResponse<T>(
  response: globalThis.Response,
): Promise<T> {
  const text =
    await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(
      text,
    ) as T;
  } catch {
    throw new Error(
      `Invalid response from Khalti: ${text}`,
    );
  }
}

function khaltiErrorMessage(
  data: Record<
    string,
    unknown
  >,
): string {
  if (
    typeof data.detail ===
    "string"
  ) {
    return data.detail;
  }

  for (
    const value of
    Object.values(data)
  ) {
    if (
      Array.isArray(value) &&
      typeof value[0] ===
        "string"
    ) {
      return value[0];
    }

    if (
      typeof value ===
      "string"
    ) {
      return value;
    }
  }

  return "Khalti payment request failed";
}

export async function initiateKhaltiPayment(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  try {
    const userId =
      req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication is required",
        });
    }

    const bookingId =
      String(
        req.body.bookingId ||
          "",
      );

    if (
      !mongoose.Types.ObjectId
        .isValid(bookingId)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid booking ID",
        });
    }

    const booking =
      await BookingModel.findOne({
        _id: bookingId,
        userId,
      });

    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Booking was not found",
        });
    }

    if (
      booking.status ===
        "confirmed" &&
      booking.paymentStatus ===
        "paid"
    ) {
      return res
        .status(200)
        .json({
          success: true,

          message:
            "Booking is already paid",

          data: {
            bookingId:
              booking._id.toString(),

            alreadyPaid: true,

            ticketUrl:
              `${FRONTEND_URL}/tickets/${booking._id}`,
          },
        });
    }

    if (
      booking.status !==
        "held" &&
      booking.status !==
        "payment_pending"
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "This booking cannot be paid",
        });
    }

    if (
      booking.holdExpiresAt <=
      new Date()
    ) {
      booking.status =
        "expired";

      booking.paymentStatus =
        "failed";

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

      await booking.save();

      return res
        .status(400)
        .json({
          success: false,
          message:
            "Your seat hold has expired",
        });
    }

    const amountInPaisa =
      rupeesToPaisa(
        booking.totalAmount,
      );

    if (amountInPaisa < 1000) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Khalti requires a minimum payment of NPR 10",
        });
    }

    const returnUrl =
      `${BACKEND_URL}/api/payments/khalti/callback`;

    const payload = {
      return_url:
        returnUrl,

      website_url:
        FRONTEND_URL,

      amount:
        amountInPaisa,

      purchase_order_id:
        booking.bookingCode,

      purchase_order_name:
        `CineTix ${booking.bookingCode}`,

      amount_breakdown: [
        {
          label:
            "Movie tickets",

          amount:
            rupeesToPaisa(
              booking.ticketSubtotal,
            ),
        },

        {
          label:
            "Food and beverages",

          amount:
            rupeesToPaisa(
              booking.foodSubtotal,
            ),
        },

        {
          label:
            "Discount",

          amount:
            -rupeesToPaisa(
              booking.discountAmount,
            ),
        },
      ],

      product_details: [
        {
          identity:
            booking._id.toString(),

          name:
            `CineTix booking ${booking.bookingCode}`,

          total_price:
            amountInPaisa,

          quantity: 1,

          unit_price:
            amountInPaisa,
        },
      ],

      merchant_booking_id:
        booking._id.toString(),
    };

    /*
     * Khalti requires amount_breakdown
     * to equal the final amount.
     *
     * Some gateways may reject negative
     * breakdown amounts, so omit the
     * optional breakdown when a coupon
     * discount exists.
     */
    const finalPayload =
      booking.discountAmount > 0
        ? {
            return_url:
              payload.return_url,

            website_url:
              payload.website_url,

            amount:
              payload.amount,

            purchase_order_id:
              payload.purchase_order_id,

            purchase_order_name:
              payload.purchase_order_name,

            product_details:
              payload.product_details,

            merchant_booking_id:
              payload.merchant_booking_id,
          }
        : payload;

    const response =
      await fetch(
        `${KHALTI_BASE_URL}/epayment/initiate/`,
        {
          method: "POST",

          headers:
            khaltiHeaders(),

          body:
            JSON.stringify(
              finalPayload,
            ),
        },
      );

    const data =
      await parseResponse<KhaltiInitiateResponse>(
        response,
      );

    if (
      !response.ok ||
      !data.pidx ||
      !data.payment_url
    ) {
      return res
        .status(502)
        .json({
          success: false,

          message:
            khaltiErrorMessage(
              data,
            ),

          data,
        });
    }

    booking.paymentMethod =
      "KHALTI";

    booking.paymentStatus =
      "pending";

    booking.status =
      "payment_pending";

    booking.khaltiPidx =
      data.pidx;

    booking.khaltiPaymentUrl =
      data.payment_url;

    await booking.save();

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Khalti payment initialized",

        data: {
          bookingId:
            booking._id.toString(),

          pidx:
            data.pidx,

          paymentUrl:
            data.payment_url,

          expiresAt:
            data.expires_at,

          expiresIn:
            data.expires_in,
        },
      });
  } catch (error) {
    console.error(
      "Khalti initiation error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to initiate Khalti payment";

    return res
      .status(500)
      .json({
        success: false,
        message,
      });
  }
}

export async function khaltiCallback(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const pidx =
      typeof req.query.pidx ===
      "string"
        ? req.query.pidx
        : "";

    const purchaseOrderId =
      typeof req.query
        .purchase_order_id ===
      "string"
        ? req.query
            .purchase_order_id
        : "";

    if (
      !pidx ||
      !purchaseOrderId
    ) {
      res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=invalid_callback`,
      );

      return;
    }

    const booking =
      await BookingModel.findOne({
        bookingCode:
          purchaseOrderId,
      });

    if (!booking) {
      res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=booking_not_found`,
      );

      return;
    }

    if (
      booking.status ===
        "confirmed" &&
      booking.paymentStatus ===
        "paid"
    ) {
      res.redirect(
        `${FRONTEND_URL}/tickets/${booking._id}`,
      );

      return;
    }

    if (
      booking.khaltiPidx &&
      booking.khaltiPidx !==
        pidx
    ) {
      booking.paymentStatus =
        "failed";

      await booking.save();

      res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=pidx_mismatch`,
      );

      return;
    }

    const lookupResponse =
      await fetch(
        `${KHALTI_BASE_URL}/epayment/lookup/`,
        {
          method: "POST",

          headers:
            khaltiHeaders(),

          body:
            JSON.stringify({
              pidx,
            }),
        },
      );

    const lookup =
      await parseResponse<KhaltiLookupResponse>(
        lookupResponse,
      );

    if (!lookupResponse.ok) {
      booking.paymentStatus =
        "failed";

      await booking.save();

      res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=lookup_failed`,
      );

      return;
    }

    const expectedAmount =
      rupeesToPaisa(
        booking.totalAmount,
      );

    if (
      lookup.total_amount !==
      expectedAmount
    ) {
      booking.paymentStatus =
        "failed";

      await booking.save();

      res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=amount_mismatch`,
      );

      return;
    }

    if (
      lookup.status ===
      "Completed"
    ) {
      booking.status =
        "confirmed";

      booking.paymentStatus =
        "paid";

      booking.paymentMethod =
        "KHALTI";

      booking.khaltiPidx =
        pidx;

      booking.paymentRef =
        lookup.transaction_id ||
        pidx;

      booking.confirmedAt =
        new Date();

      booking.qrCode =
        JSON.stringify({
          bookingId:
            booking._id.toString(),

          bookingCode:
            booking.bookingCode,

          transactionId:
            booking.paymentRef,
        });

      await SeatModel.updateMany(
        {
          bookingId:
            booking._id,

          status: "held",
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

      if (
        booking.couponId
      ) {
        await CouponModel.updateOne(
          {
            _id:
              booking.couponId,
          },
          {
            $inc: {
              usageCount: 1,
            },
          },
        );
      }

      await booking.save();

      res.redirect(
        `${FRONTEND_URL}/tickets/${booking._id}`,
      );

      return;
    }

    if (
      lookup.status ===
        "Pending" ||
      lookup.status ===
        "Initiated"
    ) {
      booking.status =
        "payment_pending";

      booking.paymentStatus =
        "pending";

      await booking.save();

      res.redirect(
        `${FRONTEND_URL}/payment/pending?bookingId=${booking._id}`,
      );

      return;
    }

    if (
      lookup.status ===
      "Refunded"
    ) {
      booking.paymentStatus =
        "refunded";

      booking.status =
        "cancelled";

      await booking.save();

      res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=refunded`,
      );

      return;
    }

    booking.paymentStatus =
      "failed";

    if (
      booking.holdExpiresAt >
      new Date()
    ) {
      booking.status =
        "held";
    } else {
      booking.status =
        "expired";

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

    await booking.save();

    res.redirect(
      `${FRONTEND_URL}/payment/failed?reason=payment_not_completed&bookingId=${booking._id}`,
    );
  } catch (error) {
    console.error(
      "Khalti callback error:",
      error,
    );

    res.redirect(
      `${FRONTEND_URL}/payment/failed?reason=server_error`,
    );
  }
}

export async function verifyKhaltiPayment(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication is required",
        });
    }

    const bookingId =
      String(
        req.params.bookingId ||
          "",
      );

    if (
      !mongoose.Types.ObjectId
        .isValid(bookingId)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid booking ID",
        });
    }

    const booking =
      await BookingModel.findOne({
        _id: bookingId,
        userId: req.userId,
      });

    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Booking was not found",
        });
    }

    if (!booking.khaltiPidx) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Khalti payment was not initiated",
        });
    }

    const response =
      await fetch(
        `${KHALTI_BASE_URL}/epayment/lookup/`,
        {
          method: "POST",

          headers:
            khaltiHeaders(),

          body:
            JSON.stringify({
              pidx:
                booking.khaltiPidx,
            }),
        },
      );

    const lookup =
      await parseResponse<KhaltiLookupResponse>(
        response,
      );

    return res
      .status(
        response.ok
          ? 200
          : 502,
      )
      .json({
        success:
          response.ok,

        message:
          response.ok
            ? "Payment status retrieved"
            : khaltiErrorMessage(
                lookup,
              ),

        data: {
          bookingId:
            booking._id.toString(),

          bookingStatus:
            booking.status,

          paymentStatus:
            booking.paymentStatus,

          khaltiStatus:
            lookup.status,

          transactionId:
            lookup.transaction_id,

          amount:
            lookup.total_amount,
        },
      });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to verify payment";

    return res
      .status(500)
      .json({
        success: false,
        message,
      });
  }
}