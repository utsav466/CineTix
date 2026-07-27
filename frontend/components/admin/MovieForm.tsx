"use client";

import {
  FormEvent,
  useState,
} from "react";

import ImageUploadField from "./ImageUploadField";

import type {
  Movie,
  MovieInput,
  MovieStatus,
} from "@/lib/api/movies.types";

type MovieFormProps = {
  initialMovie?: Movie;
  submitting: boolean;

  onSubmit(
    payload: MovieInput,
  ): Promise<void>;
};

function dateInputValue(
  date?: string,
): string {
  if (!date) {
    return "";
  }

  return new Date(date)
    .toISOString()
    .slice(0, 10);
}

export default function MovieForm({
  initialMovie,
  submitting,
  onSubmit,
}: MovieFormProps) {
  const [title, setTitle] =
    useState(
      initialMovie?.title ||
        "",
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      initialMovie?.description ||
        "",
    );

  const [genre, setGenre] =
    useState(
      initialMovie?.genre.join(
        ", ",
      ) || "",
    );

  const [language, setLanguage] =
    useState(
      initialMovie?.language ||
        "",
    );

  const [duration, setDuration] =
    useState(
      initialMovie?.duration.toString() ||
        "",
    );

  const [
    releaseDate,
    setReleaseDate,
  ] =
    useState(
      dateInputValue(
        initialMovie?.releaseDate,
      ),
    );

  const [rating, setRating] =
    useState(
      initialMovie?.rating ||
        "PG",
    );

  const [director, setDirector] =
    useState(
      initialMovie?.director ||
        "",
    );

  const [cast, setCast] =
    useState(
      initialMovie?.cast.join(
        ", ",
      ) || "",
    );

  const [
    trailerUrl,
    setTrailerUrl,
  ] =
    useState(
      initialMovie?.trailerUrl ||
        "",
    );

  const [
    posterImage,
    setPosterImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    bannerImage,
    setBannerImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    posterRemoved,
    setPosterRemoved,
  ] =
    useState(false);

  const [
    bannerRemoved,
    setBannerRemoved,
  ] =
    useState(false);

  const [status, setStatus] =
    useState<MovieStatus>(
      initialMovie?.status ||
        "coming_soon",
    );

  const [
    featured,
    setFeatured,
  ] =
    useState(
      initialMovie?.featured ||
        false,
    );

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const hasPoster =
      Boolean(
        posterImage ||
        (
          initialMovie
            ?.posterUrl &&
          !posterRemoved
        ),
      );

    if (!hasPoster) {
      setError(
        "Select a movie poster image.",
      );

      return;
    }

    const numericDuration =
      Number(duration);

    if (
      !Number.isFinite(
        numericDuration,
      ) ||
      numericDuration <= 0
    ) {
      setError(
        "Enter a valid movie duration.",
      );

      return;
    }

    await onSubmit({
      title:
        title.trim(),

      description:
        description.trim(),

      genre:
        genre
          .split(",")
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean),

      language:
        language.trim(),

      duration:
        numericDuration,

      releaseDate,

      rating:
        rating.trim(),

      director:
        director.trim(),

      cast:
        cast
          .split(",")
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean),

      trailerUrl:
        trailerUrl.trim(),

      posterImage,
      bannerImage,

      removePoster:
        posterRemoved,

      removeBanner:
        bannerRemoved,

      status,
      featured,
    });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0b0d13] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(
          event,
        );
      }}
      className="space-y-8"
    >
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Basic information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm text-white/65">
              Movie title
            </span>

            <input
              required
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm text-white/65">
              Description
            </span>

            <textarea
              required
              rows={6}
              value={
                description
              }
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label>
            <span className="text-sm text-white/65">
              Genres
            </span>

            <input
              required
              value={genre}
              onChange={(event) =>
                setGenre(
                  event.target.value,
                )
              }
              placeholder="Action, Drama"
              className={
                inputClass
              }
            />
          </label>

          <label>
            <span className="text-sm text-white/65">
              Language
            </span>

            <input
              required
              value={
                language
              }
              onChange={(event) =>
                setLanguage(
                  event.target.value,
                )
              }
              placeholder="Nepali"
              className={
                inputClass
              }
            />
          </label>

          <label>
            <span className="text-sm text-white/65">
              Duration in minutes
            </span>

            <input
              required
              type="number"
              min={1}
              value={
                duration
              }
              onChange={(event) =>
                setDuration(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label>
            <span className="text-sm text-white/65">
              Release date
            </span>

            <input
              required
              type="date"
              value={
                releaseDate
              }
              onChange={(event) =>
                setReleaseDate(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label>
            <span className="text-sm text-white/65">
              Rating
            </span>

            <select
              value={rating}
              onChange={(event) =>
                setRating(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            >
              <option value="G">
                G
              </option>

              <option value="PG">
                PG
              </option>

              <option value="PG-13">
                PG-13
              </option>

              <option value="R">
                R
              </option>
            </select>
          </label>

          <label>
            <span className="text-sm text-white/65">
              Director
            </span>

            <input
              required
              value={
                director
              }
              onChange={(event) =>
                setDirector(
                  event.target.value,
                )
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm text-white/65">
              Cast
            </span>

            <input
              value={cast}
              onChange={(event) =>
                setCast(
                  event.target.value,
                )
              }
              placeholder="Actor One, Actor Two"
              className={
                inputClass
              }
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Movie images
        </h2>

        <p className="mt-2 text-sm text-white/40">
          Upload image files directly.
          You no longer need to paste
          poster or banner URLs.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <ImageUploadField
            label="Poster image"
            description="Recommended vertical 2:3 image."
            currentUrl={
              initialMovie
                ?.posterUrl
            }
            file={
              posterImage
            }
            removed={
              posterRemoved
            }
            required
            maximumSizeMb={8}
            aspect="poster"
            onFileChange={(
              file,
            ) => {
              setPosterImage(
                file,
              );

              setPosterRemoved(
                false,
              );
            }}
            onRemove={() => {
              setPosterImage(
                null,
              );

              setPosterRemoved(
                true,
              );
            }}
          />

          <ImageUploadField
            label="Banner image"
            description="Recommended horizontal 16:6 image."
            currentUrl={
              initialMovie
                ?.bannerUrl
            }
            file={
              bannerImage
            }
            removed={
              bannerRemoved
            }
            maximumSizeMb={8}
            aspect="banner"
            onFileChange={(
              file,
            ) => {
              setBannerImage(
                file,
              );

              setBannerRemoved(
                false,
              );
            }}
            onRemove={() => {
              setBannerImage(
                null,
              );

              setBannerRemoved(
                true,
              );
            }}
          />
        </div>

        <label className="mt-6 block">
          <span className="text-sm text-white/65">
            Trailer link
          </span>

          <p className="mt-1 text-xs text-white/35">
            This remains a link because
            it is a video, not an image.
          </p>

          <input
            type="url"
            value={
              trailerUrl
            }
            onChange={(event) =>
              setTrailerUrl(
                event.target.value,
              )
            }
            placeholder="YouTube trailer link"
            className={
              inputClass
            }
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
        <h2 className="text-lg font-semibold">
          Publishing
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm text-white/65">
              Movie status
            </span>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as MovieStatus,
                )
              }
              className={
                inputClass
              }
            >
              <option value="coming_soon">
                Coming soon
              </option>

              <option value="now_showing">
                Now showing
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </label>

          <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 bg-[#0b0d13] px-4 py-3">
            <input
              type="checkbox"
              checked={
                featured
              }
              onChange={(event) =>
                setFeatured(
                  event.target.checked,
                )
              }
              className="h-5 w-5 accent-red-600"
            />

            <span className="text-sm">
              Feature this movie on the
              homepage
            </span>
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            submitting
          }
          className="rounded-xl bg-red-600 px-7 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Saving movie..."
            : initialMovie
              ? "Update movie"
              : "Add movie"}
        </button>
      </div>
    </form>
  );
}