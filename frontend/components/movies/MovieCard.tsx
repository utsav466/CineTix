import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/lib/api";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="movie-card"
      aria-label={`View ${movie.title}`}
    >
      <div className="movie-card__image-wrapper">
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 280px"
          className="movie-card__image"
        />

        <span
          className={`movie-card__status movie-card__status--${movie.status}`}
        >
          {movie.status === "now-showing" && "Now Showing"}
          {movie.status === "coming-soon" && "Coming Soon"}
          {movie.status === "recent" && "Recent"}
        </span>
      </div>

      <div className="movie-card__content">
        <h3>{movie.title}</h3>

        <p className="movie-card__genre">{movie.genre}</p>

        <div className="movie-card__details">
          <span>{movie.duration}</span>
          <span>{movie.language}</span>
          <span>{movie.certification}</span>
        </div>
      </div>
    </Link>
  );
}