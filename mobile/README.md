# Let Them Eat Cake — Native (iOS + Android)

React Native app built with Expo + Expo Router, sharing pure business logic and data with the frozen web app at the repo root.

## Required configuration before a real build

These are **not** invented — they don't exist yet and must be supplied before running on a real device or submitting to a store:

- **`app.json` → `ios.bundleIdentifier` / `android.package`** — currently `REPLACE_ME.letthemeatcake`. Set to your real reverse-DNS identifier (e.g. `com.letthemeatcake.app`).
- **Apple / Google signing credentials** — not configured. `eas build` will prompt to create these, or provide your own.
- **Universal link domain** — no production domain is associated yet (no `apple-app-site-association` / `assetlinks.json`). The app currently deep-links via the custom scheme `letthemeatcake://` only. See `src/services/deepLinks.ts` for the documented path structure.
- **A real analytics SDK** — `src/services/analyticsService.ts` is a fully-shaped no-op today (logs to console in dev). Wire in whichever SDK is chosen behind that one file.

## Getting started

```bash
npm install
npm run start      # Metro bundler — scan the QR code with Expo Go
npm run typecheck   # tsc --noEmit
```

This machine has no Xcode / Android Studio installed, so `npm run ios` / `npm run android` (which need a simulator or emulator) were not run in this environment — see the Phase 1 build report for what was and wasn't verified.

## Shared code with the web app

`src/shared/` is **not** hand-written — it's a copy of the web app's pure `lib/`, `types/`, and `data/` produced by:

```bash
npm run sync-shared
```

Re-run this whenever the web app's data or business logic changes. See `scripts/sync-shared.mjs` for exactly what's copied and what's deliberately excluded (browser-coupled files like `analytics.ts`/`notebook.ts`, ported by hand instead into `src/services/`).

## Structure

- `app/` — Expo Router screens. `(tabs)/discover`, `(tabs)/workshop`, `(tabs)/sommelier`, `(tabs)/celebrate` — the four frozen hubs, nothing else.
- `src/shared/` — synced pure logic/data from the web app (see above).
- `src/services/` — platform abstractions: `storageService`, `shareService`, `externalLinkService`, `analyticsService`, `deepLinks`, `wakeLockService`.
- `src/components/` — native UI ported from the web app's component set (`RecipeCard`, `AffiliateProductSet`, `FeatureCard`, etc.).
- `src/theme/` — color/spacing/type tokens ported 1:1 from the web app's `index.css`.
