import jwt, {
  JwtPayload,
  SignOptions,
} from "jsonwebtoken";

import {
  env,
} from "../config";

export type AuthTokenPayload = {
  userId: string;
  role: string;
};

function getJwtExpiresIn():
  SignOptions["expiresIn"] {
  return env.jwtExpiresIn as
    SignOptions["expiresIn"];
}

export function generateToken(
  payload: AuthTokenPayload,
): string {
  return jwt.sign(
    payload,
    env.jwtSecret,
    {
      expiresIn:
        getJwtExpiresIn(),
    },
  );
}

export function verifyToken(
  token: string,
): AuthTokenPayload {
  const decoded =
    jwt.verify(
      token,
      env.jwtSecret,
    );

  if (
    typeof decoded ===
    "string"
  ) {
    throw new Error(
      "Invalid authentication token.",
    );
  }

  const payload =
    decoded as JwtPayload &
      Partial<AuthTokenPayload>;

  if (
    !payload.userId ||
    !payload.role
  ) {
    throw new Error(
      "Authentication token is missing required information.",
    );
  }

  return {
    userId:
      payload.userId,

    role:
      payload.role,
  };
}