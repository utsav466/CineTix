import Image from "next/image";
import Link from "next/link";
import { featuredMovie } from "@/lib/api/cinetix";

export default function Hero() {
  return (
    <section className="hero">
      <Image
        src={featuredMovie.backdrop ?? featuredMovie.poster}
        alt={`${featuredMovie.title} featured movie`}
        fill
        priority
        sizes="100vw"
        className="hero__image"
      />

      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">Featured Film</p>

        <h1>{featuredMovie.title}</h1>

        <p className="hero__meta">
          {featuredMovie.genre} | {featuredMovie.duration} |{" "}
          {featuredMovie.certification}
        </p>

        <Link
          href={`/movies/${featuredMovie.id}`}
          className="hero__button"
        >
          Book Now
        </Link>
      </div>
    </section>
  );
}