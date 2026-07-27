import path from "node:path";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  Request,
  Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config";

import authRoutes from "./routes/auth.route";
import bookingRoutes from "./routes/booking.route";
import cinemaRoutes from "./routes/cinema.route";
import couponRoutes from "./routes/coupon.route";
import foodRoutes from "./routes/food.route";
import movieRoutes from "./routes/movie.route";
import paymentRoutes from "./routes/payment.route";
import screenRoutes from "./routes/screen.route";
import seatRoutes from "./routes/seat.route";
import showtimeRoutes from "./routes/showtime.route";
import userRoutes from "./routes/user.route";

import adminBookingRoutes from "./routes/admin.booking.routes";
import adminDashboardRoutes from "./routes/admin.dashboard.routes";
import adminMovieRoutes from "./routes/admin.movie.routes";
import adminReportsRoutes from "./routes/admin.reports.routes";
import adminSeedRoutes from "./routes/admin.seed.routes";
import adminSettingsRoutes from "./routes/admin.settings.routes";
import adminUserRoutes from "./routes/admin.user.routes";

import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware";

const app = express();

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(
  cors({
    origin(requestOrigin, callback) {
      const allowedOrigins = new Set([
        env.frontendUrl,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ]);

      if (
        !requestOrigin ||
        allowedOrigins.has(requestOrigin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          `CORS blocked origin: ${requestOrigin}`,
        ),
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(cookieParser());

if (env.isDevelopment) {
  app.use(morgan("dev"));
}

app.use(
  "/uploads",
  express.static(
    path.resolve(
      process.cwd(),
      env.uploadDirectory,
    ),
  ),
);

app.get(
  "/",
  (
    _request: Request,
    response: Response,
  ) => {
    response.status(200).json({
      success: true,
      message: "CineTix API is running.",
    });
  },
);

app.get(
  "/api/health",
  (
    _request: Request,
    response: Response,
  ) => {
    response.status(200).json({
      success: true,

      data: {
        service: "CineTix API",
        status: "healthy",
        environment: env.nodeEnv,
        timestamp:
          new Date().toISOString(),
      },
    });
  },
);

/*
 * Public and customer routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);

/*
 * Protected administrator routes
 */
app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes,
);

app.use(
  "/api/admin/bookings",
  adminBookingRoutes,
);

app.use(
  "/api/admin/users",
  adminUserRoutes,
);

app.use(
  "/api/admin/movies",
  adminMovieRoutes,
);

app.use(
  "/api/admin/reports",
  adminReportsRoutes,
);

app.use(
  "/api/admin/settings",
  adminSettingsRoutes,
);

app.use(
  "/api/admin/seed",
  adminSeedRoutes,
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;