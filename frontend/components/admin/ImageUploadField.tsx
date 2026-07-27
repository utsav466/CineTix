"use client";

import {
  ImageIcon,
  Trash2,
  UploadCloud,
} from "lucide-react";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

type ImageUploadFieldProps = {
  label: string;
  description?: string;

  currentUrl?: string;

  file:
    | File
    | null;

  removed?: boolean;

  required?: boolean;

  maximumSizeMb?: number;

  aspect?:
    | "square"
    | "poster"
    | "banner";

  onFileChange(
    file:
      | File
      | null,
  ): void;

  onRemove(): void;
};

const aspectClasses = {
  square:
    "aspect-square",

  poster:
    "aspect-[2/3]",

  banner:
    "aspect-[16/6]",
};

export default function ImageUploadField({
  label,
  description,
  currentUrl,
  file,
  removed = false,
  required = false,
  maximumSizeMb = 5,
  aspect = "square",
  onFileChange,
  onRemove,
}: ImageUploadFieldProps) {
  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl =
      URL.createObjectURL(
        file,
      );

    setPreviewUrl(
      objectUrl,
    );

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [file]);

  const visibleImage =
    previewUrl ||
    (
      !removed
        ? currentUrl
        : ""
    );

  function handleChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target
        .files?.[0];

    event.target.value =
      "";

    if (!selectedFile) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(
        selectedFile.type,
      )
    ) {
      setError(
        "Select a JPG, PNG or WebP image.",
      );

      return;
    }

    if (
      selectedFile.size >
      maximumSizeMb *
        1024 *
        1024
    ) {
      setError(
        `The image must be ${maximumSizeMb} MB or smaller.`,
      );

      return;
    }

    setError("");

    onFileChange(
      selectedFile,
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white/70">
            {label}

            {required && (
              <span className="ml-1 text-red-400">
                *
              </span>
            )}
          </p>

          {description && (
            <p className="mt-1 text-xs leading-5 text-white/35">
              {description}
            </p>
          )}
        </div>

        {visibleImage && (
          <button
            type="button"
            onClick={
              onRemove
            }
            className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
          >
            <Trash2
              size={14}
            />

            Remove
          </button>
        )}
      </div>

      <label className="mt-3 block cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={
            handleChange
          }
          className="sr-only"
        />

        <div
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#090b10] transition hover:border-red-500/50 ${aspectClasses[aspect]}`}
        >
          {visibleImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                visibleImage
              }
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="px-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <UploadCloud
                  size={23}
                />
              </span>

              <p className="mt-4 font-bold">
                Select image
              </p>

              <p className="mt-1 text-xs text-white/35">
                JPG, PNG or WebP · Maximum{" "}
                {
                  maximumSizeMb
                }{" "}
                MB
              </p>
            </div>
          )}

          {visibleImage && (
            <div className="absolute inset-x-0 bottom-0 bg-black/70 px-4 py-3 text-center text-sm font-bold opacity-0 transition hover:opacity-100">
              <ImageIcon
                size={16}
                className="mr-2 inline"
              />

              Click to replace
            </div>
          )}
        </div>
      </label>

      {file && (
        <p className="mt-2 truncate text-xs text-green-400">
          Selected:{" "}
          {
            file.name
          }
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}