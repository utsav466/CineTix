import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import { connectDB } from "./database/mongodb";
import { PORT } from "./config";

// =========================
// Authentication
// =========================
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin.user.routes";

// =========================
// Movies
// =========================
import movieRoutes from "./routes/movie.route";
import adminMovieRoutes from "./routes/admin.movie.routes";

// =========================
// Cinemas
// =========================
import cinemaRoutes from "./routes/cinema.route";

// =========================
// Showtimes
// =========================
import showtimeRoutes from "./routes/showtime.route";

// =========================
// Seats
// =========================
import seatRoutes from "./routes/seat.route";

// =========================
// Bookings
// =========================
import bookingRoutes from "./routes/booking.route";
import adminBookingRoutes from "./routes/admin.booking.routes";

// =========================
// Admin
// =========================
import adminDashboardRoutes from "./routes/admin.dashboard.routes";
import adminSeedRoutes from "./routes/admin.seed.routes";
import adminSettingsRoutes from "./routes/admin.settings.routes";
import adminReportsRoutes from "./routes/admin.reports.routes";

// =========================
// Payments
// =========================
import paymentRoutes from "./routes/payment.route";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3005",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// =========================
// Static Uploads
// =========================
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// =========================
// API Routes
// =========================

// Authentication
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);
app.use("/api/admin/users", adminUserRoutes);

// Movies
app.use("/api/movies", movieRoutes);
app.use("/api/admin/movies", adminMovieRoutes);

// Cinemas
app.use("/api/cinemas", cinemaRoutes);

// Showtimes
app.use("/api/showtimes", showtimeRoutes);

// Seats
app.use("/api/seats", seatRoutes);

// Bookings
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);

// Admin
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/seed", adminSeedRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/reports", adminReportsRoutes);

// Payments
app.use("/api/payments", paymentRoutes);

// =========================
// Root Route
// =========================
app.get("/", (_: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CineTix API 🚀",
  });
});

// =========================
// Start Server
// =========================
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🚀 CineTix API running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;