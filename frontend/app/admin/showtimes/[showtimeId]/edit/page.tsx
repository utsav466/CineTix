    "use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import ShowtimeForm from "@/components/admin/ShowtimeForm";

import {
  getAdminMovies,
} from "@/lib/api/admin-movies.api";

import {
  getCinemas,
  getScreens,
} from "@/lib/api/cinemas.api";

import {
  getShowtime,
  updateShowtime,
} from "@/lib/api/showtimes.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

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
} from "@/lib/api/showtimes.types";

export default function EditShowtimePage() {
  const params =
    useParams<{
      showtimeId: string;
    }>();

  const router =
    useRouter();

  const [movies, setMovies] =
    useState<Movie[]>([]);

  const [cinemas, setCinemas] =
    useState<Cinema[]>([]);

  const [screens, setScreens] =
    useState<Screen[]>([]);

  const [
    showtime,
    setShowtime,
  ] =
    useState<Showtime | null>(
      null,
    );

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
    async function loadData() {
      try {
        const [
          movieResult,
          cinemaResult,
          screenResult,
          showtimeResult,
        ] =
          await Promise.all([
            getAdminMovies({
              limit: 100,
            }),

            getCinemas(),

            getScreens(),

            getShowtime(
              params.showtimeId,
            ),
          ]);

        setMovies(
          movieResult.items,
        );

        setCinemas(
          cinemaResult,
        );

        setScreens(
          screenResult,
        );

        setShowtime(
          showtimeResult,
        );
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load showtime.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [params.showtimeId]);

  async function handleSubmit(
    payload: ShowtimeInput,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await updateShowtime(
        params.showtimeId,
        payload,
      );

      router.push(
        "/admin/showtimes",
      );

      router.refresh();
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Unable to update showtime.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-white/50">
        Loading showtime...
      </p>
    );
  }

  if (!showtime) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
        {error ||
          "Showtime not found."}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Scheduling
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Edit Showtime
      </h1>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8">
        <ShowtimeForm
          movies={movies}
          cinemas={cinemas}
          screens={screens}
          initialShowtime={
            showtime
          }
          submitting={
            submitting
          }
          onSubmit={
            handleSubmit
          }
        />
      </div>
    </section>
  );
}