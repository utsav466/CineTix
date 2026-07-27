import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import multer from "multer";

import { env } from "../config";

const allowedMimeTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

function createImageUpload(
  folder: string,
  maximumSizeMb = 5,
) {
  const uploadDirectory = path.resolve(
    process.cwd(),
    env.uploadDirectory,
    folder,
  );

  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });

  const storage = multer.diskStorage({
    destination(
      _request,
      _file,
      callback,
    ) {
      callback(null, uploadDirectory);
    },

    filename(
      _request,
      file,
      callback,
    ) {
      const extension =
        allowedMimeTypes.get(
          file.mimetype,
        ) || ".jpg";

      const filename = [
        file.fieldname,
        Date.now(),
        crypto.randomUUID(),
      ].join("-");

      callback(
        null,
        `${filename}${extension}`,
      );
    },
  });

  return multer({
    storage,

    limits: {
      fileSize:
        maximumSizeMb *
        1024 *
        1024,
    },

    fileFilter(
      _request,
      file,
      callback,
    ) {
      if (
        allowedMimeTypes.has(
          file.mimetype,
        )
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          "Only JPG, PNG and WebP image files are allowed.",
        ),
      );
    },
  });
}

export const movieImageUpload =
  createImageUpload(
    "movies",
    8,
  );

export const foodImageUpload =
  createImageUpload(
    "foods",
    5,
  );

export const cinemaImageUpload =
  createImageUpload(
    "cinemas",
    8,
  );

export const avatarImageUpload =
  createImageUpload(
    "avatars",
    5,
  );

export const settingsImageUpload =
  createImageUpload(
    "settings",
    8,
  );