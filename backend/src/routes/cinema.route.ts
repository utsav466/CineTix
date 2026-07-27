import {
  Router,
} from "express";

import {
  adminCreateCinema,
  adminDeleteCinema,
  adminUpdateCinema,
  getCinema,
  listCinemas,
} from "../controllers/cinema.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

import {
  cinemaImageUpload,
} from "../middlewares/upload.middleware";

const router =
  Router();

router.get(
  "/",
  listCinemas,
);

router.get(
  "/:id",
  getCinema,
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  cinemaImageUpload.single(
    "image",
  ),
  adminCreateCinema,
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  cinemaImageUpload.single(
    "image",
  ),
  adminUpdateCinema,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  adminDeleteCinema,
);

export default router;