"use client";

import type {
  ScreenSeat,
  SeatType,
} from "@/lib/api/cinemas.types";

type Props = {
  rows: number;
  seatsPerRow: number;
  seats: ScreenSeat[];
  onChange: (
    seats: ScreenSeat[],
  ) => void;
};

function rowName(
  index: number,
): string {
  return String.fromCharCode(
    65 + index,
  );
}

export function generateSeatLayout(
  rows: number,
  seatsPerRow: number,
): ScreenSeat[] {
  const result: ScreenSeat[] = [];

  for (
    let rowIndex = 0;
    rowIndex < rows;
    rowIndex += 1
  ) {
    const row =
      rowName(rowIndex);

    for (
      let seatNumber = 1;
      seatNumber <= seatsPerRow;
      seatNumber += 1
    ) {
      result.push({
        seatCode:
          `${row}${seatNumber}`,

        row,
        number: seatNumber,
        type: "regular",
        priceMultiplier: 1,
        isDisabled: false,
      });
    }
  }

  return result;
}

export default function SeatLayoutBuilder({
  rows,
  seatsPerRow,
  seats,
  onChange,
}: Props) {
  function updateSeat(
    seatCode: string,
    changes: Partial<ScreenSeat>,
  ) {
    onChange(
      seats.map((seat) =>
        seat.seatCode === seatCode
          ? {
              ...seat,
              ...changes,
            }
          : seat,
      ),
    );
  }

  function seatClass(
    seat: ScreenSeat,
  ): string {
    if (seat.isDisabled) {
      return "border-dashed border-white/10 bg-transparent text-white/25";
    }

    if (seat.type === "premium") {
      return "border-amber-400/40 bg-amber-400/15 text-amber-300";
    }

    if (seat.type === "recliner") {
      return "border-purple-400/40 bg-purple-400/15 text-purple-300";
    }

    return "border-white/15 bg-white/5 text-white/75";
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
      <h2 className="text-lg font-semibold">
        Hall seat layout
      </h2>

      <p className="mt-2 text-sm text-white/50">
        Click a seat to disable or enable it.
        Use the dropdown to change its category.
      </p>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="rounded-t-[50%] border-t-4 border-red-500 bg-red-500/5 py-3 text-center text-xs font-semibold tracking-[0.3em] text-white/45">
          SCREEN
        </div>

        <div className="mt-10 space-y-3 overflow-x-auto pb-5">
          {Array.from({
            length: rows,
          }).map(
            (_, rowIndex) => {
              const row =
                rowName(rowIndex);

              const rowSeats =
                seats.filter(
                  (seat) =>
                    seat.row === row,
                );

              return (
                <div
                  key={row}
                  className="flex min-w-max items-center gap-3"
                >
                  <span className="w-6 text-center text-xs font-bold text-white/45">
                    {row}
                  </span>

                  <div className="flex gap-2">
                    {rowSeats.map(
                      (seat) => (
                        <div
                          key={
                            seat.seatCode
                          }
                          className="flex flex-col items-center gap-1"
                        >
                          <button
                            type="button"
                            title={
                              seat.isDisabled
                                ? "Enable seat"
                                : "Disable seat"
                            }
                            onClick={() =>
                              updateSeat(
                                seat.seatCode,
                                {
                                  isDisabled:
                                    !seat.isDisabled,
                                },
                              )
                            }
                            className={`h-9 w-9 rounded-lg border text-[10px] font-semibold transition ${seatClass(
                              seat,
                            )}`}
                          >
                            {seat.number}
                          </button>

                          {!seat.isDisabled && (
                            <select
                              aria-label={`Seat type for ${seat.seatCode}`}
                              value={
                                seat.type
                              }
                              onChange={(
                                event,
                              ) => {
                                const type =
                                  event
                                    .target
                                    .value as SeatType;

                                updateSeat(
                                  seat.seatCode,
                                  {
                                    type,

                                    priceMultiplier:
                                      type ===
                                      "premium"
                                        ? 1.4
                                        : type ===
                                            "recliner"
                                          ? 1.8
                                          : 1,
                                  },
                                );
                              }}
                              className="w-9 bg-transparent text-[9px] text-white/45 outline-none"
                            >
                              <option value="regular">
                                R
                              </option>

                              <option value="premium">
                                P
                              </option>

                              <option value="recliner">
                                L
                              </option>
                            </select>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/55">
        <span>R: Regular</span>
        <span>P: Premium</span>
        <span>L: Recliner</span>
        <span>
          Dashed: aisle/disabled
        </span>

        <span>
          Capacity:{" "}
          {
            seats.filter(
              (seat) =>
                !seat.isDisabled,
            ).length
          }
        </span>
      </div>
    </section>
  );
}