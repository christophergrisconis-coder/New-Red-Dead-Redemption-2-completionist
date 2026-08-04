// Central registry of shared image assets. Every map marker in the app is
// rendered on top of the authentic RDR1 "Border States 1910" world map
// (provided by the project owner). Marker positions are measured against
// that same base image so the crop shown in the DetailPanel and the pin
// shown on /map line up exactly.
//
// verified: true  → coord measured against the reference map / IGN
// verified: false → region anchor only (surface pending verification)

import borderMap from "@/assets/rdr/border-states-map.png.asset.json";
import type { AssetRef, MapPin, Region, RichMapMarker } from "./types";

export const BORDER_STATES_MAP: AssetRef = {
  url: borderMap.url,
  alt: "RDR1 Border States world map, 1910",
  credit: "Map: Rockstar Games — pins verified against IGN Interactive Map",
};

/** Approximate normalized {x,y} anchor for each region on the base map. */
export const REGION_ANCHORS: Record<Region, { x: number; y: number }> = {
  "Tall Trees":        { x: 0.72, y: 0.13 },
  "Great Plains":      { x: 0.90, y: 0.17 },
  Blackwater:          { x: 0.94, y: 0.16 },
  "West Elizabeth":    { x: 0.82, y: 0.14 },
  "Hennigan's Stead":  { x: 0.80, y: 0.34 },
  "Cholla Springs":    { x: 0.48, y: 0.38 },
  "Gaptooth Ridge":    { x: 0.18, y: 0.45 },
  "Rio Bravo":         { x: 0.38, y: 0.60 },
  "New Austin":        { x: 0.35, y: 0.45 },
  "Diez Coronas":      { x: 0.82, y: 0.62 },
  Perdido:             { x: 0.60, y: 0.82 },
  "Punta Orgullo":     { x: 0.18, y: 0.82 },
  "Nuevo Paraiso":     { x: 0.55, y: 0.78 },
  Other:               { x: 0.50, y: 0.50 },
};

export function regionAnchor(region: Region): { x: number; y: number } {
  return REGION_ANCHORS[region] ?? REGION_ANCHORS.Other;
}

/** Region-anchored fallback pin (verified: false). */
export function regionPin(region: Region, caption: string, coordNote?: string): MapPin {
  const a = regionAnchor(region);
  return { x: a.x, y: a.y, region, caption, coordNote, verified: false };
}

/** Precisely-placed pin measured against the reference map. */
export function verifiedPin(
  x: number,
  y: number,
  region: Region,
  caption: string,
  coordNote?: string,
): MapPin {
  return { x, y, region, caption, coordNote, verified: true };
}

/** Wrap a pin into a RichMapMarker that renders as a cropped tile of the base map. */
export function mapMarker(pin: MapPin, coords?: string): RichMapMarker {
  return {
    image: BORDER_STATES_MAP,
    caption: pin.caption,
    coords: coords ?? pin.coordNote,
    pin,
  };
}

/** Hero uses the same map — DetailPanel crops it around the item's region/pin. */
export function heroForRegion(_region: Region): AssetRef {
  return BORDER_STATES_MAP;
}

/** @deprecated kept for source compatibility during migration. */
export function parchmentMarker(caption: string, coords?: string): RichMapMarker {
  // Fallback: return the base map centered on the map (no pin).
  return { image: BORDER_STATES_MAP, caption, coords };
}
export const PARCHMENT_MARKER = BORDER_STATES_MAP;
