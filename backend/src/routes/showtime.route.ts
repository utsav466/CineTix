import {
  Router,
} from "express";

import {
  createShowtime,
  deleteShowtime,
  getShowtime,
  listShowtimes,
  updateShowtime,
} from "../controllers/showtime.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

const router = Router();

/*
 * Public customer routes
 */
router.get(
  "/",
  listShowtimes,
);

router.get(
  "/:id",
  getShowtime,
);

/*
 * Administrator routes
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createShowtime,
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateShowtime,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteShowtime,
);

export default router;