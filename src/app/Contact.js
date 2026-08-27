"use client";

import { useEffect, useState } from "react";

const CONTACT_EMAIL = "marcvan-work@proton.me";

// StaticForms.dev — https://www.staticforms.dev
// Set STATICFORMS_API_KEY in .env.local (local) and in Vercel's env vars
// (deployed). It's exposed to the browser via next.config.mjs `env`, so the
// name has no NEXT_PUBLIC_ prefix. The key ships in client JS — it's public by
// design; spam is handled by the honeypot below plus StaticForms' filtering.
const STATICFORMS_ENDPOINT = "https://api.staticforms.dev/submit";
const STATICFORMS_API_KEY =
  process.env.STATICFORMS_API_KEY || "your-api-key";

export default function ContactModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // stays empty for real users
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

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

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(STATICFORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: STATICFORMS_API_KEY,
          subject: "New portfolio contact",
          name,
          email,
          replyTo: email,
          message,
          honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

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
            Send me a message and I&rsquo;ll get back to you by email.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {/* Honeypot: hidden from users, catches bots. A real person never
              fills this, so a non-empty value flags the submission as spam. */}
          <input
            type="text"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
          />

          <label className="flex flex-col gap-sm">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/60">
              Name
            </span>
            <input
              type="text"
              name="name"
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
              name="email"
              required
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
              name="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What&rsquo;s on your mind?"
              className={`${inputBase} resize-none`}
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 font-display text-sm font-semibold uppercase tracking-wide text-bg transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Sending…" : "Contact me now →"}
          </button>

          {status === "sent" ? (
            <p className="font-mono text-[0.72rem] text-accent">
              Thanks &mdash; your message is on its way. I&rsquo;ll reply to your
              email soon.
            </p>
          ) : status === "error" ? (
            <p className="font-mono text-[0.72rem] text-text/60">
              Something went wrong. Please email {CONTACT_EMAIL} directly.
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
