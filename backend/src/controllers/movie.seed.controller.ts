import { Request, Response } from "express";
import { MovieModel } from "../models/movie.model";

export async function seedMovies(req: Request, res: Response) {
  try {
    await MovieModel.deleteMany({});

    const movies = [
      {
        title: "Superman",
        description:
          "Clark Kent embraces both his Kryptonian heritage and his life on Earth while protecting humanity from powerful new threats.",
        genre: ["Action", "Adventure", "Sci-Fi"],
        language: "English",
        duration: 129,
        releaseDate: new Date("2025-07-11"),
        rating: "PG-13",
        director: "James Gunn",
        cast: [
          "David Corenswet",
          "Rachel Brosnahan",
          "Nicholas Hoult",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example1",
        status: "now_showing",
      },

      {
        title: "The Fantastic Four: First Steps",
        description:
          "Marvel's first family begins a new journey while facing Galactus and the Silver Surfer.",
        genre: ["Action", "Adventure"],
        language: "English",
        duration: 126,
        releaseDate: new Date("2025-07-25"),
        rating: "PG-13",
        director: "Matt Shakman",
        cast: [
          "Pedro Pascal",
          "Vanessa Kirby",
          "Joseph Quinn",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example2",
        status: "now_showing",
      },

      {
        title: "Jurassic World: Rebirth",
        description:
          "Dinosaurs once again threaten humanity in a brand-new Jurassic adventure.",
        genre: ["Adventure", "Action"],
        language: "English",
        duration: 134,
        releaseDate: new Date("2025-07-02"),
        rating: "PG-13",
        director: "Gareth Edwards",
        cast: [
          "Scarlett Johansson",
          "Jonathan Bailey",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example3",
        status: "now_showing",
      },

      {
        title: "F1",
        description:
          "A retired Formula One driver returns to mentor an ambitious young racer.",
        genre: ["Drama", "Sports"],
        language: "English",
        duration: 156,
        releaseDate: new Date("2025-06-27"),
        rating: "PG-13",
        director: "Joseph Kosinski",
        cast: [
          "Brad Pitt",
          "Damson Idris",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example4",
        status: "now_showing",
      },

      {
        title: "How to Train Your Dragon",
        description:
          "A live-action retelling of the beloved fantasy adventure between Hiccup and Toothless.",
        genre: ["Adventure", "Fantasy"],
        language: "English",
        duration: 125,
        releaseDate: new Date("2025-06-13"),
        rating: "PG",
        director: "Dean DeBlois",
        cast: [
          "Mason Thames",
          "Nico Parker",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example5",
        status: "now_showing",
      },

      {
        title: "Saiyaara",
        description:
          "A romantic Bollywood drama about love, dreams, and overcoming life's challenges.",
        genre: ["Romance", "Drama"],
        language: "Hindi",
        duration: 150,
        releaseDate: new Date("2025-07-18"),
        rating: "UA",
        director: "Mohit Suri",
        cast: [
          "Ahaan Panday",
          "Aneet Padda",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example6",
        status: "now_showing",
      },

      {
        title: "Mahavatar Narsimha",
        description:
          "An animated mythological epic inspired by the Narasimha avatar of Lord Vishnu.",
        genre: ["Animation", "Mythology"],
        language: "Hindi",
        duration: 132,
        releaseDate: new Date("2025-07-25"),
        rating: "PG",
        director: "Ashwin Kumar",
        cast: [
          "Animated Cast",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example7",
        status: "now_showing",
      },

      {
        title: "War 2",
        description:
          "Kabir returns for another dangerous global mission.",
        genre: ["Action", "Thriller"],
        language: "Hindi",
        duration: 165,
        releaseDate: new Date("2025-08-14"),
        rating: "UA",
        director: "Ayan Mukerji",
        cast: [
          "Hrithik Roshan",
          "N. T. Rama Rao Jr.",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example8",
        status: "coming_soon",
      },

      {
        title: "Avatar: Fire and Ash",
        description:
          "James Cameron continues the Avatar saga with new Na'vi clans and new conflicts.",
        genre: ["Adventure", "Sci-Fi"],
        language: "English",
        duration: 192,
        releaseDate: new Date("2025-12-19"),
        rating: "PG-13",
        director: "James Cameron",
        cast: [
          "Sam Worthington",
          "Zoe Saldaña",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example9",
        status: "coming_soon",
      },

      {
        title: "Spider-Man: Brand New Day",
        description:
          "Peter Parker begins a brand-new chapter as Spider-Man.",
        genre: ["Action", "Adventure"],
        language: "English",
        duration: 140,
        releaseDate: new Date("2026-07-31"),
        rating: "PG-13",
        director: "Destin Daniel Cretton",
        cast: [
          "Tom Holland",
        ],
        posterUrl: "",
        trailerUrl: "https://youtu.be/example10",
        status: "coming_soon",
      },
    ];

    const inserted = await MovieModel.insertMany(movies);

    return res.status(201).json({
      success: true,
      message: `${inserted.length} movies seeded successfully.`,
      count: inserted.length,
      movies: inserted,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}