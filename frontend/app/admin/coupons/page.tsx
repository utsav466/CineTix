"use client";

import {
  Plus,
  Tag,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  deleteCoupon,
  getCoupons,
} from "@/lib/api/coupons.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Coupon,
} from "@/lib/api/coupons.types";

function couponStatus(
  coupon: Coupon,
): {
  label: string;
  className: string;
} {
  const now =
    new Date();

  if (!coupon.isActive) {
    return {
      label: "Inactive",
      className:
        "bg-white/5 text-white/40",
    };
  }

  if (
    now <
    new Date(
      coupon.startsAt,
    )
  ) {
    return {
      label: "Scheduled",
      className:
        "bg-blue-500/10 text-blue-400",
    };
  }

  if (
    now >
    new Date(
      coupon.expiresAt,
    )
  ) {
    return {
      label: "Expired",
      className:
        "bg-red-500/10 text-red-400",
    };
  }

  return {
    label: "Active",
    className:
      "bg-green-500/10 text-green-400",
  };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] =
    useState<Coupon[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadCoupons() {
    try {
      setLoading(true);
      setError("");

      setCoupons(
        await getCoupons(),
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load coupons.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCoupons();
  }, []);

  async function handleDelete(
    coupon: Coupon,
  ) {
    if (
      !window.confirm(
        `Delete coupon ${coupon.code}?`,
      )
    ) {
      return;
    }

    try {
      await deleteCoupon(
        coupon.id,
      );

      setCoupons(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              coupon.id,
          ),
      );
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "Unable to delete coupon.",
        ),
      );
    }
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
            Promotions
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Coupons
          </h1>

          <p className="mt-2 text-white/55">
            Manage promotional codes
            and customer discounts.
          </p>
        </div>

        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
        >
          <Plus size={19} />
          Add Coupon
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center text-white/50">
          Loading coupons...
        </div>
      ) : coupons.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center">
          <Tag
            size={38}
            className="mx-auto text-white/25"
          />

          <h2 className="mt-4 text-lg font-semibold">
            No coupons created
          </h2>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coupons.map(
            (coupon) => {
              const status =
                couponStatus(
                  coupon,
                );

              return (
                <article
                  key={
                    coupon.id
                  }
                  className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                      <Tag
                        size={22}
                      />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${status.className}`}
                    >
                      {
                        status.label
                      }
                    </span>
                  </div>

                  <p className="mt-5 font-mono text-2xl font-black tracking-wider text-red-400">
                    {coupon.code}
                  </p>

                  <h2 className="mt-2 font-semibold">
                    {coupon.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-white/45">
                    {
                      coupon.description
                    }
                  </p>

                  <div className="mt-5 rounded-xl bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/40">
                      Discount
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {coupon.discountType ===
                      "percentage"
                        ? `${coupon.discountValue}%`
                        : `NPR ${coupon.discountValue}`}
                    </p>

                    <p className="mt-2 text-xs text-white/40">
                      Minimum order:
                      NPR{" "}
                      {
                        coupon.minimumOrderAmount
                      }
                    </p>
                  </div>

                  <div className="mt-4 text-xs text-white/40">
                    Used{" "}
                    {
                      coupon.usageCount
                    }

                    {coupon.usageLimit
                      ? ` of ${coupon.usageLimit}`
                      : ""}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/admin/coupons/${coupon.id}/edit`}
                      className="flex flex-1 items-center justify-center rounded-xl bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        void handleDelete(
                          coupon,
                        );
                      }}
                      className="rounded-xl bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2
                        size={17}
                      />
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}