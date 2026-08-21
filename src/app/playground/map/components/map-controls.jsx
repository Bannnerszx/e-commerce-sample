"use client";

import { useEffect, useState } from "react";
import { Plus, Minus, Compass, Maximize2 } from "lucide-react";

const buttonStyle = {
  background: "oklch(0.16 0.03 237 / 0.92)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid oklch(0.28 0.04 235 / 0.6)",
};

export function MapControls({ onZoomIn, onZoomOut, onResetNorth, mapRef }) {
  const [displayZoom, setDisplayZoom] = useState(3);

  useEffect(() => {
    const updateZoomIndicator = () => {
      if (mapRef.current) {
        const rawZoom = mapRef.current.getZoom();
        const userFriendlyZoom = Math.max(1, Math.round(rawZoom - 2));
        setDisplayZoom(userFriendlyZoom);
      }
    };

    const interval = setInterval(() => {
      if (mapRef.current) {
        updateZoomIndicator();
        clearInterval(interval);
        mapRef.current.on("zoom", updateZoomIndicator);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        mapRef.current.off("zoom", updateZoomIndicator);
      }
    };
  }, [mapRef]);

  return (
    <div
      className="absolute bottom-8 right-4 z-20 flex flex-col gap-1.5"
      role="group"
      aria-label="Map controls"
    >
      <button
        onClick={onZoomIn}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)] hover:bg-[oklch(0.22_0.04_235)] transition-all duration-150 shadow-lg"
        style={buttonStyle}
        aria-label="Zoom in"
      >
        <Plus size={16} />
      </button>

      <div
        className="w-9 h-7 flex items-center justify-center rounded text-[10px] font-mono font-bold text-[oklch(0.62_0.18_220)]"
        style={{ ...buttonStyle, cursor: "default" }}
        aria-label={`Zoom level ${displayZoom}`}
      >
        {displayZoom}x
      </div>

      <button
        onClick={onZoomOut}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)] hover:bg-[oklch(0.22_0.04_235)] transition-all duration-150 shadow-lg"
        style={buttonStyle}
        aria-label="Zoom out"
      >
        <Minus size={16} />
      </button>

      <div className="h-2" />

      <button
        onClick={onResetNorth}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)] hover:bg-[oklch(0.22_0.04_235)] transition-all duration-150 shadow-lg"
        style={buttonStyle}
        aria-label="Reset view to world"
        title="Reset view"
      >
        <Compass size={16} />
      </button>

      <button
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[oklch(0.58_0.04_230)] hover:text-[oklch(0.93_0.01_220)] hover:bg-[oklch(0.22_0.04_235)] transition-all duration-150 shadow-lg"
        style={buttonStyle}
        aria-label="Full screen"
        title="Full screen"
        onClick={() => document.documentElement.requestFullscreen?.()}
      >
        <Maximize2 size={15} />
      </button>
    </div>
  );
}
