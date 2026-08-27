"use client";

import { Loader2, Play, Plus, Sparkles } from "lucide-react";
import { cn } from "../../map/lib/cn";
import { AgentCard } from "./AgentCard";
import {
  MAX_AGENTS,
  SYNTHESIZER,
  TASK_PRESETS,
  estimateCost,
  formatCost,
} from "../agent-data";

// Left column: define the task and the worker team, see the fan-in synthesizer
// and a live cost estimate, then run. Everything is controlled by the parent.
export function BuilderPanel({
  presetKey,
  objective,
  agents,
  stage,
  onPreset,
  onObjective,
  onAgentChange,
  onAddAgent,
  onRemoveAgent,
  onRun,
}) {
  const running = stage === "running";
  const cost = estimateCost(agents);

  const runLabel =
    stage === "running" ? "Running…" : stage === "done" ? "Run again" : "Run agents";

  return (
    <div className="flex flex-col gap-4">
      {/* Task */}
      <section>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--agent-muted)]">
          Task
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TASK_PRESETS.map((preset) => {
            const active = preset.key === presetKey;
            return (
              <button
                key={preset.key}
                type="button"
                aria-pressed={active}
                disabled={running}
                onClick={() => onPreset(preset.key)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[0.75rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--agent-accent)] disabled:opacity-60",
                  active
                    ? "border-[var(--agent-accent)] bg-[var(--agent-accent-soft)] text-[var(--agent-accent)]"
                    : "border-[var(--agent-line)] text-[var(--agent-muted)] hover:border-[var(--agent-accent)] hover:text-[var(--agent-ink)]"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <textarea
          value={objective}
          disabled={running}
          onChange={(e) => onObjective(e.target.value)}
          rows={2}
          aria-label="Objective"
          className="mt-2 w-full resize-none rounded-[12px] border border-[var(--agent-line)] bg-[var(--agent-surface)] px-3 py-2.5 text-[0.9rem] text-[var(--agent-ink)] outline-none transition-colors focus:border-[var(--agent-accent)] disabled:opacity-60"
        />
      </section>

      {/* Worker team — fan-out */}
      <section>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--agent-muted)]">
            Worker agents · fan-out
          </span>
          <span className="font-mono text-[0.62rem] text-[var(--agent-muted)]">
            {agents.length}/{MAX_AGENTS}
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-2.5">
          {agents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={i}
              canRemove={agents.length > 1}
              disabled={running}
              onChange={(patch) => onAgentChange(agent.id, patch)}
              onRemove={() => onRemoveAgent(agent.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onAddAgent}
          disabled={running || agents.length >= MAX_AGENTS}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[var(--agent-line)] px-3 py-2.5 text-[0.8rem] font-semibold text-[var(--agent-muted)] transition-colors hover:border-[var(--agent-accent)] hover:text-[var(--agent-accent)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--agent-accent)]"
        >
          <Plus size={15} strokeWidth={2.5} aria-hidden />
          Add agent
        </button>
      </section>

      {/* Synthesizer — fan-in */}
      <section className="rounded-[16px] border border-[var(--agent-line)] bg-[var(--agent-canvas)] p-3.5">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--agent-muted)]">
          Synthesizer · fan-in
        </span>
        <div className="mt-1.5 flex items-center gap-2">
          <Sparkles size={16} strokeWidth={2} aria-hidden className="text-[var(--agent-accent)]" />
          <span className="text-[0.9rem] font-semibold text-[var(--agent-ink)]">
            {SYNTHESIZER.name}
          </span>
          <span className="rounded-full bg-[var(--agent-accent-soft)] px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase text-[var(--agent-accent)]">
            Pro
          </span>
        </div>
        <p className="mt-1 text-[0.78rem] text-[var(--agent-muted)]">{SYNTHESIZER.role}</p>
      </section>

      {/* Cost + run */}
      <section className="flex flex-col gap-2.5 border-t border-[var(--agent-line)] pt-3.5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--agent-muted)]">
            Est. cost / report
          </span>
          <span className="font-mono text-[0.95rem] font-semibold tabular-nums text-[var(--agent-ink)]">
            {formatCost(cost)}
          </span>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="flex items-center justify-center gap-2 rounded-[12px] bg-[var(--agent-accent)] px-6 py-3 text-[0.9rem] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--agent-accent)]"
        >
          {running ? (
            <Loader2 size={17} strokeWidth={2.5} aria-hidden className="animate-spin" />
          ) : (
            <Play size={16} strokeWidth={2.5} aria-hidden />
          )}
          {runLabel}
        </button>
      </section>
    </div>
  );
}
