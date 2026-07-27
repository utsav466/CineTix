"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import CouponForm from "@/components/admin/CouponForm";

import {
  createCoupon,
} from "@/lib/api/coupons.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  CouponInput,
} from "@/lib/api/coupons.types";

export default function NewCouponPage() {
  const router =
    useRouter();

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    payload: CouponInput,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await createCoupon(
        payload,
      );

      router.push(
        "/admin/coupons",
      );

      router.refresh();
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Unable to create coupon.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Promotions
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Create Coupon
      </h1>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8">
        <CouponForm
          submitting={
            submitting
          }
          onSubmit={
            handleSubmit
          }
        />
      </div>
    </section>
  );
}