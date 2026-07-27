"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import HallForm from "@/components/admin/HallForm";

import {
  createScreen,
  getCinemas,
} from "@/lib/api/cinemas.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Cinema,
  ScreenInput,
} from "@/lib/api/cinemas.types";

export default function NewHallPage() {
  const router =
    useRouter();

  const [cinemas, setCinemas] =
    useState<Cinema[]>([]);

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
    async function loadCinemas() {
      try {
        const result =
          await getCinemas();

        setCinemas(result);
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load cinemas.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCinemas();
  }, []);

  async function handleSubmit(
    payload: ScreenInput,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await createScreen(
        payload,
      );

      router.push(
        "/admin/halls",
      );

      router.refresh();
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Unable to create hall.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-white/50">
        Loading cinemas...
      </p>
    );
  }

  if (cinemas.length === 0) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-amber-500/20 bg-amber-500/10 p-8">
        <h1 className="text-2xl font-bold text-amber-300">
          Add a cinema first
        </h1>

        <p className="mt-3 text-white/65">
          A hall must belong to a
          cinema. Create a cinema
          branch before adding its
          halls.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/cinemas",
            )
          }
          className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
        >
          Go to Cinemas
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Hall management
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Create Cinema Hall
      </h1>

      <p className="mt-2 text-white/55">
        Configure hall capacity,
        rows, seat categories and
        aisles.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8">
        <HallForm
          cinemas={cinemas}
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