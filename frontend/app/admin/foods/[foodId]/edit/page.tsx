"use client";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import FoodForm from "@/components/admin/FoodForm";

import {
  getFood,
  updateFood,
} from "@/lib/api/foods.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Food,
  FoodInput,
} from "@/lib/api/foods.types";

export default function EditFoodPage() {
  const params =
    useParams<{
      foodId: string;
    }>();

  const router =
    useRouter();

  const [food, setFood] =
    useState<Food | null>(null);

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
    async function loadFood() {
      try {
        setFood(
          await getFood(
            params.foodId,
          ),
        );
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load food item.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFood();
  }, [params.foodId]);

  async function handleSubmit(
    payload: FoodInput,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await updateFood(
        params.foodId,
        payload,
      );

      router.push(
        "/admin/foods",
      );

      router.refresh();
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Unable to update food item.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-white/50">
        Loading item...
      </p>
    );
  }

  if (!food) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
        {error ||
          "Food item was not found."}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Concessions
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Edit {food.name}
      </h1>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8">
        <FoodForm
          initialFood={food}
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