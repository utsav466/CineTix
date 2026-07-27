"use client";

import {
  Building2,
  Plus,
  Trash2,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import ImageUploadField from "@/components/admin/ImageUploadField";

import {
  createCinema,
  deleteCinema,
  getCinemas,
} from "@/lib/api/cinemas.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  Cinema,
} from "@/lib/api/cinemas.types";

type CinemaForm = {
  name: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  isActive: boolean;
};

const initialForm:
  CinemaForm = {
    name: "",
    city: "",
    address: "",
    phone: "",
    description: "",
    isActive: true,
  };

export default function AdminCinemasPage() {
  const [
    cinemas,
    setCinemas,
  ] =
    useState<Cinema[]>([]);

  const [
    form,
    setForm,
  ] =
    useState<CinemaForm>(
      initialForm,
    );

  const [
    facilitiesText,
    setFacilitiesText,
  ] =
    useState("");

  const [
    image,
    setImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function loadCinemas() {
    try {
      setLoading(true);
      setError("");

      setCinemas(
        await getCinemas(),
      );
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          "Unable to load cinemas",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCinemas();
  }, []);

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!image) {
      setError(
        "Select a cinema image.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createCinema({
        ...form,

        facilities:
          facilitiesText
            .split(",")
            .map((item) =>
              item.trim(),
            )
            .filter(Boolean),

        image,
      });

      setForm(
        initialForm,
      );

      setFacilitiesText(
        "",
      );

      setImage(
        null,
      );

      await loadCinemas();
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Unable to create cinema",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(
    cinema: Cinema,
  ) {
    if (
      !window.confirm(
        `Delete ${cinema.name}?`,
      )
    ) {
      return;
    }

    try {
      await deleteCinema(
        cinema.id,
      );

      await loadCinemas();
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "Unable to delete cinema",
        ),
      );
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
        Venue management
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Cinemas
      </h1>

      <p className="mt-2 text-white/55">
        Add cinema branches before
        creating their halls and seat
        layouts.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={(event) => {
            void handleSubmit(
              event,
            );
          }}
          className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
        >
          <h2 className="text-xl font-black">
            Add Cinema
          </h2>

          <label className="mt-5 block">
            <span className="text-sm text-white/60">
              Cinema name
            </span>

            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name:
                    event.target.value,
                })
              }
              className={
                inputClass
              }
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm text-white/60">
                City
              </span>

              <input
                required
                value={form.city}
                onChange={(event) =>
                  setForm({
                    ...form,
                    city:
                      event.target.value,
                  })
                }
                className={
                  inputClass
                }
              />
            </label>

            <label>
              <span className="text-sm text-white/60">
                Phone
              </span>

              <input
                value={form.phone}
                onChange={(event) =>
                  setForm({
                    ...form,
                    phone:
                      event.target.value,
                  })
                }
                className={
                  inputClass
                }
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm text-white/60">
              Address
            </span>

            <input
              required
              value={
                form.address
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  address:
                    event.target.value,
                })
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm text-white/60">
              Facilities
            </span>

            <input
              value={
                facilitiesText
              }
              onChange={(event) =>
                setFacilitiesText(
                  event.target.value,
                )
              }
              placeholder="Parking, Dolby Atmos, Café"
              className={
                inputClass
              }
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm text-white/60">
              Description
            </span>

            <textarea
              rows={4}
              value={
                form.description
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  description:
                    event.target.value,
                })
              }
              className={
                inputClass
              }
            />
          </label>

          <div className="mt-5">
            <ImageUploadField
              label="Cinema image"
              description="Upload a wide photo of the cinema."
              file={image}
              required
              maximumSizeMb={8}
              aspect="banner"
              onFileChange={
                setImage
              }
              onRemove={() =>
                setImage(null)
              }
            />
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#090b10] px-4 py-3">
            <input
              type="checkbox"
              checked={
                form.isActive
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  isActive:
                    event.target.checked,
                })
              }
              className="h-5 w-5 accent-red-600"
            />

            Cinema is active
          </label>

          <button
            type="submit"
            disabled={
              submitting
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500 disabled:opacity-60"
          >
            <Plus size={18} />

            {submitting
              ? "Adding..."
              : "Add Cinema"}
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-[#11141c]">
          {loading ? (
            <p className="p-8 text-white/50">
              Loading cinemas...
            </p>
          ) : cinemas.length ===
            0 ? (
            <p className="p-8 text-white/50">
              No cinemas added yet.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {cinemas.map(
                (cinema) => (
                  <article
                    key={
                      cinema.id
                    }
                    className="flex items-center justify-between gap-5 p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-red-500/10 text-red-400">
                        {cinema.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              cinema.imageUrl
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2
                            size={22}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {
                            cinema.name
                          }
                        </h3>

                        <p className="mt-1 text-sm text-white/45">
                          {
                            cinema.city
                          }{" "}
                          ·{" "}
                          {
                            cinema.address
                          }
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {
                            cinema.hallCount ||
                            0
                          }{" "}
                          halls
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        void handleDelete(
                          cinema,
                        );
                      }}
                      className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2
                        size={17}
                      />
                    </button>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}