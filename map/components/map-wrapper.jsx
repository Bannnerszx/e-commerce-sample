"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(
  () => import("./leaflet-map").then((m) => m.LeafletMap),
  { ssr: false, loading: () => <MapLoading /> }
);

function MapLoading() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "#f8f9fa" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[oklch(0.62_0.18_220)] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[oklch(0.58_0.04_230)] tracking-widest uppercase">
          Loading chart...
        </span>
      </div>
    </div>
  );
}

export function MapWrapper(props) {
  return <LeafletMap {...props} />;
}