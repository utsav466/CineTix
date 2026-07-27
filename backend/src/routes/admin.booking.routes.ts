import {
  Router,
} from "express";

import {
  adminGetBooking,
  adminListBookings,
  adminUpdateBookingStatus,
} from "../controllers/booking.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

const router =
  Router();

router.use(
  requireAuth,
  requireAdmin,
);

router.get(
  "/",
  adminListBookings,
);

router.get(
  "/:id",
  adminGetBooking,
);

router.patch(
  "/:id/status",
  adminUpdateBookingStatus,
);

export default router;