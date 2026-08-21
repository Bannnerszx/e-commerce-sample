import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.band}>
      <button
        type="button"
        className={styles.logo}
        aria-label="Showcase, unbanned"
      >
        <span aria-hidden className={styles.mark}>
          BAN
        </span>
        <span className={styles.reveal}>
          <span className={styles.name}>Showcase, unBANned.</span>
        </span>
      </button>
    </div>
  );
}
