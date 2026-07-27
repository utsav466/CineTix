import {
  apiClient,
} from "./client";

import type {
  Coupon,
  CouponInput,
  CouponValidation,
} from "./coupons.types";

type CouponListResponse = {
  success: true;

  data: {
    items: Coupon[];
  };
};

type CouponResponse = {
  success: true;
  message?: string;

  data: {
    coupon: Coupon;
  };
};

type CouponValidationResponse = {
  success: true;
  message: string;

  data: CouponValidation;
};

export async function getCoupons():
  Promise<Coupon[]> {
  const response =
    await apiClient.get<CouponListResponse>(
      "/coupons",
    );

  return response.data.data.items;
}

export async function createCoupon(
  payload: CouponInput,
): Promise<Coupon> {
  const response =
    await apiClient.post<CouponResponse>(
      "/coupons",
      payload,
    );

  return response.data.data.coupon;
}

export async function updateCoupon(
  couponId: string,
  payload: Partial<CouponInput>,
): Promise<Coupon> {
  const response =
    await apiClient.patch<CouponResponse>(
      `/coupons/${couponId}`,
      payload,
    );

  return response.data.data.coupon;
}

export async function deleteCoupon(
  couponId: string,
): Promise<void> {
  await apiClient.delete(
    `/coupons/${couponId}`,
  );
}

export async function validateCoupon(
  code: string,
  orderAmount: number,
): Promise<CouponValidation> {
  const response =
    await apiClient.post<CouponValidationResponse>(
      "/coupons/validate",
      {
        code,
        orderAmount,
      },
    );

  return response.data.data;
}