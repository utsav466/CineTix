"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Cinema,
  Screen,
} from "@/lib/api/cinemas.types";

import type {
  Movie,
} from "@/lib/api/movies.types";

import type {
  Showtime,
  ShowtimeInput,
  ShowtimeStatus,
} from "@/lib/api/showtimes.types";

type Props = {
  movies: Movie[];
  cinemas: Cinema[];
  screens: Screen[];

  initialShowtime?: Showtime;

  submitting: boolean;

  onSubmit: (
    payload: ShowtimeInput,
  ) => Promise<void>;
};

function recordId(
  value:
    | string
    | {
        id?: string;
        _id?: string;
      },
): string {
  if (
    typeof value === "string"
  ) {
    return value;
  }

  return (
    value.id ||
    value._id ||
    ""
  );
}

function datetimeLocalValue(
  value?: string,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60 * 1000,
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}

export default function ShowtimeForm({
  movies,
  cinemas,
  screens,
  initialShowtime,
  submitting,
  onSubmit,
}: Props) {
  const [movieId, setMovieId] =
    useState(
      initialShowtime
        ? recordId(
            initialShowtime.movieId,
          )
        : movies[0]?.id || "",
    );

  const [
    cinemaId,
    setCinemaId,
  ] =
    useState(
      initialShowtime
        ? recordId(
            initialShowtime.cinemaId,
          )
        : cinemas[0]?.id || "",
    );

  const [
    screenId,
    setScreenId,
  ] =
    useState(
      initialShowtime
        ? recordId(
            initialShowtime.screenId,
          )
        : "",
    );

  const [
    startsAt,
    setStartsAt,
  ] =
    useState(
      datetimeLocalValue(
        initialShowtime?.startsAt,
      ),
    );

  const [
    regularPrice,
    setRegularPrice,
  ] =
    useState(
      initialShowtime
        ?.regularPrice
        .toString() ||
        "300",
    );

  const [
    premiumPrice,
    setPremiumPrice,
  ] =
    useState(
      initialShowtime
        ?.premiumPrice
        .toString() ||
        "450",
    );

  const [
    reclinerPrice,
    setReclinerPrice,
  ] =
    useState(
      initialShowtime
        ?.reclinerPrice
        .toString() ||
        "650",
    );

  const [
    cleanupMinutes,
    setCleanupMinutes,
  ] =
    useState(
      initialShowtime
        ?.cleanupMinutes
        .toString() ||
        "20",
    );

  const [status, setStatus] =
    useState<ShowtimeStatus>(
      initialShowtime?.status ||
        "scheduled",
    );

  const [
    isActive,
    setIsActive,
  ] =
    useState(
      initialShowtime
        ?.isActive ??
        true,
    );

  const [error, setError] =
    useState("");

  const filteredScreens =
    useMemo(
      () =>
        screens.filter(
          (screen) =>
            recordId(
              screen.cinemaId,
            ) === cinemaId,
        ),
      [cinemaId, screens],
    );

  useEffect(() => {
    if (
      !filteredScreens.some(
        (screen) =>
          screen.id ===
          screenId,
      )
    ) {
      setScreenId(
        filteredScreens[0]
          ?.id || "",
      );
    }
  }, [
    filteredScreens,
    screenId,
  ]);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (
      !movieId ||
      !cinemaId ||
      !screenId ||
      !startsAt
    ) {
      setError(
        "Complete all required showtime fields.",
      );

      return;
    }

    await onSubmit({
      movieId,
      cinemaId,
      screenId,

      startsAt:
        new Date(
          startsAt,
        ).toISOString(),

      regularPrice:
        Number(regularPrice),

      premiumPrice:
        Number(premiumPrice),

      reclinerPrice:
        Number(reclinerPrice),

      cleanupMinutes:
        Number(cleanupMinutes),

      status,
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
          Screening details
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm text-white/60">
              Movie
            </span>

            <select
              required
              value={movieId}
              onChange={(event) =>
                setMovieId(
                  event.target.value,
                )
              }
              className={inputClass}
            >
              <option value="">
                Select movie
              </option>

              {movies.map(
                (movie) => (
                  <option
                    key={movie.id}
                    value={movie.id}
                  >
                    {movie.title}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span className="text-sm text-white/60">
              Cinema
            </span>

            <select
              required
              value={cinemaId}
              onChange={(event) =>
                setCinemaId(
                  event.target.value,
                )
              }
              className={inputClass}
            >
              <option value="">
                Select cinema
              </option>

              {cinemas.map(
                (cinema) => (
                  <option
                    key={cinema.id}
                    value={cinema.id}
                  >
                    {cinema.name} —{" "}
                    {cinema.city}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span className="text-sm text-white/60">
              Hall
            </span>

            <select
              required
              value={screenId}
              onChange={(event) =>
                setScreenId(
                  event.target.value,
                )
              }
              className={inputClass}
            >
              <option value="">
                Select hall
              </option>

              {filteredScreens.map(
                (screen) => (
                  <option
                    key={screen.id}
                    value={screen.id}
                  >
                    {screen.name} —{" "}
                    {
                      screen.capacity
                    }{" "}
                    seats
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span className="text-sm text-white/60">
              Start date and time
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
              Cleanup time
            </span>

            <input
              required
              type="number"
              min={0}
              max={120}
              value={
                cleanupMinutes
              }
              onChange={(event) =>
                setCleanupMinutes(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Status
            </span>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as ShowtimeStatus,
                )
              }
              className={inputClass}
            >
              <option value="scheduled">
                Scheduled
              </option>

              <option value="cancelled">
                Cancelled
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Ticket pricing
        </h2>

        <p className="mt-2 text-sm text-white/50">
          Enter prices in NPR.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <label>
            <span className="text-sm text-white/60">
              Regular price
            </span>

            <input
              required
              type="number"
              min={0}
              value={regularPrice}
              onChange={(event) =>
                setRegularPrice(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Premium price
            </span>

            <input
              required
              type="number"
              min={0}
              value={premiumPrice}
              onChange={(event) =>
                setPremiumPrice(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Recliner price
            </span>

            <input
              required
              type="number"
              min={0}
              value={
                reclinerPrice
              }
              onChange={(event) =>
                setReclinerPrice(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#11141c] px-5 py-4">
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
          Showtime is visible to
          customers
        </span>
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-red-600 px-7 py-3 font-semibold hover:bg-red-500 disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : initialShowtime
              ? "Update Showtime"
              : "Create Showtime"}
        </button>
      </div>
    </form>
  );
}