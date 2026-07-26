"use client";

import { FormEvent, useState } from "react";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="help-icon help-search-icon"
    >
      <path
        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="help-card-icon">
      <circle
        cx="32"
        cy="32"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M24 24c1-6 15-8 16 1 1 7-8 7-8 14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="32" cy="47" r="2" fill="currentColor" />
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="help-card-icon">
      <path
        d="M8 14c9-3 17-2 24 2v36c-7-4-15-5-24-2V14Zm48 0c-9-3-17-2-24 2v36c7-4 15-5 24-2V14Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="help-card-icon">
      <rect
        x="8"
        y="15"
        width="48"
        height="34"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="m11 19 21 16 21-16"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function FeedbackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="help-card-icon">
      <path
        d="M10 10h37v31H24L10 53V10Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M20 21h19M20 29h14M43 35l12-12 4 4-12 12-7 3 3-7Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [thought, setThought] = useState("");
  const [message, setMessage] = useState("");

  function handleFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !thought.trim()) {
      setMessage("Please complete both feedback fields.");
      return;
    }

    setMessage("Thank you. Your feedback has been saved.");
    setTitle("");
    setThought("");
  }

  return (
    <main className="help-page">
      <section className="help-container">
        <div className="help-heading">
          <h1>How can we help?</h1>
          <p>Find answers, guides, and support for CineTix.</p>
        </div>

        <label className="help-search">
          <SearchIcon />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search help topics"
            aria-label="Search help topics"
          />

          <span className="help-search-arrow" aria-hidden="true">
            ⌄
          </span>
        </label>

        <div className="help-grid">
          <article className="help-card">
            <FaqIcon />

            <h2>FAQ</h2>

            <p>Find answers to frequently asked questions.</p>

            <div className="help-faq-links">
              <a href="#reset-password">How do I reset my password?</a>
              <a href="#data-security">Is my data secure?</a>
              <a href="#cancel-booking">Can I cancel my booking?</a>
            </div>

            <a className="help-button" href="#faq">
              View FAQ
            </a>
          </article>

          <article className="help-card">
            <GuideIcon />

            <h2>User Guide</h2>

            <p>
              Step-by-step guides and tutorials to help you use CineTix.
              Here you will find detailed instructions for each feature.
            </p>

            <a className="help-button" href="#user-guide">
              View Guide
            </a>
          </article>

          <article className="help-card">
            <ContactIcon />

            <h2>Contact Support</h2>

            <p>
              Reach out to our support team for personalised assistance.
            </p>

            <address className="help-contact-details">
              <a href="mailto:support@cinetix.com">
                Email: support@cinetix.com
              </a>

              <a href="tel:+97715555555">
                Phone: +977 1-5555555
              </a>
            </address>

            <a
              className="help-button"
              href="mailto:support@cinetix.com"
            >
              Contact Us
            </a>
          </article>

          <article className="help-card help-feedback-card">
            <FeedbackIcon />

            <h2>Feedback &amp; Suggestions</h2>

            <p>
              Share your feedback and suggestions to help improve CineTix.
            </p>

            <form className="help-feedback-form" onSubmit={handleFeedback}>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title"
                aria-label="Feedback title"
              />

              <textarea
                value={thought}
                onChange={(event) => setThought(event.target.value)}
                placeholder="Your thoughts"
                aria-label="Your feedback"
                rows={3}
              />

              <button className="help-button" type="submit">
                Save
              </button>

              {message && (
                <p className="help-form-message" role="status">
                  {message}
                </p>
              )}
            </form>
          </article>
        </div>
      </section>
    </main>
  );
}