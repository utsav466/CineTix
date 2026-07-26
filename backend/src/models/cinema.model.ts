import mongoose, { Document, Schema } from "mongoose";

export interface ICinema extends Document {
  name: string;
  city: string;
  address: string;
  halls: number;
  facilities: string[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const CinemaSchema = new Schema<ICinema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    halls: {
      type: Number,
      default: 1,
      min: 1,
    },

    facilities: [
      {
        type: String,
      },
    ],

    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const CinemaModel = mongoose.model<ICinema>(
  "Cinema",
  CinemaSchema
);