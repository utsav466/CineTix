import mongoose, { Schema, Document } from "mongoose";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled";

export type PaymentMethod =
  | "ESEWA"
  | "CARD"
  | "CASH";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed";

const FoodItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;

  movieId: mongoose.Types.ObjectId;

  showtimeId: mongoose.Types.ObjectId;

  seats: string[];

  foods: {
    name: string;
    quantity: number;
    price: number;
  }[];

  totalAmount: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  paymentRef: string;

  qrCode: string;

  status: BookingStatus;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    showtimeId: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },

    seats: [
      {
        type: String,
        required: true,
      },
    ],

    foods: {
      type: [FoodItemSchema],
      default: [],
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["ESEWA", "CARD", "CASH"],
      default: "ESEWA",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentRef: {
      type: String,
      default: "",
    },

    qrCode: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);