"use client";

import { useState, useCallback, useRef } from "react";
import { MapWrapper } from "./map/components/map-wrapper";
import { ShipDetailsPanel } from "./map/components/ship-details-panel";
import { MapControls } from "./map/components/map-controls";
import { SHIPS } from "./map/lib/ship-data";

export default function Playground() {
  const [zoomAction, setZoomAction] = useState(null);
  const [selectedShipId, setSelectedShipId] = useState(SHIPS[0]?.id ?? null);
  const mapRef = useRef(null);

  const handleSelectShip = useCallback((ship) => {
    setSelectedShipId((prev) => (prev === ship.id ? null : ship.id));
  }, []);

  const handleClose = useCallback(() => setSelectedShipId(null), []);

  const selectedShip = SHIPS.find((s) => s.id === selectedShipId) ?? null;

  return (
    <div className="relative w-full h-[560px] min-h-[440px] overflow-hidden rounded-lg border border-text/10 bg-[#f8f9fa]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
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

      <div className="absolute inset-0 z-0">
        <MapWrapper
          ships={SHIPS}
          selectedShipId={selectedShipId}
          onSelectShip={handleSelectShip}
          zoomAction={zoomAction}
          onZoomActionDone={() => setZoomAction(null)}
          mapRef={mapRef}
          isEmbedded={false}
        />
      </div>

      <ShipDetailsPanel ship={selectedShip} onClose={handleClose} />

      <MapControls
        onZoomIn={() => setZoomAction("in")}
        onZoomOut={() => setZoomAction("out")}
        onResetNorth={() => setZoomAction("reset")}
        mapRef={mapRef}
      />
    </div>
  );
}
