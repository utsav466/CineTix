import {
  Router,
} from "express";

import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controller";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

const router =
  Router();

router.post(
  "/register",
  register,
);

router.post(
  "/login",
  login,
);

router.get(
  "/me",
  requireAuth,
  getMe,
);

router.post(
  "/logout",
  logout,
);

export default router;