import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type BookingStatus =
  | "held"
  | "payment_pending"
  | "confirmed"
  | "cancelled"
  | "expired";

export type BookingPaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type BookingPaymentMethod =
  | "KHALTI"
  | "ESEWA"
  | "CASH";

export type BookingSeatType =
  | "regular"
  | "premium"
  | "recliner";

export interface IBookingSeat {
  seatId: mongoose.Types.ObjectId;
  seatCode: string;
  type: BookingSeatType;
  price: number;
}

export interface IBookingFood {
  foodId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;

  bookingCode: string;

  userId: mongoose.Types.ObjectId;
  showtimeId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  cinemaId: mongoose.Types.ObjectId;
  screenId: mongoose.Types.ObjectId;

  seats: IBookingSeat[];
  foodItems: IBookingFood[];

  ticketSubtotal: number;
  foodSubtotal: number;

  couponId?: mongoose.Types.ObjectId;
  couponCode?: string;

  discountAmount: number;
  totalAmount: number;

  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;

  paymentMethod?: BookingPaymentMethod;

  paymentRef?: string;

  khaltiPidx?: string;
  khaltiPaymentUrl?: string;

  qrCode?: string;

  holdExpiresAt: Date;

  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSeatSchema =
  new Schema<IBookingSeat>(
    {
      seatId: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
      },

      seatCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
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
    },
    {
      _id: false,
    },
  );

const BookingFoodSchema =
  new Schema<IBookingFood>(
    {
      foodId: {
        type: Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      lineTotal: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      _id: false,
    },
  );

const BookingSchema =
  new Schema<IBooking>(
    {
      bookingCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
        uppercase: true,
        trim: true,
      },

      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      showtimeId: {
        type: Schema.Types.ObjectId,
        ref: "Showtime",
        required: true,
        index: true,
      },

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

      seats: {
        type: [BookingSeatSchema],
        required: true,
        default: [],
      },

      foodItems: {
        type: [BookingFoodSchema],
        default: [],
      },

      ticketSubtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      foodSubtotal: {
        type: Number,
        default: 0,
        min: 0,
      },

      couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },

      couponCode: {
        type: String,
        uppercase: true,
        trim: true,
        default: "",
      },

      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "held",
          "payment_pending",
          "confirmed",
          "cancelled",
          "expired",
        ],
        default: "held",
        index: true,
      },

      paymentStatus: {
        type: String,
        enum: [
          "unpaid",
          "pending",
          "paid",
          "failed",
          "refunded",
        ],
        default: "unpaid",
        index: true,
      },

      paymentMethod: {
        type: String,
        enum: [
          "KHALTI",
          "ESEWA",
          "CASH",
        ],
      },

      paymentRef: {
        type: String,
        trim: true,
        default: "",
      },

      khaltiPidx: {
        type: String,
        trim: true,
        index: true,
      },

      khaltiPaymentUrl: {
        type: String,
        trim: true,
        default: "",
      },

      qrCode: {
        type: String,
        trim: true,
        default: "",
      },

      holdExpiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      confirmedAt: {
        type: Date,
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

BookingSchema.index({
  userId: 1,
  createdAt: -1,
});

BookingSchema.index({
  showtimeId: 1,
  status: 1,
});

BookingSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

export const BookingModel:
  Model<IBooking> =
    mongoose.models.Booking ||
    mongoose.model<IBooking>(
      "Booking",
      BookingSchema,
    );