// Local catalog + simulation engine for the AI Agent Builder playground.
// There is NO backend and no model API — the whole "agent run" is scripted in
// the browser and played back on timers, exactly like the Checkout playground
// fakes its "processing" step. The catalog values (models, tools, costs) echo
// the Google ADK "Parallel Market Research" case study so the demo teaches a
// real fan-out / fan-in workflow without ever leaving the page.

/* ---------------------------------------------------------------------------
 * Models — a fast/cheap worker model vs. a stronger synthesis model. `speed`
 * is a relative latency multiplier used by the run scheduler; `costPerRun` is
 * a simulated dollar figure used by estimateCost().
 * ------------------------------------------------------------------------- */
export const MODELS = {
  flash: {
    key: "flash",
    label: "Flash",
    blurb: "Fast + cheap. Ideal for the parallel research workers.",
    speed: 1,
    costPerRun: 0.006,
  },
  pro: {
    key: "pro",
    label: "Pro",
    blurb: "Slower, stronger reasoning. Best saved for the final synthesis.",
    speed: 2,
    costPerRun: 0.018,
  },
};

export const MODEL_ORDER = ["flash", "pro"];

/* ---------------------------------------------------------------------------
 * Tools an agent can be given. `verb` is the line shown in the run log when
 * that tool "fires". Sourced from the ADK md (Google Search grounding, Tavily
 * / Serper, Firestore, plus a scraper).
 * ------------------------------------------------------------------------- */
export const TOOLS = [
  { key: "search", label: "Google Search", verb: "searching the web" },
  { key: "tavily", label: "Tavily / Serper", verb: "querying Tavily" },
  { key: "firestore", label: "Firestore DB", verb: "reading Firestore" },
  { key: "scrape", label: "Web Scraper", verb: "scraping pages" },
];

const TOOL_COST = 0.0008; // simulated $ per tool invocation

/* ---------------------------------------------------------------------------
 * Task presets. Each preset drives the scripted output: every worker agent is
 * mapped to one `angle` (by index, cycling if there are more agents than
 * angles), and the fan-in `report` is fixed per preset. The objective string
 * seeds the editable objective field.
 * ------------------------------------------------------------------------- */
