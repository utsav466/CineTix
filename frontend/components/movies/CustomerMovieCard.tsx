import {
  Clock3,
  Languages,
  Star,
} from "lucide-react";

import Link from "next/link";

import type {
  CustomerMovie,
} from "@/lib/api/customer.types";

function genreLabel(
  genre:
    | string[]
    | string
    | undefined,
): string {
  if (Array.isArray(genre)) {
    return genre
      .slice(0, 3)
      .join(" • ");
  }

  return genre || "Cinema";
}

export default function CustomerMovieCard({
  movie,
}: {
  movie: CustomerMovie;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#11141c] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/30">
      <Link
        href={`/movies/${movie.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
          {movie.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-5 text-center text-white/25">
              Poster unavailable
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
              movie.status ===
              "now_showing"
                ? "bg-red-600 text-white"
                : "bg-black/70 text-white/80 backdrop-blur"
            }`}
          >
            {movie.status ===
            "now_showing"
              ? "Now Showing"
              : "Coming Soon"}
          </span>
        </div>

        <div className="p-5">
          <h2 className="line-clamp-1 text-lg font-black">
            {movie.title}
          </h2>

          <p className="mt-2 line-clamp-1 text-sm text-white/45">
            {genreLabel(
              movie.genre,
            )}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {movie.duration}m
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Languages
                size={14}
              />

              {movie.language ||
                "—"}
            </span>

            <span className="inline-flex items-center justify-end gap-1.5">
              <Star
                size={14}
                className="text-amber-400"
              />

              {movie.rating ||
                "NR"}
            </span>
          </div>

          <div className="mt-5 flex min-h-11 items-center justify-center rounded-xl bg-white/5 font-bold text-white/75 transition group-hover:bg-red-600 group-hover:text-white">
            View Showtimes
          </div>
        </div>
      </Link>
    </article>
  );
}