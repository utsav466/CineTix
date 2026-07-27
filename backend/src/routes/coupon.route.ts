import {
  Router,
} from "express";

import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/coupon.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

const router = Router();

router.post(
  "/validate",
  requireAuth,
  validateCoupon,
);

router.get(
  "/",
  requireAuth,
  requireAdmin,
  listCoupons,
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  createCoupon,
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateCoupon,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteCoupon,
);

export default router;