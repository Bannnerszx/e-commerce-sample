"use client";

import { FileText, RotateCcw } from "lucide-react";

// The fan-in output: the synthesizer's executive report, revealed once every
// worker has finished. `onRunAgain` re-runs the same team.
export function ResultReport({ report, agentCount, onRunAgain }) {
  return (
    <div className="rounded-[16px] border border-[var(--agent-accent)]/40 bg-[var(--agent-surface)] p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <FileText size={16} strokeWidth={2} aria-hidden className="text-[var(--agent-accent)]" />
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--agent-accent)]">
          Executive report · synthesized from {agentCount} agent{agentCount === 1 ? "" : "s"}
        </span>
      </div>

      <h4 className="mt-2 text-[1.15rem] font-bold leading-tight tracking-[-0.02em] text-[var(--agent-ink)]">
        {report.headline}
      </h4>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--agent-muted)]">
        {report.summary}
      </p>

      <ul className="mt-3.5 flex flex-col gap-2 border-t border-[var(--agent-line)] pt-3.5">
        {report.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-[0.85rem] text-[var(--agent-ink)]">
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--agent-accent)]"
            />
            {bullet}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onRunAgain}
        className="mt-4 inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--agent-line)] px-4 py-2 text-[0.8rem] font-semibold text-[var(--agent-ink)] transition-colors hover:border-[var(--agent-accent)] hover:text-[var(--agent-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--agent-accent)]"
      >
        <RotateCcw size={14} strokeWidth={2.5} aria-hidden />
        Run again
      </button>
    </div>
  );
}
