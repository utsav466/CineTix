export type CouponDiscountType =
  | "percentage"
  | "fixed";

export type Coupon = {
  id: string;

  code: string;
  name: string;
  description: string;

  discountType:
    CouponDiscountType;

  discountValue: number;

  minimumOrderAmount: number;

  maximumDiscountAmount?: number;

  usageLimit?: number;
  usageCount: number;

  perUserLimit: number;

  startsAt: string;
  expiresAt: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CouponInput = {
  code: string;
  name: string;
  description: string;

  discountType:
    CouponDiscountType;

  discountValue: number;

  minimumOrderAmount: number;

  maximumDiscountAmount?: number;

  usageLimit?: number;

  perUserLimit: number;

  startsAt: string;
  expiresAt: string;

  isActive: boolean;
};

export type CouponValidation = {
  coupon: {
    id: string;
    code: string;
    name: string;

    discountType:
      CouponDiscountType;

    discountValue: number;
  };

  orderAmount: number;
  discountAmount: number;
  finalAmount: number;
};