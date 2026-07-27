"use client";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Film,
  LockKeyhole,
  Mail,
} from "lucide-react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

function safeRedirectPath(
  value: string | null,
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/";
  }

  return value;
}

function LoginContent() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const {
    login,
    authenticated,
    loading:
      authLoading,
    user,
  } = useAuth();

  const redirectPath =
    safeRedirectPath(
      searchParams.get(
        "redirect",
      ),
    );

  const registered =
    searchParams.get(
      "registered",
    ) === "true";

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    rememberMe,
    setRememberMe,
  ] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

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

  useEffect(() => {
    if (
      authLoading ||
      !authenticated ||
      !user
    ) {
      return;
    }

    const destination =
      user.role ===
      "admin"
        ? "/admin"
        : redirectPath;

    router.replace(
      destination,
    );
  }, [
    authLoading,
    authenticated,
    user,
    redirectPath,
    router,
  ]);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !cleanEmail ||
      !password
    ) {
      setError(
        "Please enter your email and password.",
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      )
    ) {
      setError(
        "Enter a valid email address.",
      );

      return;
    }

    try {
      setSubmitting(
        true,
      );

      setError("");

      const signedInUser =
        await login({
          email:
            cleanEmail,

          password,

          rememberMe,
        });

      const destination =
        signedInUser.role ===
        "admin"
          ? "/admin"
          : redirectPath;

      router.replace(
        destination,
      );

      router.refresh();
    } catch (loginError) {
      setError(
        getApiErrorMessage(
          loginError,
          "Unable to sign in.",
        ),
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  if (
    authLoading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07080c] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-red-500" />

          <p className="mt-4 text-sm text-white/45">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.22),transparent_35%),linear-gradient(135deg,#11141c_0%,#07080c_55%,#020203_100%)]" />

          <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              className="flex w-fit items-center gap-3"
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
                Your next cinema
                experience starts
                here.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/50">
                Sign in to continue
                your booking, access
                your digital tickets
                and review your cinema
                history.
              </p>
            </div>

            <p className="text-sm text-white/30">
              © 2026 CineTix. All
              rights reserved.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Sign in to CineTix
              </h2>

              <p className="mt-3 text-white/45">
                Continue your booking
                and access your digital
                tickets.
              </p>
            </div>

            {registered &&
              !error && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  Your account was
                  created successfully.
                  You can now sign in.
                </div>
              )}

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
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
                    value={email}
                    onChange={(
                      event,
                    ) => {
                      setEmail(
                        event.target.value,
                      );

                      setError("");
                    }}
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={
                      submitting
                    }
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-[#11141c] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:opacity-60"
                  />
                </div>
              </label>

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
                      password
                    }
                    onChange={(
                      event,
                    ) => {
                      setPassword(
                        event.target.value,
                      );

                      setError("");
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={
                      submitting
                    }
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-[#11141c] py-3 pl-12 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:opacity-60"
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
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-white/50">
                  <input
                    type="checkbox"
                    checked={
                      rememberMe
                    }
                    onChange={(
                      event,
                    ) =>
                      setRememberMe(
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 accent-red-600"
                  />

                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="font-semibold text-red-400 transition hover:text-red-300"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-red-600 px-5 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-white/45">
              Don&apos;t have an
              account?{" "}
              <Link
                href="/register"
                className="font-bold text-red-400 hover:text-red-300"
              >
                Create account
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#07080c] text-white/50">
          Loading sign in...
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}