# AI Agent Builder (Agent Studio)

Playground **03** in the Showcase. A client-facing demo of how you *build* an AI
agent team and *use* it on a task — modelled on the **fan-out / fan-in** workflow
from Google's Agent Development Kit (ADK): several worker agents research
sub-topics in parallel, then a synthesizer merges their findings into one
executive report.

## It's fully simulated — on purpose

The site is a static export (`output: "export"` in `next.config.mjs`): no server,
no API routes, no secret keys. So there is **no model API call anywhere**. The
"agent run" is a script played back on timers in the browser — the same trick the
Checkout playground uses to fake "Processing…". This keeps the demo free, offline,
and unbreakable, while still teaching the real workflow shape.

## What a visitor does

1. **Build** (left panel): pick a task preset, edit the objective, and configure a
   team of worker agents — each with a name, a role, a **model** (Flash vs. Pro),
   and **tools** (Google Search, Tavily/Serper, Firestore, Scraper). Add/remove
   agents (1–5). A live **cost estimate** updates from the model + tool choices.
2. **Run** (right panel): the workers **fan out** in parallel — each streams
   `plan → tool calls → findings` with its own status — then the **synthesizer**
   **fans in** and writes the report. "Run again" re-runs the same team.

## Files

```
agent-studio/
├── AgentStudio.js            # "use client" entry: state, run reducer, timer
│                             #   scheduler, scoped theme, two-column shell
├── agent-data.js             # MODELS, TOOLS, TASK_PRESETS, SYNTHESIZER,
│                             #   DEFAULT_AGENTS, makeAgent, estimateCost,
│                             #   buildRunPlan (the scripted event timeline)
├── README.md
└── components/
    ├── BuilderPanel.js       # task presets, objective, agent list, cost, Run
    ├── AgentCard.js          # one worker: name/role inputs, model toggle, tools
    ├── RunTimeline.js        # fan-out lanes + fan-in synthesizer + report
    ├── AgentLane.js          # one worker's live streaming column
    └── ResultReport.js       # final executive report + Run again
```

## How the simulation works

`buildRunPlan(preset, agents, { reduced })` flattens the current team + task into a
time-ordered list of events (`lane-step`, `lane-done`, `synth-start`, `synth-step`,
`synth-done`). `AgentStudio` fires each with `setTimeout` and dispatches it into
`runReducer`, the single source of truth for what every lane shows. Each worker's
timeline starts near `t=0` (small stagger) → **parallel fan-out**; the synthesizer
only starts after the slowest worker finishes → **fan-in**. Every timer id is kept
in a ref and cleared on restart/unmount, so there are no double-runs. Workers map
to a preset `angle` by index (cycling), so editing names/count still produces
coherent, on-topic findings. `prefers-reduced-motion` collapses the delays to
near-instant.

## Wiring

- Registered in `src/app/Showcase.js` as `<AgentStudioSection>` (slot 03, `id="agents"`).
- Nav link `#agents` ("Agents") added in `src/app/Header.js`.
- Theme is scoped via the `agentTheme` CSS-var object on the root — a light "lab"
  surface + one electric-violet accent — so the site's indigo theme neither leaks
  in nor out (same pattern as `merch` / `checkout`).
