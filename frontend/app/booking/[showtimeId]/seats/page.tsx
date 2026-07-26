"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  foodAddOns,
  seats,
  type FoodAddOn,
  type Seat,
} from "@/lib/api/cinetix";

type FoodQuantities = Record<
  string,
  number
>;

function getFoodEmoji(
  food: FoodAddOn,
): string {
  const name = food.name.toLowerCase();

  if (
    name.includes("burger") ||
    name.includes("cheezy")
  ) {
    return "🍔";
  }

  if (
    name.includes("fries")
  ) {
    return "🍟";
  }

  if (
    name.includes("ice")
  ) {
    return "🍨";
  }

  if (
    name.includes("coffee") ||
    name.includes("americano")
  ) {
    return "☕";
  }

  if (
    name.includes("popcorn")
  ) {
    return "🍿";
  }

  if (
    name.includes("drink") ||
    name.includes("cola")
  ) {
    return "🥤";
  }

  return "🍿";
}

export default function SeatBookingPage() {
  const params = useParams<{
    showtimeId: string;
  }>();

  const router = useRouter();

  const [
    selectedSeatIds,
    setSelectedSeatIds,
  ] = useState<string[]>([
    "D16",
    "F5",
  ]);

  const [
    foodQuantities,
    setFoodQuantities,
  ] = useState<FoodQuantities>(
    {},
  );

  const selectedSeats =
    useMemo(() => {
      return seats.filter((seat) =>
        selectedSeatIds.includes(
          seat.id,
        ),
      );
    }, [selectedSeatIds]);

  const selectedFood =
    useMemo(() => {
      return foodAddOns
        .map((food) => ({
          ...food,
          quantity:
            foodQuantities[
              food.id
            ] ?? 0,
        }))
        .filter(
          (food) =>
            food.quantity > 0,
        );
    }, [foodQuantities]);

  const seatTotal = useMemo(
    () =>
      selectedSeats.reduce(
        (total, seat) =>
          total + seat.price,
        0,
      ),
    [selectedSeats],
  );

  const foodTotal = useMemo(
    () =>
      selectedFood.reduce(
        (total, food) =>
          total +
          food.price *
            food.quantity,
        0,
      ),
    [selectedFood],
  );

  const totalAmount =
    seatTotal + foodTotal;

  function handleSeatClick(
    seat: Seat,
  ) {
    if (
      seat.status === "reserved"
    ) {
      return;
    }

    setSelectedSeatIds(
      (currentSeats) => {
        const seatIsSelected =
          currentSeats.includes(
            seat.id,
          );

        if (seatIsSelected) {
          return currentSeats.filter(
            (seatId) =>
              seatId !== seat.id,
          );
        }

        return [
          ...currentSeats,
          seat.id,
        ];
      },
    );
  }

  function changeFoodQuantity(
    foodId: string,
    change: number,
  ) {
    setFoodQuantities(
      (currentQuantities) => {
        const currentQuantity =
          currentQuantities[
            foodId
          ] ?? 0;

        const nextQuantity =
          Math.max(
            0,
            currentQuantity +
              change,
          );

        return {
          ...currentQuantities,
          [foodId]:
            nextQuantity,
        };
      },
    );
  }

  function handleBack() {
    router.back();
  }

  function handleNext() {
    if (
      selectedSeatIds.length === 0
    ) {
      return;
    }

    const storedBooking =
      localStorage.getItem(
        "cinetix-booking",
      );

    const previousBooking =
      storedBooking
        ? JSON.parse(
            storedBooking,
          )
        : {};

    const bookingData = {
      ...previousBooking,

      showtimeId:
        params.showtimeId,

      seats: selectedSeatIds,

      selectedFood:
        selectedFood.map(
          (food) => ({
            id: food.id,
            name: food.name,
            price: food.price,
            quantity:
              food.quantity,
          }),
        ),

      seatTotal,
      foodTotal,
      totalAmount,
    };

    localStorage.setItem(
      "cinetix-booking",
      JSON.stringify(
        bookingData,
      ),
    );

    router.push("/checkout");
  }

  return (
    <main className="seat-booking-page">
      <section className="seat-booking-container">
        <button
          type="button"
          className="seat-back-button"
          onClick={handleBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="cinema-screen">
          <div className="screen-glow" />

          <div className="screen-curve">
            <span>Screen</span>
          </div>
        </div>

        <div className="seat-layout">
          {["A", "B", "C", "D", "E", "F"].map(
            (row) => {
              const rowSeats =
                seats.filter(
                  (seat) =>
                    seat.row === row,
                );

              return (
                <div
                  key={row}
                  className="seat-row"
                >
                  <span className="seat-row-label">
                    {row}
                  </span>

                  <div className="seat-row-seats">
                    {rowSeats.map(
                      (seat) => {
                        const isSelected =
                          selectedSeatIds.includes(
                            seat.id,
                          );

                        const seatState =
                          seat.status ===
                          "reserved"
                            ? "reserved"
                            : isSelected
                              ? "selected"
                              : "available";

                        return (
                          <button
                            key={
                              seat.id
                            }
                            type="button"
                            className={`cinema-seat cinema-seat--${seatState}`}
                            disabled={
                              seat.status ===
                              "reserved"
                            }
                            aria-label={`Seat ${seat.id}, ${seatState}`}
                            aria-pressed={
                              isSelected
                            }
                            onClick={() =>
                              handleSeatClick(
                                seat,
                              )
                            }
                          >
                            <span className="cinema-seat__back" />
                            <span className="cinema-seat__base" />
                          </button>
                        );
                      },
                    )}
                  </div>

                  <span className="seat-row-label seat-row-label--right">
                    {row}
                  </span>
                </div>
              );
            },
          )}
        </div>

        <div className="seat-controls">
          <div className="seat-legend">
            <div className="seat-legend-item">
              <span className="seat-legend-dot seat-legend-dot--available" />
              <span>
                Available
              </span>
            </div>

            <div className="seat-legend-item">
              <span className="seat-legend-dot seat-legend-dot--reserved" />
              <span>
                Reserved
              </span>
            </div>

            <div className="seat-legend-item">
              <span className="seat-legend-dot seat-legend-dot--selected" />
              <span>
                Selected
              </span>
            </div>
          </div>

          <div className="seat-selection-summary">
            <div>
              <strong>
                {
                  selectedSeatIds.length
                }{" "}
                {selectedSeatIds.length ===
                1
                  ? "seat"
                  : "seats"}{" "}
                selected
              </strong>

              <span>
                {selectedSeatIds.length >
                0
                  ? selectedSeatIds.join(
                      ", ",
                    )
                  : "Select your seats"}
              </span>
            </div>

            <button
              type="button"
              className="seat-next-button"
              disabled={
                selectedSeatIds.length ===
                0
              }
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>

        <section className="food-addons-section">
          <div className="food-addons-heading">
            <div>
              <p className="section-eyebrow">
                Optional
              </p>

              <h2>
                Food Add-ons
              </h2>
            </div>

            <p>
              Add snacks and drinks
              to your booking
            </p>
          </div>

          <div className="food-addons-grid">
            {foodAddOns.map(
              (food) => {
                const quantity =
                  foodQuantities[
                    food.id
                  ] ?? 0;

                return (
                  <article
                    key={food.id}
                    className="food-addon-card"
                  >
                    <div className="food-addon-icon">
                      {getFoodEmoji(
                        food,
                      )}
                    </div>

                    <div className="food-addon-info">
                      <h3>
                        {food.name}
                      </h3>

                      <p>
                        $
                        {food.price.toFixed(
                          2,
                        )}
                      </p>
                    </div>

                    <div className="food-addon-counter">
                      <button
                        type="button"
                        aria-label={`Remove one ${food.name}`}
                        disabled={
                          quantity === 0
                        }
                        onClick={() =>
                          changeFoodQuantity(
                            food.id,
                            -1,
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Add one ${food.name}`}
                        onClick={() =>
                          changeFoodQuantity(
                            food.id,
                            1,
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </div>

          <div className="booking-price-summary">
            <div>
              <span>
                Seats
              </span>

              <strong>
                $
                {seatTotal.toFixed(
                  2,
                )}
              </strong>
            </div>

            <div>
              <span>
                Food
              </span>

              <strong>
                $
                {foodTotal.toFixed(
                  2,
                )}
              </strong>
            </div>

            <div className="booking-price-summary__total">
              <span>
                Total
              </span>

              <strong>
                $
                {totalAmount.toFixed(
                  2,
                )}
              </strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}