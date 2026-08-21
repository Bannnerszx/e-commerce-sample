"use client";

import { useState, useCallback, useRef, useEffect, use } from "react";
import dynamic from "next/dynamic";
import {
  MousePointerClick,
  Ship,
  TrendingUp,
  Radio,
  ShieldOff,
  CreditCard,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Users,
  DollarSign,
  Activity,
  JapaneseYen,
  Calendar
} from "lucide-react";

import { MapWrapper } from "./components/map-wrapper";
import ClientAppCheck from "../../../firebase/ClientAppCheck";

// Dynamically import the UI Overlays
const ShipDetailsPanel = dynamic(() =>
  import("./components/ship-details-panel").then((mod) => mod.ShipDetailsPanel)
);
const MapControls = dynamic(() =>
  import("./components/map-controls").then((mod) => mod.MapControls)
);
const MapHudBar = dynamic(() =>
  import("./components/map-hud-bar").then((mod) => mod.MapHudBar)
);
const OverlayKpiPanel = dynamic(() =>
  import("./components/overlay-kpi-panel").then((mod) => mod.OverlayKpiPanel)
);

// Mock data — replace with Firestore getDoc or SWR when ready


function formatTimestamp(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—"; // malformed/missing date: degrade, don't show "Invalid Date"
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Coerce a possibly-missing stat counter to a number so a `.toLocaleString()` /
// `.toString()` on it can never throw when the DB is missing that field.
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export default function FleetMapClient({ initialShips, initialUrlId, initialStats, monthlyStats, serverTimestamp }) {
  // Map and App State
  const [ships] = useState(initialShips);
  const [zoomAction, setZoomAction] = useState(null);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const mapRef = useRef(null);

  // Dashboard Stats State

  const [realStats, setRealStats] = useState(initialStats);
  const [apiCredits, setApiCredits] = useState(null);


  // NEW: Fetch live credits on mount
  useEffect(() => {
    async function fetchLiveCredits() {
      try {
        // Ensure your API key is accessible here
        const apiKey = process.env.NEXT_PUBLIC_DATADOCKED_API_KEY;
        const apiUrl = "https://datadocked.com/api/vessels_operations/my-credits";

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            "accept": "application/json",
            "x-api-key": apiKey
          }
        });

        if (response.ok) {
          const creditData = await response.json();

          // Navigate through the nested JSON structure: { "detail": { "credits": 100 } }
          const finalCredits = creditData?.detail?.credits;

          // Only set it if we actually got a number back, otherwise leave it null to use the fallback
          if (finalCredits !== undefined) {
            setApiCredits(finalCredits);
          }
        } else {
          console.error("Failed to fetch credits. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching live credits, falling back to realStats", error);
      }
    }

    // Only fetch if we aren't in embedded mode
    if (!isEmbedded) {
      fetchLiveCredits();
    }
  }, [isEmbedded]);

  // 1. Determine the current month key on every render so the JSX can use it too
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const scopes = (monthlyStats && monthlyStats.length)
    ? monthlyStats
    : [{ key: "all", label: "All Time", stats: initialStats }];

  // 2. Start with a safe default
  const [scopeKey, setScopeKey] = useState("all");

  // 3. Watch for the data to arrive and update the selection
  useEffect(() => {
    if (monthlyStats && monthlyStats.length > 0) {
      const hasCurrentMonth = monthlyStats.some((m) => m.key === currentMonthKey);

      if (hasCurrentMonth) {
        setScopeKey(currentMonthKey);
      } else {
        // Fallback: If this month hasn't been generated in the DB yet, 
        // default to the most recent month available (ignoring 'all').
        const latestMonth = monthlyStats.find(m => m.key !== "all");
        if (latestMonth) {
          setScopeKey(latestMonth.key);
        }
      }
    }
  }, [monthlyStats, currentMonthKey]);

  const activeStats = (scopes.find((m) => m.key === scopeKey) || scopes[0]).stats;
  // Service Worker Registration
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => console.log("Map Cache Service Worker Active"))
        .catch((err) => console.error("Service Worker Failed", err));
    }
  }, []);

  // 1. Initialize selection based on the server-provided URL ID
  const [selectedShipId, setSelectedShipId] = useState(() => {
    if (initialUrlId) {
      const targetShip = initialShips.find(
        (s) => s?.name?.toLowerCase().replace(/[\s/]/g, "_") === initialUrlId
      );
      if (targetShip) return targetShip.id;
    }
    return null;
  });

  // 2. Read 'embed' parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("embed") === "true") {
        setIsEmbedded(true);
      }
    }
  }, []);

  // 3. Routing Handlers
  const updateUrlPath = useCallback(
    (shipName) => {
      if (typeof window === "undefined" || isEmbedded) return;
      if (shipName) {
        const formattedId = shipName.toLowerCase().replace(/[\s/]/g, "_");
        window.history.pushState(null, "", `/map/${formattedId}`);
      } else {
        window.history.pushState(null, "", `/map`);
      }
    },
    [isEmbedded]
  );

  const handleSelectShip = useCallback(
    (ship) => {
      setSelectedShipId((prev) => {
        const isDeselecting = prev === ship.id;
        updateUrlPath(isDeselecting ? null : ship.name);
        return isDeselecting ? null : ship.id;
      });
    },
    [updateUrlPath]
  );

  const handleClose = useCallback(() => {
    setSelectedShipId(null);
    updateUrlPath(null);
  }, [updateUrlPath]);

  const selectedShip = ships.find((s) => s.id === selectedShipId) ?? null;

  // 4. Calculate KPI Metrics — scoped to the selected month (activeStats), not the raw cumulative totals.
  // "Engagement Rate" was rebuilt: the old tracked ÷ opens ratio leaned on successful_tracks,
  // which counts paid DataDocked fetches — those pause whenever vessels sit moored / in port
  // (positions come free from the cache + itinerary layers), so the ratio sank with zero change
  // in user behavior. The new rate is opens ÷ (active fleet × days in the period): 100% = one
  // tracker open per vessel per day. Moored ships still count in the denominator, so port time
  // can't sink it. Note the denominator uses the CURRENT active fleet size for past months too
  // (historical fleet counts aren't stored).
  // Validate serverTimestamp is numeric before arithmetic — a malformed value would make
  // jstNow an Invalid Date, and jstNow.toISOString() below throws RangeError on that.
  const tsBase = Number.isFinite(Number(serverTimestamp)) ? Number(serverTimestamp) : Date.now();
  const jstNow = new Date(tsBase + 9 * 60 * 60 * 1000); // JST clock — matches the backend month rollover
  const monthScopeKeys = scopes.map((s) => s.key).filter((k) => /^\d{4}-\d{2}$/.test(k));

  let scopeDays = null;
  if (/^\d{4}-\d{2}$/.test(scopeKey)) {
    const [y, m] = scopeKey.split("-").map(Number);
    scopeDays = scopeKey === jstNow.toISOString().slice(0, 7)
      ? jstNow.getUTCDate() // current month: days elapsed so far
      : new Date(Date.UTC(y, m, 0)).getUTCDate(); // past month: its full length
  } else if (monthScopeKeys.length) {
    // "All Time": days since the 1st of the oldest month scope we hold (monthly stats only go
    // back 12 months, so beyond a year this modestly overstates the daily average).
    const [y, m] = [...monthScopeKeys].sort()[0].split("-").map(Number);
    scopeDays = Math.max(1, Math.floor((jstNow.getTime() - Date.UTC(y, m - 1, 1)) / 86400000) + 1);
  }
  const opensPerDay = scopeDays ? activeStats.gps_button_clicks / scopeDays : null;
  const engagementRate = opensPerDay != null && ships.length > 0
    ? ((opensPerDay / ships.length) * 100).toFixed(1)
    : null;

  // Removed .toFixed(2) since Yen amounts are typically represented as whole numbers
  const estimatedSpend = (activeStats.datadocked_api_calls * activeStats.cost_per_call).toLocaleString();
  const creditsSaved = (activeStats.unknown_vessels * activeStats.cost_per_call).toLocaleString();

  const successRate = activeStats.total_triggers > 0
    ? (((activeStats.total_triggers - activeStats.total_errors) / activeStats.total_triggers) * 100).toFixed(2)
    : "100.00";
  // The top HUD bar shows the LIVE fleet snapshot, so its success rate stays all-time (realStats),
  // independent of the month selected for the left KPI panels.
  const liveSuccessRate = realStats.total_triggers > 0
    ? (((realStats.total_triggers - realStats.total_errors) / realStats.total_triggers) * 100).toFixed(2)
    : "100.00";
  const trackedCount = ships.filter((s) => s.status === "tracked" || s.status === "Underway using Engine").length;
  const unknownCount = ships.filter((s) => s.status === "unknown").length;
  const idleCount = ships.length - trackedCount - unknownCount;
  const displayedCredits = apiCredits ?? realStats.datadocked_credit;


  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a1220]">
      <ClientAppCheck />

      {/* Local Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-slide-in {
          from { transform: translateX(16px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .leaflet-ship-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-ship-label::before,
        .leaflet-tooltip-top.leaflet-ship-label::before {
          display: none !important;
        }
      `,
        }}
      />

      {/* Full-screen Leaflet map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper
          ships={ships}
          selectedShipId={selectedShipId}
          onSelectShip={handleSelectShip}
          zoomAction={zoomAction}
          onZoomActionDone={() => setZoomAction(null)}
          mapRef={mapRef}
          isEmbedded={isEmbedded}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10" aria-hidden="true" />

      {/* Only show UI Overlays if NOT embedded */}
      {!isEmbedded && (
        <>
          {/* Top HUD bar */}
          <MapHudBar
            lastUpdated={formatTimestamp(realStats.last_updated)}
            totalShips={ships.length}
            trackedShips={trackedCount}
            successRate={liveSuccessRate}
            serverTimestamp={serverTimestamp}
          />

          {/* Left sidebar — KPI panels */}
          <aside
            className="absolute top-[60px] left-4 bottom-4 z-[1000] w-64 flex flex-col gap-3 mt-4 overflow-y-auto pointer-events-auto"
            aria-label="KPI Panels"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Month selector — re-scopes all KPI panels below to the chosen period */}
            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-none">
              <Calendar className="size-3.5 shrink-0 text-slate-500" />
              <label htmlFor="stat-scope" className="sr-only">Analytics period</label>
              <select
                id="stat-scope"
                value={scopeKey}
                onChange={(e) => setScopeKey(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-xs font-bold uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
              >
                {scopes.map((m) => {
                  // Dynamically apply the "THIS MONTH (YYYY-MM)" label if the key matches the current month
                  const isCurrentMonth = m.key === currentMonthKey;
                  const displayLabel = isCurrentMonth ? `THIS MONTH (${m.key})` : m.label;

                  return (
                    <option key={m.key} value={m.key}>
                      {displayLabel}
                    </option>
                  );
                })}
              </select>
            </div>

            <OverlayKpiPanel
              title="User Engagement"
              icon={Users}
              defaultOpen={true}
              items={[
                {
                  icon: MousePointerClick,
                  label: "Total Tracker Opens",
                  value: num(activeStats.gps_button_clicks).toLocaleString(),
                  subtitle: "GPS button clicks",
                  status: "neutral",
                },
                {
                  icon: Ship,
                  label: "Ships Tracked",
                  value: num(activeStats.successful_tracks).toLocaleString(),
                  subtitle: "Returned valid location",
                  status: "success",
                },
                {
                  icon: TrendingUp,
                  label: "Engagement Rate",
                  value: engagementRate != null ? `${engagementRate}%` : "—",
                  subtitle: "Opens ÷ (fleet × days)",
                  status: "neutral",
                },
              ]}
            />

            <OverlayKpiPanel
              title="API & Cost"
              icon={JapaneseYen}
              defaultOpen={true}
              items={[
                {
                  icon: Radio,
                  label: "DataDocked API Calls",
                  value: num(activeStats.datadocked_api_calls).toLocaleString(),
                  subtitle: "Total requests",
                  status: "neutral",
                },
                {
                  icon: DollarSign,
                  label: "Live Credits",
                  value: displayedCredits != null
                    ? displayedCredits.toLocaleString()
                    : "...",
                  subtitle: "Available balance",
                  // UPDATED: Use displayedCredits for the status logic
                  status: displayedCredits != null && displayedCredits < 100
                    ? "warning"
                    : "success",
                },
                {
                  icon: ShieldOff,
                  label: "Junk Names Blocked",
                  value: `¥${creditsSaved}`, // Updated to Yen
                  subtitle: "Saved API cost",
                  status: "warning",
                },
                {
                  icon: CreditCard,
                  label: "Estimated Spend",
                  value: `¥${estimatedSpend}`, // Updated to Yen
                  subtitle: `¥${activeStats.cost_per_call}/call`, // Updated to Yen
                  status: "neutral",
                },
              ]}
            />

            <OverlayKpiPanel
              title="System Health"
              icon={Activity}
              defaultOpen={true}
              items={[
                {
                  icon: Zap,
                  label: "Backend Triggers",
                  value: num(activeStats.total_triggers).toLocaleString(),
                  subtitle: "Cloud fn invocations",
                  status: "neutral",
                },
                {
                  icon: AlertTriangle,
                  label: "System Errors",
                  value: num(activeStats.total_errors).toString(),
                  subtitle: activeStats.total_errors === 0 ? "All systems stable" : "Review logs",
                  status: activeStats.total_errors === 0 ? "success" : "danger",
                },
                {
                  icon: CheckCircle2,
                  label: "Success Rate",
                  value: `${successRate}%`,
                  subtitle: `${(num(activeStats.total_triggers) - num(activeStats.total_errors)).toLocaleString()} of ${num(activeStats.total_triggers).toLocaleString()} ok`,
                  status: Number(successRate) >= 99 ? "success" : "warning",
                },
              ]}
            />
          </aside>

          {/* Bottom-right — fleet legend */}
          <div className="absolute bottom-10 right-4 z-[1000] bg-background/70 backdrop-blur-md border border-border/60 rounded-xl px-4 py-3 shadow-[0_4px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2.5 font-semibold">
              Fleet Status
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-[#22d3ee] shadow-[0_0_6px_#22d3ee]" />
                <span className="text-xs text-foreground font-mono">{trackedCount} tracked</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-[oklch(0.78_0.18_70)] shadow-[0_0_6px_oklch(0.78_0.18_70)]" />
                <span className="text-xs text-foreground font-mono">{unknownCount} unknown</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-[#64748b]" />
                <span className="text-xs text-foreground font-mono">{idleCount} idle</span>
              </div>
            </div>
          </div>

          {/* Right Side Sliding Panel (Your Detailed Panel) */}
          <ShipDetailsPanel ship={selectedShip} onClose={handleClose} />

          {/* Bottom Right Map Controls - Moved slightly up to accommodate the legend */}
          <div className="absolute bottom-40 right-4 z-[1000] pointer-events-auto">
            <MapControls
              onZoomIn={() => setZoomAction("in")}
              onZoomOut={() => setZoomAction("out")}
              onResetNorth={() => setZoomAction("reset")}
              mapRef={mapRef}
            />
          </div>
        </>
      )}
    </main>
  );
}