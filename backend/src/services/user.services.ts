import {
  env,
} from "../config";

import {
  CreateUserInput,
  LoginUserInput,
} from "../dtos/user.dto";

import {
  HttpError,
} from "../errors/http-error";

import {
  UserDocument,
  UserRole,
} from "../models/user.model";

import {
  UserRepository,
} from "../repositories/user.repository";

import {
  generateToken,
} from "../utils/jwt";

const userRepository =
  new UserRepository();

export type PublicUser = {
  id: string;

  fullName:
    string;

  name:
    string;

  email:
    string;

  username:
    string;

  phone:
    string;

  role:
    UserRole;

  preferredCurrency:
    | "NPR"
    | "USD"
    | "INR";

  avatarUrl:
    string;

  isActive:
    boolean;

  createdAt:
    Date;

  updatedAt:
    Date;
};

function createUsernameFromEmail(
  email: string,
): string {
  const emailPrefix =
    email.split(
      "@",
    )[0] ||
    "user";

  const safePrefix =
    emailPrefix
      .toLowerCase()
      .replace(
        /[^a-z0-9._-]/g,
        "",
      )
      .slice(
        0,
        20,
      );

  const randomSuffix =
    Math.floor(
      1000 +
        Math.random() *
          9000,
    );

  return `${
    safePrefix ||
    "user"
  }${randomSuffix}`;
}

export function toPublicUser(
  user:
    UserDocument,
): PublicUser {
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
      user.username ||
      "",

    phone:
      user.phone ||
      "",

    role:
      user.role,

    preferredCurrency:
      user.preferredCurrency,

    avatarUrl:
      user.avatarUrl ||
      "",

    isActive:
      user.isActive,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

export class UserService {
  private createToken(
    user:
      UserDocument,
  ): string {
    return generateToken({
      userId:
        user._id.toString(),

      role:
        user.role,
    });
  }

  private async createUniqueUsername(
    email: string,
    requestedUsername?: string,
  ): Promise<string> {
    if (
      requestedUsername
    ) {
      const normalizedUsername =
        requestedUsername
          .trim()
          .toLowerCase();

      const existingUsername =
        await userRepository
          .getUserByUsername(
            normalizedUsername,
          );

      if (
        existingUsername
      ) {
        throw new HttpError(
          409,
          "Username is already in use",
        );
      }

      return normalizedUsername;
    }

    let generatedUsername =
      createUsernameFromEmail(
        email,
      );

    while (
      await userRepository
        .getUserByUsername(
          generatedUsername,
        )
    ) {
      generatedUsername =
        createUsernameFromEmail(
          email,
        );
    }

    return generatedUsername;
  }

  async createUser(
    data:
      CreateUserInput,
  ): Promise<{
    user:
      PublicUser;

    token:
      string;
  }> {
    const normalizedEmail =
      data.email
        .trim()
        .toLowerCase();

    const existingEmail =
      await userRepository
        .getUserByEmail(
          normalizedEmail,
        );

    if (
      existingEmail
    ) {
      throw new HttpError(
        409,
        "An account with this email already exists",
      );
    }

    const username =
      await this
        .createUniqueUsername(
          normalizedEmail,
          data.username,
        );

    /*
     * Do not hash the password here.
     *
     * user.model.ts already hashes
     * passwords in its pre-save hook.
     * Hashing here would hash it twice.
     */
    const createdUser =
      await userRepository
        .createUser({
          fullName:
            data.fullName.trim(),

          email:
            normalizedEmail,

          username,

          phone:
            data.phone?.trim(),

          password:
            data.password,

          role:
            "customer",

          preferredCurrency:
            "NPR",

          avatarUrl:
            "",

          isActive:
            true,
        });

    return {
      user:
        toPublicUser(
          createdUser,
        ),

      token:
        this.createToken(
          createdUser,
        ),
    };
  }

  async loginUser(
    data:
      LoginUserInput,
  ): Promise<{
    user:
      PublicUser;

    token:
      string;
  }> {
    const user =
      await userRepository
        .getUserByEmailWithPassword(
          data.email,
        );

    if (!user) {
      throw new HttpError(
        401,
        "Invalid email or password",
      );
    }

    if (
      !user.isActive
    ) {
      throw new HttpError(
        403,
        "This account has been disabled",
      );
    }

    const validPassword =
      await user
        .comparePassword(
          data.password,
        );

    if (
      !validPassword
    ) {
      throw new HttpError(
        401,
        "Invalid email or password",
      );
    }

    return {
      user:
        toPublicUser(
          user,
        ),

      token:
        this.createToken(
          user,
        ),
    };
  }

  async getCurrentUser(
    userId: string,
  ): Promise<PublicUser> {
    const user =
      await userRepository
        .getUserById(
          userId,
        );

    if (!user) {
      throw new HttpError(
        404,
        "User account was not found",
      );
    }

    if (
      !user.isActive
    ) {
      throw new HttpError(
        403,
        "This account has been disabled",
      );
    }

    return toPublicUser(
      user,
    );
  }
}