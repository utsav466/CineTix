"use client";

import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type SignupFormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type SignupErrors = Partial<
  Record<keyof SignupFormData, string>
>;

const initialFormData: SignupFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<SignupFormData>(
      initialFormData,
    );

  const [errors, setErrors] =
    useState<SignupErrors>({});

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  function updateField(
    field: keyof SignupFormData,
    value: string,
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: SignupErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName =
        "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email,
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9+\-\s]{7,15}$/.test(
        formData.phone,
      )
    ) {
      nextErrors.phone =
        "Enter a valid phone number.";
    }

    if (!formData.password) {
      nextErrors.password =
        "Password is required.";
    } else if (
      formData.password.length < 8
    ) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword =
        "Confirm your password.";
    } else if (
      formData.confirmPassword !==
      formData.password
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
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
       * Temporary frontend-only signup.
       * Replace this with your backend API later.
       */
      localStorage.setItem(
        "cinetix-user",
        JSON.stringify({
          fullName:
            formData.fullName.trim(),
          email:
            formData.email.trim(),
          phone:
            formData.phone.trim(),
        }),
      );

      router.push("/login");
    } catch (error) {
      console.error(
        "Unable to create account:",
        error,
      );

      setErrors({
        email:
          "Unable to create your account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <section
        className="signup-visual"
        aria-label="CineTix promotional image"
      >
        <div className="signup-visual__overlay" />

        <Link
          href="/"
          className="signup-visual__logo"
        >
          CINETIX
        </Link>

        <div className="signup-visual__message">
          <p>Discover. Book. Enjoy.</p>

          <h2>
            Your next cinema experience
            starts here.
          </h2>
        </div>
      </section>

      <section className="signup-panel">
        <div className="signup-panel__glow" />

        <div className="signup-form-container">
          <div className="signup-heading">
            <p>Create your account</p>

            <h1>Create your profile</h1>
          </div>

          <form
            className="signup-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="signup-field">
              <label htmlFor="signup-name">
                Full Name
              </label>

              <input
                id="signup-name"
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="Full Name"
                value={formData.fullName}
                aria-invalid={
                  Boolean(errors.fullName)
                }
                onChange={(event) =>
                  updateField(
                    "fullName",
                    event.target.value,
                  )
                }
              />

              {errors.fullName && (
                <span className="signup-field__error">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-email">
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Example@email.com"
                value={formData.email}
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
                <span className="signup-field__error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-phone">
                Phone Number
              </label>

              <input
                id="signup-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+977 98XXXXXXXX"
                value={formData.phone}
                aria-invalid={
                  Boolean(errors.phone)
                }
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value,
                  )
                }
              />

              {errors.phone && (
                <span className="signup-field__error">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-password">
                Password
              </label>

              <div className="signup-password">
                <input
                  id="signup-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  value={formData.password}
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
                  className="signup-password__toggle"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {errors.password && (
                <span className="signup-field__error">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-confirm-password">
                Confirm Password
              </label>

              <input
                id="signup-confirm-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm Password"
                value={
                  formData.confirmPassword
                }
                aria-invalid={
                  Boolean(
                    errors.confirmPassword,
                  )
                }
                onChange={(event) =>
                  updateField(
                    "confirmPassword",
                    event.target.value,
                  )
                }
              />

              {errors.confirmPassword && (
                <span className="signup-field__error">
                  {
                    errors.confirmPassword
                  }
                </span>
              )}
            </div>

            <button
              type="submit"
              className="signup-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account…"
                : "Sign Up"}
            </button>
          </form>

          <p className="signup-login-link">
            Already have an account?{" "}
            <Link href="/login">
              Sign in
            </Link>
          </p>
        </div>

        <p className="signup-copyright">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </section>
    </main>
  );
}