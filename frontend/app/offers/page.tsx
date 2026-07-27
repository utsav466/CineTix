import {
  BadgePercent,
  Popcorn,
  Ticket,
} from "lucide-react";

import CustomerHeader from "@/components/layout/CustomerHeader";

const offers = [
  {
    title:
      "Cinema discounts",

    description:
      "Apply an eligible CineTix coupon during checkout to reduce your final total.",

    icon:
      BadgePercent,
  },
  {
    title:
      "Food combos",

    description:
      "Choose available popcorn, beverage and snack combos while completing your booking.",

    icon:
      Popcorn,
  },
  {
    title:
      "Instant tickets",

    description:
      "Complete payment with Khalti and receive a digital QR ticket immediately.",

    icon:
      Ticket,
  },
];

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <CustomerHeader />

      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
          More value
        </p>

        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          Offers & Benefits
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-white/50">
          CineTix keeps promotions
          simple and visible during the
          booking flow.
        </p>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {offers.map(
            (offer) => {
              const Icon =
                offer.icon;

              return (
                <article
                  key={
                    offer.title
                  }
                  className="rounded-2xl border border-white/10 bg-[#11141c] p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <Icon size={23} />
                  </div>

                  <h2 className="mt-5 text-xl font-black">
                    {offer.title}
                  </h2>

                  <p className="mt-3 leading-7 text-white/50">
                    {
                      offer.description
                    }
                  </p>
                </article>
              );
            },
          )}
        </div>
      </section>
    </main>
  );
}