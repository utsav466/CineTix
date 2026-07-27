"use client";

import {
  Armchair,
  Building2,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteScreen,
  getCinemas,
  getScreens,
} from "@/lib/api/cinemas.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Cinema,
  Screen,
} from "@/lib/api/cinemas.types";

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

type CinemaInformation = {
  id: string;
  name: string;
  city: string;
  address: string;
};

function getCinemaInformation(
  screen: Screen,
  cinemas: Cinema[],
): CinemaInformation {
  if (
    typeof screen.cinemaId !==
    "string"
  ) {
    return {
      id:
        screen.cinemaId.id ||
        screen.cinemaId._id ||
        "",

      name:
        screen.cinemaId.name ||
        "Unknown cinema",

      city:
        screen.cinemaId.city ||
        "",

      address:
        screen.cinemaId.address ||
        "",
    };
  }

  const cinema =
    cinemas.find(
      (item) =>
        item.id ===
        screen.cinemaId,
    );

  return {
    id:
      screen.cinemaId,

    name:
      cinema?.name ||
      "Unknown cinema",

    city:
      cinema?.city ||
      "",

    address:
      cinema?.address ||
      "",
  };
}

function statusClass(
  isActive: boolean,
): string {
  return isActive
    ? "bg-green-500/10 text-green-400"
    : "bg-white/5 text-white/40";
}

