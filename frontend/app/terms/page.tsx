import Link from "next/link";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: (
      <>
        By accessing or using CineTix, you agree to follow these Terms of
        Service. If you do not agree with these terms, you should not use the
        platform.
      </>
    ),
  },
  {
    title: "2. About CineTix",
    content: (
      <>
        CineTix is a movie-ticket booking platform that allows users to browse
        movies, view cinemas and showtimes, select seats, add food items, and
        complete bookings.
      </>
    ),
  },
  {
    title: "3. User Accounts",
    content: (
      <>
        You are responsible for providing accurate account information and
        keeping your login details secure. You must not use another person's
        account without permission.
      </>
    ),
  },
  {
    title: "4. Movie Listings and Showtimes",
    content: (
      <>
        Movie titles, showtimes, cinema locations, seat availability, and other
        listing information may change. CineTix aims to keep this information
        accurate but cannot guarantee that every listing will always remain
        unchanged.
      </>
    ),
  },
  {
    title: "5. Bookings and Seat Selection",
    content: (
      <>
        A booking is only confirmed after the checkout process is completed and
        a booking confirmation is issued. Selected seats may become unavailable
        before payment is completed.
      </>
    ),
  },
  {
    title: "6. Payments",
    content: (
      <>
        Payments may be processed through supported payment services such as
        eSewa. CineTix does not store full payment credentials. Payment
        processing may also be subject to the payment provider's own terms and
        policies.
      </>
    ),
  },
  {
    title: "7. Cancellations and Refunds",
    content: (
      <>
        Cancellation and refund eligibility may depend on the cinema, showtime,
        and booking status. Completed or expired bookings may not be refundable.
        Any applicable refund will be processed according to the cinema's
        policy.
      </>
    ),
  },
  {
    title: "8. Food and Add-ons",
    content: (
      <>
        Food and beverage add-ons are subject to availability. Images and
        descriptions are for reference and may differ slightly from the items
        provided at the cinema.
      </>
    ),
  },
  {
    title: "9. Acceptable Use",
    content: (
      <>
        You must not misuse CineTix, interfere with the platform, attempt
        unauthorized access, submit false booking information, or use the
        service for unlawful purposes.
      </>
    ),
  },
  {
    title: "10. Intellectual Property",
    content: (
      <>
        The CineTix name, interface, branding, design, and original platform
        content are protected by applicable intellectual-property laws. Movie
        posters and related media remain the property of their respective
        owners.
      </>
    ),
  },
  {
    title: "11. Service Availability",
    content: (
      <>
        CineTix may occasionally be unavailable because of maintenance,
        technical issues, or third-party service interruptions. Features may be
        updated, suspended, or changed when necessary.
      </>
    ),
  },
  {
    title: "12. Limitation of Liability",
    content: (
      <>
        To the extent permitted by law, CineTix is not responsible for indirect
        losses caused by cinema schedule changes, cancelled screenings,
        third-party payment failures, or events outside its reasonable control.
      </>
    ),
  },
  {
    title: "13. Privacy",
    content: (
      <>
        Your use of CineTix is also subject to our{" "}
        <Link href="/privacy">Privacy Policy</Link>, which explains how user
        information is collected and handled.
      </>
    ),
  },
  {
    title: "14. Changes to These Terms",
    content: (
      <>
        CineTix may update these Terms of Service from time to time. The revised
        version will be published on this page with an updated effective date.
      </>
    ),
  },
  {
    title: "15. Contact",
    content: (
      <>
        Questions about these terms can be sent to{" "}
        <a href="mailto:support@cinetix.com">support@cinetix.com</a>.
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="legal-container">
          <span className="legal-eyebrow">CineTix Legal</span>
          <h1>Terms of Service</h1>
          <p>
            Please read these terms carefully before using CineTix to browse
            movies, reserve seats, or complete a booking.
          </p>

          <div className="legal-meta">
            <span>Effective date: July 26, 2026</span>
            <span>Last updated: July 26, 2026</span>
          </div>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="legal-container legal-layout">
          <aside className="legal-sidebar">
            <div className="legal-sidebar-card">
              <p>On this page</p>

              <nav aria-label="Terms sections">
                {sections.map((section, index) => (
                  <a key={section.title} href={`#terms-section-${index + 1}`}>
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="legal-document">
            <div className="legal-intro">
              <h2>Welcome to CineTix</h2>
              <p>
                These Terms of Service explain the rules for using the CineTix
                website and its movie-booking features.
              </p>
            </div>

            {sections.map((section, index) => (
              <section
                className="legal-section"
                id={`terms-section-${index + 1}`}
                key={section.title}
              >
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </section>
            ))}

            <div className="legal-footer-note">
              <h2>Need help?</h2>
              <p>
                Visit the <Link href="/help">Help Center</Link> for booking,
                account, and support information.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}