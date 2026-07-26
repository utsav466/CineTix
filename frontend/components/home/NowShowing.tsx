import MovieCard from "@/components/movies/MovieCard";
import { nowShowingMovies } from "@/lib/api/cinetix";

export default function NowShowing() {
  return (
    <section className="movie-section">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">In Cinemas</p>
          <h2>Now Showing</h2>
        </div>

        <p>{nowShowingMovies.length} movies available</p>
      </div>

      <div className="movie-grid">
        {nowShowingMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}