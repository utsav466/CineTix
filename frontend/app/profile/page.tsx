"use client";

import {
  Camera,
  CheckCircle2,
  Mail,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import CustomerHeader from "@/components/layout/CustomerHeader";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import {
  updateProfile,
} from "@/lib/api/profile.api";

type Currency =
  | "NPR"
  | "USD"
  | "INR";

const MAX_AVATAR_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getInitials(
  fullName?: string,
  email?: string,
): string {
  const source =
    fullName?.trim() ||
    email?.trim() ||
    "User";

  const parts =
    source
      .split(/\s+/)
      .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const {
    user,
    refreshUser,
  } = useAuth();

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    fullName,
    setFullName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    currency,
    setCurrency,
  ] =
    useState<Currency>(
      "NPR",
    );

  const [
    avatar,
    setAvatar,
  ] =
    useState<File | null>(
      null,
    );

  const [
    avatarPreview,
    setAvatarPreview,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setFullName(
      user.fullName ||
        user.name ||
        "",
    );

    setEmail(
      user.email ||
        "",
    );

    setPhone(
      user.phone ||
        "",
    );

    if (
      user.preferredCurrency ===
        "USD" ||
      user.preferredCurrency ===
        "INR"
    ) {
      setCurrency(
        user.preferredCurrency,
      );
    } else {
      setCurrency(
        "NPR",
      );
    }
  }, [user]);

  useEffect(() => {
    if (!avatar) {
      setAvatarPreview("");

      return;
    }

    const objectUrl =
      URL.createObjectURL(
        avatar,
      );

    setAvatarPreview(
      objectUrl,
    );

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [avatar]);

  const displayName =
    user?.fullName ||
    user?.name ||
    "CineTix User";

  const visibleAvatar =
    avatarPreview ||
    user?.avatarUrl ||
    "";

  const initials =
    useMemo(
      () =>
        getInitials(
          displayName,
          user?.email,
        ),
      [
        displayName,
        user?.email,
      ],
    );

  function handleAvatarChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ): void {
    const selectedFile =
      event.target
        .files?.[0];

    event.target.value =
      "";

    if (!selectedFile) {
      return;
    }

    setError("");
    setSuccess("");

    if (
      !ALLOWED_IMAGE_TYPES.includes(
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
      MAX_AVATAR_SIZE
    ) {
      setError(
        "Profile image must be 5 MB or smaller.",
      );

      return;
    }

    setAvatar(
      selectedFile,
    );
  }

  function clearSelectedAvatar(): void {
    setAvatar(null);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedName =
      fullName.trim();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const normalizedPhone =
      phone.trim();

    if (
      normalizedName.length <
      2
    ) {
      setError(
        "Full name must contain at least 2 characters.",
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      )
    ) {
      setError(
        "Enter a valid email address.",
      );

      return;
    }

    try {
      setSaving(true);

      await updateProfile({
        fullName:
          normalizedName,

        email:
          normalizedEmail,

        phone:
          normalizedPhone,

        preferredCurrency:
          currency,

        avatar,
      });

      await refreshUser();

      setAvatar(null);

      setSuccess(
        "Your profile was updated successfully.",
      );
    } catch (updateError) {
      setError(
        getApiErrorMessage(
          updateError,
          "Unable to update your profile.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <CustomerHeader />

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
          Account settings
        </p>

        <h1 className="mt-3 text-4xl font-black">
          My Profile
        </h1>

        <p className="mt-3 text-white/45">
          Manage your personal details,
          preferred currency and profile
          picture.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#11141c] p-6">
            <div className="text-center">
              <div className="relative mx-auto h-32 w-32">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white/5 bg-red-600 text-4xl font-black shadow-2xl shadow-red-600/15">
                  {visibleAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        visibleAvatar
                      }
                      alt={`${displayName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current
                      ?.click()
                  }
                  disabled={saving}
                  className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#11141c] bg-red-600 text-white shadow-lg transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Choose profile picture"
                >
                  <Camera
                    size={18}
                  />
                </button>
              </div>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleAvatarChange
                }
                className="hidden"
              />

              <h2 className="mt-5 truncate text-lg font-black">
                {displayName}
              </h2>

              <p className="mt-1 truncate text-sm text-white/40">
                {user?.email}
              </p>

              {user?.username && (
                <p className="mt-1 truncate text-xs text-white/30">
                  @
                  {
                    user.username
                  }
                </p>
              )}

              <span className="mt-4 inline-block rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold capitalize text-red-300">
                {user?.role ||
                  "customer"}
              </span>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current
                    ?.click()
                }
                disabled={saving}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Camera
                  size={17}
                />

                {avatar
                  ? "Choose Another Image"
                  : user?.avatarUrl
                    ? "Replace Profile Picture"
                    : "Upload Profile Picture"}
              </button>

              {avatar && (
                <div className="mt-3 rounded-xl border border-green-500/15 bg-green-500/5 p-3">
                  <p className="truncate text-xs font-semibold text-green-400">
                    {avatar.name}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {(
                      avatar.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearSelectedAvatar
                    }
                    disabled={saving}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    <X
                      size={14}
                    />

                    Cancel selected image
                  </button>
                </div>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-white/30">
                JPG, PNG or WebP.
                Maximum file size:
                5 MB.
              </p>
            </div>
          </aside>

          <form
            onSubmit={(
              event,
            ) => {
              void handleSubmit(
                event,
              );
            }}
            className="rounded-2xl border border-white/10 bg-[#11141c] p-6 sm:p-8"
          >
            <div>
              <h2 className="text-xl font-black">
                Personal Information
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Update the information
                connected to your
                CineTix account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300"
              >
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {success}
                </span>
              </div>
            )}

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-white/65">
                  Full name
                </span>

                <div className="relative mt-2">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    required
                    value={
                      fullName
                    }
                    onChange={(
                      event,
                    ) => {
                      setFullName(
                        event.target
                          .value,
                      );

                      setError("");
                      setSuccess("");
                    }}
                    disabled={
                      saving
                    }
                    placeholder="Enter your full name"
                    className={
                      inputClass
                    }
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-white/65">
                  Phone number
                </span>

                <div className="relative mt-2">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type="tel"
                    value={
                      phone
                    }
                    onChange={(
                      event,
                    ) => {
                      setPhone(
                        event.target
                          .value,
                      );

                      setError("");
                      setSuccess("");
                    }}
                    disabled={
                      saving
                    }
                    placeholder="+977 98XXXXXXXX"
                    className={
                      inputClass
                    }
                  />
                </div>
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-white/65">
                Email address
              </span>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(
                    event,
                  ) => {
                    setEmail(
                      event.target
                        .value,
                    );

                    setError("");
                    setSuccess("");
                  }}
                  disabled={
                    saving
                  }
                  placeholder="you@example.com"
                  className={
                    inputClass
                  }
                />
              </div>
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-white/65">
                Preferred currency
              </span>

              <select
                value={
                  currency
                }
                onChange={(
                  event,
                ) => {
                  setCurrency(
                    event.target
                      .value as Currency,
                  );

                  setError("");
                  setSuccess("");
                }}
                disabled={
                  saving
                }
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 text-white outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="NPR">
                  NPR — Nepalese Rupee
                </option>

                <option value="USD">
                  USD — US Dollar
                </option>

                <option value="INR">
                  INR — Indian Rupee
                </option>
              </select>
            </label>

            {user?.username && (
              <div className="mt-5">
                <span className="text-sm font-semibold text-white/65">
                  Username
                </span>

                <div className="mt-2 min-h-12 rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3 text-white/40">
                  @
                  {
                    user.username
                  }
                </div>

                <p className="mt-2 text-xs text-white/30">
                  The username is used
                  as an account
                  identifier and cannot
                  currently be changed.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                disabled={
                  saving
                }
                onClick={() => {
                  if (!user) {
                    return;
                  }

                  setFullName(
                    user.fullName ||
                      user.name ||
                      "",
                  );

                  setEmail(
                    user.email ||
                      "",
                  );

                  setPhone(
                    user.phone ||
                      "",
                  );

                  setCurrency(
                    user.preferredCurrency ===
                      "USD" ||
                    user.preferredCurrency ===
                      "INR"
                      ? user.preferredCurrency
                      : "NPR",
                  );

                  setAvatar(null);
                  setError("");
                  setSuccess("");
                }}
                className="min-h-12 rounded-xl border border-white/10 px-5 font-bold text-white/55 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset Changes
              </button>

              <button
                type="submit"
                disabled={
                  saving
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save
                  size={18}
                />

                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}