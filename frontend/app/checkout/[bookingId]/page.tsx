
"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Clock3,
  Tag,
} from "lucide-react";

import {
  useParams,
} from "next/navigation";

import FoodSelector from "@/components/booking/FoodSelector";

import {
  getBooking,
  updateBookingCheckout,
} from "@/lib/api/bookings.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import {
  getFoods,
} from "@/lib/api/foods.api";

import {
  initiateKhaltiPayment,
} from "@/lib/api/payments.api";

import type {
  HeldBooking,
} from "@/lib/api/bookings.types";

import type {
  Food,
} from "@/lib/api/foods.types";

type QuantityMap =
  Record<string, number>;

function secondsRemaining(
  expiresAt: string,
): number {
  return Math.max(
    0,
    Math.floor(
      (
        new Date(
          expiresAt,
        ).getTime() -
        Date.now()
      ) / 1000,
    ),
  );
}

function formatTimer(
  seconds: number,
): string {
  const minutes =
    Math.floor(
      seconds / 60,
    );

  const remainingSeconds =
    seconds % 60;

  return `${minutes
    .toString()
    .padStart(
      2,
      "0",
    )}:${remainingSeconds
    .toString()
    .padStart(
      2,
      "0",
    )}`;
}

export default function CheckoutPage() {
  const params =
    useParams<{
      bookingId: string;
    }>();

  const [
    booking,
    setBooking,
  ] =
    useState<HeldBooking | null>(
      null,
    );

  const [foods, setFoods] =
    useState<Food[]>([]);

  const [
    quantities,
    setQuantities,
  ] =
    useState<QuantityMap>(
      {},
    );

  const [
    couponCode,
    setCouponCode,
  ] =
    useState("");

  const [
    timeRemaining,
    setTimeRemaining,
  ] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [
    updating,
    setUpdating,
  ] =
    useState(false);

  const [
    paying,
    setPaying,
  ] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [
          bookingResult,
          foodResult,
        ] =
          await Promise.all([
            getBooking(
              params.bookingId,
            ),

            getFoods({
              available: true,
            }),
          ]);

        setBooking(
          bookingResult,
        );

        setFoods(
          foodResult,
        );

        setCouponCode(
          bookingResult.couponCode ||
            "",
        );

        const initialQuantities:
          QuantityMap = {};

        for (
          const item of
          bookingResult.foodItems ||
          []
        ) {
          const foodId =
            typeof item.foodId ===
            "string"
              ? item.foodId
              : item.foodId.id ||
                item.foodId._id ||
                "";

          if (foodId) {
            initialQuantities[
              foodId
            ] =
              item.quantity;
          }
        }

        setQuantities(
          initialQuantities,
        );

        setTimeRemaining(
          secondsRemaining(
            bookingResult.holdExpiresAt,
          ),
        );
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load checkout.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [params.bookingId]);

  useEffect(() => {
    if (
      !booking ||
      (
        booking.status !==
          "held" &&
        booking.status !==
          "payment_pending"
      )
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          const remaining =
            secondsRemaining(
              booking.holdExpiresAt,
            );

          setTimeRemaining(
            remaining,
          );

          if (remaining <= 0) {
            window.clearInterval(
              timer,
            );

            setError(
              "Your seat hold has expired. Please select your seats again.",
            );
          }
        },
        1000,
      );

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [booking]);

  const selectedFoodPreview =
    useMemo(
      () =>
        foods
          .filter(
            (food) =>
              (
                quantities[
                  food.id
                ] || 0
              ) > 0,
          )
          .map(
            (food) => ({
              ...food,

              quantity:
                quantities[
                  food.id
                ],

              lineTotal:
                food.price *
                quantities[
                  food.id
                ],
            }),
          ),
      [
        foods,
        quantities,
      ],
    );

  function changeQuantity(
    foodId: string,
    quantity: number,
  ) {
    setQuantities(
      (current) => ({
        ...current,
        [foodId]:
          quantity,
      }),
    );

    setMessage("");
    setError("");
  }

  function createFoodItems() {
    return Object.entries(
      quantities,
    )
      .filter(
        ([
          ,
          quantity,
        ]) =>
          quantity > 0,
      )
      .map(
        ([
          foodId,
          quantity,
        ]) => ({
          foodId,
          quantity,
        }),
      );
  }

  async function saveCheckoutChanges(
    successMessage = true,
  ): Promise<HeldBooking> {
    if (!booking) {
      throw new Error(
        "Booking is unavailable",
      );
    }

    const updatedBooking =
      await updateBookingCheckout(
        booking.id,
        createFoodItems(),
        couponCode.trim(),
      );

    setBooking(
      updatedBooking,
    );

    setCouponCode(
      updatedBooking.couponCode ||
        "",
    );

    if (successMessage) {
      setMessage(
        updatedBooking.couponCode
          ? `Coupon ${updatedBooking.couponCode} applied successfully.`
          : "Order updated successfully.",
      );
    }

    return updatedBooking;
  }

  async function updateOrder(
    event?: FormEvent,
  ) {
    event?.preventDefault();

    if (
      !booking ||
      timeRemaining <= 0
    ) {
      setError(
        "Your booking hold has expired.",
      );

      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      await saveCheckoutChanges(
        true,
      );
    } catch (updateError) {
      setError(
        getApiErrorMessage(
          updateError,
          "Unable to update checkout.",
        ),
      );
    } finally {
      setUpdating(false);
    }
  }

  async function continueToKhalti() {
    if (!booking) {
      return;
    }

    if (timeRemaining <= 0) {
      setError(
        "Your seat hold has expired. Please select your seats again.",
      );

      return;
    }

    try {
      setPaying(true);
      setError("");
      setMessage("");

      /*
       * Save the latest food and coupon
       * choices before creating payment.
       */
      const updatedBooking =
        await saveCheckoutChanges(
          false,
        );

      const payment =
        await initiateKhaltiPayment(
          updatedBooking.id,
        );

      if (
        payment.alreadyPaid &&
        payment.ticketUrl
      ) {
        window.location.href =
          payment.ticketUrl;

        return;
      }

      if (!payment.paymentUrl) {
        throw new Error(
          "Khalti did not return a payment URL.",
        );
      }

      window.location.href =
        payment.paymentUrl;
    } catch (paymentError) {
      setError(
        getApiErrorMessage(
          paymentError,
          "Unable to start Khalti payment.",
        ),
      );

      setPaying(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07080c] p-10 text-center text-white/50">
        Loading checkout...
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#07080c] p-10 text-red-400">
        {error ||
          "Booking could not be loaded."}
      </main>
    );
  }

  const bookingExpired =
    timeRemaining <= 0 ||
    booking.status ===
      "expired" ||
    booking.status ===
      "cancelled";

  const bookingConfirmed =
    booking.status ===
      "confirmed" &&
    booking.paymentStatus ===
      "paid";

  return (
    <main className="min-h-screen bg-[#07080c] px-5 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
              Checkout
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Complete your booking
            </h1>

            <p className="mt-2 text-white/45">
              Booking code:{" "}
              {booking.bookingCode}
            </p>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border px-5 py-3 ${
              timeRemaining >
              120
                ? "border-white/10 bg-white/5"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            <Clock3 size={19} />

            <div>
              <p className="text-xs text-white/45">
                Seat hold expires in
              </p>

              <p className="font-mono text-xl font-bold">
                {formatTimer(
                  timeRemaining,
                )}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
            {message}
          </div>
        )}

        {bookingConfirmed && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
            This booking is already
            confirmed and paid.
          </div>
        )}

        <div className="mt-8 grid gap-7 xl:grid-cols-[1fr_380px]">
          <div className="space-y-7">
            <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
              <h2 className="text-xl font-semibold">
                Selected seats
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {booking.seats.map(
                  (seat) => (
                    <div
                      key={
                        seat.seatCode
                      }
                      className="flex justify-between rounded-xl bg-white/[0.03] p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          Seat{" "}
                          {
                            seat.seatCode
                          }
                        </p>

                        <p className="mt-1 text-xs capitalize text-white/40">
                          {seat.type}
                        </p>
                      </div>

                      <span className="font-semibold">
                        NPR{" "}
                        {seat.price}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </section>

            <FoodSelector
              foods={foods}
              quantities={
                quantities
              }
              onQuantityChange={
                changeQuantity
              }
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-[#11141c] p-6 xl:sticky xl:top-6">
            <h2 className="text-xl font-semibold">
              Order summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/55">
                  Tickets
                </span>

                <span>
                  NPR{" "}
                  {
                    booking.ticketSubtotal
                  }
                </span>
              </div>

              {selectedFoodPreview.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3"
                  >
                    <span className="text-white/55">
                      {item.name} ×{" "}
                      {
                        item.quantity
                      }
                    </span>

                    <span>
                      NPR{" "}
                      {
                        item.lineTotal
                      }
                    </span>
                  </div>
                ),
              )}

              <div className="flex justify-between">
                <span className="text-white/55">
                  Food subtotal
                </span>

                <span>
                  NPR{" "}
                  {
                    booking.foodSubtotal
                  }
                </span>
              </div>

              {booking.discountAmount >
                0 && (
                <div className="flex justify-between text-green-400">
                  <span>
                    Discount{" "}
                    {booking.couponCode
                      ? `(${booking.couponCode})`
                      : ""}
                  </span>

                  <span>
                    − NPR{" "}
                    {
                      booking.discountAmount
                    }
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                void updateOrder(
                  event,
                );
              }}
              className="mt-6 border-t border-white/10 pt-5"
            >
              <label>
                <span className="text-sm text-white/55">
                  Coupon code
                </span>

                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      value={
                        couponCode
                      }
                      disabled={
                        bookingExpired ||
                        bookingConfirmed ||
                        paying
                      }
                      onChange={(
                        event,
                      ) =>
                        setCouponCode(
                          event.target.value
                            .toUpperCase(),
                        )
                      }
                      placeholder="CINETIX10"
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] py-3 pl-10 pr-3 uppercase outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      updating ||
                      paying ||
                      bookingExpired ||
                      bookingConfirmed
                    }
                    className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating
                      ? "Applying..."
                      : "Apply"}
                  </button>
                </div>
              </label>
            </form>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  NPR{" "}
                  {
                    booking.totalAmount
                  }
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={
                updating ||
                paying ||
                bookingExpired ||
                bookingConfirmed
              }
              onClick={() => {
                void updateOrder();
              }}
              className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
                ? "Updating..."
                : "Save food & coupon"}
            </button>

            {bookingConfirmed ? (
              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    `/tickets/${booking.id}`;
                }}
                className="mt-3 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
              >
                View digital ticket
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  paying ||
                  updating ||
                  bookingExpired
                }
                onClick={() => {
                  void continueToKhalti();
                }}
                className="mt-3 w-full rounded-xl bg-[#5c2d91] px-5 py-3 font-semibold text-white transition hover:bg-[#6d38a7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paying
                  ? "Opening Khalti..."
                  : `Pay NPR ${booking.totalAmount} with Khalti`}
              </button>
            )}

            <p className="mt-4 text-center text-xs text-white/35">
              Food prices, discounts
              and the final payment
              amount are verified by
              the CineTix server.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
