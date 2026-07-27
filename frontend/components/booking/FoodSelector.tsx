"use client";

import {
  Minus,
  Plus,
  UtensilsCrossed,
} from "lucide-react";

import type {
  Food,
} from "@/lib/api/foods.types";

type QuantityMap =
  Record<string, number>;

type Props = {
  foods: Food[];

  quantities:
    QuantityMap;

  onQuantityChange: (
    foodId: string,
    quantity: number,
  ) => void;
};

export default function FoodSelector({
  foods,
  quantities,
  onQuantityChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Optional extras
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Food & Beverages
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Add snacks and drinks to
          your cinema booking.
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white/[0.03] p-8 text-center text-white/40">
          <UtensilsCrossed
            size={32}
            className="mx-auto"
          />

          <p className="mt-3">
            No food items are
            currently available.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {foods.map(
            (food) => {
              const quantity =
                quantities[
                  food.id
                ] || 0;

              return (
                <article
                  key={food.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#090b10]"
                >
                  <div className="h-36 bg-white/5">
                    {food.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          food.imageUrl
                        }
                        alt={
                          food.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <UtensilsCrossed
                          size={28}
                          className="text-white/20"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wider text-red-400">
                      {
                        food.category
                      }
                    </p>

                    <h3 className="mt-1 font-semibold">
                      {food.name}
                    </h3>

                    <p className="mt-2 text-sm font-bold">
                      NPR{" "}
                      {food.price}
                    </p>

                    <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 p-2">
                      <button
                        type="button"
                        disabled={
                          quantity <= 0
                        }
                        onClick={() =>
                          onQuantityChange(
                            food.id,
                            Math.max(
                              0,
                              quantity -
                                1,
                            ),
                          )
                        }
                        className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 disabled:opacity-30"
                      >
                        <Minus
                          size={16}
                        />
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        disabled={
                          quantity >= 20
                        }
                        onClick={() =>
                          onQuantityChange(
                            food.id,
                            Math.min(
                              20,
                              quantity +
                                1,
                            ),
                          )
                        }
                        className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 disabled:opacity-30"
                      >
                        <Plus
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}