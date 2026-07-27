"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import HallForm from "@/components/admin/HallForm";

import {
  getCinemas,
  getScreen,
  updateScreen,
} from "@/lib/api/cinemas.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Cinema,
  Screen,
  ScreenInput,
} from "@/lib/api/cinemas.types";

export default function EditHallPage() {
  const params =
    useParams<{
      hallId: string;
    }>();

  const router =
    useRouter();

  const [cinemas, setCinemas] =
    useState<Cinema[]>([]);

  const [hall, setHall] =
    useState<Screen | null>(null);

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
          cinemaResult,
          hallResult,
        ] =
          await Promise.all([
            getCinemas(),
            getScreen(
              params.hallId,
            ),
          ]);

        setCinemas(
          cinemaResult,
        );

        setHall(hallResult);
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load hall.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [params.hallId]);

  async function handleSubmit(
    payload: ScreenInput,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await updateScreen(
        params.hallId,
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
          "Unable to update hall.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-white/50">
        Loading hall...
      </p>
    );
  }

  if (!hall) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
        {error ||
          "Hall was not found."}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Hall management
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Edit {hall.name}
      </h1>

      <p className="mt-2 text-white/55">
        Update the hall layout,
        capacity and seat
        categories.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8">
        <HallForm
          cinemas={cinemas}
          initialScreen={hall}
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