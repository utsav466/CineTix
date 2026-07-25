import { Router } from "express";
import {
  getPublicMovie,
  listPublicMovies,
} from "../controllers/movie.controller";

const router = Router();

router.get("/", listPublicMovies);
router.get("/:id", getPublicMovie);

export default router;