import mongoose from "mongoose";

import {
  connectDB,
  disconnectDB,
} from "../database/mongodb";

import {
  UserModel,
} from "../models/user.model";

async function migrateUserRoles():
  Promise<void> {
  try {
    console.log(
      "Starting user-role migration...",
    );

    await connectDB();

    /*
     * Use the raw collection so legacy
     * values can be updated without
     * triggering the current enum first.
     */
    const result =
      await UserModel.collection.updateMany(
        {
          role: "user",
        },
        {
          $set: {
            role:
              "customer",
          },
        },
      );

    console.log(
      `Matched users: ${result.matchedCount}`,
    );

    console.log(
      `Updated users: ${result.modifiedCount}`,
    );

    const remainingLegacyUsers =
      await UserModel.collection.countDocuments(
        {
          role: "user",
        },
      );

    if (
      remainingLegacyUsers >
      0
    ) {
      throw new Error(
        `${remainingLegacyUsers} legacy users still have role "user".`,
      );
    }

    console.log(
      "✅ User-role migration completed successfully.",
    );
  } catch (error) {
    console.error(
      "❌ User-role migration failed:",
      error,
    );

    process.exitCode = 1;
  } finally {
    if (
      mongoose.connection
        .readyState !== 0
    ) {
      await disconnectDB();
    }
  }
}

void migrateUserRoles();