"use client";

import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";

import Link from "next/link";

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

import type {
  CustomerMovie,
} from "@/lib/api/customer.types";

export default function HomePage() {
  const [
    movies,
    setMovies,
  ] =
    useState<CustomerMovie[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const result =
          await getCustomerMovies({
            limit: 8,
          });

        setMovies(result);
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    void loadMovies();
  }, []);

  const featured =
    useMemo(
      () =>
        movies.find(
          (movie) =>
            movie.status ===
            "now_showing",
        ) || movies[0],
      [movies],
    );

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <CustomerHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        {featured?.backdropUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              featured.backdropUrl
            }
            alt=""
            className="absolute inset-0 -z-30 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 -z-20 bg-[#07080c]/50" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07080c] via-[#07080c]/90 to-[#07080c]/30" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#07080c] via-transparent to-transparent" />

        <div className="mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300">
              <Sparkles
                size={16}
              />

              Fast, simple and secure
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] md:text-7xl">
              Your next cinema
              experience starts

              <span className="text-red-500">
                {" "}
                here.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              Browse current movies,
              compare showtimes, select
              your exact seats, add
              snacks and pay securely
              with Khalti.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={
                  featured
                    ? `/movies/${featured.id}`
                    : "/movies"
                }
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold shadow-xl shadow-red-600/20 transition hover:bg-red-500"
              >
                <Ticket size={19} />

                Book Tickets
              </Link>

              <Link
                href="/movies"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold transition hover:bg-white/10"
              >
                Explore Movies

                <ArrowRight
                  size={18}
                />
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                "Live seat availability",
                "Secure Khalti payment",
                "Instant digital ticket",
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-white/50"
                  >
                    <ShieldCheck
                      size={17}
                      className="text-green-400"
                    />

                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
              Now showing
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Popular this week
            </h2>

            <p className="mt-2 text-white/45">
              Choose a movie to compare
              cinemas and showtimes.
            </p>
          </div>

          <Link
            href="/movies"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-white/10 px-4 py-2.5 font-bold text-white/70 hover:bg-white/5 sm:self-auto"
          >
            View all

            <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] animate-pulse rounded-2xl bg-white/5"
                />
              ),
            )}
          </div>
        ) : movies.length ===
          0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center text-white/45">
            No movies are currently
            available. Add movies from
            the admin dashboard.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {movies
              .slice(0, 8)
              .map(
                (movie) => (
                  <CustomerMovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ),
              )}
          </div>
        )}
      </section>
    </main>
  );
}