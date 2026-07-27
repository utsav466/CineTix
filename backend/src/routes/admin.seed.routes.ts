import {
  Router,
} from "express";

import {
  seedBookings,
} from "../controllers/seed-bookings.controller";

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

/*
 * POST /api/admin/seed/bookings
 *
 * Optional query:
 * ?count=10
 */
router.post(
  "/bookings",
  seedBookings,
);

export default router;