import {
  NextFunction,
  Request,
  Response,
} from "express";

import { env } from "../config";

import {
  verifyToken,
} from "../utils/jwt";

export type AuthPayload = {
  userId: string;
  role: string;
};

export interface AuthRequest
  extends Request {
  userId?: string;
  role?: string;
  auth?: AuthPayload;
}

function getBearerToken(
  request: Request,
): string | undefined {
  const authorization =
    request.headers.authorization;

  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return undefined;
  }

  const token =
    authorization
      .slice(7)
      .trim();

  return token || undefined;
}

export function requireAuth(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): void {
  try {
    const cookieToken =
      request.cookies?.[
        env.cookieName
      ] as
        | string
        | undefined;

    const bearerToken =
      getBearerToken(request);

    const token =
      cookieToken ||
      bearerToken;

    if (!token) {
      response.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });

      return;
    }

    const payload =
      verifyToken(token);

    request.userId =
      payload.userId;

    request.role =
      payload.role;

    request.auth = {
      userId:
        payload.userId,

      role:
        payload.role,
    };

    next();
  } catch {
    response.status(401).json({
      success: false,
      message:
        "Your session is invalid or has expired.",
    });
  }
}