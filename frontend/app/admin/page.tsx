"use client";

import {
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  Film,
  RefreshCw,
  Ticket,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminDashboard,
} from "@/lib/api/dashboard.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  AdminDashboardData,
} from "@/lib/api/dashboard.types";

const emptyDashboard:
  AdminDashboardData = {
    metrics: {
      totalUsers: 0,
      totalMovies: 0,
      totalCinemas: 0,
      totalShowtimes: 0,
      totalBookings: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      totalRevenue: 0,
    },

    recentBookings: [],
  };

function bookingUser(
  user:
    AdminDashboardData["recentBookings"][number]["userId"],
): string {
  if (
    typeof user ===
    "string"
  ) {
    return "Customer";
  }

  return (
    user.name ||
    user.email ||
    "Customer"
  );
}

function bookingMovie(
  movie:
    AdminDashboardData["recentBookings"][number]["movieId"],
): string {
  if (
    typeof movie ===
    "string"
  ) {
    return "Movie";
  }

  return (
    movie.title ||
    "Movie"
  );
}

function statusClass(
  status: string,
): string {
  if (
    status === "confirmed"
  ) {
    return "bg-green-500/10 text-green-400";
  }

  if (
    status ===
      "payment_pending" ||
    status === "held"
  ) {
    return "bg-amber-500/10 text-amber-400";
  }

  if (
    status === "cancelled" ||
    status === "expired"
  ) {
    return "bg-red-500/10 text-red-400";
  }

  return "bg-white/5 text-white/45";
}

export default function AdminDashboardPage() {
  const [
    data,
    setData,
  ] =
    useState<AdminDashboardData>(
      emptyDashboard,
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadDashboard(
    refresh = false,
  ) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      setData(
        await getAdminDashboard(),
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load dashboard.",
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const metricCards = [
    {
      label: "Total Revenue",

      value: `NPR ${data.metrics.totalRevenue.toLocaleString(
        "en-US",
      )}`,

      helper:
        "Confirmed payments",

      icon: Banknote,

      emphasis: true,
    },
    {
      label: "Bookings",

      value:
        data.metrics.totalBookings.toLocaleString(
          "en-US",
        ),

      helper: `${data.metrics.confirmedBookings} confirmed`,

      icon: Ticket,
    },
    {
      label: "Customers",

      value:
        data.metrics.totalUsers.toLocaleString(
          "en-US",
        ),

      helper:
        "Registered users",

      icon: Users,
    },
    {
      label: "Movies",

      value:
        data.metrics.totalMovies.toLocaleString(
          "en-US",
        ),

      helper:
        "Catalogue size",

      icon: Film,
    },
    {
      label: "Cinemas",

      value:
        data.metrics.totalCinemas.toLocaleString(
          "en-US",
        ),

      helper:
        "Active locations",

      icon: Building2,
    },
    {
      label: "Showtimes",

      value:
        data.metrics.totalShowtimes.toLocaleString(
          "en-US",
        ),

      helper:
        "Scheduled shows",

      icon: CalendarDays,
    },
    {
      label:
        "Confirmed Bookings",

      value:
        data.metrics.confirmedBookings.toLocaleString(
          "en-US",
        ),

      helper:
        "Successfully paid",

      icon: CheckCircle2,
    },
    {
      label:
        "Pending Bookings",

      value:
        data.metrics.pendingBookings.toLocaleString(
          "en-US",
        ),

      helper:
        "Require attention",

      icon: Ticket,
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-white/45">
            Monitor CineTix performance
            and recent customer activity.
          </p>
        </div>

        <button
          type="button"
          disabled={
            refreshing
          }
          onClick={() => {
            void loadDashboard(
              true,
            );
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 px-4 font-bold text-white/65 transition hover:bg-white/5 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <article
                key={card.label}
                className={`rounded-2xl border p-6 ${
                  card.emphasis
                    ? "border-red-500/25 bg-gradient-to-br from-red-600/20 to-[#11141c]"
                    : "border-white/10 bg-[#11141c]"
                }`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-white/45">
                      {card.label}
                    </p>

                    <p className="mt-3 text-2xl font-black">
                      {loading
                        ? "—"
                        : card.value}
                    </p>

                    <p className="mt-2 text-xs text-white/35">
                      {card.helper}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Icon size={21} />
                  </div>
                </div>
              </article>
            );
          },
        )}
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#11141c]">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-black">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Latest customer booking
              activity.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-white/45">
            Loading bookings...
          </div>
        ) : data.recentBookings
            .length === 0 ? (
          <div className="p-10 text-center text-white/45">
            No recent bookings.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-white/35">
                <tr>
                  <th className="px-6 py-4">
                    Booking
                  </th>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Movie
                  </th>

                  <th className="px-6 py-4">
                    Amount
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.recentBookings.map(
                  (booking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-white/5"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-red-400">
                        {
                          booking.bookingCode
                        }
                      </td>

                      <td className="px-6 py-4">
                        {bookingUser(
                          booking.userId,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {bookingMovie(
                          booking.movieId,
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-semibold">
                        NPR{" "}
                        {booking.totalAmount.toLocaleString(
                          "en-US",
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass(
                            booking.status,
                          )}`}
                        >
                          {booking.status.replaceAll(
                            "_",
                            " ",
                          )}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-white/40">
                        {new Date(
                          booking.createdAt,
                        ).toLocaleString(
                          "en-US",
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}