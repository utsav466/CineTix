import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/admin.middleware";

import {
  adminCreateMovie,
  adminDeleteMovie,
  adminGetMovie,
  adminListMovies,
  adminUpdateMovie,
} from "../controllers/movie.controller";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", adminListMovies);
router.post("/", adminCreateMovie);
router.get("/:id", adminGetMovie);
router.patch("/:id", adminUpdateMovie);
router.delete("/:id", adminDeleteMovie);

export default router;