export default function AdminHallsPage() {
  const [
    halls,
    setHalls,
  ] =
    useState<Screen[]>([]);

  const [
    cinemas,
    setCinemas,
  ] =
    useState<Cinema[]>([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    selectedCinema,
    setSelectedCinema,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "all",
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
    deletingId,
    setDeletingId,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  async function loadData(
    refresh = false,
  ): Promise<void> {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        cinemaResult,
        hallResult,
      ] =
        await Promise.all([
          getCinemas(),
          getScreens(),
        ]);

      setCinemas(
        cinemaResult,
      );

      setHalls(
        hallResult,
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load cinema halls.",
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredHalls =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return halls.filter(
        (hall) => {
          const cinema =
            getCinemaInformation(
              hall,
              cinemas,
            );

          const matchesSearch =
            !query ||
            hall.name
              .toLowerCase()
              .includes(query) ||
            cinema.name
              .toLowerCase()
              .includes(query) ||
            cinema.city
              .toLowerCase()
              .includes(query);

          const matchesCinema =
            !selectedCinema ||
            cinema.id ===
              selectedCinema;

          const matchesStatus =
            statusFilter ===
              "all" ||
            (
              statusFilter ===
                "active" &&
              hall.isActive
            ) ||
            (
              statusFilter ===
                "inactive" &&
              !hall.isActive
            );

          return (
            matchesSearch &&
            matchesCinema &&
            matchesStatus
          );
        },
      );
    }, [
      halls,
      cinemas,
      search,
      selectedCinema,
      statusFilter,
    ]);

  const totalCapacity =
    useMemo(
      () =>
        halls.reduce(
          (
            total,
            hall,
          ) =>
            total +
            Number(
              hall.capacity ||
              0,
            ),
          0,
        ),
      [halls],
    );

  const activeHalls =
    useMemo(
      () =>
        halls.filter(
          (hall) =>
            hall.isActive,
        ).length,
      [halls],
    );

  const representedCinemas =
    useMemo(() => {
      const cinemaIds =
        new Set<string>();

      halls.forEach(
        (hall) => {
          const cinema =
            getCinemaInformation(
              hall,
              cinemas,
            );

          if (cinema.id) {
            cinemaIds.add(
              cinema.id,
            );
          }
        },
      );

      return cinemaIds.size;
    }, [
      halls,
      cinemas,
    ]);

  async function handleDelete(
    hall: Screen,
  ): Promise<void> {
    const confirmed =
      window.confirm(
        `Delete "${hall.name}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        hall.id,
      );

      setError("");

      await deleteScreen(
        hall.id,
      );

      setHalls(
        (currentHalls) =>
          currentHalls.filter(
            (item) =>
              item.id !==
              hall.id,
          ),
      );
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "Unable to delete hall.",
        ),
      );
    } finally {
      setDeletingId("");
    }
  }

  function clearFilters() {
    setSearch("");
    setSelectedCinema("");
    setStatusFilter("all");
  }

  const hasFilters =
    Boolean(
      search ||
      selectedCinema ||
      statusFilter !==
        "all",
    );

  const statisticCards = [
    {
      label:
        "Total Halls",

      value:
        halls.length,

      helper:
        "Configured screens",

      icon:
        Armchair,
    },

    {
      label:
        "Active Halls",

      value:
        activeHalls,

      helper:
        "Available for showtimes",

      icon:
        Armchair,
    },

    {
      label:
        "Total Capacity",

      value:
        totalCapacity,

      helper:
        "Available seats",

      icon:
        Armchair,
    },

    {
      label:
        "Cinema Branches",

      value:
        representedCinemas,

      helper:
        "With configured halls",

      icon:
        Building2,
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            Venue management
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Halls &amp; Screens
          </h1>

          <p className="mt-2 max-w-2xl text-white/45">
            Configure cinema halls,
            seating capacity, seat
            categories and availability.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={
              refreshing
            }
            onClick={() => {
              void loadData(
                true,
              );
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white/60 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
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

          <Link
            href="/admin/halls/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500"
          >
            <Plus
              size={18}
            />

            Add Hall
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statisticCards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <article
                key={
                  card.label
                }
                className="rounded-2xl border border-white/10 bg-[#11141c] p-5"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-white/40">
                      {
                        card.label
                      }
                    </p>

                    <p className="mt-3 text-3xl font-black">
                      {loading
                        ? "—"
                        : card.value.toLocaleString(
                            "en-US",
                          )}
                    </p>

                    <p className="mt-2 text-xs text-white/35">
                      {
                        card.helper
                      }
                    </p>
                  </div>

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
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

      <section className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px_220px_auto]">
          <label className="relative">
            <span className="sr-only">
              Search halls
            </span>

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search hall, cinema or city"
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </label>

          <label>
            <span className="sr-only">
              Filter by cinema
            </span>

            <select
              value={
                selectedCinema
              }
              onChange={(
                event,
              ) =>
                setSelectedCinema(
                  event.target.value,
                )
              }
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 text-white outline-none focus:border-red-500"
            >
              <option value="">
                All cinemas
              </option>

              {cinemas.map(
                (cinema) => (
                  <option
                    key={
                      cinema.id
                    }
                    value={
                      cinema.id
                    }
                  >
                    {
                      cinema.name
                    }
                    {" — "}
                    {
                      cinema.city
                    }
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span className="sr-only">
              Filter by status
            </span>

            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                )
              }
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 text-white outline-none focus:border-red-500"
            >
              <option value="all">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </label>

          <button
            type="button"
            disabled={
              !hasFilters
            }
            onClick={
              clearFilters
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white/55 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <X size={17} />

            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-white/40">
          {
            filteredHalls.length
          }{" "}
          of{" "}
          {
            halls.length
          }{" "}
          halls
        </p>
      </section>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-red-500" />

          <p className="mt-4 text-white/45">
            Loading halls...
          </p>
        </div>
      ) : filteredHalls.length ===
        0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] px-6 py-16 text-center">
          <Armchair
            size={48}
            className="mx-auto text-white/20"
          />

          <h2 className="mt-5 text-xl font-black">
            No halls found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
            Create a cinema hall or
            clear the current filters.
          </p>

          <Link
            href="/admin/halls/new"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-5 font-bold text-white hover:bg-red-500"
          >
            <Plus
              size={17}
            />

            Add Hall
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#11141c]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-white/35">
                <tr>
                  <th className="px-5 py-4">
                    Hall
                  </th>

                  <th className="px-5 py-4">
                    Cinema
                  </th>

                  <th className="px-5 py-4">
                    Layout
                  </th>

                  <th className="px-5 py-4">
                    Capacity
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHalls.map(
                  (hall) => {
                    const cinema =
                      getCinemaInformation(
                        hall,
                        cinemas,
                      );

                    const disabledSeats =
                      hall.seatLayout.filter(
                        (seat) =>
                          seat.isDisabled,
                      ).length;

                    return (
                      <tr
                        key={
                          hall.id
                        }
                        className="border-t border-white/5 transition hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-48 items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                              <Armchair
                                size={21}
                              />
                            </span>

                            <div>
                              <p className="font-black">
                                {
                                  hall.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                ID:{" "}
                                {
                                  hall.id
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {
                              cinema.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {
                              cinema.city ||
                              cinema.address ||
                              "No location"
                            }
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-white/60">
                          {
                            hall.rows
                          }{" "}
                          rows ×{" "}
                          {
                            hall.seatsPerRow
                          }{" "}
                          seats

                          {disabledSeats >
                            0 && (
                            <p className="mt-1 text-xs text-amber-400">
                              {
                                disabledSeats
                              }{" "}
                              disabled
                            </p>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="text-lg font-black">
                            {
                              hall.capacity
                            }
                          </span>

                          <span className="ml-2 text-xs text-white/35">
                            seats
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                              hall.isActive,
                            )}`}
                          >
                            {hall.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/halls/${hall.id}/edit`}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/55 transition hover:bg-white/5 hover:text-white"
                              aria-label={`Edit ${hall.name}`}
                            >
                              <Edit3
                                size={17}
                              />
                            </Link>

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                hall.id
                              }
                              onClick={() => {
                                void handleDelete(
                                  hall,
                                );
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Delete ${hall.name}`}
                            >
                              <Trash2
                                size={17}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}