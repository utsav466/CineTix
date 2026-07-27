import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type ScreenSeatType =
  | "regular"
  | "premium"
  | "recliner";

export interface IScreenSeat {
  seatCode: string;
  row: string;
  number: number;
  type: ScreenSeatType;
  priceMultiplier: number;
  isDisabled: boolean;
}

export interface IScreen
  extends Document {
  _id: mongoose.Types.ObjectId;

  cinemaId: mongoose.Types.ObjectId;

  name: string;
  rows: number;
  seatsPerRow: number;
  capacity: number;

  seatLayout: IScreenSeat[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ScreenSeatSchema =
  new Schema<IScreenSeat>(
    {
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
        default: "regular",
      },

      priceMultiplier: {
        type: Number,
        default: 1,
        min: 0,
      },

      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: false,
    },
  );

const ScreenSchema =
  new Schema<IScreen>(
    {
      cinemaId: {
        type: Schema.Types.ObjectId,
        ref: "Cinema",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: [
          true,
          "Hall name is required",
        ],
        trim: true,
        maxlength: 80,
      },

      rows: {
        type: Number,
        required: true,
        min: 1,
        max: 26,
      },

      seatsPerRow: {
        type: Number,
        required: true,
        min: 1,
        max: 40,
      },

      capacity: {
        type: Number,
        required: true,
        min: 1,
      },

      seatLayout: {
        type: [ScreenSeatSchema],
        default: [],
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

ScreenSchema.index(
  {
    cinemaId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

export const ScreenModel: Model<IScreen> =
  mongoose.models.Screen ||
  mongoose.model<IScreen>(
    "Screen",
    ScreenSchema,
  );