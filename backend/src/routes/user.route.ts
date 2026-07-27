import {
  Router,
} from "express";

import {
  UserController,
} from "../controllers/user.controller";

import {
  requireAuth,
} from "../middlewares/auth.middlewares";

import {
  avatarImageUpload,
} from "../middlewares/upload.middleware";

const router =
  Router();

const controller =
  new UserController();

router.use(
  requireAuth,
);

router.get(
  "/me",
  (
    request,
    response,
    next,
  ) => {
    void controller.me(
      request,
      response,
      next,
    );
  },
);

router.patch(
  "/me",
  (
    request,
    response,
    next,
  ) => {
    void controller.updateMe(
      request,
      response,
      next,
    );
  },
);

router.put(
  "/me",
  avatarImageUpload.single(
    "avatar",
  ),
  (
    request,
    response,
    next,
  ) => {
    void controller.updateMe(
      request,
      response,
      next,
    );
  },
);

router.patch(
  "/me/avatar",
  avatarImageUpload.single(
    "avatar",
  ),
  (
    request,
    response,
    next,
  ) => {
    void controller.updateMyAvatar(
      request,
      response,
      next,
    );
  },
);

export default router;