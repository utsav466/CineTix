import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type FoodCategory =
  | "popcorn"
  | "beverage"
  | "snack"
  | "combo"
  | "other";

export interface IFood extends Document {
  _id: mongoose.Types.ObjectId;

  name: string;
  slug: string;
  description: string;

  category: FoodCategory;

  price: number;
  imageUrl: string;

  isVegetarian: boolean;
  isAvailable: boolean;
  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: [
        true,
        "Food name is required",
      ],
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    category: {
      type: String,
      enum: [
        "popcorn",
        "beverage",
        "snack",
        "combo",
        "other",
      ],
      default: "other",
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    isVegetarian: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
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

export const FoodModel: Model<IFood> =
  mongoose.models.Food ||
  mongoose.model<IFood>(
    "Food",
    FoodSchema,
  );