import fs from 'fs';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import distance from '@turf/distance';

const RESOLUTION = 0.1;
const cols = Math.floor(360 / RESOLUTION);
const rows = Math.floor(180 / RESOLUTION);

console.log("Loading world.geojson...");
const worldGeoJSON = JSON.parse(fs.readFileSync('./lib/countries.geo.json', 'utf8'));

const CANALS = [
    // --- Original Passages ---
    { name: "Panama Canal", coord: [-79.68, 9.15], radius: 15 },
    { name: "Suez Canal", coord: [32.34, 30.58], radius: 15 },
    { name: "Gulf of Suez (Ever Given)", coord: [32.55, 29.92], radius: 80 },
    { name: "Red Sea Exit (Bab-el-Mandeb)", coord: [43.33, 12.58], radius: 80 },
    { name: "Strait of Gibraltar", coord: [-5.6, 35.9], radius: 80 },
    { name: "Strait of Malacca", coord: [101.3, 2.9], radius: 25 },
    { name: "Singapore Strait", coord: [103.85, 1.29], radius: 25 },
    { name: "English Channel", coord: [1.45, 51.03], radius: 80 },
    { name: "Strait of Hormuz", coord: [56.3, 26.6], radius: 80 },
    { name: "Kattegat (Denmark/Sweden)", coord: [11.0, 56.0], radius: 80 },
    { name: "Bosphorus Strait", coord: [29.0, 41.0], radius: 60 },

    // --- NEW: Southeast Asia & Japan (Crucial for your Japan -> Africa route) ---
    { name: "Sunda Strait (Indonesia)", coord: [105.75, -6.0], radius: 80 },
    { name: "Lombok Strait (Indonesia)", coord: [115.75, -8.5], radius: 80 },
    { name: "Makassar Strait", coord: [118.0, -1.0], radius: 100 },
    { name: "Taiwan Strait", coord: [119.5, 24.0], radius: 100 },
    { name: "Luzon Strait (Philippines)", coord: [121.9, 20.0], radius: 100 },
    { name: "Mindoro Strait", coord: [120.4, 12.4], radius: 80 },
    { name: "Tsugaru Strait (Japan)", coord: [140.5, 41.5], radius: 80 },

    // --- NEW: Other Global Chokepoints ---
    { name: "Strait of Magellan (Chile)", coord: [-71.0, -53.5], radius: 80 },
    { name: "Torres Strait (Australia/PNG)", coord: [142.0, -10.0], radius: 80 },
    { name: "Cook Strait (New Zealand)", coord: [174.5, -41.2], radius: 80 },
    { name: "Bering Strait", coord: [-169.0, 65.9], radius: 80 },
    { name: "Dardanelles (Turkey)", coord: [26.4, 40.2], radius: 60 },
    { name: "Kiel Canal (Germany)", coord: [9.5, 54.3], radius: 60 },
    { name: "Oresund Strait", coord: [12.7, 55.6], radius: 60 }
];

console.log(`Generating ${cols}x${rows} maritime grid at ${RESOLUTION}° resolution...`);
console.log("This requires heavy spatial math and may take 1-3 minutes. Please wait...");

const grid = [];

for (let r = 0; r < rows; r++) {
    const row = [];

    const lat = 90 - (r * RESOLUTION) - (RESOLUTION / 2);

    for (let c = 0; c < cols; c++) {
        const lng = -180 + (c * RESOLUTION) + (RESOLUTION / 2);
        const currentPoint = point([lng, lat]);

        let isLand = false;

        let isCanal = false;
        for (let canal of CANALS) {
            if (distance(currentPoint, point(canal.coord)) < canal.radius) {
                isCanal = true
                break
            }
        }

        if (!isCanal) {
            for (const feature of worldGeoJSON.features) {
                if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
                    if (booleanPointInPolygon(currentPoint, feature)) {
                        isLand = true
                        break
                    }
                }
            }
        }

        row.push(isLand ? 0 : 1)
    }

    grid.push(row);

    if (r % 20 === 0) {
        console.log(`${Math.round((r / rows) * 100)}% complete...`)
    }
}

const outputPath = './lib/world-grid-data.json';
fs.writeFileSync(outputPath, JSON.stringify(grid));
console.log(`\nSuccess! Saved high-res maritime grid to ${outputPath}`);