"use client";

import {
  FormEvent,
  useState,
} from "react";

import ImageUploadField from "./ImageUploadField";

import type {
  Food,
  FoodCategory,
  FoodInput,
} from "@/lib/api/foods.types";

type FoodFormProps = {
  initialFood?: Food;
  submitting: boolean;

  onSubmit(
    payload: FoodInput,
  ): Promise<void>;
};

export default function FoodForm({
  initialFood,
  submitting,
  onSubmit,
}: FoodFormProps) {
  const [name, setName] =
    useState(
      initialFood?.name ||
        "",
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      initialFood?.description ||
        "",
    );

  const [category, setCategory] =
    useState<FoodCategory>(
      initialFood?.category ||
        "popcorn",
    );

  const [price, setPrice] =
    useState(
      initialFood?.price.toString() ||
        "",
    );

  const [
    image,
    setImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    imageRemoved,
    setImageRemoved,
  ] =
    useState(false);

  const [
    isVegetarian,
    setIsVegetarian,
  ] =
    useState(
      initialFood
        ?.isVegetarian ??
        true,
    );

  const [
    isAvailable,
    setIsAvailable,
  ] =
    useState(
      initialFood
        ?.isAvailable ??
        true,
    );

  const [
    isFeatured,
    setIsFeatured,
  ] =
    useState(
      initialFood
        ?.isFeatured ??
        false,
    );

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const numericPrice =
      Number(price);

    const hasImage =
      Boolean(
        image ||
        (
          initialFood
            ?.imageUrl &&
          !imageRemoved
        ),
      );

    if (!hasImage) {
      setError(
        "Select a food image.",
      );

      return;
    }

    if (
      !name.trim() ||
      !Number.isFinite(
        numericPrice,
      ) ||
      numericPrice < 0
    ) {
      setError(
        "Enter a valid food name and price.",
      );

      return;
    }

    await onSubmit({
      name:
        name.trim(),

      description:
        description.trim(),

      category,

      price:
        numericPrice,

      image,

      removeImage:
        imageRemoved,

      isVegetarian,
      isAvailable,
      isFeatured,
    });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(
          event,
        );
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
          Item information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm text-white/60">
              Item name
            </span>

            <input
              required
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Category
            </span>

            <select
              value={
                category
              }
              onChange={(event) =>
                setCategory(
                  event.target
                    .value as FoodCategory,
                )
              }
              className={
                inputClass
              }
            >
              <option value="popcorn">
                Popcorn
              </option>

              <option value="beverage">
                Beverage
              </option>

              <option value="snack">
                Snack
              </option>

              <option value="combo">
                Combo
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </label>

          <label>
            <span className="text-sm text-white/60">
              Price
            </span>

            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(event) =>
                setPrice(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm text-white/60">
              Description
            </span>

            <textarea
              rows={5}
              value={
                description
              }
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <ImageUploadField
          label="Food image"
          description="Upload a clear square product image."
          currentUrl={
            initialFood
              ?.imageUrl
          }
          file={image}
          removed={
            imageRemoved
          }
          required
          aspect="square"
          onFileChange={(
            selectedFile,
          ) => {
            setImage(
              selectedFile,
            );

            setImageRemoved(
              false,
            );
          }}
          onRemove={() => {
            setImage(null);

            setImageRemoved(
              true,
            );
          }}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Availability
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#090b10] px-4 py-4">
            <input
              type="checkbox"
              checked={
                isVegetarian
              }
              onChange={(event) =>
                setIsVegetarian(
                  event.target.checked,
                )
              }
              className="h-5 w-5 accent-red-600"
            />

            Vegetarian
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#090b10] px-4 py-4">
            <input
              type="checkbox"
              checked={
                isAvailable
              }
              onChange={(event) =>
                setIsAvailable(
                  event.target.checked,
                )
              }
              className="h-5 w-5 accent-red-600"
            />

            Available
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#090b10] px-4 py-4">
            <input
              type="checkbox"
              checked={
                isFeatured
              }
              onChange={(event) =>
                setIsFeatured(
                  event.target.checked,
                )
              }
              className="h-5 w-5 accent-red-600"
            />

            Featured
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            submitting
          }
          className="rounded-xl bg-red-600 px-7 py-3 font-semibold transition hover:bg-red-500 disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : initialFood
              ? "Update Item"
              : "Add Item"}
        </button>
      </div>
    </form>
  );
}