import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface ISettings
  extends Document {
  storeName: string;
  supportEmail: string;

  currency:
    | "NPR"
    | "USD"
    | "INR";

  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;

  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema =
  new Schema<ISettings>(
    {
      storeName: {
        type: String,
        trim: true,
        default: "CineTix",
        maxlength: 100,
      },

      supportEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default:
          "support@cinetix.com",
      },

      currency: {
        type: String,
        enum: [
          "NPR",
          "USD",
          "INR",
        ],
        default: "NPR",
      },

      logoUrl: {
        type: String,
        trim: true,
        default: "",
      },

      faviconUrl: {
        type: String,
        trim: true,
        default: "",
      },

      heroImageUrl: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      timestamps: true,

      toJSON: {
        transform(
          _document,
          returnedObject,
        ) {
          const object =
            returnedObject as Record<
              string,
              unknown
            >;

          object.id =
            object._id?.toString();

          delete object._id;
          delete object.__v;

          return object;
        },
      },
    },
  );

export const SettingsModel:
  Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>(
    "Settings",
    SettingsSchema,
  );