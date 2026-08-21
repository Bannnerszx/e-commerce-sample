"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useIsMobile } from "../hooks/use-mobile";

const hasCoords = (o) =>
  o != null && Number.isFinite(o.lat) && Number.isFinite(o.lng);

function createShipIcon(color, course, selected, isMobile) {
  const size = selected ? (isMobile ? 32 : 36) : (isMobile ? 24 : 28);

  const pulse = selected && !isMobile
    ? `<span style="
        position:absolute;inset:-6px;border-radius:50%;
        background:${color}33;animation:ship-ping 1.4s ease-in-out infinite;
      "></span>`
    : "";

  const shadowFilter = isMobile ? "" : `filter:drop-shadow(0 1px 4px ${color}88)`;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"
         style="transform:rotate(${course}deg);display:block;${shadowFilter}">
      <path d="M9.5 12.5H5.5L5.5 8C5.5 6.91153 6.07979 5.44812 6.85389 4.13809C7.07346 3.76652 7.29495 3.43049 7.5 3.1451C7.70505 3.43049 7.92654 3.76652 8.14611 4.13809C8.92021 5.44812 9.5 6.91153 9.5 8V12.5ZM7.5 1C7 1 4 5 4 8V12.5C4 13.3284 4.67157 14 5.5 14H9.5C10.3284 14 11 13.329 11 12.5006V8C11 5 8 1 7.5 1Z"
            fill="${color}"
            stroke="${selected ? "#fff" : "rgba(255,255,255,0.4)"}"
            stroke-width="${selected ? 0.6 : 0.2}" />
    </svg>`;

  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
      ${pulse}
      ${svg}
    </div>`;

  return L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

function fixDatelineCrossing(path) {
  if (!path || path.length === 0) return path;

  const firstPt = path[0];
  const firstLat = Array.isArray(firstPt) ? firstPt[0] : firstPt.lat;
  const firstLng = Array.isArray(firstPt) ? firstPt[1] : firstPt.lng;

  const fixedPath = [[firstLat, firstLng]];

  for (let i = 1; i < path.length; i++) {
    const pt = path[i];
    const lat = Array.isArray(pt) ? pt[0] : pt.lat;
    let lng = Array.isArray(pt) ? pt[1] : pt.lng;

    const prevLng = fixedPath[i - 1][1];
    let dlng = lng - prevLng;

    if (dlng > 180) {
      lng -= 360;
    } else if (dlng < -180) {
      lng += 360;
    }

    fixedPath.push([lat, lng]);
  }
  return fixedPath;
}

function MapCleaner() {
  const map = useMap();
  useEffect(() => {
    return () => {
      const container = map.getContainer();
      if (container) {
        container._leaflet_id = null;
      }
    };
  }, [map]);
  return null;
}

function MapStyler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    container.style.outline = "none";
    if (!document.getElementById("ship-ping-style")) {
      const style = document.createElement("style");
      style.id = "ship-ping-style";
      style.textContent = `
        @keyframes ship-ping {
          0%,100%{opacity:0.6;transform:scale(1)}
          50%{opacity:0.15;transform:scale(1.8)}
        }
      `;
      document.head.appendChild(style);
    }
  }, [map]);
  return null;
}

function ZoomController({ zoomAction, onActionDone, mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  useEffect(() => {
    if (!zoomAction) return;
    if (zoomAction === "in") map.zoomIn();
    else if (zoomAction === "out") map.zoomOut();
    else if (zoomAction === "reset") {
      map.fitBounds([[-85.0511, -1], [85.0511, 1]], { padding: [0, 0] });
    }
    onActionDone();
  }, [zoomAction, map, onActionDone]);

  return null;
}

function WorldFitter() {
  const map = useMap();
  useEffect(() => {
    const verticalBounds = L.latLngBounds([-85.0511, -1], [85.0511, 1]);

    const fitAndLock = () => {
      map.setMinZoom(0);
      map.fitBounds(verticalBounds, { padding: [0, 0] });
      map.setMinZoom(map.getZoom());
    };

    const timeoutId = setTimeout(fitAndLock, 50);
    window.addEventListener("resize", fitAndLock);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", fitAndLock);
    };
  }, [map]);

  return null;
}

