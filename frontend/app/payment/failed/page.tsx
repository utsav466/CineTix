"use client";

import {
  CircleX,
} from "lucide-react";

import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

export default function PaymentFailedPage() {
  const searchParams =
    useSearchParams();

  const reason =
    searchParams.get(
      "reason",
    ) ||
    "payment_failed";

  const bookingId =
    searchParams.get(
      "bookingId",
    );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07080c] px-5 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-[#11141c] p-8 text-center">
        <CircleX
          size={58}
          className="mx-auto text-red-400"
        />

        <h1 className="mt-5 text-3xl font-bold">
          Payment Not Completed
        </h1>

        <p className="mt-3 text-white/50">
          Reason:{" "}
          {reason.replaceAll(
            "_",
            " ",
          )}
        </p>

        <div className="mt-7 flex flex-col gap-3">
          {bookingId && (
            <Link
              href={`/checkout/${bookingId}`}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
            >
              Return to checkout
            </Link>
          )}

          <Link
            href="/"
            className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white/70 hover:bg-white/5"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}