"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import MovieForm from "@/components/admin/MovieForm";

import {
  createAdminMovie,
} from "@/lib/api/admin-movies.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  MovieInput,
} from "@/lib/api/movies.types";

export default function AddMoviePage() {
  const router =
    useRouter();

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    payload: MovieInput,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await createAdminMovie(
        payload,
      );

      router.push(
        "/admin/movies",
      );

      router.refresh();
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Unable to add movie",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Movie management
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Add Movie
      </h1>

      <p className="mt-2 text-white/55">
        Enter the movie information
        shown to customers.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8">
        <MovieForm
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}