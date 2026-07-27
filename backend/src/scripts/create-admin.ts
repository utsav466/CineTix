import bcrypt from "bcryptjs";

import {
  connectDB,
  disconnectDB,
} from "../database/mongodb";

import {
  UserModel,
} from "../models/user.model";

function normalizeEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

async function createOrResetAdmin():
  Promise<void> {
  const email =
    normalizeEmail(
      process.argv[2] ||
        "admin@cinetix.com",
    );

  const password =
    process.argv[3] ||
    "Admin12345";

  const fullName =
    process.argv[4]?.trim() ||
    "CineTix Admin";

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    )
  ) {
    throw new Error(
      "Enter a valid admin email address.",
    );
  }

  if (
    password.length < 8
  ) {
    throw new Error(
      "Admin password must contain at least 8 characters.",
    );
  }

  await connectDB();

  const hashedPassword =
    await bcrypt.hash(
      password,
      12,
    );

  const now =
    new Date();

  const existingAdmin =
    await UserModel.collection.findOne({
      email,
    });

  await UserModel.collection.updateOne(
    {
      email,
    },
    {
      $set: {
        fullName,
        email,
        password:
          hashedPassword,
        role: "admin",
        isActive: true,
        preferredCurrency:
          "NPR",
        updatedAt: now,
      },

      $setOnInsert: {
        phone: "",
        avatarUrl: "",
        createdAt: now,
      },
    },
    {
      upsert: true,
    },
  );

  const savedAdmin =
    await UserModel.collection.findOne(
      {
        email,
      },
      {
        projection: {
          fullName: 1,
          email: 1,
          role: 1,
          isActive: 1,
        },
      },
    );

  if (!savedAdmin) {
    throw new Error(
      "The administrator account could not be created.",
    );
  }

  console.log("");
  console.log(
    existingAdmin
      ? "✅ Existing account reset as administrator"
      : "✅ New administrator account created",
  );

  console.log(
    `Name: ${savedAdmin.fullName}`,
  );

  console.log(
    `Email: ${savedAdmin.email}`,
  );

  console.log(
    `Role: ${savedAdmin.role}`,
  );

  console.log(
    `Active: ${savedAdmin.isActive}`,
  );

  console.log("");
  console.log(
    "Administrator credentials:",
  );

  console.log(
    `Email: ${email}`,
  );

  console.log(
    `Password: ${password}`,
  );
}

createOrResetAdmin()
  .catch((error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown administrator creation error";

    console.error(
      `❌ ${message}`,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });