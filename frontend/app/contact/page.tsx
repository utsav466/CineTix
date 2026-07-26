"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    bookingId: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.topic ||
      !form.message.trim()
    ) {
      setStatus("Please complete all required fields.");
      return;
    }

    setStatus(
      "Your request has been submitted. The CineTix team will contact you soon.",
    );

    setForm({
      name: "",
      email: "",
      topic: "",
      bookingId: "",
      message: "",
    });
  }

  return (
    <main className="contact-cinema-page">
      <section className="contact-cinema-layout">
        <div className="contact-cinema-visual">
          <div className="contact-cinema-overlay" />

          <div className="contact-cinema-visual-content">
            <span className="contact-cinema-label">
              CineTix Customer Support
            </span>

            <h1>
              Your movie night
              <br />
              should be effortless.
            </h1>

            <p>
              Whether it is a booking, payment, ticket, or cinema issue, our
              support team is ready to help.
            </p>

            <div className="contact-cinema-response">
              <span className="contact-cinema-response-dot" />

              <div>
                <small>Typical response time</small>
                <strong>Within one business day</strong>
              </div>
            </div>
          </div>

          <div className="contact-cinema-ticket">
            <span>CINETIX SUPPORT</span>
            <strong>Need assistance?</strong>
            <small>Reference your booking ID for faster support.</small>
          </div>
        </div>

        <div className="contact-cinema-form-side">
          <div className="contact-cinema-form-wrapper">
            <div className="contact-cinema-form-heading">
              <span>Contact us</span>
              <h2>Tell us what happened</h2>
              <p>
                Complete the form and provide as much information as possible.
              </p>
            </div>

            <form className="contact-cinema-form" onSubmit={handleSubmit}>
              <div className="contact-cinema-fields-row">
                <label className="contact-cinema-field">
                  <span>Full name *</span>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </label>

                <label className="contact-cinema-field">
                  <span>Email address *</span>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="contact-cinema-field">
                <span>What can we help with? *</span>

                <select
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                >
                  <option value="">Select a support topic</option>
                  <option value="booking">Booking assistance</option>
                  <option value="payment">Payment issue</option>
                  <option value="refund">Cancellation or refund</option>
                  <option value="ticket">Ticket not showing</option>
                  <option value="account">Account issue</option>
                  <option value="showtime">Cinema or showtime issue</option>
                  <option value="feedback">Feedback or suggestion</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="contact-cinema-field">
                <span>Booking ID</span>

                <input
                  type="text"
                  name="bookingId"
                  value={form.bookingId}
                  onChange={handleChange}
                  placeholder="Example: CTX-1720000000000"
                />
              </label>

              <label className="contact-cinema-field">
                <span>Message *</span>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Describe your issue here..."
                />
              </label>

              <div className="contact-cinema-submit-row">
                <p>
                  By submitting, you agree to our{" "}
                  <Link href="/privacy">Privacy Policy</Link>.
                </p>

                <button type="submit">
                  Send Request
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              {status && (
                <p className="contact-cinema-status" role="status">
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="contact-cinema-details">
        <div className="contact-cinema-details-inner">
          <div>
            <span>Email</span>
            <a href="mailto:support@cinetix.com">
              support@cinetix.com
            </a>
          </div>

          <div>
            <span>Phone</span>
            <a href="tel:+97715555555">+977 1-5555555</a>
          </div>

          <div>
            <span>Support hours</span>
            <p>Sunday–Friday, 9:00 AM–7:00 PM</p>
          </div>

          <div>
            <span>Quick answers</span>
            <Link href="/help">Visit Help Center</Link>
          </div>
        </div>
      </section>
    </main>
  );
}