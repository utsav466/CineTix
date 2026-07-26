import { Request, Response } from "express";
import { MovieModel } from "../models/movie.model";
import { CinemaModel } from "../models/cinema.model";
import { ShowtimeModel } from "../models/showtime.model";

const TIMES = [
  "10:00 AM",
  "1:15 PM",
  "4:30 PM",
  "7:45 PM",
];

const HALLS = [
  "Hall 1",
  "Hall 2",
];

function generateSeats() {
  const seats = [];

  const rows = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
  ];

  for (const row of rows) {
    for (let i = 1; i <= 12; i++) {
      seats.push({
        seatNumber: `${row}${i}`,
        status: "available",
      });
    }
  }

  return seats;
}

export async function seedShowtimes(
  _: Request,
  res: Response
) {
  try {
    await ShowtimeModel.deleteMany({});

    const movies = await MovieModel.find({
      status: "now_showing",
    });

    const cinemas = await CinemaModel.find();

    if (!movies.length) {
      return res.status(400).json({
        success: false,
        message: "No movies found. Seed movies first.",
      });
    }

    if (!cinemas.length) {
      return res.status(400).json({
        success: false,
        message: "No cinemas found. Seed cinemas first.",
      });
    }

    const showtimes = [];

    const today = new Date();

    for (const movie of movies) {
      for (const cinema of cinemas) {
        for (const hall of HALLS) {
          for (const time of TIMES) {
            showtimes.push({
              movieId: movie._id,
              cinemaId: cinema._id,
              hall,
              date: today,
              time,
              language: movie.language,
              price:
                movie.language === "Hindi"
                  ? 450
                  : 500,
              seats: generateSeats(),
            });
          }
        }
      }
    }

    const inserted =
      await ShowtimeModel.insertMany(showtimes);

    return res.json({
      success: true,
      message: `${inserted.length} showtimes created successfully.`,
      count: inserted.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}