"use client";

import { Trash2 } from "lucide-react";
import { cn } from "../../map/lib/cn";
import { MODELS, MODEL_ORDER, TOOLS } from "../agent-data";

// One configurable worker agent. Pure controlled inputs — the parent owns the
// agents array and passes an `onChange(patch)` that merges into this agent.
// Model picker follows the checkout MethodToggle segmented-control pattern;
// tool pills follow the merch ProductPage size-picker multi-select pattern.
export function AgentCard({ agent, index, canRemove, disabled, onChange, onRemove }) {
  const toggleTool = (key) => {
    const has = agent.tools.includes(key);
    const tools = has
      ? agent.tools.filter((t) => t !== key)
      : [...agent.tools, key];
    onChange({ tools });
  };

  return (
    <div className="rounded-[16px] border border-[var(--agent-line)] bg-[var(--agent-surface)] p-3.5">
      <div className="flex items-start justify-between gap-2">
        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--agent-accent-soft)] font-mono text-[0.7rem] font-semibold text-[var(--agent-accent)]">
          {index + 1}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            type="text"
            value={agent.name}
            disabled={disabled}
            onChange={(e) => onChange({ name: e.target.value })}
            aria-label={`Agent ${index + 1} name`}
            placeholder="Agent name"
            className="w-full rounded-[8px] border border-transparent bg-transparent px-1 py-0.5 text-[0.95rem] font-semibold text-[var(--agent-ink)] outline-none transition-colors hover:border-[var(--agent-line)] focus:border-[var(--agent-accent)] disabled:opacity-60"
          />
          <input
            type="text"
            value={agent.role}
            disabled={disabled}
            onChange={(e) => onChange({ role: e.target.value })}
            aria-label={`Agent ${index + 1} role`}
            placeholder="What does this agent do?"
            className="w-full rounded-[8px] border border-transparent bg-transparent px-1 py-0.5 text-[0.8rem] text-[var(--agent-muted)] outline-none transition-colors hover:border-[var(--agent-line)] focus:border-[var(--agent-accent)] disabled:opacity-60"
          />
        </div>

        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${agent.name}`}
            className="shrink-0 rounded-[8px] p-1.5 text-[var(--agent-muted)] transition-colors hover:bg-[var(--agent-canvas)] hover:text-[var(--agent-ink)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--agent-accent)]"
          >
            <Trash2 size={15} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </div>

      {/* Model — segmented control */}
      <div className="mt-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--agent-muted)]">
          Model
        </span>
        <div
          role="radiogroup"
          aria-label={`Model for ${agent.name}`}
          className="mt-1.5 grid grid-cols-2 gap-1 rounded-[10px] border border-[var(--agent-line)] bg-[var(--agent-canvas)] p-1"
        >
          {MODEL_ORDER.map((key) => {
            const model = MODELS[key];
            const active = agent.model === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                title={model.blurb}
                onClick={() => onChange({ model: key })}
                className={cn(
                  "rounded-[7px] px-3 py-1.5 text-[0.8rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--agent-accent)] disabled:opacity-60",
                  active
                    ? "bg-[var(--agent-surface)] text-[var(--agent-ink)] shadow-sm"
                    : "text-[var(--agent-muted)] hover:text-[var(--agent-ink)]"
                )}
              >
                {model.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools — multi-select pills */}
      <div className="mt-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--agent-muted)]">
          Tools
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TOOLS.map((tool) => {
            const active = agent.tools.includes(tool.key);
            return (
              <button
                key={tool.key}
                type="button"
                aria-pressed={active}
                disabled={disabled}
                onClick={() => toggleTool(tool.key)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[0.72rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--agent-accent)] disabled:opacity-60",
                  active
                    ? "border-[var(--agent-accent)] bg-[var(--agent-accent-soft)] text-[var(--agent-accent)]"
                    : "border-[var(--agent-line)] bg-[var(--agent-surface)] text-[var(--agent-muted)] hover:border-[var(--agent-accent)] hover:text-[var(--agent-ink)]"
                )}
              >
                {tool.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
