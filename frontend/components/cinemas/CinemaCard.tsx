import Image from "next/image";
import type { Cinema } from "@/lib/api/cinetix";

type CinemaCardProps = {
  cinema: Cinema;
};

export default function CinemaCard({ cinema }: CinemaCardProps) {
  return (
    <article className="cinema-card">
      <div className="cinema-card__image-wrapper">
        <Image
          src={cinema.image}
          alt={cinema.name}
          fill
          sizes="(max-width: 700px) 100vw, 360px"
          className="cinema-card__image"
        />
      </div>

      <div className="cinema-card__content">
        <h2>{cinema.name}</h2>
        <p>
          {cinema.location}, {cinema.city}
        </p>
        <span>★ {cinema.rating}</span>
      </div>
    </article>
  );
}