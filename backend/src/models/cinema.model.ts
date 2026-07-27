import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface ICinema extends Document {
  _id: mongoose.Types.ObjectId;

  name: string;
  slug: string;
  city: string;
  address: string;
  phone: string;
  description: string;

  facilities: string[];
  imageUrl: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CinemaSchema =
  new Schema<ICinema>(
    {
      name: {
        type: String,
        required: [
          true,
          "Cinema name is required",
        ],
        trim: true,
        minlength: 2,
        maxlength: 120,
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

      city: {
        type: String,
        required: [
          true,
          "City is required",
        ],
        trim: true,
        index: true,
      },

      address: {
        type: String,
        required: [
          true,
          "Address is required",
        ],
        trim: true,
        maxlength: 300,
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      description: {
        type: String,
        trim: true,
        default: "",
        maxlength: 1000,
      },

      facilities: {
        type: [String],
        default: [],
      },

      imageUrl: {
        type: String,
        trim: true,
        default: "",
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

export const CinemaModel: Model<ICinema> =
  mongoose.models.Cinema ||
  mongoose.model<ICinema>(
    "Cinema",
    CinemaSchema,
  );