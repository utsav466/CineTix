import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type ShowtimeStatus =
  | "scheduled"
  | "cancelled"
  | "completed";

export interface IShowtime
  extends Document {
  _id: mongoose.Types.ObjectId;

  movieId: mongoose.Types.ObjectId;
  cinemaId: mongoose.Types.ObjectId;
  screenId: mongoose.Types.ObjectId;

  startsAt: Date;
  endsAt: Date;

  regularPrice: number;
  premiumPrice: number;
  reclinerPrice: number;

  cleanupMinutes: number;

  status: ShowtimeStatus;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ShowtimeSchema =
  new Schema<IShowtime>(
    {
      movieId: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
        index: true,
      },

      cinemaId: {
        type: Schema.Types.ObjectId,
        ref: "Cinema",
        required: true,
        index: true,
      },

      screenId: {
        type: Schema.Types.ObjectId,
        ref: "Screen",
        required: true,
        index: true,
      },

      startsAt: {
        type: Date,
        required: true,
        index: true,
      },

      endsAt: {
        type: Date,
        required: true,
        index: true,
      },

      regularPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      premiumPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      reclinerPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      cleanupMinutes: {
        type: Number,
        default: 20,
        min: 0,
        max: 120,
      },

      status: {
        type: String,
        enum: [
          "scheduled",
          "cancelled",
          "completed",
        ],
        default: "scheduled",
        index: true,
      },

      isActive: {
        type: Boolean,
        default: true,
        index: true,
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
    },
  );

ShowtimeSchema.index({
  screenId: 1,
  startsAt: 1,
});

ShowtimeSchema.index({
  movieId: 1,
  startsAt: 1,
});

export const ShowtimeModel:
  Model<IShowtime> =
    mongoose.models.Showtime ||
    mongoose.model<IShowtime>(
      "Showtime",
      ShowtimeSchema,
    );