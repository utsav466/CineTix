import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type ShowtimeSeatType =
  | "regular"
  | "premium"
  | "recliner";

export type ShowtimeSeatStatus =
  | "available"
  | "held"
  | "booked";

export interface IShowtimeSeat
  extends Document {
  _id: mongoose.Types.ObjectId;

  showtimeId:
    mongoose.Types.ObjectId;

  screenId:
    mongoose.Types.ObjectId;

  seatCode: string;

  row: string;

  number: number;

  type: ShowtimeSeatType;

  price: number;

  status: ShowtimeSeatStatus;

  heldBy?:
    mongoose.Types.ObjectId;

  holdExpiresAt?: Date;

  bookingId?:
    mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

/*
 * Compatibility alias used by the
 * existing seat repository.
 */
export type ISeat =
  IShowtimeSeat;

const ShowtimeSeatSchema =
  new Schema<IShowtimeSeat>(
    {
      showtimeId: {
        type:
          Schema.Types.ObjectId,
        ref: "Showtime",
        required: true,
        index: true,
      },

      screenId: {
        type:
          Schema.Types.ObjectId,
        ref: "Screen",
        required: true,
        index: true,
      },

      seatCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },

      row: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },

      number: {
        type: Number,
        required: true,
        min: 1,
      },

      type: {
        type: String,
        enum: [
          "regular",
          "premium",
          "recliner",
        ],
        required: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "available",
          "held",
          "booked",
        ],
        default: "available",
        index: true,
      },

      heldBy: {
        type:
          Schema.Types.ObjectId,
        ref: "User",
      },

      holdExpiresAt: {
        type: Date,
        index: true,
      },

      bookingId: {
        type:
          Schema.Types.ObjectId,
        ref: "Booking",
      },
    },
    {
      timestamps: true,

      toJSON: {
        transform(
          _document,
          returnedObject,
        ) {
          const safeObject =
            returnedObject as Record<
              string,
              unknown
            >;

          safeObject.id =
            safeObject._id?.toString();

          delete safeObject._id;
          delete safeObject.__v;

          return safeObject;
        },
      },

      toObject: {
        transform(
          _document,
          returnedObject,
        ) {
          const safeObject =
            returnedObject as Record<
              string,
              unknown
            >;

          safeObject.id =
            safeObject._id?.toString();

          delete safeObject._id;
          delete safeObject.__v;

          return safeObject;
        },
      },
    },
  );

ShowtimeSeatSchema.index(
  {
    showtimeId: 1,
    seatCode: 1,
  },
  {
    unique: true,
  },
);

ShowtimeSeatSchema.index({
  showtimeId: 1,
  status: 1,
});

ShowtimeSeatSchema.index({
  status: 1,
  holdExpiresAt: 1,
});

export const SeatModel:
  Model<IShowtimeSeat> =
    mongoose.models.Seat ||
    mongoose.model<IShowtimeSeat>(
      "Seat",
      ShowtimeSeatSchema,
    );