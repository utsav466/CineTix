"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import CustomerSeatMap from "@/components/booking/CustomerSeatMap";

import {
  getShowtimeSeats,
  holdSeats,
} from "@/lib/api/bookings.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  AvailableSeat,
  ShowtimeSeatData,
} from "@/lib/api/bookings.types";

function itemName(
  value:
    | string
    | {
        title?: string;
        name?: string;
      },
): string {
  if (
    typeof value === "string"
  ) {
    return "";
  }

  return (
    value.title ||
    value.name ||
    ""
  );
}

export default function SeatSelectionPage() {
  const params =
    useParams<{
      showtimeId: string;
    }>();

  const router =
    useRouter();

  const [data, setData] =
    useState<ShowtimeSeatData | null>(
      null,
    );

  const [
    selectedSeatCodes,
    setSelectedSeatCodes,
  ] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadSeats() {
      try {
        setLoading(true);

        const result =
          await getShowtimeSeats(
            params.showtimeId,
          );

        setData(result);
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load seats.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSeats();
  }, [params.showtimeId]);

  const selectedSeats =
    useMemo(
      () =>
        data?.seats.filter(
          (seat) =>
            selectedSeatCodes.includes(
              seat.seatCode,
            ),
        ) || [],
      [
        data,
        selectedSeatCodes,
      ],
    );

  const total =
    selectedSeats.reduce(
      (
        sum,
        seat,
      ) =>
        sum + seat.price,
      0,
    );

  function toggleSeat(
    seat: AvailableSeat,
  ) {
    setSelectedSeatCodes(
      (current) => {
        if (
          current.includes(
            seat.seatCode,
          )
        ) {
          return current.filter(
            (seatCode) =>
              seatCode !==
              seat.seatCode,
          );
        }

        if (
          current.length >= 10
        ) {
          setError(
            "You can select a maximum of 10 seats.",
          );

          return current;
        }

        setError("");

        return [
          ...current,
          seat.seatCode,
        ];
      },
    );
  }

  async function continueBooking() {
    if (
      selectedSeatCodes.length ===
      0
    ) {
      setError(
        "Select at least one seat.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const booking =
        await holdSeats(
          params.showtimeId,
          selectedSeatCodes,
        );

      router.push(
        `/checkout/${booking.id}`,
      );
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Unable to hold the selected seats.",
        ),
      );

      const refreshedData =
        await getShowtimeSeats(
          params.showtimeId,
        );

      setData(refreshedData);
      setSelectedSeatCodes([]);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07080c] p-10 text-center text-white/50">
        Loading seats...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#07080c] p-10 text-red-400">
        {error ||
          "Unable to load showtime."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080c] px-5 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
          Select seats
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {itemName(
            data.showtime.movieId,
          )}
        </h1>

        <p className="mt-2 text-white/50">
          {itemName(
            data.showtime.cinemaId,
          )}{" "}
          ·{" "}
          {itemName(
            data.showtime.screenId,
          )}{" "}
          ·{" "}
          {new Date(
            data.showtime.startsAt,
          ).toLocaleString()}
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-7 xl:grid-cols-[1fr_340px]">
          <CustomerSeatMap
            seats={
              data.seats
            }
            selectedSeatCodes={
              selectedSeatCodes
            }
            onToggleSeat={
              toggleSeat
            }
          />

          <aside className="h-fit rounded-2xl border border-white/10 bg-[#11141c] p-6 xl:sticky xl:top-6">
            <h2 className="text-xl font-semibold">
              Booking summary
            </h2>

            <div className="mt-5 space-y-3">
              {selectedSeats.length ===
              0 ? (
                <p className="text-sm text-white/45">
                  No seats selected.
                </p>
              ) : (
                selectedSeats.map(
                  (seat) => (
                    <div
                      key={
                        seat.id
                      }
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-white/65">
                        {
                          seat.seatCode
                        }{" "}
                        ·{" "}
                        {
                          seat.type
                        }
                      </span>

                      <span>
                        NPR{" "}
                        {
                          seat.price
                        }
                      </span>
                    </div>
                  ),
                )
              )}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>

                <span>
                  NPR {total}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={
                submitting ||
                selectedSeats.length ===
                  0
              }
              onClick={() => {
                void continueBooking();
              }}
              className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Holding seats..."
                : "Continue"}
            </button>

            <p className="mt-4 text-center text-xs text-white/40">
              Your seats will be held
              for 10 minutes.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}