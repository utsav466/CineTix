"use client";

import {
  Check,
  Eye,
  EyeOff,
  Film,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import {
  registerUser,
} from "@/lib/api/auth.api";

type SignupFormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type SignupErrors = Partial<
  Record<
    keyof SignupFormData,
    string
  >
> & {
  form?: string;
};

const initialFormData:
  SignupFormData = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

function passwordStrength(
  password: string,
): {
  score: number;
  label: string;
} {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (
    /[A-Z]/.test(
      password,
    )
  ) {
    score += 1;
  }

  if (
    /[0-9]/.test(
      password,
    )
  ) {
    score += 1;
  }

  if (
    /[^A-Za-z0-9]/.test(
      password,
    )
  ) {
    score += 1;
  }

  if (score <= 1) {
    return {
      score,
      label: "Weak",
    };
  }

  if (score <= 3) {
    return {
      score,
      label: "Good",
    };
  }

  return {
    score,
    label: "Strong",
  };
}

export default function RegisterPage() {
  const router =
    useRouter();

  const [
    formData,
    setFormData,
  ] =
    useState<SignupFormData>(
      initialFormData,
    );

  const [
    errors,
    setErrors,
  ] =
    useState<SignupErrors>(
      {},
    );

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  const [
    acceptTerms,
    setAcceptTerms,
  ] =
    useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const strength =
    useMemo(
      () =>
        passwordStrength(
          formData.password,
        ),
      [formData.password],
    );

  function updateField(
    field:
      keyof SignupFormData,
    value: string,
  ) {
    setFormData(
      (currentData) => ({
        ...currentData,
        [field]: value,
      }),
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        [field]:
          undefined,
        form:
          undefined,
      }),
    );
  }

  function validateForm():
    boolean {
    const nextErrors:
      SignupErrors = {};

    if (
      !formData.fullName.trim()
    ) {
      nextErrors.fullName =
        "Full name is required.";
    } else if (
      formData.fullName
        .trim()
        .length < 2
    ) {
      nextErrors.fullName =
        "Enter your full name.";
    }

    if (
      !formData.email.trim()
    ) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (
      !formData.phone.trim()
    ) {
      nextErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9+\-\s()]{7,18}$/.test(
        formData.phone.trim(),
      )
    ) {
      nextErrors.phone =
        "Enter a valid phone number.";
    }

    if (
      !formData.password
    ) {
      nextErrors.password =
        "Password is required.";
    } else if (
      formData.password
        .length < 8
    ) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    if (
      !formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Confirm your password.";
    } else if (
      formData.confirmPassword !==
      formData.password
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!acceptTerms) {
      nextErrors.form =
        "You must accept the Terms and Privacy Policy.";
    }

    setErrors(
      nextErrors,
    );

    return (
      Object.keys(
        nextErrors,
      ).length === 0
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(
        true,
      );

      setErrors({});

      await registerUser({
        fullName:
          formData.fullName.trim(),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        phone:
          formData.phone.trim(),

        password:
          formData.password,

        confirmPassword:
          formData.confirmPassword,
      });

      router.push(
        "/login?registered=true",
      );

      router.refresh();
    } catch (error) {
      setErrors({
        form:
          getApiErrorMessage(
            error,
            "Unable to create your account.",
          ),
      });
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  const inputClass =
    "min-h-12 w-full rounded-xl border border-white/10 bg-[#11141c] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.24),transparent_35%),linear-gradient(145deg,#151821_0%,#08090d_55%,#020203_100%)]" />

          <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 rounded-xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-xl shadow-red-600/20">
                <Film
                  size={24}
                />
              </span>

              <div>
                <p className="text-2xl font-black">
                  CineTix
                </p>

                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Cinema booking
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-500">
                Discover. Book. Enjoy.
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight xl:text-6xl">
                Create your account
                and book your next
                movie.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/50">
                Save your bookings,
                access digital tickets
                and complete cinema
                payments securely.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Live seat availability",
                  "Secure Khalti payments",
                  "Instant digital tickets",
                ].map(
                  (feature) => (
                    <div
                      key={
                        feature
                      }
                      className="flex items-center gap-3 text-white/60"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                        <Check
                          size={15}
                        />
                      </span>

                      {feature}
                    </div>
                  ),
                )}
              </div>
            </div>

            <p className="text-sm text-white/30">
              © 2026 CineTix. All
              rights reserved.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:py-16">
          <div className="w-full max-w-xl">
            <Link
              href="/"
              className="mb-10 flex items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600">
                <Film
                  size={22}
                />
              </span>

              <div>
                <p className="text-xl font-black">
                  CineTix
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Cinema booking
                </p>
              </div>
            </Link>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
                Join CineTix
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-white/45">
                Enter your information
                to start booking cinema
                tickets.
              </p>
            </div>

            {errors.form && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {errors.form}
              </div>
            )}

            <form
              onSubmit={(event) => {
                void handleSubmit(
                  event,
                );
              }}
              className="mt-8 space-y-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
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
                      type="text"
                      value={
                        formData.fullName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "fullName",
                          event.target.value,
                        )
                      }
                      autoComplete="name"
                      placeholder="Your full name"
                      disabled={
                        isSubmitting
                      }
                      aria-invalid={
                        Boolean(
                          errors.fullName,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  {errors.fullName && (
                    <p className="mt-2 text-xs text-red-400">
                      {
                        errors.fullName
                      }
                    </p>
                  )}
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
                        formData.phone
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "phone",
                          event.target.value,
                        )
                      }
                      autoComplete="tel"
                      placeholder="+977 98XXXXXXXX"
                      disabled={
                        isSubmitting
                      }
                      aria-invalid={
                        Boolean(
                          errors.phone,
                        )
                      }
                      className={
                        inputClass
                      }
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-white/65">
                  Email address
                </span>

                <div className="relative mt-2">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={
                      isSubmitting
                    }
                    aria-invalid={
                      Boolean(
                        errors.email,
                      )
                    }
                    className={
                      inputClass
                    }
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-white/65">
                    Password
                  </span>

                  <div className="relative mt-2">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        formData.password
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "password",
                          event.target.value,
                        )
                      }
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      disabled={
                        isSubmitting
                      }
                      aria-invalid={
                        Boolean(
                          errors.password,
                        )
                      }
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current,
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/5 hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                        />
                      ) : (
                        <Eye
                          size={18}
                        />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs text-red-400">
                      {
                        errors.password
                      }
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-white/65">
                    Confirm password
                  </span>

                  <div className="relative mt-2">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "confirmPassword",
                          event.target.value,
                        )
                      }
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      disabled={
                        isSubmitting
                      }
                      aria-invalid={
                        Boolean(
                          errors.confirmPassword,
                        )
                      }
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) =>
                            !current,
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/5 hover:text-white"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmation password"
                          : "Show confirmation password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          size={18}
                        />
                      ) : (
                        <Eye
                          size={18}
                        />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-400">
                      {
                        errors.confirmPassword
                      }
                    </p>
                  )}
                </label>
              </div>

              {formData.password && (
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">
                      Password strength
                    </span>

                    <span
                      className={
                        strength.score >=
                        4
                          ? "font-semibold text-green-400"
                          : strength.score >=
                            2
                          ? "font-semibold text-amber-400"
                          : "font-semibold text-red-400"
                      }
                    >
                      {strength.label}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {[
                      1,
                      2,
                      3,
                      4,
                    ].map(
                      (value) => (
                        <span
                          key={
                            value
                          }
                          className={`h-1.5 rounded-full ${
                            strength.score >=
                            value
                              ? strength.score >=
                                4
                                ? "bg-green-500"
                                : strength.score >=
                                  2
                                ? "bg-amber-500"
                                : "bg-red-500"
                              : "bg-white/10"
                          }`}
                        />
                      ),
                    )}
                  </div>
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <input
                  type="checkbox"
                  checked={
                    acceptTerms
                  }
                  onChange={(
                    event,
                  ) =>
                    setAcceptTerms(
                      event.target.checked,
                    )
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-red-600"
                />

                <span className="text-sm leading-6 text-white/50">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-red-400 hover:text-red-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-red-400 hover:text-red-300"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-red-600 px-5 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-white/45">
              Already have an
              account?{" "}
              <Link
                href="/login"
                className="font-bold text-red-400 hover:text-red-300"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <Link
                href="/"
                className="block text-center text-sm font-semibold text-white/40 transition hover:text-white"
              >
                Return to CineTix
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}