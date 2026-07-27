"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import FoodForm from "@/components/admin/FoodForm";

import {
  createFood,
} from "@/lib/api/foods.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  FoodInput,
} from "@/lib/api/foods.types";

export default function NewFoodPage() {
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
    payload: FoodInput,
  ) {
    try {
      setSubmitting(true);
      setError("");

      await createFood(
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
          "Unable to add food item.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Concessions
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Add Food Item
      </h1>

      <p className="mt-2 text-white/55">
        Add a snack, beverage,
        popcorn option or cinema
        combo.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8">
        <FoodForm
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