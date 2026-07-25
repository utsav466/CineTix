import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares";

import {
  createBooking,
  myBookings,
  bookingDetail,
  cancelBooking,
} from "../controllers/booking.controller";

const router = Router();

router.use(requireAuth);

router.post("/", createBooking);
router.get("/me", myBookings);
router.get("/:id", bookingDetail);
router.patch("/:id/cancel", cancelBooking);

export default router;