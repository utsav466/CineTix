"use client";

import {
  Clock3,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  verifyKhaltiPayment,
} from "@/lib/api/payments.api";

export default function PaymentPendingPage() {
  const searchParams =
    useSearchParams();

  const bookingId =
    searchParams.get(
      "bookingId",
    ) || "";

  const [checking, setChecking] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function checkPayment() {
    if (!bookingId) {
      return;
    }

    try {
      setChecking(true);

      const result =
        await verifyKhaltiPayment(
          bookingId,
        );

      setMessage(
        `Khalti status: ${
          result.khaltiStatus ||
          result.paymentStatus
        }`,
      );

      if (
        result.khaltiStatus ===
        "Completed"
      ) {
        window.location.href =
          `/tickets/${bookingId}`;
      }
    } catch {
      setMessage(
        "Unable to verify payment right now.",
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07080c] px-5 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-[#11141c] p-8 text-center">
        <Clock3
          size={58}
          className="mx-auto text-amber-400"
        />

        <h1 className="mt-5 text-3xl font-bold">
          Payment Pending
        </h1>

        <p className="mt-3 text-white/50">
          Khalti has not confirmed the
          payment yet.
        </p>

        {message && (
          <p className="mt-4 rounded-xl bg-white/5 p-3 text-sm">
            {message}
          </p>
        )}

        <button
          type="button"
          disabled={
            checking ||
            !bookingId
          }
          onClick={() => {
            void checkPayment();
          }}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={
              checking
                ? "animate-spin"
                : ""
            }
          />

          {checking
            ? "Checking..."
            : "Check payment status"}
        </button>

        <Link
          href="/"
          className="mt-3 block rounded-xl border border-white/10 px-5 py-3 font-semibold text-white/70 hover:bg-white/5"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}