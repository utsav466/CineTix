import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/admin.middleware";
import { seedBookings } from "../controllers/seed.controller";

const router = Router();

router.use(requireAuth, requireAdmin);


// POST /api/admin/seed/bookings?count=15
router.post("/bookings", seedBookings);


export default router;