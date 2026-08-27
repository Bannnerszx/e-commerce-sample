"use client";

import { Check, GitMerge, Loader2, Sparkles, Workflow } from "lucide-react";
import { cn } from "../../map/lib/cn";
import { AgentLane } from "./AgentLane";
import { ResultReport } from "./ResultReport";
import { SYNTHESIZER } from "../agent-data";

// Right column: watch the workflow run. Worker lanes fan out in parallel, then
// the synthesizer fans in and the report appears. Before the first run it shows
// an explainer of what will happen.
export function RunTimeline({ stage, objective, agents, run, report, onRunAgain }) {
  if (stage === "config") {
    return <EmptyState agentCount={agents.length} />;
  }

  const synth = run.synth;

  return (
    <div className="flex flex-col gap-4">
      <header>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--agent-muted)]">
          Objective
        </span>
        <p className="mt-1 text-[0.9rem] font-medium leading-snug text-[var(--agent-ink)]">
          {objective}
        </p>
      </header>

      {/* Fan-out */}
      <div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--agent-muted)]">
          Fan-out · {agents.length} agents in parallel
        </span>
        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {agents.map((agent, i) => (
            <AgentLane key={agent.id} agent={agent} lane={run.lanes[i]} />
          ))}
        </div>
      </div>

      {/* Fan-in connector */}
      <div className="flex items-center gap-2 pl-1 text-[var(--agent-muted)]">
        <GitMerge size={15} strokeWidth={2} aria-hidden className="rotate-180" />
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em]">
          Fan-in · merge
        </span>
        <span className="h-px flex-1 bg-[var(--agent-line)]" />
      </div>

      {/* Synthesizer */}
      <div
        className={cn(
          "rounded-[14px] border bg-[var(--agent-surface)] p-3 transition-colors",
          synth.status === "done"
            ? "border-[var(--agent-accent)]/40"
            : synth.status === "running"
              ? "border-[var(--agent-accent)]"
              : "border-[var(--agent-line)]"
        )}
      >
        <div className="flex items-center gap-1.5">
          <SynthDot status={synth.status} />
          <span className="text-[0.85rem] font-semibold text-[var(--agent-ink)]">
            {SYNTHESIZER.name}
          </span>
          <span className="rounded-full bg-[var(--agent-canvas)] px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold uppercase text-[var(--agent-muted)]">
            Pro
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-1" aria-live="polite">
          {synth.status === "waiting" ? (
            <p className="font-mono text-[0.72rem] text-[var(--agent-muted)]">
              waiting for all agents…
            </p>
          ) : (
            synth.steps.map((step, i) => {
              const last = i === synth.steps.length - 1;
              return (
                <p key={i} className="font-mono text-[0.74rem] text-[var(--agent-muted)]">
                  {step.text}
                  {synth.status === "running" && last ? (
                    <span className="animate-pulse"> ▍</span>
                  ) : null}
                </p>
              );
            })
          )}
        </div>
      </div>

      {/* Report */}
      {run.showReport ? (
        <ResultReport report={report} agentCount={agents.length} onRunAgain={onRunAgain} />
      ) : null}
    </div>
  );
}

function SynthDot({ status }) {
  if (status === "done") {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--agent-accent)] text-white">
        <Check size={11} strokeWidth={3} aria-hidden />
      </span>
    );
  }
  if (status === "running") {
    return (
      <Loader2 size={14} strokeWidth={2.5} aria-hidden className="shrink-0 animate-spin text-[var(--agent-accent)]" />
    );
  }
  return <Sparkles size={14} strokeWidth={2} aria-hidden className="shrink-0 text-[var(--agent-muted)]" />;
}

function EmptyState({ agentCount }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-[var(--agent-line)] bg-[var(--agent-canvas)] px-4 py-12 text-center">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--agent-accent-soft)] text-[var(--agent-accent)]">
        <Workflow size={20} strokeWidth={2} aria-hidden />
      </span>
      <p className="font-display text-[1.05rem] font-semibold text-[var(--agent-ink)]">
        Ready to run
      </p>
      <p className="max-w-[30ch] text-[0.83rem] leading-relaxed text-[var(--agent-muted)]">
        Press <span className="font-semibold text-[var(--agent-ink)]">Run agents</span> and watch your{" "}
        {agentCount} worker{agentCount === 1 ? "" : "s"} fan out in parallel, then a
        synthesizer merge their findings into one report.
      </p>
    </div>
  );
}
