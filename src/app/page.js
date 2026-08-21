import styles from "./page.module.css";
import Showcase from "./Showcase";
import Logo from "./Logo";

export default function Home() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <span className={styles.small}>
            FULL-STACK &middot; REAL-TIME &middot; DOCUMENTED &middot; UPTIME
          </span>

          <h1 className={styles.title}>
            <span className={styles.line}>E-Commerce &mdash; and</span>{" "}
            <span className={styles.line}>some stuff showcase.</span>
          </h1>

          <p className={styles.subtitle}>
            I build things that launch, stay up, and make sense to the next person &mdash; from the first plan to the last deploy, with docs that don&rsquo;t make you cry(sometimes me).
          </p>

          <div className={styles.ctas}>
            <a href="#work" className={styles.primary}>
              See it live &darr;
            </a>
            <a
              href="#"
              className={styles.secondary}
              target="_blank"
              rel="noreferrer"
            >
              See Documentation &rarr;
            </a>
          </div>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt>Real-time</dt>
              <dd>Live data, no refresh</dd>
            </div>
            <div className={styles.stat}>
              <dt>Design system</dt>
              <dd>Tokens &amp; theming</dd>
            </div>
            <div className={styles.stat}>
              <dt>Documented</dt>
              <dd>Reads like a book</dd>
            </div>
          </dl>
        </main>
      </div>

      <Logo />

      <Showcase />
    </>
  );
}
