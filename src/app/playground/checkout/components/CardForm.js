"use client";

import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "../../map/lib/cn";
import {
  DEMO_CARD,
  detectBrand,
  formatCardNumber,
  formatExpiry,
  formatPrice,
  validateCard,
} from "../checkout-data";
import { CardBrandRow } from "./brand-marks";

const fieldBase =
  "w-full rounded-[10px] border bg-[var(--merch-surface)] px-3 py-2.5 text-[0.9rem] text-[var(--merch-primary)] tabular-nums placeholder:text-[color-mix(in_srgb,var(--merch-secondary)_70%,transparent)] focus:outline-none focus:border-[var(--merch-primary)]";

function Field({ label, error, children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--merch-secondary)]">
        {label}
      </span>
      {children}
      {error ? (
        <span role="alert" className="text-[0.72rem] font-medium text-[var(--merch-tertiary)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function CardForm({ total, onPay }) {
  const [values, setValues] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const brand = useMemo(() => detectBrand(values.number), [values.number]);

  const setField = (key) => (raw) => {
    let next = raw;
    if (key === "number") next = formatCardNumber(raw);
    if (key === "expiry") next = formatExpiry(raw);
    if (key === "cvc") next = raw.replace(/\D/g, "").slice(0, 4);
    const updated = { ...values, [key]: next };
    setValues(updated);
    if (touched) setErrors(validateCard(updated));
  };

  const autofill = () => {
    setValues({ ...DEMO_CARD });
    setErrors({});
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    const found = validateCard(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onPay();
  };

  const borderFor = (key) =>
    errors[key]
      ? "border-[var(--merch-tertiary)]"
      : "border-[color-mix(in_srgb,var(--merch-secondary)_40%,transparent)]";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="text-[0.8rem] font-medium text-[var(--merch-secondary)]">
          Enter your card details
        </span>
        <button
          type="button"
          onClick={autofill}
          className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--merch-secondary)] underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--merch-primary)] hover:decoration-[var(--merch-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
        >
          Use demo card
        </button>
      </div>

      <Field label="Card number" error={errors.number} htmlFor="cc-number">
        <div className="relative">
          <input
            id="cc-number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 1234 1234 1234"
            value={values.number}
            onChange={(e) => setField("number")(e.target.value)}
            className={cn(fieldBase, "pr-24", borderFor("number"))}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <CardBrandRow activeKey={brand?.key} />
          </span>
        </div>
      </Field>

      <Field label="Name on card" error={errors.name} htmlFor="cc-name">
        <input
          id="cc-name"
          autoComplete="cc-name"
          placeholder="Alex Runner"
          value={values.name}
          onChange={(e) => setField("name")(e.target.value)}
          className={cn(fieldBase, "!tracking-normal", borderFor("name"))}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry" error={errors.expiry} htmlFor="cc-exp">
          <input
            id="cc-exp"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={values.expiry}
            onChange={(e) => setField("expiry")(e.target.value)}
            className={cn(fieldBase, borderFor("expiry"))}
          />
        </Field>
        <Field label={`CVC${brand?.key === "amex" ? " (4)" : ""}`} error={errors.cvc} htmlFor="cc-cvc">
          <input
            id="cc-cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder={brand?.key === "amex" ? "1234" : "123"}
            value={values.cvc}
            onChange={(e) => setField("cvc")(e.target.value)}
            className={cn(fieldBase, borderFor("cvc"))}
          />
        </Field>
      </div>

      {/* The single reserved accent action for this screen */}
      <button
        type="submit"
        className="mt-1 flex items-center justify-center gap-2 rounded-[14px] bg-[var(--merch-tertiary)] px-6 py-3.5 text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--merch-primary)]"
      >
        <Lock size={15} strokeWidth={2.5} aria-hidden />
        Pay {formatPrice(total)}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[0.72rem] text-[var(--merch-secondary)]">
        <Lock size={12} strokeWidth={2.25} aria-hidden />
        Simulated payment · no real card is charged
      </p>
    </form>
  );
}
