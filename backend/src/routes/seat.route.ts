import {
  Router,
} from "express";

import {
  getShowtimeSeats,
} from "../controllers/seat.controller";

const router = Router();

router.get(
  "/showtime/:showtimeId",
  getShowtimeSeats,
);

export default router;