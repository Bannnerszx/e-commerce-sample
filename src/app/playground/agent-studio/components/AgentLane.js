"use client";

import { Check, Loader2, Search, Brain, FileText } from "lucide-react";
import { cn } from "../../map/lib/cn";
import { MODELS } from "../agent-data";

const STEP_ICON = {
  think: Brain,
  tool: Search,
  finding: FileText,
};

// One worker's live column during a run. `lane` is the run-state slice:
// { status: "waiting" | "running" | "done", steps: [{kind,text}], metric }.
export function AgentLane({ agent, lane }) {
  const status = lane?.status ?? "waiting";
  const steps = lane?.steps ?? [];
  const done = status === "done";
  const running = status === "running";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-[14px] border bg-[var(--agent-surface)] p-3 transition-colors",
        done
          ? "border-[var(--agent-accent)]/40"
          : running
            ? "border-[var(--agent-accent)]"
            : "border-[var(--agent-line)]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <StatusDot status={status} />
          <span className="truncate text-[0.82rem] font-semibold text-[var(--agent-ink)]">
            {agent.name}
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--agent-canvas)] px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold uppercase text-[var(--agent-muted)]">
          {MODELS[agent.model].label}
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-1.5" aria-live="polite">
        {steps.length === 0 && !done ? (
          <p className="font-mono text-[0.72rem] text-[var(--agent-muted)]">
            {running ? "starting…" : "queued"}
          </p>
        ) : null}

        {steps.map((step, i) => {
          const Icon = STEP_ICON[step.kind] ?? FileText;
          const last = i === steps.length - 1;
          return (
            <div key={i} className="flex items-start gap-1.5">
              <Icon
                size={12}
                strokeWidth={2}
                aria-hidden
                className={cn(
                  "mt-[3px] shrink-0",
                  step.kind === "finding"
                    ? "text-[var(--agent-accent)]"
                    : "text-[var(--agent-muted)]"
                )}
              />
              <span
                className={cn(
                  "text-[0.74rem] leading-snug",
                  step.kind === "finding"
                    ? "text-[var(--agent-ink)]"
                    : "font-mono text-[var(--agent-muted)]"
                )}
              >
                {step.text}
                {running && last ? <span className="animate-pulse"> ▍</span> : null}
              </span>
            </div>
          );
        })}
      </div>

      {done && lane?.metric ? (
        <div className="mt-2.5 flex items-center justify-between rounded-[8px] bg-[var(--agent-accent-soft)] px-2.5 py-1.5">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[var(--agent-accent)]">
            {lane.metric.label}
          </span>
          <span className="text-[0.82rem] font-bold tabular-nums text-[var(--agent-ink)]">
            {lane.metric.value}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function StatusDot({ status }) {
  if (status === "done") {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--agent-accent)] text-white">
        <Check size={11} strokeWidth={3} aria-hidden />
      </span>
    );
  }
  if (status === "running") {
    return (
      <Loader2
        size={14}
        strokeWidth={2.5}
        aria-hidden
        className="shrink-0 animate-spin text-[var(--agent-accent)]"
      />
    );
  }
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--agent-line)] bg-[var(--agent-canvas)]" />;
}
