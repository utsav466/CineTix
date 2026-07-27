"use client";

import {
  CalendarDays,
  Clock3,
  Ticket,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CustomerHeader from "@/components/layout/CustomerHeader";

import {
  getCustomerBookings,
} from "@/lib/api/customer.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  CustomerBooking,
} from "@/lib/api/customer.types";

function movieTitle(
  booking: CustomerBooking,
): string {
  if (
    typeof booking.movieId ===
    "string"
  ) {
    return "Movie";
  }

  return booking.movieId.title;
}

function showtimeDate(
  booking: CustomerBooking,
): Date | null {
  if (
    typeof booking.showtimeId ===
    "string"
  ) {
    return null;
  }

  return new Date(
    booking.showtimeId.startsAt,
  );
}

export default function MyTicketsPage() {
  const [
    bookings,
    setBookings,
  ] =
    useState<CustomerBooking[]>(
      [],
    );

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        setBookings(
          await getCustomerBookings(),
        );
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load your bookings. Please log in again.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadBookings();
  }, []);

  const filteredBookings =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            filter === "all" ||
            booking.status ===
              filter,
        ),
      [
        bookings,
        filter,
      ],
    );

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <CustomerHeader />

      <section className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          My Tickets
        </h1>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {[
            {
              value: "all",
              label: "All",
            },
            {
              value:
                "confirmed",

              label:
                "Confirmed",
            },
            {
              value: "held",

              label:
                "Awaiting Payment",
            },
            {
              value:
                "cancelled",

              label:
                "Cancelled",
            },
          ].map(
            (item) => (
              <button
                key={
                  item.value
                }
                type="button"
                onClick={() =>
                  setFilter(
                    item.value,
                  )
                }
                className={`min-h-11 whitespace-nowrap rounded-xl px-4 font-bold transition ${
                  filter ===
                  item.value
                    ? "bg-red-600 text-white"
                    : "border border-white/10 bg-[#11141c] text-white/55 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ),
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-10 text-white/45">
            Loading bookings...
          </p>
        ) : filteredBookings.length ===
          0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center">
            <Ticket
              size={44}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-4 text-xl font-black">
              No matching bookings
            </h2>

            <p className="mt-2 text-white/45">
              Browse movies and make
              your first booking.
            </p>

            <Link
              href="/movies"
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-red-600 px-5 font-bold hover:bg-red-500"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filteredBookings.map(
              (booking) => {
                const date =
                  showtimeDate(
                    booking,
                  );

                return (
                  <article
                    key={booking.id}
                    className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
                  >
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                          {
                            booking.bookingCode
                          }
                        </p>

                        <h2 className="mt-2 text-xl font-black">
                          {movieTitle(
                            booking,
                          )}
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/45">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays
                              size={16}
                            />

                            {date
                              ? date.toLocaleDateString(
                                  "en-US",
                                  {
                                    dateStyle:
                                      "medium",
                                  },
                                )
                              : "Date unavailable"}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Clock3
                              size={16}
                            />

                            {date
                              ? date.toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour:
                                      "numeric",

                                    minute:
                                      "2-digit",
                                  },
                                )
                              : "Time unavailable"}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-white/45">
                          Seats:{" "}
                          {booking.seats
                            .map(
                              (seat) =>
                                seat.seatCode,
                            )
                            .join(", ")}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <p className="text-xl font-black">
                          NPR{" "}
                          {
                            booking.totalAmount
                          }
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            booking.status ===
                            "confirmed"
                              ? "bg-green-500/10 text-green-400"
                              : booking.status ===
                                "held"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-white/5 text-white/45"
                          }`}
                        >
                          {booking.status.replaceAll(
                            "_",
                            " ",
                          )}
                        </span>

                        <div className="mt-4">
                          {booking.status ===
                            "confirmed" && (
                            <Link
                              href={`/tickets/${booking.id}`}
                              className="inline-flex min-h-11 items-center rounded-xl bg-green-600 px-5 font-bold hover:bg-green-500"
                            >
                              View Ticket
                            </Link>
                          )}

                          {booking.status ===
                            "held" && (
                            <Link
                              href={`/checkout/${booking.id}`}
                              className="inline-flex min-h-11 items-center rounded-xl bg-red-600 px-5 font-bold hover:bg-red-500"
                            >
                              Continue Checkout
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>
    </main>
  );
}