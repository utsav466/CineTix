"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Languages,
  MapPin,
  Play,
  Star,
} from "lucide-react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CustomerHeader from "@/components/layout/CustomerHeader";

import {
  getCustomerMovie,
  getCustomerShowtimes,
} from "@/lib/api/customer.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  CustomerMovie,
  CustomerShowtime,
} from "@/lib/api/customer.types";

function objectName(
  value:
    | string
    | {
        name?: string;
        title?: string;
      },
): string {
  if (
    typeof value === "string"
  ) {
    return "Cinema";
  }

  return (
    value.name ||
    value.title ||
    "Cinema"
  );
}

function objectCity(
  value:
    | string
    | {
        city?: string;
      },
): string {
  if (
    typeof value === "string"
  ) {
    return "";
  }

  return value.city || "";
}

function formatDateValue(
  date: Date,
): string {
  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1,
    ).padStart(2, "0"),
    String(
      date.getDate(),
    ).padStart(2, "0"),
  ].join("-");
}

export default function MovieDetailsPage() {
  const params =
    useParams<{
      movieId: string;
    }>();

  const [
    movie,
    setMovie,
  ] =
    useState<CustomerMovie | null>(
      null,
    );

  const [
    showtimes,
    setShowtimes,
  ] =
    useState<CustomerShowtime[]>(
      [],
    );

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      formatDateValue(
        new Date(),
      ),
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const dateOptions =
    useMemo(
      () =>
        Array.from(
          {
            length: 7,
          },
          (_, index) => {
            const date =
              new Date();

            date.setDate(
              date.getDate() +
                index,
            );

            return {
              value:
                formatDateValue(
                  date,
                ),

              weekday:
                date.toLocaleDateString(
                  "en-US",
                  {
                    weekday:
                      "short",
                  },
                ),

              day:
                date.toLocaleDateString(
                  "en-US",
                  {
                    day:
                      "numeric",
                  },
                ),

              month:
                date.toLocaleDateString(
                  "en-US",
                  {
                    month:
                      "short",
                  },
                ),
            };
          },
        ),
      [],
    );

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        const [
          movieResult,
          showtimeResult,
        ] =
          await Promise.all([
            getCustomerMovie(
              params.movieId,
            ),

            getCustomerShowtimes({
              movieId:
                params.movieId,

              date:
                selectedDate,
            }),
          ]);

        setMovie(movieResult);

        setShowtimes(
          showtimeResult,
        );
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load movie details.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMovie();
  }, [
    params.movieId,
    selectedDate,
  ]);

  const groupedShowtimes =
    useMemo(() => {
      const groups =
        new Map<
          string,
          CustomerShowtime[]
        >();

      for (
        const showtime of
        showtimes
      ) {
        const key =
          typeof showtime.cinemaId ===
          "string"
            ? showtime.cinemaId
            : showtime.cinemaId.id;

        const current =
          groups.get(key) ||
          [];

        current.push(
          showtime,
        );

        groups.set(
          key,
          current,
        );
      }

      return Array.from(
        groups.values(),
      );
    }, [showtimes]);

  if (loading && !movie) {
    return (
      <main className="min-h-screen bg-[#07080c] text-white">
        <CustomerHeader />

        <div className="mx-auto max-w-7xl px-5 py-16 text-center text-white/45">
          Loading movie...
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#07080c] text-white">
        <CustomerHeader />

        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-300">
            {error ||
              "Movie was not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <CustomerHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        {movie.backdropUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              movie.backdropUrl
            }
            alt=""
            className="absolute inset-0 -z-30 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 -z-20 bg-[#07080c]/60" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07080c] via-[#07080c]/90 to-[#07080c]/50" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#07080c] to-transparent" />

        <div className="mx-auto max-w-7xl px-5 py-12">
          <Link
            href="/movies"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 text-sm font-bold text-white/70 backdrop-blur hover:bg-white/10"
          >
            <ArrowLeft
              size={17}
            />

            Back to movies
          </Link>

          <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {movie.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    movie.posterUrl
                  }
                  alt={`${movie.title} poster`}
                  className="aspect-[2/3] h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center text-white/25">
                  Poster unavailable
                </div>
              )}
            </div>

            <div className="self-end">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-400">
                {movie.status ===
                "now_showing"
                  ? "Now Showing"
                  : "Coming Soon"}
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-6xl">
                {movie.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4">
                  <Clock3
                    size={16}
                  />

                  {movie.duration} min
                </span>

                <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4">
                  <Languages
                    size={16}
                  />

                  {movie.language ||
                    "Not specified"}
                </span>

                <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4">
                  <Star
                    size={16}
                    className="text-amber-400"
                  />

                  {movie.rating ||
                    "Not rated"}
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-8 text-white/60">
                {movie.synopsis ||
                  movie.description ||
                  "Movie synopsis is not available."}
              </p>

              {movie.trailerUrl && (
                <a
                  href={
                    movie.trailerUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 font-bold hover:bg-white/10"
                >
                  <Play
                    size={18}
                  />

                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            Choose a show
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Dates and showtimes
          </h2>

          <p className="mt-2 text-white/45">
            Select a date first, then
            choose a cinema and time.
          </p>
        </div>

        <div
          className="mt-7 flex gap-3 overflow-x-auto pb-2"
          aria-label="Showtime date selector"
        >
          {dateOptions.map(
            (option) => {
              const active =
                selectedDate ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    setSelectedDate(
                      option.value,
                    )
                  }
                  className={`min-h-[88px] min-w-[82px] rounded-2xl border px-4 text-center transition ${
                    active
                      ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "border-white/10 bg-[#11141c] text-white/55 hover:bg-white/10"
                  }`}
                  aria-pressed={
                    active
                  }
                >
                  <span className="block text-xs uppercase">
                    {
                      option.weekday
                    }
                  </span>

                  <span className="mt-1 block text-2xl font-black">
                    {
                      option.day
                    }
                  </span>

                  <span className="block text-xs">
                    {
                      option.month
                    }
                  </span>
                </button>
              );
            },
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center text-white/45">
            Loading showtimes...
          </div>
        ) : groupedShowtimes.length ===
          0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center">
            <CalendarDays
              size={38}
              className="mx-auto text-white/20"
            />

            <h3 className="mt-4 text-xl font-bold">
              No shows on this date
            </h3>

            <p className="mt-2 text-white/45">
              Try another date from the
              selector above.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {groupedShowtimes.map(
              (cinemaShows) => {
                const firstShow =
                  cinemaShows[0];

                const cinemaKey =
                  typeof firstShow.cinemaId ===
                  "string"
                    ? firstShow.cinemaId
                    : firstShow.cinemaId.id;

                return (
                  <article
                    key={cinemaKey}
                    className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-xl font-black">
                          {objectName(
                            firstShow.cinemaId,
                          )}
                        </h3>

                        {objectCity(
                          firstShow.cinemaId,
                        ) && (
                          <p className="mt-2 flex items-center gap-2 text-sm text-white/45">
                            <MapPin
                              size={15}
                            />

                            {objectCity(
                              firstShow.cinemaId,
                            )}
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-white/40">
                        From NPR{" "}
                        {Math.min(
                          ...cinemaShows.map(
                            (show) =>
                              show.regularPrice,
                          ),
                        )}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {cinemaShows
                        .sort(
                          (
                            first,
                            second,
                          ) =>
                            new Date(
                              first.startsAt,
                            ).getTime() -
                            new Date(
                              second.startsAt,
                            ).getTime(),
                        )
                        .map(
                          (
                            showtime,
                          ) => (
                            <Link
                              key={
                                showtime.id
                              }
                              href={`/booking/${showtime.id}`}
                              className="inline-flex min-h-12 min-w-[116px] flex-col items-center justify-center rounded-xl border border-white/10 bg-[#090b10] px-4 text-center transition hover:border-red-500 hover:bg-red-600"
                            >
                              <span className="font-black">
                                {new Date(
                                  showtime.startsAt,
                                ).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour:
                                      "numeric",

                                    minute:
                                      "2-digit",
                                  },
                                )}
                              </span>

                              <span className="mt-1 text-[11px] text-white/45">
                                {objectName(
                                  showtime.screenId,
                                )}
                              </span>
                            </Link>
                          ),
                        )}
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