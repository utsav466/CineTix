"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginErrors = Partial<
  Record<"email" | "password", string>
>;

const initialForm: LoginForm = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<LoginForm>(initialForm);

  const [errors, setErrors] =
    useState<LoginErrors>({});

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  function updateField<
    Key extends keyof LoginForm,
  >(
    field: Key,
    value: LoginForm[Key],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (
      field === "email" ||
      field === "password"
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    }
  }

  function validateForm() {
    const nextErrors: LoginErrors = {};

    if (!form.email.trim()) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email,
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password =
        "Password is required.";
    } else if (
      form.password.length < 8
    ) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Temporary frontend-only login.
       * Replace this with your backend login API later.
       */
      localStorage.setItem(
        "cinetix-auth",
        JSON.stringify({
          email: form.email.trim(),
          rememberMe: form.rememberMe,
          loggedInAt:
            new Date().toISOString(),
        }),
      );

      router.push("/");
    } catch (error) {
      console.error(
        "Unable to sign in:",
        error,
      );

      setErrors({
        email:
          "Unable to sign in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section
        className="login-visual"
        aria-label="CineTix promotional image"
      >
        <div className="login-visual__overlay" />

        <Link
          href="/"
          className="login-visual__logo"
        >
          CINETIX
        </Link>

        <div className="login-visual__message">
          <p>Discover. Book. Enjoy.</p>

          <h2>
            Your next cinema experience
            starts here.
          </h2>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel__glow" />

        <div className="login-form-container">
          <div className="login-heading">
            <p>Welcome back</p>

            <h1>
              Welcome Back{" "}
              <span aria-hidden="true">
                👋
              </span>
            </h1>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="login-field">
              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Example@email.com"
                value={form.email}
                aria-invalid={
                  Boolean(errors.email)
                }
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value,
                  )
                }
              />

              {errors.email && (
                <span className="login-field__error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-password">
                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  autoComplete="current-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  aria-invalid={
                    Boolean(
                      errors.password,
                    )
                  }
                  onChange={(event) =>
                    updateField(
                      "password",
                      event.target.value,
                    )
                  }
                />

                <button
                  type="button"
                  className="login-password__toggle"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {errors.password && (
                <span className="login-field__error">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(event) =>
                    updateField(
                      "rememberMe",
                      event.target.checked,
                    )
                  }
                />

                <span>
                  Remember me
                </span>
              </label>

              <Link
                href="/help"
                className="login-forgot-link"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Signing in…"
                : "Sign in"}
            </button>
          </form>

          <p className="login-signup-link">
            Don&apos;t have an account?{" "}
            <Link href="/signup">
              Sign up
            </Link>
          </p>
        </div>

        <p className="login-copyright">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </section>
    </main>
  );
}