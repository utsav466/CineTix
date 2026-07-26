"use client";

import Image from "next/image";
import {
  notFound,
  useParams,
  useRouter,
} from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAvailableCinemasForMovie,
  getAvailableDatesForMovie,
  getMovieById,
  getMovieShowtimesAtCinema,
} from "@/lib/api/cinetix";

type DateOption = {
  value: string;
  dayNumber: string;
  dayName: string;
  monthName: string;
};

function createDateOption(
  dateValue: string,
): DateOption {
  const date = new Date(
    `${dateValue}T00:00:00`,
  );

  return {
    value: dateValue,

    dayNumber: new Intl.DateTimeFormat(
      "en-US",
      {
        day: "2-digit",
      },
    ).format(date),

    dayName: new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
      },
    ).format(date),

    monthName: new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
      },
    ).format(date),
  };
}

export default function MovieDetailsPage() {
  const params = useParams<{
    movieId: string;
  }>();

  const router = useRouter();

  const movie = getMovieById(
    params.movieId,
  );

  const dateOptions =
    useMemo<DateOption[]>(() => {
      if (!movie) {
        return [];
      }

      return getAvailableDatesForMovie(
        movie.id,
      ).map(createDateOption);
    }, [movie]);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState("");

  const [
    selectedCinemaId,
    setSelectedCinemaId,
  ] = useState("");

  const [
    selectedShowtimeId,
    setSelectedShowtimeId,
  ] = useState("");

  const availableCinemas = useMemo(
    () => {
      if (!movie || !selectedDate) {
        return [];
      }

      return getAvailableCinemasForMovie(
        movie.id,
        selectedDate,
      );
    },
    [movie, selectedDate],
  );

  const availableShowtimes = useMemo(
    () => {
      if (
        !movie ||
        !selectedDate ||
        !selectedCinemaId
      ) {
        return [];
      }

      return getMovieShowtimesAtCinema(
        movie.id,
        selectedCinemaId,
        selectedDate,
      );
    },
    [
      movie,
      selectedCinemaId,
      selectedDate,
    ],
  );

  useEffect(() => {
    if (dateOptions.length === 0) {
      setSelectedDate("");
      setSelectedCinemaId("");
      setSelectedShowtimeId("");
      return;
    }

    const dateStillExists =
      dateOptions.some(
        (date) =>
          date.value === selectedDate,
      );

    if (!dateStillExists) {
      setSelectedDate(
        dateOptions[0].value,
      );

      setSelectedCinemaId("");
      setSelectedShowtimeId("");
    }
  }, [dateOptions, selectedDate]);

  useEffect(() => {
    if (
      availableCinemas.length === 0
    ) {
      setSelectedCinemaId("");
      setSelectedShowtimeId("");
      return;
    }

    const cinemaStillExists =
      availableCinemas.some(
        (cinema) =>
          cinema.id ===
          selectedCinemaId,
      );

    if (!cinemaStillExists) {
      setSelectedCinemaId(
        availableCinemas[0].id,
      );

      setSelectedShowtimeId("");
    }
  }, [
    availableCinemas,
    selectedCinemaId,
  ]);

  if (!movie) {
    notFound();
  }

  const currentMovie = movie;

  const selectedCinema =
    availableCinemas.find(
      (cinema) =>
        cinema.id ===
        selectedCinemaId,
    );

  const selectedShowtime =
    availableShowtimes.find(
      (showtime) =>
        showtime.id ===
        selectedShowtimeId,
    );

  const canBookMovie =
    currentMovie.status ===
    "now-showing";

  function handleDateSelect(
    dateValue: string,
  ) {
    setSelectedDate(dateValue);
    setSelectedCinemaId("");
    setSelectedShowtimeId("");
  }

  function handleCinemaSelect(
    cinemaId: string,
  ) {
    setSelectedCinemaId(cinemaId);
    setSelectedShowtimeId("");
  }

  function handleNext() {
    if (
      !selectedDate ||
      !selectedCinema ||
      !selectedShowtime
    ) {
      return;
    }

    const bookingData = {
      movieId: currentMovie.id,
      movieTitle: currentMovie.title,
      moviePoster: currentMovie.poster,

      date: selectedDate,

      cinemaId: selectedCinema.id,
      cinemaName: selectedCinema.name,
      cinemaLocation: `${selectedCinema.location}, ${selectedCinema.city}`,

      showtimeId: selectedShowtime.id,
      startTime:
        selectedShowtime.startTime,
      endTime:
        selectedShowtime.endTime,
      price: selectedShowtime.price,
      auditorium:
        selectedShowtime.auditorium,
    };

    localStorage.setItem(
      "cinetix-booking",
      JSON.stringify(bookingData),
    );

    router.push(
      `/booking/${selectedShowtime.id}/seats`,
    );
  }

  return (
    <main className="movie-details-page">
      <section className="movie-details-layout">
        <div className="movie-details-poster">
          <Image
            src={currentMovie.poster}
            alt={`${currentMovie.title} movie poster`}
            width={500}
            height={715}
            priority
            sizes="(max-width: 760px) 90vw, 380px"
            className="movie-details-poster__image"
          />
        </div>

        <div className="movie-details-content">
          <div className="movie-details-intro">
            <p className="section-eyebrow">
              {currentMovie.status ===
              "coming-soon"
                ? "Coming Soon"
                : currentMovie.status ===
                    "recent"
                  ? "Recent Release"
                  : "Now Showing"}
            </p>

            <h1>
              {currentMovie.title}
            </h1>

            <p className="movie-details-meta">
              {currentMovie.genre} |{" "}
              {currentMovie.duration} |{" "}
              {currentMovie.language} |{" "}
              {
                currentMovie.certification
              }
            </p>

            <p className="movie-details-description">
              {
                currentMovie.description
              }
            </p>

            {currentMovie.director && (
              <p className="movie-details-credit">
                <strong>
                  Director:
                </strong>{" "}
                {
                  currentMovie.director
                }
              </p>
            )}

            {currentMovie.cast &&
              currentMovie.cast.length >
                0 && (
                <p className="movie-details-credit">
                  <strong>
                    Cast:
                  </strong>{" "}
                  {currentMovie.cast.join(
                    ", ",
                  )}
                </p>
              )}
          </div>

          {canBookMovie ? (
            <div className="movie-booking-panel">
              <div className="booking-group">
                <h2>Select Date</h2>

                {dateOptions.length >
                0 ? (
                  <div className="date-options">
                    {dateOptions.map(
                      (date) => {
                        const isSelected =
                          selectedDate ===
                          date.value;

                        return (
                          <button
                            key={
                              date.value
                            }
                            type="button"
                            className={`date-card ${
                              isSelected
                                ? "is-selected"
                                : ""
                            }`}
                            aria-pressed={
                              isSelected
                            }
                            onClick={() =>
                              handleDateSelect(
                                date.value,
                              )
                            }
                          >
                            <span className="date-card__month">
                              {
                                date.monthName
                              }
                            </span>

                            <span className="date-card__number">
                              {
                                date.dayNumber
                              }
                            </span>

                            <span className="date-card__day">
                              {
                                date.dayName
                              }
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <p className="no-showtimes">
                    No booking dates are
                    currently available.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="coming-soon-box">
              {currentMovie.status ===
              "coming-soon"
                ? "Booking will open closer to the release date."
                : "This movie is not currently available for booking."}
            </div>
          )}
        </div>
      </section>

      {canBookMovie && (
        <section className="movie-selection-section">
          <div className="booking-group">
            <h2>Cinema Hall</h2>

            {availableCinemas.length >
            0 ? (
              <div className="cinema-options">
                {availableCinemas.map(
                  (cinema) => {
                    const isSelected =
                      selectedCinemaId ===
                      cinema.id;

                    return (
                      <button
                        key={cinema.id}
                        type="button"
                        className={`cinema-option ${
                          isSelected
                            ? "is-selected"
                            : ""
                        }`}
                        aria-pressed={
                          isSelected
                        }
                        onClick={() =>
                          handleCinemaSelect(
                            cinema.id,
                          )
                        }
                      >
                        <strong>
                          {cinema.name}
                        </strong>

                        <span>
                          {
                            cinema.location
                          }
                          , {cinema.city}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            ) : (
              <p className="no-showtimes">
                No cinemas are available
                for the selected date.
              </p>
            )}
          </div>

          <div className="booking-group">
            <h2>
              Select Show Time
            </h2>

            {availableShowtimes.length >
            0 ? (
              <div className="showtime-options">
                {availableShowtimes.map(
                  (showtime) => {
                    const isSelected =
                      selectedShowtimeId ===
                      showtime.id;

                    return (
                      <button
                        key={showtime.id}
                        type="button"
                        className={`showtime-option ${
                          isSelected
                            ? "is-selected"
                            : ""
                        }`}
                        aria-pressed={
                          isSelected
                        }
                        onClick={() =>
                          setSelectedShowtimeId(
                            showtime.id,
                          )
                        }
                      >
                        {
                          showtime.startTime
                        }{" "}
                        –{" "}
                        {
                          showtime.endTime
                        }
                      </button>
                    );
                  },
                )}
              </div>
            ) : (
              <p className="no-showtimes">
                Select a cinema with an
                available showtime.
              </p>
            )}
          </div>

          <button
            type="button"
            className="movie-next-button"
            disabled={
              !selectedShowtime
            }
            onClick={handleNext}
          >
            Next
          </button>
        </section>
      )}
    </main>
  );
}