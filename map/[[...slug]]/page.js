// app/map/[[...slug]]/page.js
import { db } from "@/lib/firebaseAdmin";
import FleetMapClient from "../fleet-map-client";

// Firestore docs can hold values that aren't safe to hand a Client Component:
// Timestamp/GeoPoint/DocumentReference class instances, undefined, functions. Passing any
// of them as a prop makes Next.js throw "Only plain objects can be passed to Client
// Components" at the server->client boundary — which surfaces as a client-side crash.
// toPlain() recursively reduces a value to JSON-serializable data (Timestamps/Dates become
// ISO strings) so malformed/non-plain fields can never break serialization.
function toPlain(value) {
  if (value == null) return value === undefined ? null : value;
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return value;
  if (t === "function") return null;
  // Firestore Timestamp (and anything Date-like exposing toDate()).
  if (typeof value.toDate === "function") {
    try {
      return value.toDate().toISOString();
    } catch {
      return null;
    }
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (Array.isArray(value)) return value.map(toPlain);
  if (t === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const plain = toPlain(v);
      if (plain !== undefined) out[k] = plain;
    }
    return out;
  }
  // BigInt, Symbol, or anything else non-serializable.
  return null;
}

// Guarantee a display-safe ISO date string, falling back to "now" when the stored value
// is missing or unparseable.
function safeIsoDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export default async function Page({ params }) {
  // Await params in Next.js 14+ / 15
  const resolvedParams = await params;

  // If URL is /map/gracious_ace, slug[0] is "gracious_ace"
  // If URL is /map, slug is undefined
  const urlId = resolvedParams.slug ? resolvedParams.slug[0] : null;

  // FETCH ALL SHIPS: This ensures ALL pins are always active on the map!
  let ships = [];
  try {
    const snapshot = await db.collection("ship_routes").get();
    // Show only vessels currently IN USE. Idle/discharged vessels are retired to
    // tracking_active:false by refreshPositionsCore (their doc is kept in Firestore
    // for free instant revival, just hidden here). Keep active (true) + new (undefined);
    // filter in JS because a Firestore != query would also drop docs missing the field.
    ships = snapshot.docs
      .map((doc) => toPlain({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((s) => s.tracking_active !== false);
  } catch (error) {
    console.error("Error fetching ships on server:", error);
  }

  let initialStats = {
    last_updated: new Date().toISOString(),
    gps_button_clicks: 0,
    successful_tracks: 0,
    datadocked_api_calls: 0,
    unknown_vessels: 0,
    cost_per_call: 24,
    total_triggers: 0,
    total_errors: 0
  }

  try {
    const statsDoc = await db.collection("ship_analytics").doc("global_stats").get();
    if (statsDoc.exists) {
      initialStats = toPlain({ ...initialStats, ...statsDoc.data() })
    }
  } catch (err) {
    console.error("Failed to fetch global stats on server:", err)
  }
  // A malformed/missing stored last_updated must never reach the client's date parser.
  initialStats.last_updated = safeIsoDate(initialStats.last_updated);

  // Monthly analytics: "All Time" (cumulative) + one entry per month from the top-level monthly_stats
  // collection (docID "YYYY-MM"). Each entry carries a full stats object shaped like initialStats so the
  // client's KPI math works unchanged. The current month is keyed by its YYYY-MM (matching the client's
  // auto-select) and overridden with the LIVE month-to-date so /map is exact, not daily-stale.
  const COUNTERS = ["gps_button_clicks", "successful_tracks", "datadocked_api_calls", "unknown_vessels", "total_triggers", "total_errors"];
  const currentMonthKey = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 7); // JST, matches backend
  const base = initialStats.month_baseline || {};
  const liveMtd = Object.fromEntries(COUNTERS.map((k) => [k, Math.max(0, (Number(initialStats[k]) || 0) - (Number(base[k]) || 0))]));
  const costPerCall = initialStats.cost_per_call || 24;

  let monthlyStats = [{ key: "all", label: "All Time", stats: initialStats }];
  try {
    const monthlySnap = await db.collection("monthly_ship_stats").orderBy("month", "desc").limit(12).get();

    const months = monthlySnap.docs.map((d) => {
      const m = d.data();
      const isCurrent = m.month === currentMonthKey;
      const counters = isCurrent ? liveMtd : Object.fromEntries(COUNTERS.map((k) => [k, Number(m[k]) || 0]));
      return {
        key: m.month,
        label: isCurrent ? `${m.month} (This Month)` : m.month,
        stats: { ...counters, cost_per_call: m.cost_per_call || costPerCall, last_updated: initialStats.last_updated },
      };
    });

    // Guarantee a current-month scope even before the first rollup wrote its doc.
    if (!months.some((e) => e.key === currentMonthKey)) {
      months.unshift({
        key: currentMonthKey,
        label: `${currentMonthKey} (This Month)`,
        stats: { ...liveMtd, cost_per_call: costPerCall, last_updated: initialStats.last_updated },
      });
    }

    monthlyStats = [{ key: "all", label: "All Time", stats: initialStats }, ...months];
  } catch (err) {
    console.error("Failed to fetch monthly stats on server:", err)
  }

  const serverTimestamp = Date.now();
  // Pass both the full fleet and the requested ID to the interactive client
  return <FleetMapClient serverTimestamp={serverTimestamp} initialShips={ships} initialUrlId={urlId} initialStats={initialStats} monthlyStats={monthlyStats} />;
}