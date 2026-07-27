import {
  Router,
} from "express";

import {
  createScreen,
  deleteScreen,
  getScreen,
  listScreens,
  updateScreen,
} from "../controllers/screen.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

const router = Router();

router.get(
  "/",
  listScreens,
);

router.get(
  "/:id",
  getScreen,
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  createScreen,
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateScreen,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteScreen,
);

export default router;