"use client";

import {
  RefreshCw,
  Search,
  Ticket,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminBookings,
} from "@/lib/api/dashboard.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  AdminBooking,
} from "@/lib/api/dashboard.types";

function customerName(
  booking: AdminBooking,
): string {
  if (
    typeof booking.userId ===
    "string"
  ) {
    return "Customer";
  }

  return (
    booking.userId.name ||
    booking.userId.email ||
    "Customer"
  );
}

function movieName(
  booking: AdminBooking,
): string {
  if (
    typeof booking.movieId ===
    "string"
  ) {
    return "Movie";
  }

  return (
    booking.movieId.title ||
    "Movie"
  );
}

function cinemaName(
  booking: AdminBooking,
): string {
  if (
    typeof booking.cinemaId ===
    "string"
  ) {
    return "Cinema";
  }

  return (
    booking.cinemaId.name ||
    "Cinema"
  );
}

function statusStyle(
  status: string,
): string {
  if (
    status === "confirmed"
  ) {
    return "bg-green-500/10 text-green-400";
  }

  if (
    status === "held" ||
    status ===
      "payment_pending"
  ) {
    return "bg-amber-500/10 text-amber-400";
  }

  if (
    status === "cancelled" ||
    status === "expired"
  ) {
    return "bg-red-500/10 text-red-400";
  }

  return "bg-white/5 text-white/45";
}

export default function AdminBookingsPage() {
  const [
    bookings,
    setBookings,
  ] =
    useState<AdminBooking[]>(
      [],
    );

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [
    paymentStatus,
    setPaymentStatus,
  ] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadBookings(
    refresh = false,
  ) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      setBookings(
        await getAdminBookings(),
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load bookings.",
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  const filteredBookings =
    useMemo(
      () =>
        bookings.filter(
          (booking) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              booking.bookingCode
                .toLowerCase()
                .includes(query) ||
              customerName(
                booking,
              )
                .toLowerCase()
                .includes(query) ||
              movieName(
                booking,
              )
                .toLowerCase()
                .includes(query);

            const matchesStatus =
              !status ||
              booking.status ===
                status;

            const matchesPayment =
              !paymentStatus ||
              booking.paymentStatus ===
                paymentStatus;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesPayment
            );
          },
        ),
      [
        bookings,
        search,
        status,
        paymentStatus,
      ],
    );

  function clearFilters() {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
  }

  const hasFilters =
    Boolean(
      search ||
        status ||
        paymentStatus,
    );

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            Operations
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Bookings
          </h1>

          <p className="mt-2 text-white/45">
            Review customer bookings,
            payment states and tickets.
          </p>
        </div>

        <button
          type="button"
          disabled={
            refreshing
          }
          onClick={() => {
            void loadBookings(
              true,
            );
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 px-4 font-bold text-white/65 hover:bg-white/5 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_220px_auto]">
          <label className="relative">
            <span className="sr-only">
              Search bookings
            </span>

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search code, customer or movie"
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] py-3 pl-11 pr-4 outline-none focus:border-red-500"
            />
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value,
              )
            }
            className="min-h-12 rounded-xl border border-white/10 bg-[#090b10] px-4 outline-none focus:border-red-500"
          >
            <option value="">
              All booking statuses
            </option>

            <option value="held">
              Held
            </option>

            <option value="payment_pending">
              Payment pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="cancelled">
              Cancelled
            </option>

            <option value="expired">
              Expired
            </option>
          </select>

          <select
            value={
              paymentStatus
            }
            onChange={(event) =>
              setPaymentStatus(
                event.target.value,
              )
            }
            className="min-h-12 rounded-xl border border-white/10 bg-[#090b10] px-4 outline-none focus:border-red-500"
          >
            <option value="">
              All payment statuses
            </option>

            <option value="unpaid">
              Unpaid
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="failed">
              Failed
            </option>

            <option value="refunded">
              Refunded
            </option>
          </select>

          <button
            type="button"
            disabled={!hasFilters}
            onClick={
              clearFilters
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white/55 hover:bg-white/5 disabled:opacity-35"
          >
            <X size={17} />

            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-white/40">
          {
            filteredBookings.length
          }{" "}
          of {bookings.length} bookings
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center text-white/45">
          Loading bookings...
        </div>
      ) : filteredBookings.length ===
        0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center">
          <Ticket
            size={42}
            className="mx-auto text-white/20"
          />

          <h2 className="mt-4 text-xl font-black">
            No bookings found
          </h2>

          <p className="mt-2 text-white/45">
            Change or clear your
            filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filteredBookings.map(
            (booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
              >
                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
                  <div>
                    <p className="font-mono text-sm font-bold text-red-400">
                      {booking.bookingCode}
                    </p>

                    <h2 className="mt-2 text-lg font-black">
                      {movieName(
                        booking,
                      )}
                    </h2>

                    <p className="mt-1 text-sm text-white/45">
                      {customerName(
                        booking,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Cinema and seats
                    </p>

                    <p className="mt-2 font-semibold">
                      {cinemaName(
                        booking,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-white/45">
                      {booking.seats
                        .map(
                          (seat) =>
                            seat.seatCode,
                        )
                        .join(", ") ||
                        "No seats"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Payment
                    </p>

                    <p className="mt-2 text-lg font-black">
                      NPR{" "}
                      {booking.totalAmount.toLocaleString(
                        "en-US",
                      )}
                    </p>

                    <p className="mt-1 text-sm text-white/45">
                      {booking.paymentMethod ||
                        "Not selected"}
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle(
                        booking.status,
                      )}`}
                    >
                      {booking.status.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>

                    <p className="mt-3 text-xs capitalize text-white/40">
                      Payment:{" "}
                      {
                        booking.paymentStatus
                      }
                    </p>

                    <p className="mt-2 text-xs text-white/30">
                      {new Date(
                        booking.createdAt,
                      ).toLocaleString(
                        "en-US",
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}