
import Playground from "./playground/Playground";

function SectionHead({ index, kicker, title }) {
  return (
    <header className="mb-lg flex flex-col gap-1">
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">
        {index} &middot; {kicker}
      </span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-text">
        {title}
      </h2>
    </header>
  );
}

function Section({ children }) {
  return (
    <section className="border-t border-text/10 py-lg first:border-t-0">
      {children}
    </section>
  );
}

const btnBase =
  "inline-flex items-center justify-center font-display text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function PlaygroundSection() {
  return (
    <Section>
      <SectionHead
        index="02"
        kicker="Playground"
        title="Global Logistics & Operations Hub"
      />
      <Playground />
    </Section>
  );
}

const typeRows = [
  {
    label: "display",
    face: "Space Grotesk",
    className: "font-display text-5xl font-semibold tracking-tight",
    sample: "The quick brown fox",
  },
  {
    label: "h1",
    face: "Space Grotesk",
    className: "font-display text-3xl font-semibold",
    sample: "A major section heading",
  },
  {
    label: "body",
    face: "IBM Plex Sans",
    className: "font-body text-base leading-relaxed",
    sample:
      "Body text carries most of the weight — readable at long form, comfortable at small sizes, confident in hierarchy.",
  },
  {
    label: "label",
    face: "IBM Plex Mono",
    className: "font-mono text-[0.72rem] uppercase tracking-[0.06em]",
    sample: "Overline / label text",
  },
];

function TypographySection() {
  return (
    <Section>
      <SectionHead index="03" kicker="Typography" title="Type scale" />
      <div className="overflow-hidden rounded-lg border border-text/10 bg-secondary/20">
        {typeRows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-2 border-b border-text/10 p-md last:border-b-0 sm:flex-row sm:items-center sm:gap-md"
          >
            <span className="w-16 shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/50">
              {row.label}
            </span>
            <p className={`flex-1 text-text ${row.className}`}>{row.sample}</p>
            <span className="shrink-0 font-mono text-[0.72rem] text-text/40">
              {row.face}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ButtonsSection() {
  return (
    <Section>
      <SectionHead index="04" kicker="Buttons" title="Buttons" />
      <div className="flex flex-col gap-lg rounded-lg border border-text/10 p-md sm:p-lg">
        <div className="flex flex-wrap items-center gap-md">
          <button className={`${btnBase} rounded-md bg-accent px-5 py-3 text-bg`}>
            Primary
          </button>
          <button
            className={`${btnBase} rounded-md bg-secondary px-5 py-3 text-text`}
          >
            Secondary
          </button>
          <button
            className={`${btnBase} rounded-md border-2 border-text px-5 py-3 text-text hover:bg-text hover:text-bg`}
          >
            Outline
          </button>
          <button
            className={`${btnBase} rounded-md px-5 py-3 text-text hover:bg-text/5`}
          >
            Ghost
          </button>
          <a
            href="#"
            className={`${btnBase} text-accent underline decoration-2 underline-offset-4`}
          >
            Text link →
          </a>
          <button
            disabled
            className={`${btnBase} cursor-not-allowed rounded-md bg-secondary px-5 py-3 text-text opacity-40`}
          >
            Disabled
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-md">
          <button
            className={`${btnBase} rounded-full bg-accent px-6 py-3 text-bg`}
          >
            Pill
          </button>
          <button
            className={`${btnBase} rounded-full border-2 border-text px-6 py-3 text-text`}
          >
            Pill outline
          </button>
          <button
            className={`${btnBase} rounded-md bg-accent px-3 py-2 text-xs text-bg`}
          >
            Small
          </button>
          <button
            className={`${btnBase} rounded-md bg-accent px-5 py-3 text-bg`}
          >
            Default
          </button>
          <button
            className={`${btnBase} rounded-md bg-accent px-7 py-4 text-base text-bg`}
          >
            Large
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-sm">
          {["◎", "♥", "…"].map((glyph, i) => (
            <button
              key={i}
              aria-label={`Icon action ${i + 1}`}
              className={`${btnBase} h-11 w-11 rounded-md border border-text/15 text-text hover:bg-text/5`}
            >
              <span aria-hidden className="text-lg leading-none">
                {glyph}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

const prefs = ["Weekly digest", "Product updates", "Promotions"];

function FormSection() {
  const inputBase =
    "w-full rounded-md border border-text/20 bg-transparent px-3 py-2.5 text-text placeholder:text-text/40 focus:border-accent focus:outline-none";

  return (
    <Section>
      <SectionHead index="05" kicker="Inputs" title="Form controls" />
      <div className="grid gap-md md:grid-cols-2">
        <div className="flex flex-col gap-md rounded-lg border border-text/10 p-md sm:p-lg">
          <label className="flex flex-col gap-sm">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/60">
              Email
            </span>
            <input
              type="email"
              placeholder="iris@studio.com"
              className={inputBase}
            />
          </label>

          <label className="flex flex-col gap-sm">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/60">
              Message
            </span>
            <textarea
              rows={3}
              placeholder="Type a message…"
              className={`${inputBase} resize-none`}
            />
          </label>
        </div>

        <div className="flex flex-col gap-md rounded-lg border border-text/10 p-md sm:p-lg">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-text/60">
            Notification preferences
          </span>
          <div className="flex flex-col gap-sm">
            {prefs.map((p, i) => (
              <label
                key={p}
                className="flex cursor-pointer items-center gap-sm text-text"
              >
                <input
                  type="checkbox"
                  defaultChecked={i === 0}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const cards = [
  {
    tag: "New",
    tagClass: "bg-accent text-bg",
    title: "Aurora Desk Lamp",
    body: "Warm dimmable light with a brushed-aluminium arm and a weighted base.",
    price: "$128",
    cta: "Add to cart",
  },
  {
    tag: "Popular",
    tagClass: "bg-secondary text-text",
    title: "Meridian Chair",
    body: "Moulded shell on solid ash legs — comfortable enough for long stretches.",
    price: "$340",
    cta: "Add to cart",
  },
  {
    tag: "Low stock",
    tagClass: "border border-text/25 text-text/70",
    title: "Field Notebook",
    body: "Dot-grid pages, lay-flat binding, and a cover that ages honestly.",
    price: "$24",
    cta: "Add to cart",
  },
];

function CardsSection() {
  return (
    <Section>
      <SectionHead index="01" kicker="Playground" title="E-commerce Playground" />
      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.title}
            className="flex flex-col overflow-hidden rounded-lg border border-text/10 bg-secondary/10 transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/40 to-accent/20">
              <span
                className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] ${c.tagClass}`}
              >
                {c.tag}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-sm p-md">
              <h3 className="font-display text-lg font-semibold text-text">
                {c.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-text/70">
                {c.body}
              </p>
              <div className="mt-sm flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-text">
                  {c.price}
                </span>
                <button
                  className={`${btnBase} rounded-md bg-accent px-4 py-2 text-xs text-bg`}
                >
                  {c.cta}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export default function Showcase() {
  return (
    <div id="work" className="mx-auto w-full max-w-[1120px] px-md py-lg sm:px-lg">
      <CardsSection />
      <PlaygroundSection />
      <TypographySection />
      <ButtonsSection />
      <FormSection />
    </div>
  );
}
