import bcrypt from "bcryptjs";

import mongoose, {
  HydratedDocument,
  Model,
  Schema,
} from "mongoose";

export type UserRole =
  | "customer"
  | "admin";

export type PreferredCurrency =
  | "NPR"
  | "USD"
  | "INR";

export interface IUser {
  fullName: string;
  email: string;
  username?: string;
  phone: string;
  password: string;

  role: UserRole;

  preferredCurrency:
    PreferredCurrency;

  avatarUrl: string;
  isActive: boolean;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(
    candidatePassword: string,
  ): Promise<boolean>;
}

export type UserDocument =
  HydratedDocument<
    IUser,
    IUserMethods
  >;

export type UserModelType =
  Model<
    IUser,
    Record<string, never>,
    IUserMethods
  >;

const userSchema =
  new Schema<
    IUser,
    UserModelType,
    IUserMethods
  >(
    {
      fullName: {
        type: String,

        required: [
          true,
          "Full name is required.",
        ],

        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      email: {
        type: String,

        required: [
          true,
          "Email is required.",
        ],

        unique: true,
        trim: true,
        lowercase: true,
        index: true,
      },

      username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      password: {
        type: String,

        required: [
          true,
          "Password is required.",
        ],

        minlength: 8,
        select: false,
      },

      role: {
        type: String,

        enum: [
          "customer",
          "admin",
        ],

        default:
          "customer",

        index: true,
      },

      preferredCurrency: {
        type: String,

        enum: [
          "NPR",
          "USD",
          "INR",
        ],

        default:
          "NPR",
      },

      avatarUrl: {
        type: String,
        trim: true,
        default: "",
      },

      isActive: {
        type: Boolean,
        default: true,
        index: true,
      },

      resetPasswordToken: {
        type: String,
        select: false,
      },

      resetPasswordExpires: {
        type: Date,
        select: false,
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

          object.name =
            object.fullName;

          delete object._id;
          delete object.password;
          delete object.resetPasswordToken;
          delete object.resetPasswordExpires;
          delete object.__v;

          return object;
        },
      },

      toObject: {
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

          object.name =
            object.fullName;

          delete object._id;
          delete object.password;
          delete object.resetPasswordToken;
          delete object.resetPasswordExpires;
          delete object.__v;

          return object;
        },
      },
    },
  );

/*
 * Compatibility fix for old database records.
 *
 * Older CineTix users were created with:
 * role: "user"
 *
 * The current application uses:
 * role: "customer"
 */
userSchema.pre(
  "validate",
  function normalizeLegacyRole() {
    const currentRole =
      this.role as string;

    if (
      currentRole === "user"
    ) {
      this.role =
        "customer";
    }
  },
);

userSchema.pre(
  "save",
  async function hashPassword() {
    if (
      !this.isModified(
        "password",
      )
    ) {
      return;
    }

    this.password =
      await bcrypt.hash(
        this.password,
        12,
      );
  },
);

userSchema.methods.comparePassword =
  async function comparePassword(
    candidatePassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(
      candidatePassword,
      this.password,
    );
  };

export const UserModel =
  (mongoose.models
    .User as UserModelType) ||
  mongoose.model<
    IUser,
    UserModelType
  >(
    "User",
    userSchema,
  );

export const User =
  UserModel;

export default UserModel;