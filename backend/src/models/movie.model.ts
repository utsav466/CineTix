import mongoose, { Document, Schema } from "mongoose";

export type MovieStatus = "now_showing" | "coming_soon";

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number; // minutes
  releaseDate: Date;
  rating: string; // G, PG, PG-13, R, etc.
  director: string;
  cast: string[];
  posterUrl: string;
  trailerUrl: string;
  status: MovieStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    genre: [
      {
        type: String,
        required: true,
      },
    ],

    language: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    rating: {
      type: String,
      default: "PG",
    },

    director: {
      type: String,
      required: true,
    },

    cast: [
      {
        type: String,
      },
    ],

    posterUrl: {
      type: String,
      default: "",
    },

    trailerUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      default: "coming_soon",
    },
  },
  {
    timestamps: true,
  }
);

export const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);