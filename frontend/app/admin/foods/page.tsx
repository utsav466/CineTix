"use client";

import {
  Edit3,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  deleteFood,
  getFoods,
} from "@/lib/api/foods.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Food,
  FoodCategory,
} from "@/lib/api/foods.types";

export default function AdminFoodsPage() {
  const [foods, setFoods] =
    useState<Food[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    category,
    setCategory,
  ] =
    useState<
      FoodCategory | ""
    >("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadFoods() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getFoods({
          search:
            search.trim() ||
            undefined,

          category:
            category ||
            undefined,
        });

      setFoods(result);
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load food items.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFoods();
  }, [category]);

  async function handleSearch(
    event: FormEvent,
  ) {
    event.preventDefault();
    await loadFoods();
  }

  async function handleDelete(
    food: Food,
  ) {
    if (
      !window.confirm(
        `Delete "${food.name}"?`,
      )
    ) {
      return;
    }

    try {
      await deleteFood(
        food.id,
      );

      setFoods(
        (current) =>
          current.filter(
            (item) =>
              item.id !== food.id,
          ),
      );
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "Unable to delete food item.",
        ),
      );
    }
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
            Concessions
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Food & Beverages
          </h1>

          <p className="mt-2 text-white/55">
            Manage snacks, drinks,
            popcorn and cinema combos.
          </p>
        </div>

        <Link
          href="/admin/foods/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
        >
          <Plus size={19} />
          Add Item
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#11141c] p-4 md:flex-row">
        <form
          onSubmit={(event) => {
            void handleSearch(
              event,
            );
          }}
          className="relative flex-1"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search food..."
            className="w-full rounded-xl border border-white/10 bg-[#090b10] py-3 pl-11 pr-4 text-white outline-none focus:border-red-500"
          />
        </form>

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value as
                | FoodCategory
                | "",
            )
          }
          className="rounded-xl border border-white/10 bg-[#090b10] px-4 py-3 text-white outline-none focus:border-red-500"
        >
          <option value="">
            All categories
          </option>

          <option value="popcorn">
            Popcorn
          </option>

          <option value="beverage">
            Beverages
          </option>

          <option value="snack">
            Snacks
          </option>

          <option value="combo">
            Combos
          </option>

          <option value="other">
            Other
          </option>
        </select>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center text-white/50">
          Loading items...
        </div>
      ) : foods.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center">
          <UtensilsCrossed
            size={38}
            className="mx-auto text-white/25"
          />

          <h2 className="mt-4 text-lg font-semibold">
            No food items
          </h2>

          <p className="mt-2 text-white/45">
            Add your first snack,
            beverage or combo.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {foods.map(
            (food) => (
              <article
                key={food.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#11141c]"
              >
                <div className="h-48 bg-white/5">
                  {food.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        food.imageUrl
                      }
                      alt={food.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <UtensilsCrossed
                        size={36}
                        className="text-white/20"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                        {
                          food.category
                        }
                      </span>

                      <h2 className="mt-1 text-lg font-semibold">
                        {food.name}
                      </h2>
                    </div>

                    <span className="font-bold text-red-400">
                      NPR{" "}
                      {food.price}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-white/45">
                    {food.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        food.isAvailable
                          ? "bg-green-500/10 text-green-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {food.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>

                    {food.isFeatured && (
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                        Featured
                      </span>
                    )}

                    {food.isVegetarian && (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                        Vegetarian
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/admin/foods/${food.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
                    >
                      <Edit3 size={17} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        void handleDelete(
                          food,
                        );
                      }}
                      className="rounded-xl bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}