"use client";

import {
  CalendarDays,
  Edit3,
  Film,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
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
  deleteAdminMovie,
  getAdminMovies,
  getMovieStatistics,
} from "@/lib/api/admin-movies.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Movie,
  MovieStatistics,
  MovieStatus,
} from "@/lib/api/movies.types";

const emptyStatistics:
  MovieStatistics = {
    total: 0,
    nowShowing: 0,
    comingSoon: 0,
    inactive: 0,
  };

function statusStyle(
  status: MovieStatus,
): string {
  if (
    status ===
    "now_showing"
  ) {
    return "bg-green-500/10 text-green-400";
  }

  if (
    status ===
    "coming_soon"
  ) {
    return "bg-amber-500/10 text-amber-400";
  }

  return "bg-white/5 text-white/45";
}

function statusLabel(
  status: MovieStatus,
): string {
  return status
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "No release date";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
}

export default function AdminMoviesPage() {
  const [
    movies,
    setMovies,
  ] =
    useState<Movie[]>([]);

  const [
    statistics,
    setStatistics,
  ] =
    useState<MovieStatistics>(
      emptyStatistics,
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState<
      MovieStatus | ""
    >("");

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

  async function loadMovies(
    refresh = false,
  ) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        moviePage,
        movieStatistics,
      ] =
        await Promise.all([
          getAdminMovies({
            page: 1,
            limit: 100,
          }),

          getMovieStatistics(),
        ]);

      setMovies(
        moviePage.items,
      );

      setStatistics(
        movieStatistics,
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load movies.",
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadMovies();
  }, []);

  const filteredMovies =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return movies.filter(
        (movie) => {
          const matchesSearch =
            !query ||
            movie.title
              .toLowerCase()
              .includes(query) ||
            movie.director
              .toLowerCase()
              .includes(query) ||
            movie.language
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            !status ||
            movie.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      movies,
      search,
      status,
    ]);

  async function handleDelete(
    movie: Movie,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${movie.title}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        movie.id,
      );

      setError("");

      await deleteAdminMovie(
        movie.id,
      );

      await loadMovies(true);
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "Unable to delete movie.",
        ),
      );
    } finally {
      setDeletingId("");
    }
  }

  const statisticCards = [
    {
      label: "Total Movies",
      value:
        statistics.total,
      icon: Film,
    },

    {
      label: "Now Showing",
      value:
        statistics.nowShowing,
      icon: Sparkles,
    },

    {
      label: "Coming Soon",
      value:
        statistics.comingSoon,
      icon: CalendarDays,
    },

    {
      label: "Inactive",
      value:
        statistics.inactive,
      icon: Film,
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            Catalogue management
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Movies
          </h1>

          <p className="mt-2 text-white/45">
            Add, edit, publish and
            remove movies from the
            CineTix catalogue.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={
              refreshing
            }
            onClick={() => {
              void loadMovies(
                true,
              );
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white/60 transition hover:bg-white/5 disabled:opacity-50"
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
            href="/admin/movies/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500"
          >
            <Plus size={18} />

            Add Movie
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
                key={card.label}
                className="rounded-2xl border border-white/10 bg-[#11141c] p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/40">
                      {card.label}
                    </p>

                    <p className="mt-2 text-3xl font-black">
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

      <section className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px_auto]">
          <label className="relative">
            <span className="sr-only">
              Search movies
            </span>

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search title, director or language"
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] py-3 pl-11 pr-4 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </label>

          <select
            value={status}
            onChange={(
              event,
            ) =>
              setStatus(
                event.target
                  .value as
                  | MovieStatus
                  | "",
              )
            }
            className="min-h-12 rounded-xl border border-white/10 bg-[#090b10] px-4 outline-none focus:border-red-500"
          >
            <option value="">
              All statuses
            </option>

            <option value="now_showing">
              Now showing
            </option>

            <option value="coming_soon">
              Coming soon
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <button
            type="button"
            disabled={
              !search &&
              !status
            }
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-bold text-white/55 transition hover:bg-white/5 disabled:opacity-35"
          >
            <X size={17} />

            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-white/40">
          {filteredMovies.length} of{" "}
          {movies.length} movies
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
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-12 text-center text-white/45">
          Loading movie catalogue...
        </div>
      ) : filteredMovies.length ===
        0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-12 text-center">
          <Film
            size={45}
            className="mx-auto text-white/20"
          />

          <h2 className="mt-4 text-xl font-black">
            No movies found
          </h2>

          <p className="mt-2 text-white/45">
            Add a movie or change your
            current filters.
          </p>

          <Link
            href="/admin/movies/new"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-5 font-bold hover:bg-red-500"
          >
            <Plus size={17} />

            Add Movie
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#11141c]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-white/35">
                <tr>
                  <th className="px-5 py-4">
                    Movie
                  </th>

                  <th className="px-5 py-4">
                    Language
                  </th>

                  <th className="px-5 py-4">
                    Release
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Featured
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMovies.map(
                  (movie) => (
                    <tr
                      key={movie.id}
                      className="border-t border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-64 items-center gap-4">
                          <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                            {movie.posterUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={
                                  movie.posterUrl
                                }
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Film
                                size={20}
                                className="text-white/20"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-black">
                              {
                                movie.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-white/40">
                              {
                                movie.director
                              }
                              {" · "}
                              {
                                movie.duration
                              }{" "}
                              min
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-white/60">
                        {
                          movie.language
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-white/50">
                        {formatDate(
                          movie.releaseDate,
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(
                            movie.status,
                          )}`}
                        >
                          {statusLabel(
                            movie.status,
                          )}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={
                            movie.featured
                              ? "text-amber-400"
                              : "text-white/30"
                          }
                        >
                          {movie.featured
                            ? "Yes"
                            : "No"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/movies/${movie.id}/edit`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/55 transition hover:bg-white/5 hover:text-white"
                            aria-label={`Edit ${movie.title}`}
                          >
                            <Edit3
                              size={17}
                            />
                          </Link>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              movie.id
                            }
                            onClick={() => {
                              void handleDelete(
                                movie,
                              );
                            }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 text-red-400 transition hover:bg-red-500/10 disabled:opacity-40"
                            aria-label={`Delete ${movie.title}`}
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}