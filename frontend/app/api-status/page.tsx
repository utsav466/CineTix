"use client";

import { useEffect, useState } from "react";


import {
  getApiHealth,
  HealthData,
} from "@/lib/api/system.api";
import { getApiErrorMessage } from "@/lib/api/client";

type Status =
  | "checking"
  | "connected"
  | "failed";

export default function ApiStatusPage() {
  const [status, setStatus] =
    useState<Status>("checking");

  const [health, setHealth] =
    useState<HealthData | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function checkConnection(): Promise<void> {
    try {
      setStatus("checking");
      setErrorMessage("");

      const response = await getApiHealth();

      setHealth(response.data);
      setStatus("connected");
    } catch (error) {
      setHealth(null);
      setStatus("failed");

      setErrorMessage(
        getApiErrorMessage(
          error,
          "Could not connect to the CineTix API",
        ),
      );
    }
  }

  useEffect(() => {
    void checkConnection();
  }, []);

  return (
    <main className="min-h-screen bg-[#07080c] px-6 py-20 text-white">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#11131a] p-8 shadow-2xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-red-500">
          CineTix System Check
        </p>

        <h1 className="text-3xl font-bold">
          Frontend–Backend Connection
        </h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
          {status === "checking" && (
            <p className="text-gray-300">
              Checking the API connection...
            </p>
          )}

          {status === "connected" && health && (
            <div>
              <p className="text-lg font-semibold text-green-400">
                API connected successfully
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400">
                    Environment
                  </dt>

                  <dd className="font-medium">
                    {health.environment}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400">
                    Server time
                  </dt>

                  <dd className="font-medium">
                    {new Date(
                      health.timestamp,
                    ).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {status === "failed" && (
            <div>
              <p className="text-lg font-semibold text-red-400">
                API connection failed
              </p>

              <p className="mt-2 text-sm text-gray-300">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            void checkConnection();
          }}
          className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === "checking"}
        >
          {status === "checking"
            ? "Checking..."
            : "Check Again"}
        </button>
      </section>
    </main>
  );
}