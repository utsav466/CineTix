"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CompletedBooking = {
  id?: string;
  movieId?: string;
  movieTitle?: string;
  moviePoster?: string;
  movieGenre?: string;
  movieDuration?: string;
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
  paymentMethod?: string;
  status?: string;
  bookedAt?: string;
};

function formatBookingDate(dateValue?: string) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
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

function createOrderNumber(bookingId: string) {
  const numbers = bookingId.replace(/\D/g, "");

  if (numbers.length >= 11) {
    return numbers.slice(-11);
  }

  return numbers.padEnd(11, "0");
}

function Barcode() {
  const bars = [
    2, 1, 3, 1, 2, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 2, 1,
    3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 4, 1, 1, 3, 2, 1, 4,
    2, 1, 2, 3, 1, 1, 4, 2, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1,
  ];

  return (
    <div className="ticket-barcode" aria-label="Booking barcode">
      {bars.map((width, index) => (
        <span
          key={`${width}-${index}`}
          style={{ width: `${width}px` }}
        />
      ))}
    </div>
  );
}

type TicketProps = {
  booking: CompletedBooking;
  bookingId: string;
};

function TicketCard({ booking, bookingId }: TicketProps) {
  const orderNumber = createOrderNumber(bookingId);

  const seatText =
    booking.seats && booking.seats.length > 0
      ? booking.seats.join(", ")
      : "No seats";

  return (
    <article className="success-ticket">
      <div className="success-ticket__main">
        <div className="success-ticket__movie">
          <div className="success-ticket__poster">
            {booking.moviePoster ? (
              <Image
                src={booking.moviePoster}
                alt={`${booking.movieTitle ?? "Movie"} poster`}
                width={92}
                height={132}
                className="success-ticket__poster-image"
              />
            ) : (
              <div className="success-ticket__poster-placeholder">
                🎬
              </div>
            )}
          </div>

          <div className="success-ticket__movie-info">
            <h2>{booking.movieTitle ?? "Movie"}</h2>

            <p>
              <span aria-hidden="true">◷</span>
              {booking.movieDuration ?? "Duration unavailable"}
            </p>

            <p>
              <span aria-hidden="true">▣</span>
              {booking.movieGenre ?? "Movie"}
            </p>
          </div>
        </div>

        <div className="success-ticket__schedule">
          <div className="success-ticket__info-block">
            <span className="success-ticket__info-icon">▦</span>

            <div>
              <strong>{booking.startTime ?? "Time unavailable"}</strong>
              <span>{formatBookingDate(booking.date)}</span>
            </div>
          </div>

          <div className="success-ticket__info-block">
            <span className="success-ticket__info-icon">▰</span>

            <div>
              <strong>{booking.auditorium ?? "Cinema Hall"}</strong>
              <span>Seat {seatText}</span>
            </div>
          </div>
        </div>

        <div className="success-ticket__divider" />

        <div className="success-ticket__details">
          <div className="success-ticket__detail-row">
            <span className="success-ticket__detail-icon">◉</span>
            <strong>{formatNpr(booking.totalAmount ?? 0)}</strong>
          </div>

          <div className="success-ticket__detail-row">
            <span className="success-ticket__detail-icon">⌖</span>

            <div>
              <strong>{booking.cinemaName ?? "Cinema"}</strong>
              <span>
                {booking.cinemaLocation ?? "Location unavailable"}
              </span>
            </div>
          </div>

          <div className="success-ticket__detail-row">
            <span className="success-ticket__detail-icon">▤</span>

            <span>
              Show this QR code to the ticket counter to receive your ticket
            </span>
          </div>
        </div>
      </div>

      <div className="success-ticket__tear-line">
        <span />
        <span />
      </div>

      <div className="success-ticket__barcode-area">
        <Barcode />

        <p>Order ID: {orderNumber}</p>
      </div>
    </article>
  );
}

export default function BookingSuccessPage() {
  const params = useParams<{
    bookingId: string;
  }>();

  const router = useRouter();

  const [booking, setBooking] = useState<CompletedBooking | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  const bookingId = params.bookingId;

  useEffect(() => {
    try {
      const completedBooking = localStorage.getItem(
        "cinetix-completed-booking",
      );

      if (!completedBooking) {
        setBooking(null);
        return;
      }

      const parsedBooking = JSON.parse(
        completedBooking,
      ) as CompletedBooking;

      setBooking(parsedBooking);
    } catch (error) {
      console.error("Unable to load completed booking:", error);
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const displayedBooking = useMemo<CompletedBooking | null>(() => {
    if (!booking) {
      return null;
    }

    return {
      ...booking,
      id: booking.id ?? bookingId,
    };
  }, [booking, bookingId]);

  function handleBackHome() {
    localStorage.removeItem("cinetix-booking");
    router.push("/");
  }

  if (isLoading) {
    return (
      <main className="booking-success-page">
        <div className="booking-success-message">
          Preparing your tickets…
        </div>
      </main>
    );
  }

  if (!displayedBooking) {
    return (
      <main className="booking-success-page">
        <div className="booking-success-empty">
          <h1>Booking not found</h1>

          <p>
            We could not find the completed booking for this ticket.
          </p>

          <button
            type="button"
            className="booking-success-home-button"
            onClick={() => router.push("/")}
          >
            Back to Home Page
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-success-page">
      <section className="booking-success-container">
        <div className="booking-success-progress">
          <div className="booking-success-progress__step">
            <span className="booking-success-progress__circle">
              1
            </span>
            <span>cart</span>
          </div>

          <div className="booking-success-progress__line" />

          <div className="booking-success-progress__step">
            <span className="booking-success-progress__circle booking-success-progress__circle--active">
              2
            </span>
            <span>checkout</span>
          </div>
        </div>

        <div className="booking-success-heading">
          <p className="section-eyebrow">Booking Confirmed</p>
          <h1>Your tickets are ready</h1>
        </div>

        <div className="booking-success-tickets">
          <TicketCard
            booking={displayedBooking}
            bookingId={bookingId}
          />

          <TicketCard
            booking={displayedBooking}
            bookingId={bookingId}
          />
        </div>

        <button
          type="button"
          className="booking-success-home-button"
          onClick={handleBackHome}
        >
          Back to Home Page
        </button>
      </section>
    </main>
  );
}
