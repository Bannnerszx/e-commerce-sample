"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import ContactModal from "./Contact";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a className={styles.brand} href="/" aria-label="marcvan cabaguing — home">
          <span className={styles.wordTop}>marcvan</span>
          <span className={styles.wordBottom}>cabaguing</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <a className={styles.link} href="#store">
            Store
          </a>
          <a className={styles.link} href="#checkout">
            Checkout
          </a>
          <a className={styles.link} href="#agents">
            Agents
          </a>
          <a className={styles.link} href="#logistics">
            Logistics
          </a>
        </nav>

        <button
          type="button"
          className={styles.cta}
          onClick={() => setContactOpen(true)}
        >
          Get started
        </button>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
}
