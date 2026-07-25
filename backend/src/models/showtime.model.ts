import mongoose, { Document, Schema } from "mongoose";

export type SeatStatus = "available" | "booked";

export interface ISeat {
  seatNumber: string;
  status: SeatStatus;
}

export interface IShowtime extends Document {
  movieId: mongoose.Types.ObjectId;

  cinema: string;
  screen: string;

  date: Date;
  time: string;

  price: number;

  seats: ISeat[];

  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>(
  {
    seatNumber: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
  },
  {
    _id: false,
  }
);

const ShowtimeSchema = new Schema<IShowtime>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    cinema: {
      type: String,
      required: true,
    },

    screen: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    seats: {
      type: [SeatSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ShowtimeModel =
  mongoose.models.Showtime ||
  mongoose.model<IShowtime>("Showtime", ShowtimeSchema);