import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { env } from "../config";
import { HttpError } from "../errors/http-error";

type MongoDuplicateError = Error & {
  code?: number;
  keyValue?: Record<string, unknown>;
};

function getDuplicateFieldMessage(
  error: MongoDuplicateError,
): string {
  const duplicateField = error.keyValue
    ? Object.keys(error.keyValue)[0]
    : undefined;

  if (!duplicateField) {
    return "A record with this information already exists";
  }

  return `${duplicateField} already exists`;
}

export const notFoundHandler = (
  req: Request,
  res: Response,
): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (
    error instanceof mongoose.Error.ValidationError
  ) {
    statusCode = 400;
    message = "Database validation failed";
    details = Object.values(error.errors).map(
      (validationError) => ({
        field: validationError.path,
        message: validationError.message,
      }),
    );
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${error.path}`;
  } else if (
    error instanceof Error &&
    "code" in error &&
    (error as MongoDuplicateError).code === 11000
  ) {
    statusCode = 409;
    message = getDuplicateFieldMessage(
      error as MongoDuplicateError,
    );
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  if (statusCode >= 500) {
    console.error("Unhandled server error:", error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details !== undefined ? { details } : {}),
    ...(env.isDevelopment &&
    error instanceof Error &&
    error.stack
      ? { stack: error.stack }
      : {}),
  });
};