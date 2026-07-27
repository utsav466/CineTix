import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type MovieStatus =
  | "now_showing"
  | "coming_soon"
  | "inactive";

export interface IMovie extends Document {
  _id: mongoose.Types.ObjectId;

  title: string;
  slug: string;
  description: string;

  genre: string[];
  language: string;
  duration: number;

  releaseDate: Date;
  rating: string;

  director: string;
  cast: string[];

  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;

  status: MovieStatus;
  featured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema =
  new Schema<IMovie>(
    {
      title: {
        type: String,
        required: [
          true,
          "Movie title is required",
        ],
        trim: true,
        minlength: 1,
        maxlength: 150,
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
        required: [
          true,
          "Movie description is required",
        ],
        trim: true,
        minlength: 10,
        maxlength: 3000,
      },

      genre: {
        type: [String],
        required: true,
        default: [],
      },

      language: {
        type: String,
        required: [
          true,
          "Movie language is required",
        ],
        trim: true,
        index: true,
      },

      duration: {
        type: Number,
        required: [
          true,
          "Movie duration is required",
        ],
        min: 1,
      },

      releaseDate: {
        type: Date,
        required: [
          true,
          "Release date is required",
        ],
        index: true,
      },

      rating: {
        type: String,
        trim: true,
        default: "PG",
      },

      director: {
        type: String,
        required: [
          true,
          "Director is required",
        ],
        trim: true,
      },

      cast: {
        type: [String],
        default: [],
      },

      posterUrl: {
        type: String,
        trim: true,
        default: "",
      },

      bannerUrl: {
        type: String,
        trim: true,
        default: "",
      },

      trailerUrl: {
        type: String,
        trim: true,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "now_showing",
          "coming_soon",
          "inactive",
        ],
        default: "coming_soon",
        index: true,
      },

      featured: {
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
    },
  );

export const MovieModel: Model<IMovie> =
  mongoose.models.Movie ||
  mongoose.model<IMovie>(
    "Movie",
    MovieSchema,
  );