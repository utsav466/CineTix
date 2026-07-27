import {
  Router,
} from "express";

import {
  createFood,
  deleteFood,
  getFood,
  listFoods,
  updateFood,
} from "../controllers/food.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

import {
  foodImageUpload,
} from "../middlewares/upload.middleware";

const router =
  Router();

router.get(
  "/",
  listFoods,
);

router.get(
  "/:id",
  getFood,
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  foodImageUpload.single(
    "image",
  ),
  createFood,
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  foodImageUpload.single(
    "image",
  ),
  updateFood,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteFood,
);

export default router;