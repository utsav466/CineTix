import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/admin.middleware";
import { adminGetOrder, adminListOrders, adminUpdateOrderStatus } from "../controllers/booking.controller";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", adminListOrders);
router.get("/:id", adminGetOrder);
router.patch("/:id/status", adminUpdateOrderStatus);

export default router;