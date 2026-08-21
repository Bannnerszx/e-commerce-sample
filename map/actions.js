// map/actions.js
"use server";

import { db } from "@/lib/firebaseAdmin";
export async function fetchShipRouteCache(docId) {
  try {
    // Uses the fast Admin SDK on the server! No client bundle impact.
    const docSnap = await db.collection("ship_routes").doc(docId).get();
    
    if (docSnap.exists) {
      return docSnap.data();
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching route cache from server:", error);
    return null;
  }
}