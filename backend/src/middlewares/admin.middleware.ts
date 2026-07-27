import {
  NextFunction,
  Response,
} from "express";

import {
  AuthRequest,
} from "./auth.middlewares";

export function requireAdmin(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): void {
  const userId =
    request.auth?.userId ||
    request.userId;

  const role =
    request.auth?.role ||
    request.role;

  if (!userId) {
    response.status(401).json({
      success: false,
      message:
        "Authentication is required",
    });

    return;
  }

  if (role !== "admin") {
    response.status(403).json({
      success: false,
      message:
        "Administrator access is required",
    });

    return;
  }

  next();
}