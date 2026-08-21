// src/app/map/lib/pathfinder.js

const RESOLUTION = 0.5; 
const MAX_X = Math.floor(360 / RESOLUTION) - 1; // 719
const MAX_Y = Math.floor(180 / RESOLUTION) - 1; // 359

export function latLngToGrid(lat, lng) {
  let x = Math.floor((lng + 180) / RESOLUTION);
  let y = Math.floor((90 - lat) / RESOLUTION);
  
  x = Math.max(0, Math.min(MAX_X, x));
  y = Math.max(0, Math.min(MAX_Y, y));
  
  return { x, y };
}

export function gridToLatLng(x, y) {
  const lng = -180 + (x * RESOLUTION) + (RESOLUTION / 2);
  const lat = 90 - (y * RESOLUTION) - (RESOLUTION / 2);
  return { lat, lng };
}

// Snaps ports to the nearest deep water so they don't get trapped on the coastline
function getNearestWater(grid, startX, startY, maxRadius = 15) {
  if (grid[startY][startX] === 1) return { x: startX, y: startY };

  for (let r = 1; r <= maxRadius; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;

        const nx = startX + dx;
        const ny = startY + dy;

        if (nx >= 0 && nx <= MAX_X && ny >= 0 && ny <= MAX_Y) {
          if (grid[ny][nx] === 1) return { x: nx, y: ny };
        }
      }
    }
  }
  return null; 
}

function heuristic(a, b) {
  // Multiply by 20 to aggressively seek the destination. This stops the server from freezing!
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) * 20;
}

export async function findRoute(grid, startLatLng, endLatLng) {
  let startNode = latLngToGrid(startLatLng.lat, startLatLng.lng);
  let endNode = latLngToGrid(endLatLng.lat, endLatLng.lng);

  startNode = getNearestWater(grid, startNode.x, startNode.y);
  endNode = getNearestWater(grid, endNode.x, endNode.y);

  if (!startNode || !endNode) return null; 

  const openSet = [startNode];
  const cameFrom = new Map();
  
  const gScore = new Map();
  gScore.set(`${startNode.x},${startNode.y}`, 0);
  
  const fScore = new Map();
  fScore.set(`${startNode.x},${startNode.y}`, heuristic(startNode, endNode));

  let loops = 0; 
  const MAX_LOOPS = 15000; 

  while (openSet.length > 0 && loops < MAX_LOOPS) {
    loops++;
    
    // 🔥 THE MAGIC YIELD:
    // Every 500 loops, pause for 0ms to yield the event loop.
    // This stops the Next.js server from freezing!
    if (loops % 500 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // --- OPTIMIZED FAST EXTRACTION ---
    let lowestIndex = 0;
    let lowestFScore = fScore.get(`${openSet[0].x},${openSet[0].y}`);
    
    for (let i = 1; i < openSet.length; i++) {
      const score = fScore.get(`${openSet[i].x},${openSet[i].y}`) || Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        lowestIndex = i;
      }
    }
    
    const current = openSet[lowestIndex];
    openSet.splice(lowestIndex, 1);
    // ----------------------------------

    if (current.x === endNode.x && current.y === endNode.y) {
      console.log(`✅ ROUTE FOUND in ${loops} steps!`);
      const path = [];
      let curr = current;
      while (cameFrom.has(`${curr.x},${curr.y}`)) {
        path.unshift(gridToLatLng(curr.x, curr.y));
        curr = cameFrom.get(`${curr.x},${curr.y}`);
      }
      path.unshift(startLatLng);
      path.push(endLatLng);
      return path; 
    }
    const neighbors = [
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y - 1 },
      { x: current.x - 1, y: current.y - 1 },
      { x: current.x + 1, y: current.y + 1 },
      { x: current.x - 1, y: current.y + 1 },
    ];

    for (let neighbor of neighbors) {
      if (neighbor.y < 0 || neighbor.y > MAX_Y) continue;
      
      // WORLD WRAPPING (Dateline crossing logic)
      if (neighbor.x < 0) neighbor.x = MAX_X;
      else if (neighbor.x > MAX_X) neighbor.x = 0;
      
      if (grid[neighbor.y][neighbor.x] === 0) continue;

      const isDiagonal = current.x !== neighbor.x && current.y !== neighbor.y;
      
      if (isDiagonal) {
        if (grid[current.y][neighbor.x] === 0 || grid[neighbor.y][current.x] === 0) {
          continue; 
        }
      }

      const stepCost = isDiagonal ? 1.414 : 1;
      const tentativeGScore = gScore.get(`${current.x},${current.y}`) + stepCost;
      const neighborKey = `${neighbor.x},${neighbor.y}`;

      if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, endNode));

        if (!openSet.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  if (loops >= MAX_LOOPS) console.error("❌ ROUTE FAILED: Hit max loops.");
  else console.error("❌ ROUTE FAILED: Trapped! No water route available.");
  
  return null; 
}