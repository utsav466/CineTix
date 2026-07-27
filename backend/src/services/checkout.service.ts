import mongoose from "mongoose";

import {
  UpdateBookingCheckoutDTO,
} from "../dtos/booking.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  BookingModel,
} from "../models/booking.model";

import {
  CouponModel,
  ICoupon,
} from "../models/coupon.model";

import {
  FoodModel,
} from "../models/food.model";

type RequestedFoodItem = {
  foodId: string;
  quantity: number;
};

export class CheckoutService {
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

  private calculateDiscount(
    coupon: ICoupon,
    subtotal: number,
  ): number {
    let discount =
      coupon.discountType ===
      "percentage"
        ? (
            subtotal *
            coupon.discountValue
          ) / 100
        : coupon.discountValue;

    if (
      coupon.maximumDiscountAmount !==
        undefined &&
      discount >
        coupon.maximumDiscountAmount
    ) {
      discount =
        coupon.maximumDiscountAmount;
    }

    return Math.min(
      subtotal,
      Math.max(
        0,
        Math.round(
          discount * 100,
        ) / 100,
      ),
    );
  }

  private mergeFoodItems(
    foodItems: RequestedFoodItem[],
  ): RequestedFoodItem[] {
    const quantityMap =
      new Map<string, number>();

    for (
      const item of foodItems
    ) {
      const currentQuantity =
        quantityMap.get(
          item.foodId,
        ) || 0;

      quantityMap.set(
        item.foodId,
        Math.min(
          20,
          currentQuantity +
            item.quantity,
        ),
      );
    }

    return Array.from(
      quantityMap.entries(),
    ).map(
      ([
        foodId,
        quantity,
      ]) => ({
        foodId,
        quantity,
      }),
    );
  }

  private async validateCoupon(
    couponCode: string,
    subtotal: number,
  ) {
    if (!couponCode) {
      return {
        coupon: null,
        discountAmount: 0,
      };
    }

    const coupon =
      await CouponModel.findOne({
        code:
          couponCode.toUpperCase(),
      });

    if (!coupon) {
      throw new HttpError(
        404,
        "Coupon code is invalid",
      );
    }

    const now = new Date();

    if (!coupon.isActive) {
      throw new HttpError(
        400,
        "Coupon is inactive",
      );
    }

    if (
      now < coupon.startsAt
    ) {
      throw new HttpError(
        400,
        "Coupon is not active yet",
      );
    }

    if (
      now > coupon.expiresAt
    ) {
      throw new HttpError(
        400,
        "Coupon has expired",
      );
    }

    if (
      coupon.usageLimit !==
        undefined &&
      coupon.usageCount >=
        coupon.usageLimit
    ) {
      throw new HttpError(
        400,
        "Coupon usage limit has been reached",
      );
    }

    if (
      subtotal <
      coupon.minimumOrderAmount
    ) {
      throw new HttpError(
        400,
        `Minimum order amount is NPR ${coupon.minimumOrderAmount}`,
      );
    }

    return {
      coupon,

      discountAmount:
        this.calculateDiscount(
          coupon,
          subtotal,
        ),
    };
  }

  async updateCheckout(
    bookingId: string,
    userId: string,
    data: UpdateBookingCheckoutDTO,
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
        _id: bookingId,
        userId,
      });

    if (!booking) {
      throw new HttpError(
        404,
        "Booking was not found",
      );
    }

    if (
      booking.status !== "held"
    ) {
      throw new HttpError(
        400,
        "Only active held bookings can be updated",
      );
    }

    if (
      booking.holdExpiresAt <=
      new Date()
    ) {
      booking.status =
        "expired";

      await booking.save();

      throw new HttpError(
        400,
        "Your seat hold has expired",
      );
    }

    const mergedItems =
      this.mergeFoodItems(
        data.foodItems,
      );

    for (
      const item of mergedItems
    ) {
      this.validateObjectId(
        item.foodId,
        "food",
      );
    }

    const foodIds =
      mergedItems.map(
        (item) =>
          new mongoose.Types.ObjectId(
            item.foodId,
          ),
      );

    const foods =
      foodIds.length > 0
        ? await FoodModel.find({
            _id: {
              $in: foodIds,
            },

            isAvailable: true,
          })
        : [];

    if (
      foods.length !==
      mergedItems.length
    ) {
      throw new HttpError(
        400,
        "One or more selected food items are unavailable",
      );
    }

    const foodMap =
      new Map(
        foods.map(
          (food) => [
            food._id.toString(),
            food,
          ],
        ),
      );

    const bookingFoodItems =
      mergedItems.map(
        (item) => {
          const food =
            foodMap.get(
              item.foodId,
            );

          if (!food) {
            throw new HttpError(
              400,
              "Food item is unavailable",
            );
          }

          const lineTotal =
            Math.round(
              food.price *
                item.quantity *
                100,
            ) / 100;

          return {
            foodId:
              food._id,

            name:
              food.name,

            quantity:
              item.quantity,

            unitPrice:
              food.price,

            lineTotal,
          };
        },
      );

    const foodSubtotal =
      bookingFoodItems.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.lineTotal,
        0,
      );

    const subtotal =
      Math.round(
        (
          booking.ticketSubtotal +
          foodSubtotal
        ) *
          100,
      ) / 100;

    const {
      coupon,
      discountAmount,
    } =
      await this.validateCoupon(
        data.couponCode,
        subtotal,
      );

    const totalAmount =
      Math.max(
        0,
        Math.round(
          (
            subtotal -
            discountAmount
          ) *
            100,
        ) / 100,
      );

    booking.foodItems =
      bookingFoodItems;

    booking.foodSubtotal =
      foodSubtotal;

    booking.couponId =
      coupon?._id;

    booking.couponCode =
      coupon?.code || "";

    booking.discountAmount =
      discountAmount;

    booking.totalAmount =
      totalAmount;

    await booking.save();

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

  async removeCoupon(
    bookingId: string,
    userId: string,
  ) {
    this.validateObjectId(
      bookingId,
      "booking",
    );

    const booking =
      await BookingModel.findOne({
        _id: bookingId,
        userId,
      });

    if (!booking) {
      throw new HttpError(
        404,
        "Booking was not found",
      );
    }

    if (
      booking.status !== "held"
    ) {
      throw new HttpError(
        400,
        "This booking can no longer be updated",
      );
    }

    booking.couponId =
      undefined;

    booking.couponCode =
      "";

    booking.discountAmount =
      0;

    booking.totalAmount =
      Math.round(
        (
          booking.ticketSubtotal +
          booking.foodSubtotal
        ) *
          100,
      ) / 100;

    await booking.save();

    return booking;
  }
}