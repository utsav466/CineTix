"use client";

import {
  Building2,
  MapPin,
  Phone,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import CustomerHeader from "@/components/layout/CustomerHeader";

import {
  getCustomerCinemas,
} from "@/lib/api/customer.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

import type {
  CustomerCinema,
} from "@/lib/api/customer.types";

export default function CinemasPage() {
  const [
    cinemas,
    setCinemas,
  ] =
    useState<CustomerCinema[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadCinemas() {
      try {
        setCinemas(
          await getCustomerCinemas(),
        );
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load cinemas.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCinemas();
  }, []);

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <CustomerHeader />

      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
          Locations
        </p>

        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          CineTix Cinemas
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-white/50">
          Browse cinema locations and
          choose the venue that works
          best for you.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-10 text-white/45">
            Loading cinemas...
          </p>
        ) : cinemas.length ===
          0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#11141c] p-10 text-center">
            <Building2
              size={42}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-4 text-xl font-bold">
              No cinemas available
            </h2>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {cinemas.map(
              (cinema) => (
                <article
                  key={cinema.id}
                  className="rounded-2xl border border-white/10 bg-[#11141c] p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Building2
                      size={23}
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-black">
                    {cinema.name}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-white/50">
                    <p className="flex items-start gap-2">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0"
                      />

                      {[
                        cinema.address,
                        cinema.city,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                        "Location unavailable"}
                    </p>

                    {cinema.phone && (
                      <p className="flex items-center gap-2">
                        <Phone
                          size={17}
                        />

                        {cinema.phone}
                      </p>
                    )}
                  </div>

                  {cinema.amenities &&
                    cinema.amenities
                      .length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {cinema.amenities.map(
                          (
                            amenity,
                          ) => (
                            <span
                              key={
                                amenity
                              }
                              className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/50"
                            >
                              {
                                amenity
                              }
                            </span>
                          ),
                        )}
                      </div>
                    )}
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </main>
  );
}