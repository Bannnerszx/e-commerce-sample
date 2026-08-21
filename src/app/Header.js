"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
          <a className={styles.link} href="#tokens">
            Tokens
          </a>
          <a className={styles.link} href="#docs">
            Docs
          </a>
          <a className={styles.link} href="#components">
            Components
          </a>
        </nav>

        <a className={styles.cta} href="#tokens">
          Get started
        </a>
      </div>
    </header>
  );
}