export const TASK_PRESETS = [
  {
    key: "competitors",
    label: "Competitor analysis",
    objective: "Analyze the top 3 competitors in the premium running-shoe market",
    angles: [
      {
        focus: "Pricing & positioning",
        findings: [
          "Competitor A holds the premium tier at ~$160",
          "Competitor B undercuts with a $110 core line",
          "Competitor C leans on subscription bundles",
        ],
        metric: { label: "Median price", value: "$135" },
      },
      {
        focus: "Product & technology",
        findings: [
          "A ships a carbon-plate flagship every ~9 months",
          "B differentiates on a recycled-material story",
          "C bundles a companion training app",
        ],
        metric: { label: "Release cadence", value: "9 mo" },
      },
      {
        focus: "Channels & marketing",
        findings: [
          "A spends heavily on elite-athlete sponsorships",
          "B is DTC-first with strong short-video reach",
          "C relies on retail partnerships",
        ],
        metric: { label: "Top channel", value: "DTC / social" },
      },
      {
        focus: "Customer sentiment",
        findings: [
          "A praised for durability, dinged on price",
          "B loved for value, mixed on sizing",
          "C sentiment rising after its app launch",
        ],
        metric: { label: "Avg. rating", value: "4.2 / 5" },
      },
    ],
    report: {
      headline: "Where the opening is",
      summary:
        "The market splits into a premium-performance leader (A), a value-and-sustainability challenger (B), and an ecosystem play (C). The clearest gap is a mid-premium shoe pairing B's value story with A's performance credibility.",
      bullets: [
        "Enter at $125–$140 — above B, below A's $160 anchor",
        "Lead with performance proof (plate / tech) to dodge the 'cheap' trap",
        "Go DTC-first on social, where B is taking share",
        "Ship a companion app early — C shows it lifts sentiment",
      ],
    },
  },
  {
    key: "launch",
    label: "Product launch plan",
    objective: "Plan the go-to-market for a new cold-brew coffee line",
    angles: [
      {
        focus: "Target audience",
        findings: [
          "Core buyer: 25–34 urban professionals",
          "Secondary: at-home remote workers",
          "High overlap with oat-milk & RTD-tea buyers",
        ],
        metric: { label: "Core segment", value: "25–34" },
      },
      {
        focus: "Pricing & packaging",
        findings: [
          "Shelf price lands at $3.99 single / $12.99 4-pack",
          "Glass bottle signals premium vs. canned rivals",
          "Multi-packs drive ~60% of category volume",
        ],
        metric: { label: "Target price", value: "$3.99" },
      },
      {
        focus: "Channel strategy",
        findings: [
          "Grocery + convenience for reach",
          "DTC subscription for margin & first-party data",
          "Cafés as a low-cost sampling channel",
        ],
        metric: { label: "Launch channels", value: "3" },
      },
      {
        focus: "Launch risks",
        findings: [
          "Cold-chain logistics raise fulfilment cost",
          "Category is crowded — differentiation is key",
          "Demand skews hard to summer",
        ],
        metric: { label: "Top risk", value: "Cold chain" },
      },
    ],
    report: {
      headline: "Go-to-market on one page",
      summary:
        "A $3.99 premium cold-brew aimed at 25–34 urban professionals, launched grocery-and-DTC first with cafés for sampling. The 4-pack is the volume driver; cold-chain cost and a crowded shelf are the risks to manage.",
      bullets: [
        "Make the $12.99 4-pack the hero SKU",
        "Open a DTC subscription on day one to own the customer data",
        "Use cafés for sampling, not revenue — it's cheap awareness",
        "Pre-book cold-chain capacity before the summer peak",
      ],
    },
  },
  {
    key: "sentiment",
    label: "Brand sentiment audit",
    objective: "Audit public sentiment for a fintech app after a pricing change",
    angles: [
      {
        focus: "Social chatter",
        findings: [
          "Mentions up ~3x in 48h after the announcement",
          "Sentiment 58% negative, concentrated on X / Reddit",
          "Power users drive most of the volume",
        ],
        metric: { label: "Net sentiment", value: "−22" },
      },
      {
        focus: "Support tickets",
        findings: [
          "Cancellation requests up 18% week-over-week",
          "Top theme: 'grandfather my old plan'",
          "Response time slipped to ~14h",
        ],
        metric: { label: "Cancels", value: "+18%" },
      },
      {
        focus: "Reviews & ratings",
        findings: [
          "App-store rating dipped 4.6 → 4.1",
          "Recent 1-star reviews cite price, not the product",
          "Feature requests unchanged — it's price, not quality",
        ],
        metric: { label: "Store rating", value: "4.1" },
      },
      {
        focus: "Competitor response",
        findings: [
          "Two rivals ran 'switch & save' promos within days",
          "One offered to price-match the old tier",
          "Search interest for alternatives up ~40%",
        ],
        metric: { label: "Rival promos", value: "2 live" },
      },
    ],
    report: {
      headline: "Read on the backlash",
      summary:
        "The pricing change triggered a sharp, concentrated backlash from power users — loud on social, showing up as cancellations, and actively exploited by two competitors. The product isn't the problem; the migration path is.",
      bullets: [
        "Offer a grandfather tier to the loudest cohort — cheaper than the churn",
        "Publish a clear 'why' post to blunt the social narrative",
        "Staff up support for two weeks — slow replies compound the anger",
        "Watch the two rival 'switch & save' promos closely",
      ],
    },
  },
];

export function getPreset(key) {
  return TASK_PRESETS.find((p) => p.key === key) ?? TASK_PRESETS[0];
}

/* ---------------------------------------------------------------------------
 * The fan-in agent. Fixed — the visitor edits the worker team, the synthesizer
 * is always the Pro model that merges their output.
 * ------------------------------------------------------------------------- */
export const SYNTHESIZER = {
  name: "Synthesizer",
  role: "Merge every worker's findings into one executive report",
  model: "pro",
};

