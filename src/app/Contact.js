"use client";

import { useEffect, useState } from "react";

const CONTACT_EMAIL = "marcvan-work@proton.me";

export default function ContactModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const inputBase =
    "w-full rounded-md border border-text/20 bg-transparent px-3 py-2.5 text-text placeholder:text-text/40 focus:border-accent focus:outline-none";

  function handleSubmit(e) {
    e.preventDefault();

    const subject = `Portfolio contact${name ? ` — ${name}` : ""}`;
    const bodyLines = [
      message,
      "",
      "—",
      name && `Name: ${name}`,
      email && `Email: ${email}`,
    ].filter(Boolean);

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = href;
    setSent(true);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Backdrop */}
      <button
        aria-label="Close contact form"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-text/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-[32rem] rounded-lg border border-text/10 bg-bg p-lg shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md text-text/60 transition-colors hover:bg-text/5 hover:text-text"
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>

        <header className="mb-lg flex flex-col gap-1">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">
            Contact
          </span>
          <h2
            id="contact-modal-title"
            className="font-display text-2xl font-semibold tracking-tight text-text"
          >
            Get started
          </h2>
          <p className="text-sm text-text/60">
            Send me a message and your mail client opens ready to go.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <label className="flex flex-col gap-sm">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/60">
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputBase}
            />
          </label>

          <label className="flex flex-col gap-sm">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/60">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputBase}
            />
          </label>

          <label className="flex flex-col gap-sm">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/60">
              Message
            </span>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What&rsquo;s on your mind?"
              className={`${inputBase} resize-none`}
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 font-display text-sm font-semibold uppercase tracking-wide text-bg transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Contact me now &rarr;
          </button>

          {sent ? (
            <p className="font-mono text-[0.72rem] text-text/60">
              Opening your mail client&hellip; if nothing happens, email{" "}
              {CONTACT_EMAIL} directly.
            </p>
          ) : (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-center font-mono text-[0.72rem] text-text/50 underline decoration-1 underline-offset-4 hover:text-accent"
            >
              or email {CONTACT_EMAIL}
            </a>
          )}
        </form>
      </div>
    </div>
  );
}
