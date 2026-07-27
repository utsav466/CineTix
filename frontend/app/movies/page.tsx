"use client";

import {
  Film,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CustomerHeader from "@/components/layout/CustomerHeader";

import CustomerMovieCard from "@/components/movies/CustomerMovieCard";

import {
  getCustomerMovies,
} from "@/lib/api/customer.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  CustomerMovie,
} from "@/lib/api/customer.types";

const statusOptions = [
  {
    value: "all",
    label: "All Movies",
  },
  {
    value: "now_showing",
    label: "Now Showing",
  },
  {
    value: "coming_soon",
    label: "Coming Soon",
  },
];

export default function MoviesPage() {
  const [
    movies,
    setMovies,
  ] =
    useState<CustomerMovie[]>(
      [],
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
    useState("all");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getCustomerMovies({
            limit: 100,
          });

        setMovies(result);
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load movies.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

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
              .includes(
                query,
              ) ||
            movie.language
              ?.toLowerCase()
              .includes(
                query,
              ) ||
            (
              Array.isArray(
                movie.genre,
              ) &&
              movie.genre.some(
                (genre) =>
                  genre
                    .toLowerCase()
                    .includes(
                      query,
                    ),
              )
            );

          const matchesStatus =
            status === "all" ||
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

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <CustomerHeader />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_38%)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
            CineTix catalogue
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Movies
          </h1>

          <p className="mt-3 max-w-2xl text-white/50">
            Explore movies, compare
            showtimes and choose the
            cinema experience that
            works for you.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block max-w-2xl">
              <span className="sr-only">
                Search movies
              </span>

              <Search
                size={19}
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
                placeholder="Search by title, language or genre"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-[#11141c] py-3 pl-12 pr-12 outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 hover:bg-white/5 hover:text-white"
                  aria-label="Clear search"
                >
                  <X
                    size={17}
                  />
                </button>
              )}
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {statusOptions.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      setStatus(
                        option.value,
                      )
                    }
                    className={`min-h-11 whitespace-nowrap rounded-xl px-4 text-sm font-bold transition ${
                      status ===
                      option.value
                        ? "bg-red-600 text-white"
                        : "border border-white/10 bg-[#11141c] text-white/55 hover:bg-white/10"
                    }`}
                  >
                    {
                      option.label
                    }
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-white/45">
          {loading
            ? "Loading movies..."
            : `${filteredMovies.length} movie${
                filteredMovies.length ===
                1
                  ? ""
                  : "s"
              } found`}
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] animate-pulse rounded-2xl bg-white/5"
                />
              ),
            )}
          </div>
        ) : filteredMovies.length ===
          0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] px-6 py-16 text-center">
            <Film
              size={44}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-4 text-xl font-black">
              No movies found
            </h2>

            <p className="mt-2 text-white/45">
              Try another search term
              or filter.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMovies.map(
              (movie) => (
                <CustomerMovieCard
                  key={
                    movie.id
                  }
                  movie={
                    movie
                  }
                />
              ),
            )}
          </div>
        )}
      </section>
    </main>
  );
}