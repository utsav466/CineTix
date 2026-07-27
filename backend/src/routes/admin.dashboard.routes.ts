import {
  Router,
} from "express";

import {
  adminDashboardStats,
} from "../controllers/dashboard.controller";

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
 * Main endpoint used by the frontend.
 */
router.get(
  "/",
  adminDashboardStats,
);

/*
 * Backward-compatible endpoint.
 */
router.get(
  "/stats",
  adminDashboardStats,
);

export default router;