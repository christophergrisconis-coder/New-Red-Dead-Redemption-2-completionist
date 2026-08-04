## Problem

`mobile/SnackApp.js` (the single-file build the user pastes into Expo Snack) is out of sync with the web app. It still ships the old text-only walkthroughs — no hero images, no map markers, no pins — so Snack shows the "old" experience. The web app already has:

- The real RDR1 "Border States 1910" base map (`src/assets/rdr/border-states-map.png.asset.json`, served from the Lovable CDN)
- Verified `{x, y}` pins on treasures, rare weapons, hideouts, plus region-anchor fallbacks
- A magazine-style DetailPanel with a hero crop of the map + `MapMarkerCard` crops per pin

None of that made it into `SnackApp.js`.

## Fix

Rewrite `mobile/SnackApp.js` as a single self-contained file that mirrors the web experience using only Expo-Go-safe APIs. No React Navigation, no TS, no extra deps beyond `@react-native-async-storage/async-storage` (optional).

### 1. Inline the map + pin data

- Hard-code the CDN URL for `border-states-map.png` (absolute `https://` URL so Snack can load it — Snack has no `/__l5e` proxy). Add a short credit line.
- Inline a `REGION_ANCHORS` table and a `PINS` array covering: 9 treasures, 5 rare weapons, 7 hideouts, 20 bounties, 5 gang-outfit scrap clusters. Each pin: `{ id, x, y, region, caption, verified, category }`. Verified coords copied from `src/data/collectibles.ts`, `weapons.ts`, `hideouts.ts`; unverified ones use region anchors and are flagged.

### 2. Reusable image components

- `<BaseMap pins width />` — renders the base map at a given width and overlays absolutely-positioned dot markers (color per category, ring on the active pin).
- `<MapCrop pin size zoom />` — renders a cropped viewport of the same base map centered on the pin, using a large `<Image>` inside a clipped `<View>` with negative offsets (RN equivalent of the web's `background-position` crop). Used for hero banners and per-marker cards.
- `<PinBadge verified />` — "Verified" vs "Region anchor" chip.

### 3. Detail screen upgrade

For every trackable that has a pin (treasures, rare weapons, hideouts, bounties, outfit scrap steps):

- Hero: `<MapCrop>` centered on the pin, with title/region overlay.
- Body: existing walkthrough / objectives / gold-medal / rewards sections (kept).
- New "Map Marker" card: `<MapCrop>` at higher zoom + caption + verified badge + coord note.
- Outfits get a per-scrap list where each row has its own mini `<MapCrop>`.

Trackables without a pin (story missions, minigames, jobs, safehouses, challenges) keep a lightweight region-anchor hero so every screen has consistent imagery.

### 4. Map tab

New "Map" tab in the bottom nav: full-width `<BaseMap>` with category filter chips (Treasures / Weapons / Hideouts / Bounties / Outfits). Tapping a pin opens that item's detail screen.

### 5. Data parity pass

Port the corrected counts + separation already in the web build: story 57, strangers 18 (+1 extra), bounties 20, jobs 5, hideouts 7, minigames 6, locations 94, official outfits 9, rare weapons 5, safehouses 13. Official vs Completionist Extra flags preserved. Detailed per-quest walkthroughs stay as-is (they're already in the file).

### 6. Snack-safety checklist

- Single file, no relative imports.
- All images loaded via absolute `https://` URLs from the Lovable CDN (Snack cannot resolve `/__l5e/...` relative paths — needs the full origin, so I'll prepend the project's asset host).
- AsyncStorage import wrapped in try/catch so the app still runs if the dep isn't added.
- No `window`, no `document`, no `<iframe>`.

### 7. Repository UI note

The user said "update the repository/UI" — the web app already has the map + pins. I'll also make sure `mobile/README.md` and the top comment block in `SnackApp.js` document the new Snack paste steps and mention the map/marker system so it's obvious the file is current.

## Files touched

- `mobile/SnackApp.js` — full rewrite (single self-contained file, ~1500 lines).
- `mobile/README.md` — updated paste instructions + note about images/markers.

No changes to the web app (already correct) and no changes to the multi-file `mobile/src/` tree (kept for the full Expo project workflow).

## After building

I'll verify the file parses (node --check) and that every image URL is an absolute `https://` string so Snack can render it without a proxy.
