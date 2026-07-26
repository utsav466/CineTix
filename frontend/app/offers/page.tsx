import { offers } from "@/lib/api/cinetix";

export default function OffersPage() {
  const activeOffers = offers.filter(
    (offer) => offer.active,
  );

  return (
    <main className="offers-page">
      <section className="offers-container">
        <div className="offers-heading">
          <p className="section-eyebrow">
            Promotions
          </p>

          <h1>Offers</h1>
        </div>

        {activeOffers.length > 0 ? (
          <div className="offers-grid">
            {activeOffers.map((offer) => (
              <article
                key={offer.id}
                className="offer-card"
              >
                <div className="offer-card__content">
                  <span className="offer-card__badge">
                    Special Offer
                  </span>

                  <h2>{offer.title}</h2>

                  <p>
                    {offer.description}
                  </p>

                  {offer.discount && (
                    <strong className="offer-card__discount">
                      {offer.discount}% off
                    </strong>
                  )}

                  {offer.code && (
                    <div className="offer-card__code">
                      <span>Promo code</span>
                      <strong>{offer.code}</strong>
                    </div>
                  )}

                  {offer.validUntil && (
                    <p className="offer-card__validity">
                      Valid until{" "}
                      {new Intl.DateTimeFormat(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      ).format(
                        new Date(
                          `${offer.validUntil}T00:00:00`,
                        ),
                      )}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="offers-empty">
            <div className="offers-empty__icon">
              %
            </div>

            <h2>No offers currently</h2>

            <p>
              New movie offers and promotions
              will appear here when available.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}