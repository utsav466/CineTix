import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  BookingModel,
} from "../models/booking.model";

type SalesRange =
  | "7d"
  | "30d"
  | "90d";

type SummaryAggregation = {
  _id: null;
  revenue: number;
  bookings: number;
  confirmed: number;
  cancelled: number;
};

type DailyAggregation = {
  date: string;
  revenue: number;
  bookings: number;
  confirmed: number;
};

type TopMovieAggregation = {
  title: string;
  bookings: number;
  revenue: number;
};

function normalizeRange(
  value: unknown,
): SalesRange {
  if (
    value === "7d" ||
    value === "90d"
  ) {
    return value;
  }

  return "30d";
}

function rangeDays(
  range: SalesRange,
): number {
  if (range === "7d") {
    return 7;
  }

  if (range === "90d") {
    return 90;
  }

  return 30;
}

function dayString(
  date: Date,
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

export async function adminSalesReport(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const range =
      normalizeRange(
        request.query.range,
      );

    const days =
      rangeDays(range);

    const end =
      new Date();

    end.setHours(
      23,
      59,
      59,
      999,
    );

    const start =
      new Date(end);

    start.setDate(
      end.getDate() -
        (days - 1),
    );

    start.setHours(
      0,
      0,
      0,
      0,
    );

    const dateMatch = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    const [
      summaryResult,
      dailyResult,
      topMovieResult,
    ] =
      await Promise.all([
        BookingModel.aggregate<SummaryAggregation>([
          {
            $match:
              dateMatch,
          },

          {
            $group: {
              _id: null,

              revenue: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$paymentStatus",
                        "paid",
                      ],
                    },

                    "$totalAmount",

                    0,
                  ],
                },
              },

              bookings: {
                $sum: 1,
              },

              confirmed: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "confirmed",
                      ],
                    },

                    1,

                    0,
                  ],
                },
              },

              cancelled: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "cancelled",
                      ],
                    },

                    1,

                    0,
                  ],
                },
              },
            },
          },
        ]),

        BookingModel.aggregate<DailyAggregation>([
          {
            $match:
              dateMatch,
          },

          {
            $group: {
              _id: {
                $dateToString: {
                  format:
                    "%Y-%m-%d",

                  date:
                    "$createdAt",
                },
              },

              revenue: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$paymentStatus",
                        "paid",
                      ],
                    },

                    "$totalAmount",

                    0,
                  ],
                },
              },

              bookings: {
                $sum: 1,
              },

              confirmed: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "confirmed",
                      ],
                    },

                    1,

                    0,
                  ],
                },
              },
            },
          },

          {
            $project: {
              _id: 0,
              date: "$_id",
              revenue: 1,
              bookings: 1,
              confirmed: 1,
            },
          },

          {
            $sort: {
              date: 1,
            },
          },
        ]),

        BookingModel.aggregate<TopMovieAggregation>([
          {
            $match: {
              ...dateMatch,
              paymentStatus:
                "paid",
            },
          },

          {
            $lookup: {
              from: "movies",
              localField:
                "movieId",
              foreignField:
                "_id",
              as: "movie",
            },
          },

          {
            $unwind:
              "$movie",
          },

          {
            $group: {
              _id:
                "$movie.title",

              bookings: {
                $sum: 1,
              },

              revenue: {
                $sum:
                  "$totalAmount",
              },
            },
          },

          {
            $sort: {
              revenue: -1,
            },
          },

          {
            $limit: 5,
          },

          {
            $project: {
              _id: 0,
              title: "$_id",
              bookings: 1,
              revenue: 1,
            },
          },
        ]),
      ]);

    const summary =
      summaryResult[0] ?? {
        revenue: 0,
        bookings: 0,
        confirmed: 0,
        cancelled: 0,
      };

    const dailyLookup =
      new Map(
        dailyResult.map(
          (item) => [
            item.date,
            item,
          ],
        ),
      );

    const daily:
      DailyAggregation[] = [];

    for (
      let index = 0;
      index < days;
      index += 1
    ) {
      const date =
        new Date(start);

      date.setDate(
        start.getDate() +
          index,
      );

      const key =
        dayString(date);

      daily.push(
        dailyLookup.get(
          key,
        ) ?? {
          date: key,
          revenue: 0,
          bookings: 0,
          confirmed: 0,
        },
      );
    }

    response.status(200).json({
      success: true,

      data: {
        range,
        currency: "NPR",

        revenue:
          summary.revenue,

        bookings:
          summary.bookings,

        confirmed:
          summary.confirmed,

        cancelled:
          summary.cancelled,

        daily,

        topMovies:
          topMovieResult,
      },
    });
  } catch (error) {
    next(error);
  }
}