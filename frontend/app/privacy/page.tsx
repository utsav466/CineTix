import Link from "next/link";

const privacySections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        CineTix may collect information you provide when creating an account,
        signing in, completing a booking, contacting support, or submitting
        feedback. This may include your name, email address, phone number, and
        booking details.
      </>
    ),
  },
  {
    title: "2. Booking Information",
    content: (
      <>
        When you make a booking, CineTix may process information such as the
        selected movie, cinema, showtime, auditorium, seats, food add-ons,
        booking total, and booking reference number.
      </>
    ),
  },
  {
    title: "3. Payment Information",
    content: (
      <>
        Payments may be handled by third-party payment providers such as eSewa.
        CineTix does not intend to store your complete payment credentials.
        Payment providers may process your information under their own privacy
        policies.
      </>
    ),
  },
  {
    title: "4. How We Use Your Information",
    content: (
      <>
        We may use your information to create and manage accounts, process
        bookings, display ticket history, provide customer support, prevent
        misuse, improve CineTix features, and send important service-related
        updates.
      </>
    ),
  },
  {
    title: "5. Local Storage",
    content: (
      <>
        The current CineTix frontend uses browser local storage for temporary
        features such as login state, unfinished bookings, completed bookings,
        and ticket history. This information remains in the browser until it is
        cleared or replaced.
      </>
    ),
  },
  {
    title: "6. Cookies and Similar Technologies",
    content: (
      <>
        CineTix may use cookies or similar browser technologies to keep users
        signed in, remember preferences, maintain booking sessions, and
        understand how the platform is used.
      </>
    ),
  },
  {
    title: "7. Sharing of Information",
    content: (
      <>
        CineTix may share necessary information with cinemas, payment
        processors, hosting providers, and other service providers involved in
        completing a booking or operating the platform. We do not sell personal
        information.
      </>
    ),
  },
  {
    title: "8. Data Security",
    content: (
      <>
        CineTix uses reasonable measures designed to protect personal
        information. However, no website, browser storage system, or internet
        transmission can be guaranteed to be completely secure.
      </>
    ),
  },
  {
    title: "9. Data Retention",
    content: (
      <>
        We may retain personal and booking information for as long as necessary
        to provide services, maintain records, resolve disputes, prevent fraud,
        and comply with legal obligations.
      </>
    ),
  },
  {
    title: "10. Your Choices and Rights",
    content: (
      <>
        Depending on applicable law, you may request access to, correction of,
        or deletion of certain personal information. You may also clear local
        browser data through your browser settings.
      </>
    ),
  },
  {
    title: "11. Children’s Privacy",
    content: (
      <>
        CineTix is not intended to knowingly collect personal information from
        children without appropriate permission from a parent or guardian where
        required by law.
      </>
    ),
  },
  {
    title: "12. Third-Party Links",
    content: (
      <>
        CineTix may link to external websites or services. Their privacy
        practices are controlled by those third parties, not by CineTix.
      </>
    ),
  },
  {
    title: "13. Changes to This Policy",
    content: (
      <>
        CineTix may update this Privacy Policy from time to time. The latest
        version will be published on this page with a revised effective date.
      </>
    ),
  },
  {
    title: "14. Contact Us",
    content: (
      <>
        Questions or privacy requests can be sent to{" "}
        <a href="mailto:support@cinetix.com">support@cinetix.com</a>.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="legal-container">
          <span className="legal-eyebrow">CineTix Legal</span>

          <h1>Privacy Policy</h1>

          <p>
            This policy explains what information CineTix may collect, how it
            may be used, and the choices available to users.
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

              <nav aria-label="Privacy Policy sections">
                {privacySections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#privacy-section-${index + 1}`}
                  >
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="legal-document">
            <div className="legal-intro">
              <h2>Your privacy matters</h2>

              <p>
                This Privacy Policy applies when you use CineTix to browse
                movies, select showtimes, reserve seats, complete bookings, or
                contact support.
              </p>
            </div>

            {privacySections.map((section, index) => (
              <section
                className="legal-section"
                id={`privacy-section-${index + 1}`}
                key={section.title}
              >
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </section>
            ))}

            <div className="legal-footer-note">
              <h2>Related information</h2>

              <p>
                Read the <Link href="/terms">Terms of Service</Link> or visit
                the <Link href="/help">Help Center</Link> for support.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}