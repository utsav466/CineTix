"use client";

import {
  Banknote,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Ticket,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AdminSalesReport,
  getAdminSalesReport,
  ReportRange,
} from "@/lib/api/admin-reports.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

const emptyReport:
  AdminSalesReport = {
    range: "30d",
    currency: "NPR",
    revenue: 0,
    bookings: 0,
    confirmed: 0,
    cancelled: 0,
    daily: [],
    topMovies: [],
  };

function formatCurrency(
  value: number,
): string {
  return `NPR ${value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    },
  )}`;
}

function formatDay(
  value: string,
): string {
  const date =
    new Date(
      `${value}T00:00:00`,
    );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
}

export default function AdminReportsPage() {
  const [
    range,
    setRange,
  ] =
    useState<ReportRange>(
      "30d",
    );

  const [
    report,
    setReport,
  ] =
    useState<AdminSalesReport>(
      emptyReport,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function loadReport(
    selectedRange:
      ReportRange,
    refresh = false,
  ) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      setReport(
        await getAdminSalesReport(
          selectedRange,
        ),
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load sales report.",
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadReport(
      range,
    );
  }, [range]);

  const maximumDailyRevenue =
    useMemo(
      () =>
        Math.max(
          1,
          ...report.daily.map(
            (item) =>
              item.revenue,
          ),
        ),
      [report.daily],
    );

  const summaryCards = [
    {
      label: "Revenue",
      value:
        formatCurrency(
          report.revenue,
        ),
      icon: Banknote,
    },

    {
      label: "Bookings",
      value:
        report.bookings.toLocaleString(
          "en-US",
        ),
      icon: Ticket,
    },

    {
      label: "Confirmed",
      value:
        report.confirmed.toLocaleString(
          "en-US",
        ),
      icon: CheckCircle2,
    },

    {
      label: "Cancelled",
      value:
        report.cancelled.toLocaleString(
          "en-US",
        ),
      icon: XCircle,
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            Analytics
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Sales Reports
          </h1>

          <p className="mt-2 text-white/45">
            Review revenue, bookings,
            cancellations and top-performing
            movies.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={range}
            onChange={(
              event,
            ) =>
              setRange(
                event.target
                  .value as ReportRange,
              )
            }
            className="min-h-11 rounded-xl border border-white/10 bg-[#11141c] px-4 font-semibold outline-none focus:border-red-500"
          >
            <option value="7d">
              Last 7 days
            </option>

            <option value="30d">
              Last 30 days
            </option>

            <option value="90d">
              Last 90 days
            </option>
          </select>

          <button
            type="button"
            disabled={
              refreshing
            }
            onClick={() => {
              void loadReport(
                range,
                true,
              );
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white/60 hover:bg-white/5 disabled:opacity-50"
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
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
        >
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <article
                key={card.label}
                className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/40">
                      {card.label}
                    </p>

                    <p className="mt-3 text-2xl font-black">
                      {loading
                        ? "—"
                        : card.value}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Icon
                      size={21}
                    />
                  </span>
                </div>
              </article>
            );
          },
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
          <div className="flex items-center gap-3">
            <BarChart3
              size={21}
              className="text-red-400"
            />

            <div>
              <h2 className="text-xl font-black">
                Daily Revenue
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Paid booking revenue by day.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 h-72 animate-pulse rounded-xl bg-white/5" />
          ) : report.daily.length ===
            0 ? (
            <div className="mt-8 flex h-72 items-center justify-center rounded-xl border border-dashed border-white/10 text-white/40">
              No report data available.
            </div>
          ) : (
            <>
              <div className="mt-8 flex h-72 items-end gap-2 overflow-x-auto border-b border-white/10 pb-1">
                {report.daily.map(
                  (item) => {
                    const percentage =
                      item.revenue ===
                      0
                        ? 2
                        : Math.max(
                            5,
                            (
                              item.revenue /
                              maximumDailyRevenue
                            ) *
                              100,
                          );

                    return (
                      <div
                        key={item.date}
                        className="group flex min-w-8 flex-1 flex-col items-center justify-end"
                      >
                        <div className="pointer-events-none mb-2 hidden whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs shadow-xl group-hover:block">
                          {formatCurrency(
                            item.revenue,
                          )}
                          {" · "}
                          {item.bookings} bookings
                        </div>

                        <div
                          className="w-full min-w-6 rounded-t-md bg-red-600 transition hover:bg-red-500"
                          style={{
                            height:
                              `${percentage}%`,
                          }}
                        />

                        <span className="mt-2 hidden text-[10px] text-white/35 md:block">
                          {formatDay(
                            item.date,
                          )}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-white/35">
                    <tr>
                      <th className="pb-3">
                        Date
                      </th>

                      <th className="pb-3">
                        Bookings
                      </th>

                      <th className="pb-3">
                        Confirmed
                      </th>

                      <th className="pb-3 text-right">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.daily
                      .filter(
                        (item) =>
                          item.bookings >
                            0 ||
                          item.revenue >
                            0,
                      )
                      .slice(-10)
                      .reverse()
                      .map(
                        (item) => (
                          <tr
                            key={
                              item.date
                            }
                            className="border-t border-white/5"
                          >
                            <td className="py-3 text-white/60">
                              {new Date(
                                `${item.date}T00:00:00`,
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </td>

                            <td className="py-3">
                              {
                                item.bookings
                              }
                            </td>

                            <td className="py-3">
                              {
                                item.confirmed
                              }
                            </td>

                            <td className="py-3 text-right font-bold">
                              {formatCurrency(
                                item.revenue,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
          <h2 className="text-xl font-black">
            Top Movies
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Ranked by paid revenue.
          </p>

          {loading ? (
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-white/5"
                  />
                ),
              )}
            </div>
          ) : report.topMovies
              .length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-white/10 px-5 py-10 text-center text-white/40">
              No paid movie bookings in
              this period.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {report.topMovies.map(
                (
                  movie,
                  index,
                ) => (
                  <article
                    key={
                      movie.title
                    }
                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-sm font-black text-red-400">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">
                        {
                          movie.title
                        }
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {
                          movie.bookings
                        }{" "}
                        paid bookings
                      </p>
                    </div>

                    <p className="whitespace-nowrap text-sm font-black">
                      {formatCurrency(
                        movie.revenue,
                      )}
                    </p>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}