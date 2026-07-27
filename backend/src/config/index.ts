import "dotenv/config";

function getRequiredString(
  name: string,
  fallback?: string,
): string {
  const value =
    process.env[name] ??
    fallback;

  if (
    !value ||
    !value.trim()
  ) {
    throw new Error(
      `Missing required environment variable: ${name}`,
    );
  }

  return value.trim();
}

function getPositiveNumber(
  name: string,
  fallback: number,
): number {
  const rawValue =
    process.env[name];

  if (
    rawValue ===
      undefined ||
    rawValue.trim() ===
      ""
  ) {
    return fallback;
  }

  const parsedValue =
    Number(rawValue);

  if (
    !Number.isFinite(
      parsedValue,
    ) ||
    parsedValue <= 0
  ) {
    throw new Error(
      `${name} must be a positive number.`,
    );
  }

  return parsedValue;
}

const nodeEnv =
  process.env.NODE_ENV ??
  "development";

export const env = {
  nodeEnv,

  isDevelopment:
    nodeEnv ===
    "development",

  isProduction:
    nodeEnv ===
    "production",

  isTest:
    nodeEnv ===
    "test",

  port:
    getPositiveNumber(
      "PORT",
      5001,
    ),

  mongodbUri:
    getRequiredString(
      "MONGODB_URI",
    ),

  jwtSecret:
    getRequiredString(
      "JWT_SECRET",
    ),

  jwtExpiresIn:
    process.env
      .JWT_EXPIRES_IN ??
    "7d",

  frontendUrl:
    getRequiredString(
      "FRONTEND_URL",
      "http://localhost:3000",
    ),

  backendUrl:
    getRequiredString(
      "BACKEND_URL",
      "http://localhost:5001",
    ),

  cookieName:
    process.env
      .COOKIE_NAME ??
    "cinetix_token",

  cookieMaxAgeDays:
    getPositiveNumber(
      "COOKIE_MAX_AGE_DAYS",
      7,
    ),

  khaltiSecretKey:
    process.env
      .KHALTI_SECRET_KEY ??
    "",

  khaltiBaseUrl:
    process.env
      .KHALTI_BASE_URL ??
    "https://dev.khalti.com/api/v2",

  uploadDirectory:
    process.env
      .UPLOAD_DIRECTORY ??
    "uploads",
} as const;