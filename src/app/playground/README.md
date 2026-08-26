# Playground — Global Logistics & Operations Hub

An interactive fleet-tracking map embedded as a live **playground** in section `06`
of the homepage. It's a trimmed-down port of a standalone Next.js project (the
root-level `/map` folder) made self-contained: **local data, one ship, no external
services.**

- **Rendered at:** [`src/app/Showcase.js`](../Showcase.js) → `PlaygroundSection`
  (`06 · Playground / Global Logistics & Operations Hub`)
- **Entry component:** [`Playground.js`](./Playground.js)
- **Live demo ship:** `EVER GIVEN` (Rotterdam → Singapore, drawn from a 7-point
  forecast route)

---

## What it does

A full-bleed [Leaflet](https://leafletjs.com/) world map inside a fixed-height box:

- Renders the fleet from local data as rotated ship-icon markers with name labels.
- On select (click a pin, or the default-selected ship on load) it draws the
  vessel's dashed forecast route, destination pin, and any waypoints — then flies
  the camera to frame the route.
- A sliding **vessel details panel** shows flag, type, MMSI, origin→destination,
  journey progress, and live telemetry (speed / course / position / status).
- Custom zoom / reset-to-world / fullscreen controls.
- Responsive: the panel switches to a collapsible top accordion on mobile.

Everything is client-rendered — the map is loaded with `ssr: false`, so the
homepage still prerenders statically.

---

## Folder structure

```
src/app/playground/
├── Playground.js                    # Client wrapper: state + layout of the embed
├── README.md                        # This file
└── map/
    ├── components/
    │   ├── map-wrapper.jsx           # Dynamic import of the map (ssr:false + loader)
    │   ├── leaflet-map.jsx           # The Leaflet map: markers, routes, camera logic
    │   ├── map-controls.jsx          # Zoom / reset / fullscreen buttons
    │   └── ship-details-panel.jsx    # Sliding vessel info card (desktop + mobile)
    ├── hooks/
    │   └── use-mobile.js             # useIsMobile() breakpoint hook
    └── lib/
        ├── ship-data.js              # Local fleet data (currently 1 ship)
        └── cn.js                     # Minimal className joiner
```

### Component flow

```
Showcase.js (server)
  └─ Playground.js ("use client")            selection state, mapRef, layout box
       ├─ MapWrapper                          dynamic() → leaflet-map, ssr:false
       │    └─ LeafletMap                     MapContainer + markers/routes/fitters
       ├─ ShipDetailsPanel                    reads selected ship
       └─ MapControls                         drives zoomAction → LeafletMap
```

`Playground` owns `selectedShipId` and a `zoomAction` signal. `MapControls` sets
`zoomAction`; a `ZoomController` inside `LeafletMap` consumes it and clears it via
`onZoomActionDone`. `mapRef` is populated by the map so the controls can read the
live zoom level.

---

## Dependencies

Added to the root [`package.json`](../../../package.json):

| Package         | Why                                            |
| --------------- | ---------------------------------------------- |
| `leaflet`       | Map engine + `leaflet/dist/leaflet.css`        |
| `react-leaflet` | React bindings (`MapContainer`, `Marker`, …)   |
| `lucide-react`  | Icons in the details panel and controls        |

All markers use Leaflet `divIcon` (inline SVG), so **no default marker image
assets** are needed. Map tiles come from the CARTO light basemap CDN.

---

## Local data — adding or swapping ships

Edit [`map/lib/ship-data.js`](./map/lib/ship-data.js). Each entry:

```js
{
  id: "ship-1",                 // unique; Playground default-selects SHIPS[0]
  name: "EVER GIVEN",
  flag: "🇵🇦", flagCode: "PA",
  type: "Container Ship",       // drives the color badge in the panel
  lat: 29.92, lng: 32.55,       // current position
  course: 145,                  // heading in degrees (rotates the ship icon)
  speed: "14.2 knots",
  latStr: "29°55′N", lngStr: "32°33′E",
  status: "Underway using Engine",
  origin:      { lat, lng, label, time },
  destination: { lat, lng, label, time },
  progress: 63,                 // % — fills the journey progress bar
  mmsi: "353136000", imo: "9811000",
  color: "#3b82f6",             // route line + accents
  forecastPath: [[lat, lng], …] // optional; else a straight origin→dest line
  // waypoints: [{ lat, lng, label }] // optional intermediate markers
}
```

- Add more objects to the `SHIPS` array to show a multi-ship fleet.
- The map falls back to a straight `origin → destination` line when a ship has no
  `forecastPath`.
- `Playground.js` default-selects `SHIPS[0]`. To start with a clean map (no panel),
  set the initial `selectedShipId` to `null` there.

---

## How this was ported from `/map`

The original was a full app backed by Firestore + a third-party AIS API. To make it
a dependency-free showcase, the following were **dropped** (they were the only
things referencing modules that don't exist in this project — `@/lib/firebaseAdmin`,
`@/lib/utils`, `@/components/ui/badge`, `../../../firebase/ClientAppCheck`):

- Firestore data fetching (`page.js`, `actions.js`) and the route-cache lookup.
- The DataDocked live-credits API call.
- Service worker registration and App Check.
- The KPI dashboard: HUD bar, stat panels, month selector, and fleet legend.

The route-generation toolchain in the original (`world-grid.js`, `pathfinder.js`,
`generate-grid.mjs`, `world-grid-data.json`, `countries.geo.json`) is **not** part
of the render path and was intentionally left out.

Edits made to the ported files:

- `leaflet-map.jsx` — removed the Firestore `fetchShipRouteCache` effect; routes now
  come straight from each ship's `forecastPath`. Import fixed to the local
  `useIsMobile` hook.
- `ship-details-panel.jsx` — `cn` now imports from local `lib/cn.js`; `fixed`/absolute
  positioning adjusted so the panel stays **inside the embed box** rather than the
  viewport; dropped the KPI-sidebar offset (there's no sidebar here).
- `Playground.js` — new lean client replacing the original `fleet-map-client.js`,
  laying the map out in a contained `560px` bordered box.

The root `/map` folder is left in place (untracked) and is safe to delete — nothing
in `src/` imports from it.

---

## Verify

```bash
npm run build     # compiles; `/` prerenders (map is client-only)
npm run dev       # then open the homepage, scroll to section 06
```

Expected: the world map renders inside the bordered box with `EVER GIVEN` near Suez,
its dashed route to Singapore, and the details panel open. Clicking the pin toggles
the panel; zoom / reset / fullscreen controls work; no console errors.
