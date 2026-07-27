import {
  NextFunction,
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import {
  CreateCouponSchema,
  UpdateCouponSchema,
  ValidateCouponSchema,
} from "../dtos/coupon.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  CouponModel,
} from "../models/coupon.model";

function validateCouponId(
  id: string,
): void {
  if (
    !mongoose.Types.ObjectId
      .isValid(id)
  ) {
    throw new HttpError(
      400,
      "Invalid coupon ID",
    );
  }
}

function calculateDiscount(
  discountType:
    | "percentage"
    | "fixed",

  discountValue: number,

  maximumDiscountAmount:
    number | undefined,

  orderAmount: number,
): number {
  let discount =
    discountType ===
    "percentage"
      ? (
          orderAmount *
          discountValue
        ) / 100
      : discountValue;

  if (
    maximumDiscountAmount !==
      undefined &&
    discount >
      maximumDiscountAmount
  ) {
    discount =
      maximumDiscountAmount;
  }

  return Math.min(
    orderAmount,
    Math.max(
      0,
      Math.round(
        discount * 100,
      ) / 100,
    ),
  );
}

export async function listCoupons(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const items =
      await CouponModel.find()
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      data: {
        items,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createCoupon(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data =
      CreateCouponSchema.parse(
        req.body,
      );

    const existing =
      await CouponModel.findOne({
        code: data.code,
      });

    if (existing) {
      throw new HttpError(
        409,
        "Coupon code already exists",
      );
    }

    const coupon =
      await CouponModel.create(
        data,
      );

    res.status(201).json({
      success: true,
      message:
        "Coupon created successfully",
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCoupon(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateCouponId(
      req.params.id,
    );

    const data =
      UpdateCouponSchema.parse(
        req.body,
      );

    if (data.code) {
      const duplicate =
        await CouponModel.findOne({
          code: data.code,

          _id: {
            $ne:
              req.params.id,
          },
        });

      if (duplicate) {
        throw new HttpError(
          409,
          "Coupon code already exists",
        );
      }
    }

    const coupon =
      await CouponModel
        .findByIdAndUpdate(
          req.params.id,
          data,
          {
            new: true,
            runValidators: true,
          },
        );

    if (!coupon) {
      throw new HttpError(
        404,
        "Coupon was not found",
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Coupon updated successfully",
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCoupon(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateCouponId(
      req.params.id,
    );

    const coupon =
      await CouponModel
        .findByIdAndDelete(
          req.params.id,
        );

    if (!coupon) {
      throw new HttpError(
        404,
        "Coupon was not found",
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function validateCoupon(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      code,
      orderAmount,
    } =
      ValidateCouponSchema.parse(
        req.body,
      );

    const coupon =
      await CouponModel.findOne({
        code,
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
      orderAmount <
      coupon.minimumOrderAmount
    ) {
      throw new HttpError(
        400,
        `Minimum order amount is NPR ${coupon.minimumOrderAmount}`,
      );
    }

    const discountAmount =
      calculateDiscount(
        coupon.discountType,
        coupon.discountValue,
        coupon.maximumDiscountAmount,
        orderAmount,
      );

    res.status(200).json({
      success: true,
      message:
        "Coupon applied successfully",
      data: {
        coupon: {
          id:
            coupon._id.toString(),

          code:
            coupon.code,

          name:
            coupon.name,

          discountType:
            coupon.discountType,

          discountValue:
            coupon.discountValue,
        },

        orderAmount,

        discountAmount,

        finalAmount:
          Math.max(
            0,
            orderAmount -
              discountAmount,
          ),
      },
    });
  } catch (error) {
    next(error);
  }
}