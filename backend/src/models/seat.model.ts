import mongoose, { Document, Schema } from "mongoose";

export type SeatStatus = "available" | "reserved" | "booked";

export interface ISeat extends Document {
  showtimeId: mongoose.Types.ObjectId;

  row: string;
  number: number;

  seatCode: string; // A1, A2...

  type: "regular" | "premium";

  price: number;

  status: SeatStatus;

  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>(
  {
    showtimeId: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },

    row: {
      type: String,
      required: true,
      uppercase: true,
    },

    number: {
      type: Number,
      required: true,
      min: 1,
    },

    seatCode: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["regular", "premium"],
      default: "regular",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

SeatSchema.index(
  {
    showtimeId: 1,
    seatCode: 1,
  },
  {
    unique: true,
  }
);

export const SeatModel =
  mongoose.models.Seat ||
  mongoose.model<ISeat>("Seat", SeatSchema);