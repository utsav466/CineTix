import {
  NextFunction,
  Request,
  Response,
} from "express";

import { env } from "../config";

import {
  AuthRequest,
} from "../middlewares/auth.middlewares";

import User, {
  UserDocument,
} from "../models/user.model";

import {
  generateToken,
} from "../utils/jwt";

type RegisterRequestBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

type LoginRequestBody = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

function normalizeEmail(
  email: string,
): string {
  return email
    .trim()
    .toLowerCase();
}

function createUsername(
  email: string,
): string {
  return email
    .split("@")[0]
    .replace(
      /[^a-z0-9._-]/gi,
      "",
    )
    .toLowerCase()
    .slice(0, 30);
}

function authCookieOptions() {
  return {
    httpOnly: true,

    secure:
      env.isProduction,

    sameSite:
      env.isProduction
        ? ("none" as const)
        : ("lax" as const),

    path: "/",
  };
}

function setAuthCookie(
  response: Response,
  token: string,
  rememberMe: boolean,
): void {
  response.cookie(
    env.cookieName,
    token,
    {
      ...authCookieOptions(),

      maxAge:
        (
          rememberMe
            ? env.cookieMaxAgeDays
            : 1
        ) *
        24 *
        60 *
        60 *
        1000,
    },
  );
}

function clearAuthCookie(
  response: Response,
): void {
  response.clearCookie(
    env.cookieName,
    authCookieOptions(),
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

export async function register(
  request:
    Request<
      Record<string, never>,
      unknown,
      RegisterRequestBody
    >,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    } =
      request.body;

    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !password
    ) {
      response.status(400).json({
        success: false,

        message:
          "Full name, email and password are required.",
      });

      return;
    }

    if (
      password.length < 8
    ) {
      response.status(400).json({
        success: false,

        message:
          "Password must be at least 8 characters.",
      });

      return;
    }

    if (
      confirmPassword !==
        undefined &&
      password !==
        confirmPassword
    ) {
      response.status(400).json({
        success: false,
        message:
          "Passwords do not match.",
      });

      return;
    }

    const normalizedEmail =
      normalizeEmail(email);

    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (existingUser) {
      response.status(409).json({
        success: false,

        message:
          "An account with this email already exists.",
      });

      return;
    }

    let username =
      createUsername(
        normalizedEmail,
      ) ||
      `user${Date.now()}`;

    if (
      await User.exists({
        username,
      })
    ) {
      username =
        `${username.slice(
          0,
          24,
        )}${Date.now()
          .toString()
          .slice(-5)}`;
    }

    const user =
      await User.create({
        fullName:
          fullName.trim(),

        email:
          normalizedEmail,

        username,

        phone:
          phone?.trim() ||
          "",

        password,

        role:
          "customer",

        preferredCurrency:
          "NPR",

        avatarUrl: "",

        isActive: true,
      });

    response.status(201).json({
      success: true,

      message:
        "Account created successfully.",

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

export async function login(
  request:
    Request<
      Record<string, never>,
      unknown,
      LoginRequestBody
    >,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      email,
      password,
      rememberMe = false,
    } =
      request.body;

    if (
      !email?.trim() ||
      !password
    ) {
      response.status(400).json({
        success: false,

        message:
          "Email and password are required.",
      });

      return;
    }

    const user =
      await User.findOne({
        email:
          normalizeEmail(email),
      }).select(
        "+password",
      );

    if (!user) {
      response.status(401).json({
        success: false,

        message:
          "Incorrect email or password.",
      });

      return;
    }

    if (!user.isActive) {
      response.status(403).json({
        success: false,

        message:
          "This account has been disabled.",
      });

      return;
    }

    const passwordMatches =
      await user.comparePassword(
        password,
      );

    if (!passwordMatches) {
      response.status(401).json({
        success: false,

        message:
          "Incorrect email or password.",
      });

      return;
    }

    const token =
      generateToken({
        userId:
          user._id.toString(),

        role:
          user.role,
      });

    setAuthCookie(
      response,
      token,
      Boolean(rememberMe),
    );

    response.status(200).json({
      success: true,

      message:
        "Signed in successfully.",

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

export async function getMe(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId =
      request.auth?.userId ||
      request.userId;

    if (!userId) {
      response.status(401).json({
        success: false,

        message:
          "Authentication is required.",
      });

      return;
    }

    const user =
      await User.findById(
        userId,
      );

    if (
      !user ||
      !user.isActive
    ) {
      clearAuthCookie(
        response,
      );

      response.status(401).json({
        success: false,

        message:
          "Your account could not be loaded.",
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

export function logout(
  _request: Request,
  response: Response,
): void {
  clearAuthCookie(
    response,
  );

  response.status(200).json({
    success: true,

    message:
      "Signed out successfully.",
  });
}