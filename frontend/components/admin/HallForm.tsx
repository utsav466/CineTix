"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import SeatLayoutBuilder, {
  generateSeatLayout,
} from "@/components/admin/SeatLayoutBuilder";

import type {
  Cinema,
  Screen,
  ScreenInput,
  ScreenSeat,
} from "@/lib/api/cinemas.types";

type HallFormProps = {
  cinemas: Cinema[];
  initialScreen?: Screen;
  submitting: boolean;
  onSubmit: (
    payload: ScreenInput,
  ) => Promise<void>;
};

function getCinemaId(
  cinemaId: Screen["cinemaId"],
): string {
  if (typeof cinemaId === "string") {
    return cinemaId;
  }

  return (
    cinemaId.id ||
    cinemaId._id ||
    ""
  );
}

export default function HallForm({
  cinemas,
  initialScreen,
  submitting,
  onSubmit,
}: HallFormProps) {
  const [cinemaId, setCinemaId] =
    useState(
      initialScreen
        ? getCinemaId(
            initialScreen.cinemaId,
          )
        : cinemas[0]?.id || "",
    );

  const [name, setName] =
    useState(
      initialScreen?.name || "",
    );

  const [rows, setRows] =
    useState(
      initialScreen?.rows || 8,
    );

  const [
    seatsPerRow,
    setSeatsPerRow,
  ] =
    useState(
      initialScreen?.seatsPerRow ||
        10,
    );

  const [
    seatLayout,
    setSeatLayout,
  ] =
    useState<ScreenSeat[]>(
      initialScreen?.seatLayout ||
        generateSeatLayout(8, 10),
    );

  const [
    isActive,
    setIsActive,
  ] =
    useState(
      initialScreen?.isActive ??
        true,
    );

  const [error, setError] =
    useState("");

  /*
   * Regenerate the layout only when rows or
   * seats-per-row change.
   *
   * Existing seats keep their category and
   * disabled state when possible.
   */
  useEffect(() => {
    setSeatLayout(
      (currentLayout) => {
        const generated =
          generateSeatLayout(
            rows,
            seatsPerRow,
          );

        return generated.map(
          (generatedSeat) => {
            const existingSeat =
              currentLayout.find(
                (seat) =>
                  seat.seatCode ===
                  generatedSeat.seatCode,
              );

            return (
              existingSeat ||
              generatedSeat
            );
          },
        );
      },
    );
  }, [rows, seatsPerRow]);

  const capacity = useMemo(
    () =>
      seatLayout.filter(
        (seat) =>
          !seat.isDisabled,
      ).length,
    [seatLayout],
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (!cinemaId) {
      setError(
        "Please select a cinema.",
      );
      return;
    }

    if (!name.trim()) {
      setError(
        "Please enter the hall name.",
      );
      return;
    }

    if (capacity < 1) {
      setError(
        "The hall must contain at least one active seat.",
      );
      return;
    }

    await onSubmit({
      cinemaId,
      name: name.trim(),
      rows,
      seatsPerRow,
      seatLayout,
      isActive,
    });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 py-3 text-white outline-none transition focus:border-red-500";

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="space-y-7"
    >
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Hall information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
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
              Hall name
            </span>

            <input
              required
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="Hall 1"
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Number of rows
            </span>

            <input
              required
              type="number"
              min={1}
              max={26}
              value={rows}
              onChange={(event) =>
                setRows(
                  Math.max(
                    1,
                    Math.min(
                      26,
                      Number(
                        event.target
                          .value,
                      ),
                    ),
                  ),
                )
              }
              className={inputClass}
            />
          </label>

          <label>
            <span className="text-sm text-white/60">
              Seats per row
            </span>

            <input
              required
              type="number"
              min={1}
              max={40}
              value={seatsPerRow}
              onChange={(event) =>
                setSeatsPerRow(
                  Math.max(
                    1,
                    Math.min(
                      40,
                      Number(
                        event.target
                          .value,
                      ),
                    ),
                  ),
                )
              }
              className={inputClass}
            />
          </label>

          <div className="rounded-xl border border-white/10 bg-[#090b10] px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Current capacity
            </p>

            <p className="mt-1 text-2xl font-bold">
              {capacity}
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#090b10] px-4 py-3">
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
              Hall is active
            </span>
          </label>
        </div>
      </section>

      <SeatLayoutBuilder
        rows={rows}
        seatsPerRow={
          seatsPerRow
        }
        seats={seatLayout}
        onChange={
          setSeatLayout
        }
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-red-600 px-7 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Saving hall..."
            : initialScreen
              ? "Update Hall"
              : "Create Hall"}
        </button>
      </div>
    </form>
  );
}