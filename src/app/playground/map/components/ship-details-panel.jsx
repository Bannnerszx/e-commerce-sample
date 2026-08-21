"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { X, Anchor, ArrowRight, Gauge, Compass, MapPin, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/cn";

function VesselTypeBadge({ type }) {
  const colorMap = {
    "Container Ship": "bg-blue-100 text-blue-700 border-blue-200",
    "Tanker": "bg-orange-100 text-orange-700 border-orange-200",
    "Bulk Carrier": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Passenger": "bg-green-100 text-green-700 border-green-200",
    "Cargo": "bg-purple-100 text-purple-700 border-purple-200",
    "Naval": "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span
      className={cn(
        "text-xs font-mono px-2 py-0.5 rounded border",
        colorMap[type] ?? "bg-slate-100 text-slate-600 border-slate-200"
      )}
    >
      {type}
    </span>
  );
}

function TelemetryCell({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50/80 border border-slate-200/60 shadow-sm">
      <div className="flex items-center gap-1.5 text-slate-500">
        <Icon size={12} />
        <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-semibold font-mono text-slate-900 leading-tight">{value}</span>
    </div>
  );
}

function ShipDetailContent({ ship, onClose, isMobile }) {
  const statusColor =
    ship.status === "Underway using Engine"
      ? "text-green-600"
      : ship.status === "At Anchor"
      ? "text-yellow-600"
      : "text-slate-500";

  const isParked = ship.status === "Moored" || ship.status === "At Anchor";
  const effectiveProgress = (isParked && ship.progress > 85) ? 100 : (ship.progress || 0);

  return (
    <div className="flex flex-col gap-4">
      {!isMobile && (
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{ship.flag}</span>
              <h2 className="text-lg font-bold font-mono tracking-tight text-slate-900 leading-none">
                {ship.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <VesselTypeBadge type={ship.type} />
              <span className="text-xs font-mono text-slate-500">
                MMSI {ship.mmsi}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              ship.status === "Underway using Engine" ? "bg-green-500" : "bg-yellow-500"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              ship.status === "Underway using Engine" ? "bg-green-500" : "bg-yellow-500"
            )}
          />
        </span>
        <span className={cn("text-xs font-mono font-medium", statusColor)}>{ship.status}</span>
      </div>

      <div className="h-px bg-slate-200" />

      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          Route
        </p>
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex items-center gap-1 text-slate-500">
              <Anchor size={10} />
              <span className="text-[9px] font-mono uppercase">Origin</span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-900">{ship.origin?.label ?? "—"}</p>
            <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
              {ship.origin?.time}
            </p>
          </div>

          <ArrowRight size={14} className="text-slate-400 mt-4 shrink-0" />

          <div className="flex flex-col gap-0.5 flex-1 text-right">
            <div className="flex items-center justify-end gap-1 text-slate-500">
              <span className="text-[9px] font-mono uppercase">Destination</span>
              <MapPin size={10} />
            </div>
            <p className="text-sm font-bold font-mono text-slate-900">{ship.destination?.label ?? "—"}</p>
            <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
              {ship.destination?.time}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-500">Journey Progress</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: ship.color }}>
              {effectiveProgress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${effectiveProgress}%`,
                background: `linear-gradient(90deg, ${ship.color}99, ${ship.color})`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200" />

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          Live Telemetry
        </p>
        <div className="grid grid-cols-2 gap-2">
          <TelemetryCell icon={Gauge} label="Speed" value={ship.speed} />
          <TelemetryCell icon={Compass} label="Course" value={`${ship.course}°`} />
          <TelemetryCell icon={MapPin} label="Position" value={`${ship.latStr} ${ship.lngStr}`} />
          <TelemetryCell icon={Activity} label="Status" value={ship.status === "Underway using Engine" ? "Underway" : ship.status} />
        </div>
      </div>
    </div>
  );
}

export function ShipDetailsPanel({ ship, onClose }) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [ship?.id]);

  if (!ship) return null;

  const lngs = [ship.origin?.lng, ship.destination?.lng, ship.lng].filter((n) =>
    Number.isFinite(n)
  );
  const centerLng = lngs.length ? (Math.min(...lngs) + Math.max(...lngs)) / 2 : 0;

  const isDestOnRight = Number.isFinite(ship.destination?.lng)
    ? ship.destination.lng > centerLng
    : false;
  const desktopPositionClass = isDestOnRight ? "left-4" : "right-4";

  if (isMobile) {
    return (
      <div className="absolute top-4 left-4 right-4 z-40">
        <div
          className="rounded-xl shadow-2xl "
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${ship.color}40`,
            boxShadow: `0 8px 32px -4px ${ship.color}30, 0 0 16px ${ship.color}15`,
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          }}
        >
          <div className="rounded-xl overflow-hidden">
            <button
              type="button"
              className="w-full p-3.5 flex items-center justify-between cursor-pointer select-none text-left outline-none"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ touchAction: "manipulation" }}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3 shrink-0">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ backgroundColor: ship.color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-3 w-3"
                    style={{ backgroundColor: ship.color, boxShadow: `0 0 8px ${ship.color}` }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono text-slate-900 leading-none truncate">
                      {ship.name}
                    </span>
                    <span className="text-sm">{ship.flag}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 mt-0.5 truncate max-w-[200px]">
                    {ship.origin?.label ?? "—"} → {ship.destination?.label ?? "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="p-1 text-slate-400">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={20} />
                </div>
              </div>
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className={cn(
                  "p-4 pt-2 transition-colors duration-300",
                  isExpanded ? "border-t border-slate-200" : "border-t border-transparent"
                )}>
                  <ShipDetailContent ship={ship} onClose={onClose} isMobile={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute top-4 z-30 w-80 rounded-xl overflow-hidden shadow-2xl transition-all duration-500",
        desktopPositionClass
      )}
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        animation: "fade-slide-in 0.22s ease-out",
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    >
      <div
        className="h-1 w-full shadow-sm"
        style={{ background: `linear-gradient(90deg, transparent, ${ship.color}, transparent)` }}
      />
      <div className="p-4">
        <ShipDetailContent ship={ship} onClose={onClose} isMobile={false} />
      </div>
    </div>
  );
}
