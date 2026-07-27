import MovieCard from "@/components/movies/MovieCard";
import { comingSoonMovies } from "@/lib/api";

export default function ComingSoon() {
  if (comingSoonMovies.length === 0) {
    return null;
  }

  return (
    <section className="movie-section">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Upcoming Releases</p>
          <h2>Coming Soon</h2>
        </div>

        <p>{comingSoonMovies.length} upcoming movie</p>
      </div>

      <div className="movie-grid">
        {comingSoonMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}