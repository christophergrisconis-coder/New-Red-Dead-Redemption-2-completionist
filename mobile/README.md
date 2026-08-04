# RDR1 Completionist — Expo Snack build

Single-file React Native app (`mobile/SnackApp.js`) for Expo Snack / Expo Go
with the real RDR1 "Border States 1910" map, verified pins, per-quest
walkthroughs, Gold Medal tips, and 100% tracking.

**Current build tag:** look for `BUILD: v3` at the very top of
`mobile/SnackApp.js`. If your Snack's `App.js` doesn't show that same tag
on line 3, you're running an older cached copy — re-paste (see below).

## Paste into Expo Snack (fresh, no cache)

Snack does NOT auto-pull from this repo. Every time you want the latest
build you must copy the current file contents in yourself.

1. Open **https://snack.expo.dev**.
2. Click your account menu → **"+ New Snack"**  (do NOT reopen the old
   Snack — that's what's serving you the stale file).
3. In the file tree on the left, open **`App.js`**, select all, delete it.
4. Open **`mobile/SnackApp.js`** in this repo (GitHub "Raw" view or your
   local checkout), copy the whole file, paste into `App.js`.
5. Confirm line 3 of your pasted `App.js` starts with `* BUILD: v3` — if
   not, you copied from the wrong tab.
6. (Optional) Open the **Dependencies** panel and add
   `@react-native-async-storage/async-storage` for progress persistence.
7. On the right, pick **My Device** and scan the QR with **Expo Go**.

### If Expo Go still shows the old UI

- In Expo Go, swipe the project card away (fully close it), then rescan
  the QR — Expo Go caches the last bundle per-Snack.
- In Snack, click **Save** (top right) after pasting so the bundler
  rebuilds; then rescan.
- As a hard reset, use **File → New Snack** and paste again instead of
  editing an existing Snack.

## What's inside (v3)

- **Real RDR1 world map** loaded from the Lovable CDN as the base image.
- **Detail hero** is now placed **below** the title and above the body
  text — nothing overlays the map and nothing overlays the text.
- **Zoomed map marker** card moved to the **bottom** of each detail page
  so it no longer breaks up the walkthrough reading flow.
- **Map tab** overlays every hideout, rare weapon, bounty, treasure, and
  outfit-scrap pin on the full map; tap a pin to open its walkthrough.
- **Verified vs region-anchor pins** are labeled so you can tell
  IGN-measured coords from regional fallbacks.
- **Per-quest walkthroughs** — overview, objectives, numbered checklist,
  Gold Medal requirements, 100% tips, missables, rewards.
- **Progress** — mark complete, pin, per-step tick-off, notes,
  Share-sheet export, JSON import, reset.
