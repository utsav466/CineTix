import {
  NextFunction,
  Response,
} from "express";

import { env } from "../config";

import {
  AuthRequest,
} from "../middlewares/auth.middlewares";

import User, {
  PreferredCurrency,
  UserDocument,
} from "../models/user.model";

const ALLOWED_CURRENCY:
  PreferredCurrency[] = [
    "NPR",
    "USD",
    "INR",
  ];

function currentUserId(
  request: AuthRequest,
): string | undefined {
  return (
    request.auth?.userId ||
    request.userId
  );
}

function serializeUser(
  user: UserDocument,
) {
  return {
    id:
      user._id.toString(),

    fullName:
      user.fullName,

    name:
      user.fullName,

    email:
      user.email,

    username:
      user.username || "",

    phone:
      user.phone || "",

    role:
      user.role,

    preferredCurrency:
      user.preferredCurrency,

    avatarUrl:
      user.avatarUrl || "",

    isActive:
      user.isActive,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

function uploadedAvatarUrl(
  filename: string,
): string {
  return `${env.backendUrl}/uploads/avatars/${filename}`;
}

export class UserController {
  async me(
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId =
        currentUserId(
          request,
        );

      if (!userId) {
        response.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });

        return;
      }

      const user =
        await User.findById(
          userId,
        );

      if (!user) {
        response.status(404).json({
          success: false,
          message:
            "User not found",
        });

        return;
      }

      response.status(200).json({
        success: true,

        data: {
          user:
            serializeUser(
              user,
            ),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId =
        currentUserId(
          request,
        );

      if (!userId) {
        response.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });

        return;
      }

      const user =
        await User.findById(
          userId,
        );

      if (!user) {
        response.status(404).json({
          success: false,
          message:
            "User not found",
        });

        return;
      }

      if (
        typeof request.body
          .fullName ===
        "string"
      ) {
        const fullName =
          request.body.fullName.trim();

        if (
          fullName.length < 2
        ) {
          response.status(400).json({
            success: false,

            message:
              "Full name must contain at least 2 characters.",
          });

          return;
        }

        user.fullName =
          fullName;
      }

      if (
        typeof request.body
          .email ===
        "string"
      ) {
        const email =
          request.body.email
            .trim()
            .toLowerCase();

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email,
          )
        ) {
          response.status(400).json({
            success: false,

            message:
              "Enter a valid email address.",
          });

          return;
        }

        const emailOwner =
          await User.findOne({
            email,

            _id: {
              $ne:
                user._id,
            },
          });

        if (emailOwner) {
          response.status(409).json({
            success: false,

            message:
              "Email is already in use.",
          });

          return;
        }

        user.email =
          email;
      }

      if (
        typeof request.body
          .phone ===
        "string"
      ) {
        user.phone =
          request.body.phone.trim();
      }

      if (
        typeof request.body
          .preferredCurrency ===
        "string"
      ) {
        const currency =
          request.body
            .preferredCurrency
            .trim()
            .toUpperCase() as PreferredCurrency;

        if (
          !ALLOWED_CURRENCY.includes(
            currency,
          )
        ) {
          response.status(400).json({
            success: false,

            message:
              "Invalid preferred currency.",

            allowed:
              ALLOWED_CURRENCY,
          });

          return;
        }

        user.preferredCurrency =
          currency;
      }

      if (request.file) {
        user.avatarUrl =
          uploadedAvatarUrl(
            request.file.filename,
          );
      }

      await user.save();

      response.status(200).json({
        success: true,

        message:
          "Profile updated successfully.",

        data: {
          user:
            serializeUser(
              user,
            ),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMyAvatar(
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId =
        currentUserId(
          request,
        );

      if (!userId) {
        response.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });

        return;
      }

      if (!request.file) {
        response.status(400).json({
          success: false,

          message:
            "An avatar file is required.",
        });

        return;
      }

      const user =
        await User.findById(
          userId,
        );

      if (!user) {
        response.status(404).json({
          success: false,
          message:
            "User not found",
        });

        return;
      }

      user.avatarUrl =
        uploadedAvatarUrl(
          request.file.filename,
        );

      await user.save();

      response.status(200).json({
        success: true,

        message:
          "Avatar updated successfully.",

        data: {
          user:
            serializeUser(
              user,
            ),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}