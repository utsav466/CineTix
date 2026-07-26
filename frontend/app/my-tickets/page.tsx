"use client";

import { useEffect, useState } from "react";

type TicketBooking = {
  id?: string;
  movieTitle?: string;
  moviePoster?: string;
  date?: string;
  cinemaName?: string;
  cinemaLocation?: string;
  startTime?: string;
  endTime?: string;
  auditorium?: string;
  seats?: string[];
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

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedTickets = localStorage.getItem(
        "cinetix-ticket-history",
      );

      const latestCompletedBooking = localStorage.getItem(
        "cinetix-completed-booking",
      );

      const parsedTickets: TicketBooking[] = savedTickets
        ? JSON.parse(savedTickets)
        : [];

      if (latestCompletedBooking) {
        const latestTicket = JSON.parse(
          latestCompletedBooking,
        ) as TicketBooking;

        const alreadyExists = parsedTickets.some(
          (ticket) => ticket.id === latestTicket.id,
        );

        if (!alreadyExists) {
          parsedTickets.unshift(latestTicket);

          localStorage.setItem(
            "cinetix-ticket-history",
            JSON.stringify(parsedTickets),
          );
        }
      }

      setTickets(parsedTickets);
    } catch (error) {
      console.error("Unable to load tickets:", error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <main className="my-tickets-page">
        <div className="my-tickets-message">
          Loading your tickets…
        </div>
      </main>
    );
  }

  return (
    <main className="my-tickets-page">
      <section className="my-tickets-container">
        <div className="my-tickets-heading">
          <p className="section-eyebrow">Your Bookings</p>
          <h1>My Tickets</h1>
        </div>

        {tickets.length > 0 ? (
          <div className="my-tickets-grid">
            {tickets.map((ticket, index) => (
              <article
                key={ticket.id ?? `${ticket.movieTitle}-${index}`}
                className="my-ticket-card"
              >
                <div className="my-ticket-card__top">
                  <div>
                    <p className="my-ticket-card__eyebrow">
                      Confirmed Ticket
                    </p>

                    <h2>{ticket.movieTitle ?? "Movie"}</h2>
                  </div>

                  <span className="my-ticket-card__status">
                    {ticket.status ?? "Confirmed"}
                  </span>
                </div>

                <div className="my-ticket-card__details">
                  <div>
                    <span>Cinema</span>
                    <strong>
                      {ticket.cinemaName ?? "Cinema unavailable"}
                    </strong>
                  </div>

                  <div>
                    <span>Date & Time</span>
                    <strong>
                      {formatBookingDate(ticket.date)}
                      {ticket.startTime
                        ? ` • ${ticket.startTime}`
                        : ""}
                    </strong>
                  </div>

                  <div>
                    <span>Auditorium</span>
                    <strong>
                      {ticket.auditorium ?? "Hall unavailable"}
                    </strong>
                  </div>

                  <div>
                    <span>Seats</span>
                    <strong>
                      {ticket.seats?.length
                        ? ticket.seats.join(", ")
                        : "No seats"}
                    </strong>
                  </div>
                </div>

                {ticket.cinemaLocation && (
                  <p className="my-ticket-card__location">
                    📍 {ticket.cinemaLocation}
                  </p>
                )}

                <div className="my-ticket-card__footer">
                  <div>
                    <span>Total</span>
                    <strong>
                      {formatNpr(ticket.totalAmount ?? 0)}
                    </strong>
                  </div>

                  <div>
                    <span>Order</span>
                    <strong>{ticket.id ?? "CINETIX"}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="my-tickets-empty">
            <div className="my-tickets-empty__icon">
              🎟
            </div>

            <h2>No tickets yet</h2>

            <p>
              Your confirmed movie bookings will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}