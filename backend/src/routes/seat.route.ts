import { Router } from "express";
import {
  getSeats,
  reserveSeat,
  bookSeat,
  releaseSeat,
} from "../controllers/seat.controller";

const router = Router();

router.get("/:showtimeId", getSeats);

router.patch("/:id/reserve", reserveSeat);

router.patch("/:id/book", bookSeat);

router.patch("/:id/release", releaseSeat);

export default router;