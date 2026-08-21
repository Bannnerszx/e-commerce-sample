"use client";

import { SHIPS } from "../lib/ship-data";

export function VesselStats() {
  const underway = SHIPS.filter((s) => s.status === "Underway using Engine").length;
  const atAnchor = SHIPS.filter((s) => s.status === "At Anchor").length;

  return (
    <div
      className="absolute bottom-8 left-4 z-20 flex flex-col gap-1 rounded-xl px-3 py-2.5 shadow-xl"
      style={{
        background: "oklch(0.15 0.03 237 / 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid oklch(0.28 0.04 235 / 0.5)",
      }}
    >
      <p className="text-[9px] font-mono uppercase tracking-widest text-[oklch(0.58_0.04_230)] mb-0.5">
        Vessels Tracked
      </p>
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono font-bold text-[oklch(0.93_0.01_220)]">{SHIPS.length}</span>
          <span className="text-[9px] font-mono text-[oklch(0.58_0.04_230)]">Total</span>
        </div>
        <div className="w-px h-8 bg-[oklch(0.26_0.04_235)]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono font-bold text-green-400">{underway}</span>
          <span className="text-[9px] font-mono text-[oklch(0.58_0.04_230)]">Underway</span>
        </div>
        <div className="w-px h-8 bg-[oklch(0.26_0.04_235)]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono font-bold text-yellow-400">{atAnchor}</span>
          <span className="text-[9px] font-mono text-[oklch(0.58_0.04_230)]">Anchored</span>
        </div>
      </div>
    </div>
  );
}