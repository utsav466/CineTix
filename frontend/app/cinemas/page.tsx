import CinemaCard from "@/components/cinemas/CinemaCard";
import { cinemas } from "@/lib/api/cinetix";

export default function CinemasPage() {
  return (
    <main className="cinemas-page">
      <section className="movie-section">
        <div className="page-heading">
          <p className="section-eyebrow">Explore</p>
          <h1>Cinemas</h1>
          <p className="muted">
            Choose a cinema near you and discover available shows.
          </p>
        </div>

        <div className="cinema-grid">
          {cinemas.map((cinema) => (
            <CinemaCard key={cinema.id} cinema={cinema} />
          ))}
        </div>
      </section>
    </main>
  );
}