import {
  Router,
} from "express";

import {
  cancelHeldBooking,
  getBooking,
  getMyBookings,
  holdBookingSeats,
} from "../controllers/booking.controller";

import {
  removeBookingCoupon,
  updateBookingCheckout,
} from "../controllers/checkout.controller";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

const router = Router();

router.use(requireAuth);

router.post(
  "/hold",
  holdBookingSeats,
);

router.get(
  "/my",
  getMyBookings,
);

router.patch(
  "/:id/checkout",
  updateBookingCheckout,
);

router.delete(
  "/:id/coupon",
  removeBookingCoupon,
);

router.delete(
  "/:id/hold",
  cancelHeldBooking,
);

router.get(
  "/:id",
  getBooking,
);

export default router;