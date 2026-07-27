import {
  Router,
} from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/admin.settings.controller";

import {
  requireAdmin,
} from "../middlewares/admin.middleware";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

import {
  settingsImageUpload,
} from "../middlewares/upload.middleware";

const router =
  Router();

router.use(
  requireAuth,
  requireAdmin,
);

router.get(
  "/",
  getSettings,
);

router.patch(
  "/",
  settingsImageUpload.fields([
    {
      name: "logoImage",
      maxCount: 1,
    },
    {
      name: "faviconImage",
      maxCount: 1,
    },
    {
      name: "heroImage",
      maxCount: 1,
    },
  ]),
  updateSettings,
);

export default router;