"use client";

import { useState } from "react";
import { Search, Menu, X, Anchor, Layers, Bell, Settings } from "lucide-react";
import { SHIPS } from "../lib/ship-data";
import { cn } from "@/lib/utils";

export function TopNav({ onSelectShip, selectedShipId }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const results = query.trim()
    ? SHIPS.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.origin.label.toLowerCase().includes(query.toLowerCase()) ||
        s.destination.label.toLowerCase().includes(query.toLowerCase()) ||
        s.mmsi.includes(query)
    )
    : [];

  const showDropdown = focused && query.trim().length > 0;

  function handleSelect(ship) {
    onSelectShip(ship);
    setQuery("");
    setFocused(false);
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 transform-gpu"
      style={{
        background: "oklch(0.13 0.03 237 / 0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid oklch(0.28 0.04 235 / 0.5)",
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "oklch(0.62 0.18 220 / 0.2)", border: "1px solid oklch(0.62 0.18 220 / 0.4)" }}
        >
          <Anchor size={16} className="text-[oklch(0.62_0.18_220)]" />
        </div>
        <span className="font-mono font-bold text-sm tracking-widest text-[oklch(0.93_0.01_220)] hidden sm:block">
          MARINE<span className="text-[oklch(0.62_0.18_220)]">VIEW</span>
        </span>
      </div>

      <div className="flex-1 relative max-w-md">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 h-9 transition-all duration-200",
            focused
              ? "ring-1 ring-[oklch(0.62_0.18_220/0.6)] bg-[oklch(0.22_0.04_235)]"
              : "bg-[oklch(0.22_0.04_235/0.7)]"
          )}
          style={{ border: "1px solid oklch(0.28 0.04 235 / 0.6)" }}
        >
          <Search size={14} className="text-[oklch(0.58_0.04_230)] shrink-0" />
          <input
            type="text"
            placeholder="Search vessels, ports, MMSI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className="flex-1 bg-transparent text-sm font-mono text-[oklch(0.93_0.01_220)] placeholder:text-[oklch(0.58_0.04_230/0.6)] outline-none min-w-0"
            aria-label="Search vessels or ports"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)] transition-colors"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {showDropdown && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-y-auto max-h-[60vh] shadow-2xl z-50"
            style={{
              background: "oklch(0.15 0.03 237 / 0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid oklch(0.28 0.04 235 / 0.6)",
            }}
          >
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm font-mono text-[oklch(0.58_0.04_230)]">
                No vessels found
              </div>
            ) : (
              results.map((ship) => (
                <button
                  key={ship.id}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[oklch(0.22_0.04_235/0.8)] transition-colors text-left"
                  onMouseDown={() => handleSelect(ship)}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ship.color }} />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-mono font-semibold text-[oklch(0.93_0.01_220)] truncate">
                      {ship.name}
                    </span>
                    <span className="text-[10px] font-mono text-[oklch(0.58_0.04_230)] truncate">
                      {ship.type} · {ship.origin.label} → {ship.destination.label}
                    </span>
                  </div>
                  <span className="text-lg shrink-0 ml-auto">{ship.flag}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-1">
        <NavIconButton icon={Layers} label="Layers" />
        <NavIconButton icon={Bell} label="Alerts" />
        <NavIconButton icon={Settings} label="Settings" />
      </div>

      <div className="hidden sm:flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/25">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
        </span>
        <span className="text-[10px] font-mono text-green-400 font-semibold">LIVE</span>
      </div>

      <button
        className="md:hidden p-1.5 rounded-md hover:bg-[oklch(0.22_0.04_235)] transition-colors text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)]"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 md:hidden py-2 shadow-xl"
          style={{
            background: "oklch(0.14 0.03 237 / 0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid oklch(0.28 0.04 235 / 0.5)",
          }}
        >
          {[
            { icon: Layers, label: "Layer Controls" },
            { icon: Bell, label: "Alerts" },
            { icon: Settings, label: "Settings" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-mono text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)] hover:bg-[oklch(0.22_0.04_235/0.5)] transition-colors"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function NavIconButton({ icon: Icon, label }) {
  return (
    <button
      className="p-2 rounded-md hover:bg-[oklch(0.22_0.04_235)] transition-colors text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)]"
      aria-label={label}
      title={label}
    >
      <Icon size={16} />
    </button>
  );
}