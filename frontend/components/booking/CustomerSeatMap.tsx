"use client";

import type {
  AvailableSeat,
} from "@/lib/api/bookings.types";

type Props = {
  seats: AvailableSeat[];

  selectedSeatCodes:
    string[];

  onToggleSeat: (
    seat: AvailableSeat,
  ) => void;
};

export default function CustomerSeatMap({
  seats,
  selectedSeatCodes,
  onToggleSeat,
}: Props) {
  const rows = [
    ...new Set(
      seats.map(
        (seat) => seat.row,
      ),
    ),
  ];

  function seatClass(
    seat: AvailableSeat,
  ): string {
    if (
      selectedSeatCodes.includes(
        seat.seatCode,
      )
    ) {
      return "border-red-400 bg-red-600 text-white";
    }

    if (
      seat.status === "booked"
    ) {
      return "cursor-not-allowed border-white/5 bg-white/10 text-white/20";
    }

    if (
      seat.status === "held" &&
      !seat.heldByCurrentUser
    ) {
      return "cursor-not-allowed border-amber-500/20 bg-amber-500/10 text-amber-500/40";
    }

    if (
      seat.type === "premium"
    ) {
      return "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20";
    }

    if (
      seat.type === "recliner"
    ) {
      return "border-purple-400/40 bg-purple-400/10 text-purple-300 hover:bg-purple-400/20";
    }

    return "border-white/15 bg-white/5 text-white/70 hover:bg-white/10";
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-t-[50%] border-t-4 border-red-500 bg-red-500/5 py-3 text-center text-xs font-semibold tracking-[0.35em] text-white/45">
          SCREEN
        </div>

        <div className="mt-10 space-y-3 overflow-x-auto pb-6">
          {rows.map((row) => {
            const rowSeats =
              seats
                .filter(
                  (seat) =>
                    seat.row === row,
                )
                .sort(
                  (first, second) =>
                    first.number -
                    second.number,
                );

            return (
              <div
                key={row}
                className="flex min-w-max items-center gap-3"
              >
                <span className="w-7 text-center text-xs font-semibold text-white/40">
                  {row}
                </span>

                <div className="flex gap-2">
                  {rowSeats.map(
                    (seat) => {
                      const unavailable =
                        seat.status ===
                          "booked" ||
                        (seat.status ===
                          "held" &&
                          !seat.heldByCurrentUser);

                      return (
                        <button
                          key={
                            seat.id
                          }
                          type="button"
                          disabled={
                            unavailable
                          }
                          onClick={() =>
                            onToggleSeat(
                              seat,
                            )
                          }
                          title={`${seat.seatCode} — NPR ${seat.price}`}
                          className={`h-10 w-10 rounded-lg border text-[11px] font-semibold transition ${seatClass(
                            seat,
                          )}`}
                        >
                          {
                            seat.number
                          }
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-5 text-xs text-white/50">
        <span>White: Regular</span>
        <span>Gold: Premium</span>
        <span>Purple: Recliner</span>
        <span>Red: Selected</span>
        <span>Gray: Booked</span>
        <span>Amber faded: Held</span>
      </div>
    </section>
  );
}