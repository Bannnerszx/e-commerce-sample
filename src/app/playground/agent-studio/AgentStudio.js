"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { BuilderPanel } from "./components/BuilderPanel";
import { RunTimeline } from "./components/RunTimeline";
import {
  DEFAULT_AGENTS,
  MAX_AGENTS,
  TASK_PRESETS,
  buildRunPlan,
  getPreset,
  makeAgent,
} from "./agent-data";

// Local design tokens, scoped to this playground so the site's indigo theme is
// neither inherited nor leaked — same approach as the merch / checkout demos.
// A near-white "lab" surface + one electric-violet accent reserved for the run
// action and active states (per DESIGN.md: monochrome base + a single pop).
const agentTheme = {
  "--agent-ink": "#14151c",
  "--agent-muted": "#5c6072",
  "--agent-line": "#e5e6ef",
  "--agent-surface": "#ffffff",
  "--agent-canvas": "#f6f7fb",
  "--agent-accent": "#5b53ff",
  "--agent-accent-soft": "#ecebff",
  fontFamily: "var(--font-body)",
};

function emptyRun() {
  return { lanes: [], synth: { status: "waiting", steps: [] }, showReport: false };
}

// The whole run is a stream of timed events dispatched into this reducer — the
// only source of truth for what each lane and the synthesizer are showing.
function runReducer(state, action) {
  switch (action.type) {
    case "init":
      return {
        lanes: Array.from({ length: action.count }, () => ({
          status: "waiting",
          steps: [],
          metric: null,
        })),
        synth: { status: "waiting", steps: [] },
        showReport: false,
      };
    case "lane-step": {
      const lanes = state.lanes.slice();
      const lane = lanes[action.lane];
      if (!lane) return state;
      lanes[action.lane] = { ...lane, status: "running", steps: [...lane.steps, action.step] };
      return { ...state, lanes };
    }
    case "lane-done": {
      const lanes = state.lanes.slice();
      const lane = lanes[action.lane];
      if (!lane) return state;
      lanes[action.lane] = { ...lane, status: "done", metric: action.metric };
      return { ...state, lanes };
    }
    case "synth-start":
      return { ...state, synth: { ...state.synth, status: "running" } };
    case "synth-step":
      return { ...state, synth: { ...state.synth, steps: [...state.synth.steps, action.step] } };
    case "synth-done":
      return { ...state, synth: { ...state.synth, status: "done" }, showReport: true };
    case "reset":
      return emptyRun();
    default:
      return state;
  }
}

export default function AgentStudio() {
  const [presetKey, setPresetKey] = useState(TASK_PRESETS[0].key);
  const [objective, setObjective] = useState(TASK_PRESETS[0].objective);
  const [agents, setAgents] = useState(() => DEFAULT_AGENTS.map((a) => ({ ...a })));
  const [stage, setStage] = useState("config"); // "config" | "running" | "done"
  const [run, dispatch] = useReducer(runReducer, undefined, emptyRun);

  // Fan-out means several concurrent timers; keep every id so a restart or an
  // unmount can cancel the whole in-flight run cleanly (no double-runs).
  const timers = useRef([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    dispatch({ type: "reset" });
    setStage("config");
  }, [clearTimers]);

  const startRun = useCallback(() => {
    clearTimers();
    const preset = getPreset(presetKey);
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    dispatch({ type: "init", count: agents.length });
    setStage("running");

    const plan = buildRunPlan(preset, agents, { reduced });
    plan.events.forEach((ev) => {
      timers.current.push(setTimeout(() => dispatch(ev), ev.at));
    });
    timers.current.push(setTimeout(() => setStage("done"), plan.duration + 60));
  }, [agents, presetKey, clearTimers]);

  const handlePreset = useCallback(
    (key) => {
      setPresetKey(key);
      setObjective(getPreset(key).objective);
      reset();
    },
    [reset]
  );

  const handleAgentChange = useCallback((id, patch) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const handleAddAgent = useCallback(() => {
    setAgents((prev) => (prev.length >= MAX_AGENTS ? prev : [...prev, makeAgent()]));
  }, []);

  const handleRemoveAgent = useCallback((id) => {
    setAgents((prev) => (prev.length <= 1 ? prev : prev.filter((a) => a.id !== id)));
  }, []);

  return (
    <div
      style={agentTheme}
      className="w-full overflow-hidden rounded-[24px] border border-[var(--agent-line)] bg-[var(--agent-canvas)] text-[var(--agent-ink)]"
    >
      {/* Studio bar */}
      <div className="flex items-center justify-between border-b border-[var(--agent-line)] bg-[var(--agent-surface)] px-4 py-3 sm:px-6">
        <span className="flex items-center gap-2 text-[1rem] font-bold tracking-[-0.02em] text-[var(--agent-ink)]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--agent-accent)] text-white">
            <Bot size={16} strokeWidth={2.25} aria-hidden />
          </span>
          Agent Studio
        </span>
        <span className="rounded-full bg-[var(--agent-accent-soft)] px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[var(--agent-accent)]">
          Fan-out → Fan-in
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        {/* Build */}
        <div className="border-b border-[var(--agent-line)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <BuilderPanel
            presetKey={presetKey}
            objective={objective}
            agents={agents}
            stage={stage}
            onPreset={handlePreset}
            onObjective={setObjective}
            onAgentChange={handleAgentChange}
            onAddAgent={handleAddAgent}
            onRemoveAgent={handleRemoveAgent}
            onRun={startRun}
          />
        </div>

        {/* Run */}
        <div className="p-4 sm:p-6">
          <RunTimeline
            stage={stage}
            objective={objective}
            agents={agents}
            run={run}
            report={getPreset(presetKey).report}
            onRunAgain={startRun}
          />
        </div>
      </div>
    </div>
  );
}
