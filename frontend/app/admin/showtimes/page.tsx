"use client";

import {
  CalendarClock,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  deleteShowtime,
  getShowtimes,
} from "@/lib/api/showtimes.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Showtime,
} from "@/lib/api/showtimes.types";

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
    return value;
  }

  return (
    value.title ||
    value.name ||
    "Unknown"
  );
}

export default function AdminShowtimesPage() {
  const [
    showtimes,
    setShowtimes,
  ] =
    useState<Showtime[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadShowtimes() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getShowtimes({
          includeInactive: true,
        });

      setShowtimes(result);
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load showtimes.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadShowtimes();
  }, []);

  async function handleDelete(
    showtime: Showtime,
  ) {
    if (
      !window.confirm(
        "Delete this showtime?",
      )
    ) {
      return;
    }

    try {
      await deleteShowtime(
        showtime.id,
      );

      setShowtimes(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              showtime.id,
          ),
      );
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "Unable to delete showtime.",
        ),
      );
    }
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
            Scheduling
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Showtimes
          </h1>

          <p className="mt-2 text-white/55">
            Schedule movies and set
            seat-category prices.
          </p>
        </div>

        <Link
          href="/admin/showtimes/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
        >
          <Plus size={19} />
          Add Showtime
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#11141c]">
        {loading ? (
          <p className="p-10 text-center text-white/50">
            Loading showtimes...
          </p>
        ) : showtimes.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarClock
              size={36}
              className="mx-auto text-white/25"
            />

            <p className="mt-4 font-semibold">
              No showtimes scheduled
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-5 py-4">
                    Movie
                  </th>

                  <th className="px-5 py-4">
                    Cinema / Hall
                  </th>

                  <th className="px-5 py-4">
                    Date and time
                  </th>

                  <th className="px-5 py-4">
                    Prices
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {showtimes.map(
                  (showtime) => (
                    <tr
                      key={
                        showtime.id
                      }
                      className="border-b border-white/5 last:border-none"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {itemName(
                          showtime.movieId,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/60">
                        {itemName(
                          showtime.cinemaId,
                        )}
                        <br />
                        {itemName(
                          showtime.screenId,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/60">
                        {new Date(
                          showtime.startsAt,
                        ).toLocaleString(
                          "en-US",
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                          },
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/60">
                        NPR{" "}
                        {
                          showtime.regularPrice
                        }{" "}
                        /{" "}
                        {
                          showtime.premiumPrice
                        }{" "}
                        /{" "}
                        {
                          showtime.reclinerPrice
                        }
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs capitalize text-white/70">
                          {
                            showtime.status
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/showtimes/${showtime.id}/edit`}
                            className="rounded-lg bg-white/5 p-2 text-white/60 hover:bg-white/10"
                          >
                            <Edit3
                              size={
                                17
                              }
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              void handleDelete(
                                showtime,
                              );
                            }}
                            className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2
                              size={
                                17
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}