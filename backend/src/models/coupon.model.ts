import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type CouponDiscountType =
  | "percentage"
  | "fixed";

export interface ICoupon
  extends Document {
  _id: mongoose.Types.ObjectId;

  code: string;
  name: string;
  description: string;

  discountType:
    CouponDiscountType;

  discountValue: number;

  minimumOrderAmount: number;
  maximumDiscountAmount?: number;

  usageLimit?: number;
  usageCount: number;

  perUserLimit: number;

  startsAt: Date;
  expiresAt: Date;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema =
  new Schema<ICoupon>(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
        minlength: 3,
        maxlength: 30,
      },

      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      description: {
        type: String,
        trim: true,
        default: "",
        maxlength: 500,
      },

      discountType: {
        type: String,
        enum: [
          "percentage",
          "fixed",
        ],
        required: true,
      },

      discountValue: {
        type: Number,
        required: true,
        min: 0,
      },

      minimumOrderAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      maximumDiscountAmount: {
        type: Number,
        min: 0,
      },

      usageLimit: {
        type: Number,
        min: 1,
      },

      usageCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      perUserLimit: {
        type: Number,
        default: 1,
        min: 1,
      },

      startsAt: {
        type: Date,
        required: true,
        index: true,
      },

      expiresAt: {
        type: Date,
        required: true,
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

CouponSchema.index({
  isActive: 1,
  startsAt: 1,
  expiresAt: 1,
});

export const CouponModel:
  Model<ICoupon> =
    mongoose.models.Coupon ||
    mongoose.model<ICoupon>(
      "Coupon",
      CouponSchema,
    );