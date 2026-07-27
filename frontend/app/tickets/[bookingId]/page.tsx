"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";

import {
  useParams,
} from "next/navigation";

import {
  QRCodeSVG,
} from "qrcode.react";

import {
  useEffect,
  useState,
} from "react";

import {
  getBooking,
} from "@/lib/api/bookings.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  HeldBooking,
} from "@/lib/api/bookings.types";

function movieName(
  booking: HeldBooking,
): string {
  if (
    typeof booking.movieId ===
    "string"
  ) {
    return "Movie";
  }

  return booking.movieId.title;
}

function cinemaName(
  booking: HeldBooking,
): string {
  if (
    typeof booking.cinemaId ===
    "string"
  ) {
    return "Cinema";
  }

  return booking.cinemaId.name;
}

function cinemaLocation(
  booking: HeldBooking,
): string {
  if (
    typeof booking.cinemaId ===
    "string"
  ) {
    return "";
  }

  return [
    booking.cinemaId.address,
    booking.cinemaId.city,
  ]
    .filter(Boolean)
    .join(", ");
}

function screenName(
  booking: HeldBooking,
): string {
  if (
    typeof booking.screenId ===
    "string"
  ) {
    return "Hall";
  }

  return booking.screenId.name;
}

function showtimeDate(
  booking: HeldBooking,
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

export default function TicketPage() {
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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadTicket() {
      try {
        const result =
          await getBooking(
            params.bookingId,
          );

        setBooking(result);
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load ticket.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadTicket();
  }, [params.bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07080c] p-10 text-center text-white/50">
        Loading your ticket...
      </main>
    );
  }

  if (
    !booking ||
    booking.status !==
      "confirmed" ||
    booking.paymentStatus !==
      "paid"
  ) {
    return (
      <main className="min-h-screen bg-[#07080c] px-5 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-300">
          {error ||
            "This booking has not been confirmed."}
        </div>
      </main>
    );
  }

  const date =
    showtimeDate(booking);

  const qrValue =
    booking.qrCode ||
    JSON.stringify({
      bookingId:
        booking.id,

      bookingCode:
        booking.bookingCode,

      transactionId:
        booking.paymentRef,
    });

  return (
    <main className="min-h-screen bg-[#07080c] px-5 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 text-center">
          <CheckCircle2
            size={54}
            className="mx-auto text-green-400"
          />

          <h1 className="mt-4 text-3xl font-bold">
            Booking Confirmed
          </h1>

          <p className="mt-2 text-white/50">
            Your CineTix digital ticket
            is ready.
          </p>
        </div>

        <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#11141c] shadow-2xl">
          <div className="bg-gradient-to-r from-red-700 to-red-500 p-7">
            <div className="flex items-center gap-3">
              <Ticket size={30} />

              <div>
                <p className="text-sm text-white/75">
                  CineTix Movie Ticket
                </p>

                <h2 className="text-2xl font-black">
                  {movieName(
                    booking,
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-7 md:grid-cols-[1fr_220px]">
            <div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Booking code
                  </p>

                  <p className="mt-1 font-mono text-lg font-bold text-red-400">
                    {
                      booking.bookingCode
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Hall
                  </p>

                  <p className="mt-1 font-semibold">
                    {screenName(
                      booking,
                    )}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/35">
                    <CalendarDays
                      size={14}
                    />
                    Date
                  </p>

                  <p className="mt-1 font-semibold">
                    {date
                      ? date.toLocaleDateString(
                          "en-US",
                          {
                            dateStyle:
                              "long",
                          },
                        )
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/35">
                    <Clock3
                      size={14}
                    />
                    Time
                  </p>

                  <p className="mt-1 font-semibold">
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
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/35">
                  <MapPin size={14} />
                  Cinema
                </p>

                <p className="mt-1 font-semibold">
                  {cinemaName(
                    booking,
                  )}
                </p>

                {cinemaLocation(
                  booking,
                ) && (
                  <p className="mt-1 text-sm text-white/45">
                    {cinemaLocation(
                      booking,
                    )}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Seats
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {booking.seats.map(
                    (seat) => (
                      <span
                        key={
                          seat.seatCode
                        }
                        className="rounded-lg bg-red-500/10 px-4 py-2 font-bold text-red-400"
                      >
                        {
                          seat.seatCode
                        }
                      </span>
                    ),
                  )}
                </div>
              </div>

              {booking.foodItems.length >
                0 && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Food & beverages
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-white/65">
                    {booking.foodItems.map(
                      (item) => (
                        <p
                          key={`${String(
                            item.foodId,
                          )}-${item.name}`}
                        >
                          {item.name} ×{" "}
                          {
                            item.quantity
                          }
                        </p>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="mt-7 border-t border-white/10 pt-5">
                <div className="flex justify-between">
                  <span className="text-white/50">
                    Paid with Khalti
                  </span>

                  <span className="text-xl font-bold">
                    NPR{" "}
                    {
                      booking.totalAmount
                    }
                  </span>
                </div>

                <p className="mt-2 text-xs text-white/35">
                  Transaction:{" "}
                  {booking.paymentRef ||
                    "Verified"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center text-black">
              <QRCodeSVG
                value={qrValue}
                size={170}
                level="H"
                includeMargin
              />

              <p className="mt-3 text-sm font-bold">
                Scan at cinema entry
              </p>

              <p className="mt-1 text-xs text-black/55">
                {
                  booking.bookingCode
                }
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-white/15 p-5 text-center text-xs text-white/35">
            Present this digital ticket
            at the cinema entrance.
          </div>
        </article>
      </div>
    </main>
  );
}