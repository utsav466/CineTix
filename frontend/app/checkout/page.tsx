"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StoredBooking = {
  movieId?: string;
  movieTitle?: string;
  moviePoster?: string;
  date?: string;
  cinemaId?: string;
  cinemaName?: string;
  cinemaLocation?: string;
  showtimeId?: string;
  startTime?: string;
  endTime?: string;
  price?: number;
  auditorium?: string;
  seats?: string[];
  selectedFood?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  seatTotal?: number;
  foodTotal?: number;
  totalAmount?: number;
};

function formatBookingDate(dateValue?: string) {
  if (!dateValue) {
    return "Not selected";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatNpr(amount: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();

  const [booking, setBooking] = useState<StoredBooking | null>(
    null,
  );

  const [paymentMethod, setPaymentMethod] = useState("esewa");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedBooking = localStorage.getItem(
        "cinetix-booking",
      );

      if (!storedBooking) {
        setBooking(null);
        return;
      }

      const parsedBooking = JSON.parse(
        storedBooking,
      ) as StoredBooking;

      setBooking(parsedBooking);
    } catch (error) {
      console.error(
        "Unable to read booking information:",
        error,
      );

      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const foodItems = booking?.selectedFood ?? [];

  const calculatedFoodTotal = useMemo(() => {
    return foodItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [foodItems]);

  const seatTotal =
    booking?.seatTotal ??
    (booking?.seats?.length ?? 0) *
      (booking?.price ?? 0);

  const foodTotal =
    booking?.foodTotal ?? calculatedFoodTotal;

  const totalAmount =
    booking?.totalAmount ??
    seatTotal + foodTotal;

  function handleBack() {
    router.back();
  }

  function handlePlaceOrder() {
    if (!booking || !paymentMethod) {
      return;
    }

    const bookingId = `CTX-${Date.now()}`;

    const completedBooking = {
      ...booking,
      id: bookingId,
      paymentMethod,
      totalAmount,
      status: "confirmed",
      bookedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "cinetix-completed-booking",
      JSON.stringify(completedBooking),
    );

    router.push(
      `/booking/success/${bookingId}`,
    );
  }

  if (isLoading) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">
          Loading your booking…
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>No booking found</h1>

          <p>
            Select a movie, cinema, showtime and seats before
            opening checkout.
          </p>

          <button
            type="button"
            className="checkout-primary-button"
            onClick={() => router.push("/")}
          >
            Browse Movies
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <button
          type="button"
          className="checkout-back-button"
          onClick={handleBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="checkout-progress">
          <div className="checkout-progress__step">
            <span className="checkout-progress__circle checkout-progress__circle--active">
              1
            </span>

            <span className="checkout-progress__label">
              cart
            </span>
          </div>

          <div className="checkout-progress__line" />

          <div className="checkout-progress__step">
            <span className="checkout-progress__circle">
              2
            </span>

            <span className="checkout-progress__label">
              checkout
            </span>
          </div>
        </div>

        <section className="checkout-card">
          <div className="checkout-summary">
            <h1>Booking Summary</h1>

            <dl className="checkout-summary-list">
              <div>
                <dt>Movie:</dt>
                <dd>{booking.movieTitle ?? "Movie"}</dd>
              </div>

              <div>
                <dt>Show Details:</dt>
                <dd>
                  {formatBookingDate(booking.date)}
                  {booking.startTime
                    ? ` • ${booking.startTime}`
                    : ""}
                </dd>
              </div>

              <div>
                <dt>Theatre Name:</dt>
                <dd>
                  {booking.cinemaName ?? "Cinema"}
                </dd>
              </div>

              {booking.cinemaLocation && (
                <div>
                  <dt>Location:</dt>
                  <dd>{booking.cinemaLocation}</dd>
                </div>
              )}

              {booking.auditorium && (
                <div>
                  <dt>Auditorium:</dt>
                  <dd>{booking.auditorium}</dd>
                </div>
              )}

              <div>
                <dt>Seats:</dt>
                <dd>
                  {booking.seats?.length
                    ? booking.seats.join(", ")
                    : "No seats selected"}
                </dd>
              </div>
            </dl>

            {foodItems.length > 0 && (
              <div className="checkout-food-summary">
                <h2>Food Add-ons</h2>

                <div className="checkout-food-list">
                  {foodItems.map((item) => (
                    <div key={item.id}>
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <strong>
                        {formatNpr(
                          item.price * item.quantity,
                        )}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="checkout-totals">
              <div>
                <span>Seats</span>
                <strong>{formatNpr(seatTotal)}</strong>
              </div>

              <div>
                <span>Food</span>
                <strong>{formatNpr(foodTotal)}</strong>
              </div>

              <div className="checkout-totals__grand">
                <span>Total Amount:</span>
                <strong>
                  {formatNpr(totalAmount)}
                </strong>
              </div>
            </div>

            <p className="checkout-terms">
              By placing your order, you agree to our
              company Privacy Policy and Conditions of Use.
            </p>

            <button
              type="button"
              className="checkout-primary-button"
              disabled={!paymentMethod}
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>

          <div className="checkout-payment">
            <h2>Payment Method</h2>

            <label
              className={`payment-option ${
                paymentMethod === "esewa"
                  ? "payment-option--selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value="esewa"
                checked={paymentMethod === "esewa"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              <span className="payment-option__radio" />

              <span className="payment-option__name">
                eSewa
              </span>

              <span className="payment-option__logo">
                <span>e</span>Sewa
              </span>
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}