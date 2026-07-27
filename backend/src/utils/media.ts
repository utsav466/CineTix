import fs from "node:fs";
import path from "node:path";

import type {
  Request,
} from "express";

import { env } from "../config";

type UploadedFileMap = {
  [fieldName: string]:
    Express.Multer.File[];
};

export function getUploadedFile(
  request: Request,
  fieldName: string,
): Express.Multer.File | undefined {
  if (
    request.file &&
    request.file.fieldname ===
      fieldName
  ) {
    return request.file;
  }

  if (
    Array.isArray(
      request.files,
    )
  ) {
    return request.files.find(
      (file) =>
        file.fieldname ===
        fieldName,
    );
  }

  const files =
    request.files as
      | UploadedFileMap
      | undefined;

  return files?.[
    fieldName
  ]?.[0];
}

export function createPublicUploadUrl(
  file: Express.Multer.File,
): string {
  const uploadRoot = path.resolve(
    process.cwd(),
    env.uploadDirectory,
  );

  const relativePath =
    path
      .relative(
        uploadRoot,
        file.path,
      )
      .split(path.sep)
      .join("/");

  return `${env.backendUrl.replace(
    /\/$/,
    "",
  )}/uploads/${relativePath}`;
}

function parseBoolean(
  value: unknown,
): unknown {
  if (
    value === true ||
    value === "true" ||
    value === "1"
  ) {
    return true;
  }

  if (
    value === false ||
    value === "false" ||
    value === "0"
  ) {
    return false;
  }

  return value;
}

function parseStringArray(
  value: unknown,
): unknown {
  if (
    Array.isArray(value)
  ) {
    return value;
  }

  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(
        normalizedValue,
      );

    if (
      Array.isArray(parsed)
    ) {
      return parsed;
    }
  } catch {
    // Fall back to comma-separated parsing.
  }

  return normalizedValue
    .split(",")
    .map((item) =>
      item.trim(),
    )
    .filter(Boolean);
}

export function parseMultipartBody(
  body: Record<string, unknown>,
  options?: {
    arrayFields?: string[];
    booleanFields?: string[];
  },
): Record<string, unknown> {
  const parsedBody = {
    ...body,
  };

  for (
    const field of
    options?.arrayFields || []
  ) {
    if (
      field in parsedBody
    ) {
      parsedBody[field] =
        parseStringArray(
          parsedBody[field],
        );
    }
  }

  for (
    const field of
    options?.booleanFields || []
  ) {
    if (
      field in parsedBody
    ) {
      parsedBody[field] =
        parseBoolean(
          parsedBody[field],
        );
    }
  }

  return parsedBody;
}

export async function deleteUploadedFile(
  fileUrl?: string,
): Promise<void> {
  if (!fileUrl) {
    return;
  }

  let pathname =
    fileUrl;

  try {
    pathname =
      new URL(
        fileUrl,
        env.backendUrl,
      ).pathname;
  } catch {
    return;
  }

  const uploadMarker =
    "/uploads/";

  const markerIndex =
    pathname.indexOf(
      uploadMarker,
    );

  if (markerIndex < 0) {
    return;
  }

  const relativePath =
    decodeURIComponent(
      pathname.slice(
        markerIndex +
          uploadMarker.length,
      ),
    );

  const uploadRoot =
    path.resolve(
      process.cwd(),
      env.uploadDirectory,
    );

  const filePath =
    path.resolve(
      uploadRoot,
      relativePath,
    );

  const validPrefix =
    `${uploadRoot}${path.sep}`;

  if (
    filePath !== uploadRoot &&
    !filePath.startsWith(
      validPrefix,
    )
  ) {
    return;
  }

  try {
    await fs.promises.unlink(
      filePath,
    );
  } catch (
    error: unknown
  ) {
    const fileError =
      error as
        NodeJS.ErrnoException;

    if (
      fileError.code !==
      "ENOENT"
    ) {
      console.error(
        "Unable to delete uploaded file:",
        fileError,
      );
    }
  }
}