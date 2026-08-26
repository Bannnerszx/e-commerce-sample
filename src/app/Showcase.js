
import Playground from "./playground/Playground";
import BanMerch from "./playground/merch/BanMerch";
import Checkout from "./playground/checkout/Checkout";

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

function Section({ id, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-text/10 py-lg first:border-t-0"
    >
      {children}
    </section>
  );
}

function ComingSoon({ note }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-text/20 bg-secondary/10 px-md py-16 text-center">
      <span aria-hidden className="text-3xl">
        🚧
      </span>
      <p className="font-display text-lg font-semibold text-text">
        Coming soon
      </p>
      <p className="w-full max-w-[28rem] text-sm text-text/60">
        {note ?? "Stuff to be added soon — check back later."}
      </p>
    </div>
  );
}

function MerchPlaygroundSection() {
  return (
    <Section id="store">
      <SectionHead
        index="01"
        kicker="Playground"
        title="E-commerce Playground"
      />
      <BanMerch />
    </Section>
  );
}

function CheckoutPlaygroundSection() {
  return (
    <Section id="checkout">
      <SectionHead
        index="02"
        kicker="Playground"
        title="Checkout & Payment Flow"
      />
      <Checkout />
    </Section>
  );
}

function PlaygroundSection() {
  return (
    <Section id="logistics">
      <SectionHead
        index="06"
        kicker="Playground"
        title="Global Logistics & Operations Hub"
      />
      <Playground />
    </Section>
  );
}

function TypographySection() {
  return (
    <Section>
      <SectionHead index="03" kicker="Playground" title="Unknown" />
      <ComingSoon note="Unknown — stuff to be added soon." />
    </Section>
  );
}

function ButtonsSection() {
  return (
    <Section>
      <SectionHead index="04" kicker="Playground" title="Unknown" />
      <ComingSoon note="Unknown — stuff to be added soon." />
    </Section>
  );
}

function FormSection() {
  return (
    <Section>
      <SectionHead index="05" kicker="Playground" title="Unknown" />
      <ComingSoon note="Unknown — stuff to be added soon." />
    </Section>
  );
}

export default function Showcase() {
  return (
    <div id="work" className="mx-auto w-full max-w-[1120px] px-md py-lg sm:px-lg">
      <MerchPlaygroundSection />
      <CheckoutPlaygroundSection />
      <TypographySection />
      <ButtonsSection />
      <FormSection />
      <PlaygroundSection />
    </div>
  );
}