/* ---------------------------------------------------------------------------
 * Worker team. DEFAULT_AGENTS seeds the builder; makeAgent() mints new ones.
 * ------------------------------------------------------------------------- */
export const MIN_AGENTS = 1;
export const MAX_AGENTS = 5;

export const DEFAULT_AGENTS = [
  { id: "seed-1", name: "Pricing Analyst", role: "Compare pricing & positioning", model: "flash", tools: ["search", "scrape"] },
  { id: "seed-2", name: "Product Scout", role: "Break down features & specs", model: "flash", tools: ["search", "tavily"] },
  { id: "seed-3", name: "Sentiment Watcher", role: "Gauge customer sentiment", model: "flash", tools: ["tavily", "firestore"] },
];

let _seq = 0;
export function makeAgent(partial = {}) {
  _seq += 1;
  return {
    id: `agent-${Date.now().toString(36)}-${_seq}`,
    name: `Research Agent ${_seq}`,
    role: "Research a sub-topic",
    model: "flash",
    tools: ["search"],
    ...partial,
  };
}

/* ---------------------------------------------------------------------------
 * Simulated cost. Workers + the Pro synthesizer + a small per-tool charge.
 * Lands in the $0.01–0.05 "per research report" band the ADK md quotes.
 * ------------------------------------------------------------------------- */
export function estimateCost(agents) {
  const workers = agents.reduce((sum, a) => sum + MODELS[a.model].costPerRun, 0);
  const tools = agents.reduce((sum, a) => sum + a.tools.length * TOOL_COST, 0);
  const synth = MODELS[SYNTHESIZER.model].costPerRun;
  return workers + tools + synth;
}

export function formatCost(value) {
  return `$${value.toFixed(3)}`;
}

/* ---------------------------------------------------------------------------
 * Run scheduler. Turns the current team + preset into a flat, time-ordered
 * list of events the entry component fires with setTimeout. Every worker's
 * timeline starts near t=0 (a small stagger keeps it lively) so they run in
 * PARALLEL — that's the fan-out. The synthesizer only starts after the slowest
 * worker finishes — that's the fan-in.
 *
 * `reduced` collapses the gaps to near-instant for prefers-reduced-motion.
 * Returns { events, duration } where each event is a reducer action.
 * ------------------------------------------------------------------------- */
export function buildRunPlan(preset, agents, { reduced = false } = {}) {
  const gap = reduced ? 40 : 620;
  const stagger = reduced ? 0 : 140;
  const events = [];
  let maxEnd = 0;

  agents.forEach((agent, i) => {
    const angle = preset.angles[i % preset.angles.length];
    const step = gap * MODELS[agent.model].speed;
    let t = i * stagger;

    events.push({ at: t, type: "lane-step", lane: i, step: { kind: "think", text: `Planning: ${angle.focus}` } });
    t += step;

    const tools = agent.tools.length ? agent.tools : ["search"];
    tools.forEach((key) => {
      const tool = TOOLS.find((x) => x.key === key);
      events.push({
        at: t,
        type: "lane-step",
        lane: i,
        step: { kind: "tool", text: `${tool ? tool.label : key} — ${tool ? tool.verb : "working"}…` },
      });
      t += step;
    });

    angle.findings.forEach((text) => {
      events.push({ at: t, type: "lane-step", lane: i, step: { kind: "finding", text } });
      t += step;
    });

    events.push({ at: t, type: "lane-done", lane: i, metric: angle.metric, focus: angle.focus });
    maxEnd = Math.max(maxEnd, t);
  });

  let s = maxEnd + gap;
  events.push({ at: s, type: "synth-start" });
  const synthStep = gap * MODELS[SYNTHESIZER.model].speed;
  s += synthStep;

  [
    `Merging ${agents.length} research stream${agents.length === 1 ? "" : "s"}…`,
    "Cross-checking findings for conflicts…",
    "Writing the executive summary…",
  ].forEach((text) => {
    events.push({ at: s, type: "synth-step", step: { text } });
    s += synthStep;
  });

  events.push({ at: s, type: "synth-done" });

  return { events, duration: s };
}
