import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/admin.middleware";

import {
  adminListBookings,
  adminGetBooking,
  adminUpdateBookingStatus,
} from "../controllers/booking.controller";


const router = Router();


router.use(requireAuth, requireAdmin);



router.get("/", adminListBookings);


router.get("/:id", adminGetBooking);


router.patch("/:id/status", adminUpdateBookingStatus);



export default router;