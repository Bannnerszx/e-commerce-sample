"use client"

import { useState, useEffect } from "react"
import { Satellite, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Receive the serverTimestamp prop
export function MapHudBar({ totalShips, trackedShips, successRate, serverTimestamp }) {
  const [liveTime, setLiveTime] = useState("");

  useEffect(() => {
    // 1. Calculate how far off the user's computer clock is from the server
    const driftOffset = serverTimestamp ? serverTimestamp - Date.now() : 0;

    const tick = () => {
      // 2. Add that offset to Date.now() to get the TRUE server time
      const trueServerTime = new Date(Date.now() + driftOffset);

      const jstString = trueServerTime.toLocaleString("en-US", {
        timeZone: "Asia/Tokyo",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      
      setLiveTime(`${jstString} JST`);
    };

    tick(); // Run once immediately
    const interval = setInterval(tick, 1000); // Tick every second

    return () => clearInterval(interval);
  }, [serverTimestamp]);

  return (
    // Clean white background with a subtle blue border
    <header className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-5 py-3 bg-white border-b border-[#0000ff]/20 shadow-none">
      {/* Branding */}
      <div className="flex items-center gap-3">
        {/* Soft 10% blue background for the icon */}
        <div className="bg-[#0000ff]/10 rounded-lg p-1.5 border border-[#0000ff]/20">
          <Satellite className="size-4 text-[#0000ff]" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-[#0000ff] tracking-tight leading-none">
            GPS System Utilization &amp; Health
          </h1>
          {/* 60% opacity blue for subtitles so they don't overpower the title */}
          <p className="text-[10px] text-[#0000ff]/60 mt-0.5">
            Ship tracking performance dashboard
          </p>
        </div>
      </div>

      {/* Center quick stats */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-[#0000ff]/60 font-medium uppercase tracking-widest">Vessels</span>
          {/* Restored to original foreground color */}
          <span className="text-sm font-bold font-mono text-foreground">{totalShips}</span>
        </div>
        
        {/* Subtle blue dividers */}
        <div className="w-px h-6 bg-[#0000ff]/20" />
        
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-[#0000ff]/60 font-medium uppercase tracking-widest">Tracked</span>
          {/* Restored to original cyan */}
          <span className="text-sm font-bold font-mono text-[#22d3ee]">{trackedShips}</span>
        </div>
        
        <div className="w-px h-6 bg-[#0000ff]/20" />
        
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-[#0000ff]/60 font-medium uppercase tracking-widest">Uptime</span>
          {/* Restored to original cyan */}
          <span className="text-sm font-bold font-mono text-[#22d3ee]">{successRate}%</span>
        </div>
      </div>

      {/* Right status */}
      <div className="flex items-center gap-3">
        <Badge
          variant="secondary"
          className="flex items-center gap-1.5 text-[10px] font-mono bg-[#0000ff]/10 text-[#0000ff] border border-[#0000ff]/20 shadow-none hover:bg-[#0000ff]/20"
        >
          {/* Solid blue pulse dot */}
          <span className="size-1.5 rounded-full bg-[#0000ff] animate-pulse" />
          Live
        </Badge>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#0000ff]/60 font-mono min-w-[140px] justify-end">
          <Clock className="size-3 shrink-0" />
          <span>{liveTime || "Syncing..."}</span>
        </div>
      </div>
    </header>
  )
}