function RouteFitter({ selectedShip, customRoute, isMobile }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedShip) return;

    const activePath = customRoute ||
      (selectedShip.forecastPath ? fixDatelineCrossing(selectedShip.forecastPath) : null) ||
      (hasCoords(selectedShip) && hasCoords(selectedShip.destination)
        ? fixDatelineCrossing([
            [selectedShip.lat, selectedShip.lng],
            [selectedShip.destination.lat, selectedShip.destination.lng],
          ])
        : null);

    if (!activePath || activePath.length === 0) return;

    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    activePath.forEach((pt) => {
      const lat = pt[0];
      const lng = pt[1];
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    const currentCenterLng = map.getCenter().lng;
    const boundsCenterLng = (minLng + maxLng) / 2;

    const worldOffset = Math.round((currentCenterLng - boundsCenterLng) / 360) * 360;

    const shiftedBounds = L.latLngBounds([
      [minLat, minLng + worldOffset],
      [maxLat, maxLng + worldOffset]
    ]);

    const timeout = setTimeout(() => {
      map.invalidateSize();
      map.flyToBounds(shiftedBounds, {
        padding: isMobile ? [32, 32] : [90, 90],
        maxZoom: isMobile ? 3 : 5,
        duration: 1.2,
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [map, selectedShip, customRoute, isMobile]);

  return null;
}

export function LeafletMap({
  ships,
  selectedShipId,
  onSelectShip,
  zoomAction,
  onZoomActionDone,
  mapRef,
  isEmbedded
}) {
  const selectedShip = ships?.find((s) => s.id === selectedShipId) ?? null;

  const customRoute = null;

  const isMobile = useIsMobile();

  const worldOffsets = [-720, -360, 0, 360, 720];

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      minZoom={1}
      maxZoom={18}
      preferCanvas={true}
      zoomSnap={0}
      zoomControl={false}
      attributionControl={true}
      worldCopyJump={false}
      maxBounds={[
        [-85.0511, -180000],
        [85.0511, 180000],
      ]}
      maxBoundsViscosity={1.0}
      style={{ width: "100%", height: "100%", background: "#f8f9fa" }}
    >
      <MapCleaner />
      <RouteFitter selectedShip={selectedShip} customRoute={customRoute} isMobile={isMobile} />

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        maxZoom={20}
        maxNativeZoom={19}
        updateWhenIdle={isMobile}
        updateWhenZooming={!isMobile}
        keepBuffer={isMobile ? 2 : 4}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      <WorldFitter />
      <MapStyler />
      <ZoomController
        zoomAction={zoomAction}
        onActionDone={onZoomActionDone}
        mapRef={mapRef}
      />

      {selectedShip && worldOffsets.map((offset) => {
        const basePath = customRoute ||
          (selectedShip.forecastPath ? fixDatelineCrossing(selectedShip.forecastPath) : null) ||
          (hasCoords(selectedShip) && hasCoords(selectedShip.destination)
            ? fixDatelineCrossing([
                [selectedShip.lat, selectedShip.lng],
                [selectedShip.destination.lat, selectedShip.destination.lng],
              ])
            : null);

        if (!basePath || basePath.length === 0) return null;

        const offsetPath = basePath.map((pt) => [pt[0], pt[1] + offset]);

        return (
          <Polyline
            key={`route-line-${offset}`}
            positions={offsetPath}
            pathOptions={{
              color: selectedShip.color,
              weight: 2,
              opacity: 0.8,
              dashArray: "8 7",
            }}
          />
        );
      })}

      {selectedShip && hasCoords(selectedShip.destination) && worldOffsets.map((offset) => (
        <Marker
          key={`dest-${offset}`}
          position={[selectedShip.destination.lat, selectedShip.destination.lng + offset]}
          icon={L.divIcon({
            html: `
              <div style="position:relative;width:10px;height:10px;">
                <span style="position:absolute;inset:-6px;border-radius:50%;background:${selectedShip.color}44;animation:ship-ping 1.4s ease-in-out infinite;"></span>
                <div style="position:absolute;inset:0;border-radius:50%;background:${selectedShip.color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 6px ${selectedShip.color}88;"></div>
              </div>
            `,
            className: "",
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          })}
        >
          <Tooltip permanent direction="top" offset={[0, -8]} className="leaflet-ship-label">
            <span style={{
              fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.8)",
              background: "transparent", border: "none", boxShadow: "none", whiteSpace: "nowrap",
            }}>
              {selectedShip.destination.label}
            </span>
          </Tooltip>
        </Marker>
      ))}

      {selectedShip && selectedShip.waypoints && selectedShip.waypoints.filter(hasCoords).flatMap((wp, index) =>
        worldOffsets.map((offset) => (
          <Marker
            key={`waypoint-${index}-${offset}`}
            position={[wp.lat, wp.lng + offset]}
            icon={L.divIcon({
              html: `
                <div style="position:relative;width:10px;height:10px;">
                  <span style="position:absolute;inset:-6px;border-radius:50%;background:${selectedShip.color}44;animation:ship-ping 1.4s ease-in-out infinite;"></span>
                  <div style="position:absolute;inset:0;border-radius:50%;background:transparent;border:2px dashed ${selectedShip.color};box-shadow:0 0 6px ${selectedShip.color}88;"></div>
                </div>
              `,
              className: "",
              iconSize: [10, 10],
              iconAnchor: [5, 5],
            })}
          >
            <Tooltip permanent direction="top" offset={[0, -8]} className="leaflet-ship-label">
              <span style={{
                fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.8)",
                background: "transparent", border: "none", boxShadow: "none", whiteSpace: "nowrap",
              }}>
                {wp.label}
              </span>
            </Tooltip>
          </Marker>
        ))
      )}

      {/* Render vessels across all map copies */}
      {(ships || []).filter(hasCoords).flatMap((ship) => {
        const isSelected = ship.id === selectedShipId;
        if (isEmbedded && !isSelected) return [];

        return worldOffsets.map((offset) => (
          <Marker
            key={`${ship.id}-${offset}`}
            position={[ship.lat, ship.lng + offset]}
            icon={createShipIcon(ship.color, ship.course, isSelected, isMobile)}
            zIndexOffset={isSelected ? 1000 : 0}
            eventHandlers={{
              click: () => onSelectShip(ship),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, isSelected ? -20 : -16]}
              permanent={isSelected || !isMobile}
              className="leaflet-ship-label"
            >
              <span style={{
                fontFamily: "monospace", fontSize: "10px", fontWeight: 600, color: ship.color,
                background: "rgba(10,18,32,0.85)", padding: "2px 6px", borderRadius: "4px",
                border: `1px solid ${ship.color}44`, whiteSpace: "nowrap",
              }}>
                {ship.name}
              </span>
            </Tooltip>
          </Marker>
        ));
      })}
    </MapContainer>
  );
}
