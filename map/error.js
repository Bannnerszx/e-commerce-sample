"use client";

import { useEffect } from "react";

// Route-level error boundary for /map. Next.js auto-wraps this segment, so ANY throw
// during render of page.js / FleetMapClient — a Firestore serialization error, a bad
// date, a malformed ship doc — lands here instead of blanking the whole page.
export default function Error({ error, reset }) {
  useEffect(() => {
    // Keep the real cause visible in the console / error reporting.
    console.error("Map route crashed:", error);
  }, [error]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a1220] flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <h1 className="text-slate-100 text-lg font-semibold mb-2">
          Map failed to load
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Something went wrong while loading the fleet map. This can happen when
          incoming vessel data is incomplete or malformed.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#0a1220] transition hover:bg-[#67e8f9]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
