"use client";

import {
  FormEvent,
  useState,
} from "react";

import type {
  Coupon,
  CouponDiscountType,
  CouponInput,
} from "@/lib/api/coupons.types";

type Props = {
  initialCoupon?: Coupon;

  submitting: boolean;

  onSubmit: (
    payload: CouponInput,
  ) => Promise<void>;
};

function localDateTime(
  date?: string,
): string {
  if (!date) {
    return "";
  }

  const parsed =
    new Date(date);

  const offset =
    parsed.getTimezoneOffset();

  return new Date(
    parsed.getTime() -
      offset * 60 * 1000,
  )
    .toISOString()
    .slice(0, 16);
}

export default function CouponForm({
  initialCoupon,
  submitting,
  onSubmit,
}: Props) {
  const [code, setCode] =
    useState(
      initialCoupon?.code || "",
    );

  const [name, setName] =
    useState(
      initialCoupon?.name || "",
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      initialCoupon?.description ||
        "",
    );

  const [
    discountType,
    setDiscountType,
  ] =
    useState<CouponDiscountType>(
      initialCoupon?.discountType ||
        "percentage",
    );

  const [
    discountValue,
    setDiscountValue,
  ] =
    useState(
      initialCoupon?.discountValue.toString() ||
        "10",
    );

  const [
    minimumOrderAmount,
    setMinimumOrderAmount,
  ] =
    useState(
      initialCoupon?.minimumOrderAmount.toString() ||
        "0",
    );

  const [
    maximumDiscountAmount,
    setMaximumDiscountAmount,
  ] =
    useState(
      initialCoupon
        ?.maximumDiscountAmount
        ?.toString() || "",
    );

  const [
    usageLimit,
    setUsageLimit,
  ] =
    useState(
      initialCoupon?.usageLimit?.toString() ||
        "",
    );

  const [
    perUserLimit,
    setPerUserLimit,
  ] =
    useState(
      initialCoupon?.perUserLimit.toString() ||
        "1",
    );

  const [
    startsAt,
    setStartsAt,
  ] =
    useState(
      localDateTime(
        initialCoupon?.startsAt,
      ),
    );

  const [
    expiresAt,
    setExpiresAt,
  ] =
    useState(
      localDateTime(
        initialCoupon?.expiresAt,
      ),
    );

  const [
    isActive,
    setIsActive,
  ] =
    useState(
      initialCoupon?.isActive ??
        true,
    );

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (
      !code.trim() ||
      !name.trim() ||
      !startsAt ||
      !expiresAt
    ) {
      setError(
        "Complete all required coupon fields.",
      );

      return;
    }

    await onSubmit({
      code:
        code
          .trim()
          .toUpperCase(),

      name:
        name.trim(),

      description:
        description.trim(),

      discountType,

      discountValue:
        Number(
          discountValue,
        ),

      minimumOrderAmount:
        Number(
          minimumOrderAmount,
        ),

      maximumDiscountAmount:
        maximumDiscountAmount
          ? Number(
              maximumDiscountAmount,
            )
          : undefined,

      usageLimit:
        usageLimit
          ? Number(
              usageLimit,
            )
          : undefined,

      perUserLimit:
        Number(
          perUserLimit,
        ),

      startsAt:
        new Date(
          startsAt,
        ).toISOString(),

      expiresAt:
        new Date(
          expiresAt,
        ).toISOString(),

      isActive,
    });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 py-3 text-white outline-none focus:border-red-500";

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="space-y-7"
    >
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Coupon information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm text-white/60">
              Coupon code
            </span>

            <input
              required
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value
                    .toUpperCase(),
                )
              }
              placeholder="CINETIX10"
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Coupon name
            </span>

            <input
              required
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm text-white/60">
              Description
            </span>

            <textarea
              rows={4}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Discount rules
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm text-white/60">
              Discount type
            </span>

            <select
              value={
                discountType
              }
              onChange={(event) =>
                setDiscountType(
                  event.target
                    .value as CouponDiscountType,
                )
              }
              className={inputClass}
            >
              <option value="percentage">
                Percentage
              </option>

              <option value="fixed">
                Fixed amount
              </option>
            </select>
          </label>

          <label>
            <span className="text-sm text-white/60">
              Discount value
            </span>

            <input
              required
              type="number"
              min={0.01}
              step="0.01"
              value={
                discountValue
              }
              onChange={(event) =>
                setDiscountValue(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Minimum order
            </span>

            <input
              type="number"
              min={0}
              value={
                minimumOrderAmount
              }
              onChange={(event) =>
                setMinimumOrderAmount(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Maximum discount
            </span>

            <input
              type="number"
              min={0}
              value={
                maximumDiscountAmount
              }
              onChange={(event) =>
                setMaximumDiscountAmount(
                  event.target.value,
                )
              }
              placeholder="Optional"
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Total usage limit
            </span>

            <input
              type="number"
              min={1}
              value={usageLimit}
              onChange={(event) =>
                setUsageLimit(
                  event.target.value,
                )
              }
              placeholder="Optional"
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Per-user limit
            </span>

            <input
              required
              type="number"
              min={1}
              value={perUserLimit}
              onChange={(event) =>
                setPerUserLimit(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Availability period
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm text-white/60">
              Starts at
            </span>

            <input
              required
              type="datetime-local"
              value={startsAt}
              onChange={(event) =>
                setStartsAt(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Expires at
            </span>

            <input
              required
              type="datetime-local"
              value={expiresAt}
              onChange={(event) =>
                setExpiresAt(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#090b10] px-4 py-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) =>
              setIsActive(
                event.target.checked,
              )
            }
            className="h-5 w-5 accent-red-600"
          />

          <span>
            Coupon is active
          </span>
        </label>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-red-600 px-7 py-3 font-semibold hover:bg-red-500 disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : initialCoupon
              ? "Update Coupon"
              : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}