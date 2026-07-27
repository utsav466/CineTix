import {
  Router,
} from "express";

import {
  adminCreateMovie,
  adminDeleteMovie,
  adminGetMovie,
  adminListMovies,
  adminMovieStatistics,
  adminUpdateMovie,
} from "../controllers/movie.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

import {
  movieImageUpload,
} from "../middlewares/upload.middleware";

const router =
  Router();

router.use(
  requireAuth,
  requireAdmin,
);

router.get(
  "/statistics",
  adminMovieStatistics,
);

router.get(
  "/",
  adminListMovies,
);

router.post(
  "/",
  movieImageUpload.fields([
    {
      name: "posterImage",
      maxCount: 1,
    },
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  adminCreateMovie,
);

router.get(
  "/:id",
  adminGetMovie,
);

router.patch(
  "/:id",
  movieImageUpload.fields([
    {
      name: "posterImage",
      maxCount: 1,
    },
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  adminUpdateMovie,
);

router.delete(
  "/:id",
  adminDeleteMovie,
);

export default router;