import {
  Router,
} from "express";

import {
  initiateKhaltiPayment,
  khaltiCallback,
  verifyKhaltiPayment,
} from "../controllers/payment.controller";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

const router = Router();

/*
 * Khalti redirects the browser here,
 * so this route must remain public.
 */
router.get(
  "/khalti/callback",
  khaltiCallback,
);

router.post(
  "/khalti/initiate",
  requireAuth,
  initiateKhaltiPayment,
);

router.get(
  "/khalti/verify/:bookingId",
  requireAuth,
  verifyKhaltiPayment,
);

export default router;