import {
  apiClient,
} from "./client";

import type {
  AdminBooking,
  AdminDashboardData,
  AdminDashboardMetrics,
  AdminUser,
} from "./dashboard.types";

type UnknownRecord =
  Record<string, unknown>;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stringValue(
  value: unknown,
  fallback = "",
): string {
  return typeof value ===
    "string"
    ? value
    : fallback;
}

function numberValue(
  value: unknown,
): number {
  if (
    typeof value ===
      "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  const parsedValue =
    Number(value);

  return Number.isFinite(
    parsedValue,
  )
    ? parsedValue
    : 0;
}

function booleanValue(
  value: unknown,
  fallback = false,
): boolean {
  return typeof value ===
    "boolean"
    ? value
    : fallback;
}

function recordId(
  value: UnknownRecord,
): string {
  return (
    stringValue(
      value.id,
    ) ||
    stringValue(
      value._id,
    )
  );
}

/*
 * Supports all API response shapes:
 *
 * { data: [...] }
 * { data: { items: [...] } }
 * { data: { users: [...] } }
 * { data: { bookings: [...] } }
 */
function extractArray(
  root: unknown,
  possibleKeys: string[],
): unknown[] {
  if (
    Array.isArray(root)
  ) {
    return root;
  }

  if (!isRecord(root)) {
    return [];
  }

  const data =
    root.data;

  /*
   * Your current users endpoint
   * returns this format:
   *
   * {
   *   success: true,
   *   data: [...]
   * }
   */
  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    isRecord(data)
  ) {
    for (
      const key of
      possibleKeys
    ) {
      const value =
        data[key];

      if (
        Array.isArray(value)
      ) {
        return value;
      }
    }
  }

  /*
   * Also support arrays placed
   * directly on the root object.
   */
  for (
    const key of
    possibleKeys
  ) {
    const value =
      root[key];

    if (
      Array.isArray(value)
    ) {
      return value;
    }
  }

  return [];
}

function normalizeAdminUser(
  value: unknown,
): AdminUser {
  const user =
    isRecord(value)
      ? value
      : {};

  const fullName =
    stringValue(
      user.fullName,
    );

  const username =
    stringValue(
      user.username,
    );

  const email =
    stringValue(
      user.email,
    );

  const rawRole =
    stringValue(
      user.role,
      "customer",
    );

  /*
   * Compatibility for any old
   * database records.
   */
  const role =
    rawRole === "user"
      ? "customer"
      : rawRole;

  return {
    ...user,

    id:
      recordId(user),

    name:
      stringValue(
        user.name,
      ) ||
      fullName ||
      username ||
      email ||
      "Unknown user",

    fullName:
      fullName ||
      stringValue(
        user.name,
      ),

    username,

    email,

    phone:
      stringValue(
        user.phone,
      ),

    role,

    preferredCurrency:
      stringValue(
        user.preferredCurrency,
        "NPR",
      ),

    avatarUrl:
      stringValue(
        user.avatarUrl,
      ),

    isActive:
      booleanValue(
        user.isActive,
        true,
      ),

    createdAt:
      stringValue(
        user.createdAt,
        new Date(0)
          .toISOString(),
      ),

    updatedAt:
      stringValue(
        user.updatedAt,
      ) || undefined,
  } as AdminUser;
}

function normalizeAdminBooking(
  value: unknown,
): AdminBooking {
  const booking =
    isRecord(value)
      ? value
      : {};

  return {
    ...booking,

    id:
      recordId(
        booking,
      ),

    bookingCode:
      stringValue(
        booking.bookingCode,
        "UNKNOWN",
      ),

    totalAmount:
      numberValue(
        booking.totalAmount,
      ),

    status:
      stringValue(
        booking.status,
        "held",
      ),

    paymentStatus:
      stringValue(
        booking.paymentStatus,
        "unpaid",
      ),

    createdAt:
      stringValue(
        booking.createdAt,
        new Date(0)
          .toISOString(),
      ),
  } as AdminBooking;
}

const emptyMetrics:
  AdminDashboardMetrics = {
    totalUsers: 0,
    totalMovies: 0,
    totalCinemas: 0,
    totalShowtimes: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  };

export async function getAdminDashboard():
  Promise<AdminDashboardData> {
  const response =
    await apiClient.get(
      "/admin/dashboard",
    );

  const root =
    response.data;

  const data =
    isRecord(root) &&
    isRecord(root.data)
      ? root.data
      : {};

  const metricsSource =
    isRecord(
      data.metrics,
    )
      ? data.metrics
      : data;

  const recentBookings =
    Array.isArray(
      data.recentBookings,
    )
      ? data.recentBookings
          .map(
            normalizeAdminBooking,
          )
          .filter(
            (booking) =>
              Boolean(
                booking.id,
              ),
          )
      : [];

  return {
    metrics: {
      ...emptyMetrics,

      totalUsers:
        numberValue(
          metricsSource.totalUsers,
        ),

      totalMovies:
        numberValue(
          metricsSource.totalMovies,
        ),

      totalCinemas:
        numberValue(
          metricsSource.totalCinemas,
        ),

      totalShowtimes:
        numberValue(
          metricsSource.totalShowtimes,
        ),

      totalBookings:
        numberValue(
          metricsSource.totalBookings,
        ),

      confirmedBookings:
        numberValue(
          metricsSource.confirmedBookings,
        ),

      pendingBookings:
        numberValue(
          metricsSource.pendingBookings,
        ),

      totalRevenue:
        numberValue(
          metricsSource.totalRevenue,
        ),
    },

    recentBookings,
  };
}

export async function getAdminBookings():
  Promise<AdminBooking[]> {
  const response =
    await apiClient.get(
      "/admin/bookings",
      {
        params: {
          page: 1,
          limit: 100,
        },
      },
    );

  const bookingRows =
    extractArray(
      response.data,
      [
        "items",
        "bookings",
      ],
    );

  return bookingRows
    .map(
      normalizeAdminBooking,
    )
    .filter(
      (booking) =>
        Boolean(
          booking.id,
        ),
    );
}

export async function getAdminUsers():
  Promise<AdminUser[]> {
  const response =
    await apiClient.get(
      "/admin/users",
      {
        params: {
          page: 1,
          limit: 100,
        },
      },
    );

  const userRows =
    extractArray(
      response.data,
      [
        "items",
        "users",
      ],
    );

  return userRows
    .map(
      normalizeAdminUser,
    )
    .filter(
      (user) =>
        Boolean(
          user.id,
        ),
    );
}