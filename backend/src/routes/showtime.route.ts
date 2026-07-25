import { Router } from "express";
import {
  listShowtimes,
  getShowtime,
  adminCreateShowtime,
  adminUpdateShowtime,
  adminDeleteShowtime,
} from "../controllers/showtime.controller";

import { requireAuth } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

/* Public */
router.get("/", listShowtimes);
router.get("/:id", getShowtime);

/* Admin */
router.post("/", requireAuth, requireAdmin, adminCreateShowtime);
router.patch("/:id", requireAuth, requireAdmin, adminUpdateShowtime);
router.delete("/:id", requireAuth, requireAdmin, adminDeleteShowtime);

export default router;