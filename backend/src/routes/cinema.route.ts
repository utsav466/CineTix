import { Router } from "express";
import {
  listCinemas,
  getCinema,
  adminCreateCinema,
  adminUpdateCinema,
  adminDeleteCinema,
} from "../controllers/cinema.controller";

import { requireAuth } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

/* -------------------------------- */
/* Public Routes                    */
/* -------------------------------- */

router.get("/", listCinemas);
router.get("/:id", getCinema);

/* -------------------------------- */
/* Admin Routes                     */
/* -------------------------------- */

router.post("/", requireAuth, requireAdmin, adminCreateCinema);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  adminUpdateCinema
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  adminDeleteCinema
);

export default router;