import {
  NextFunction,
  Request,
  Response,
} from "express";

import { env } from "../config";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!env.isDevelopment) {
    next();
    return;
  }

  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
}