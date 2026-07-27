"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/contexts/AuthContext";

type AuthGuardProps = {
  children: ReactNode;

  requiredRole?:
    | "customer"
    | "admin";
};

export default function AuthGuard({
  children,
  requiredRole,
}: AuthGuardProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const {
    user,
    loading,
    authenticated,
  } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (
      !authenticated ||
      !user
    ) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          pathname,
        )}`,
      );

      return;
    }

    if (
      requiredRole &&
      user.role !==
        requiredRole
    ) {
      router.replace("/");
    }
  }, [
    authenticated,
    loading,
    pathname,
    requiredRole,
    router,
    user,
  ]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07080c] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-red-500" />

          <p className="mt-4 text-sm text-white/70">
            Checking your CineTix
            session...
          </p>
        </div>
      </main>
    );
  }

  if (
    !authenticated ||
    !user
  ) {
    return null;
  }

  if (
    requiredRole &&
    user.role !==
      requiredRole
  ) {
    return null;
  }

  return children;
}