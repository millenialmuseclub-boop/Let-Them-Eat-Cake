# OTA Updates (Capgo)

## Architecture

`@capgo/capacitor-updater` is installed and configured (`capacitor.config.ts`,
`plugins.CapacitorUpdater`) with `autoUpdate: true` — the app checks for an
update in the background and applies it silently on the next launch. No
"Updating…" screen, no blocking the user.

`src/lib/otaUpdater.ts` calls `CapacitorUpdater.notifyAppReady()` once on
every launch, right after the app renders. This is Capgo's crash-safety
contract: if a bundle never calls this (because it crashed, hung, or
white-screened), Capgo automatically reverts the device to the last known
good bundle on the next launch. **A failed OTA update cannot brick the app or
leave a user stuck** — the store-submitted binary's bundled web assets are
always the final fallback.

## Channels

- **production** — what real users receive. Only ever published deliberately (see below).
- **staging** — for internal testing before promoting to production.

Device-to-channel assignment is configured in the Capgo dashboard (or via
their API/CLI), not in this repo's code — the app doesn't hardcode a channel.

## Publishing an update

Both channels use the same manual workflow: **Actions → "Publish OTA Update
(Capgo)" → Run workflow → choose `staging` or `production`.**

There is no automatic trigger — no push, merge, or tag publishes anything.
The workflow always runs `npm run build` (which includes the TypeScript
typecheck) first; if that fails, nothing is published.

**Recommended flow:** publish to `staging` first, verify on a staging-channel
device/build, then run the same workflow again with `production` once you're
confident.

## Required GitHub secret

- `CAPGO_TOKEN` — a Capgo API key with upload permission. Set under
  **Settings → Secrets and variables → Actions**. Never printed to build logs,
  never committed to the repo.

## What can ship OTA vs. what needs a new store build

**OTA-safe** (web-layer only, exactly what this app already is — no native
code):
- UI/CSS/copy fixes
- JavaScript business-logic fixes
- Data/content updates (recipes, cakes, affiliate links, etc.) — all bundled
  JSON, no new native permissions

**Requires a new App Store / Play Store binary, not OTA:**
- Adding/upgrading a Capacitor plugin
- Any change to native permissions or entitlements
- Any change to `capacitor.config.ts` that affects native behavior, or to
  the `ios/`/`android/` projects themselves
- Anything Apple's App Review Guidelines or Google Play's policy on
  dynamically loaded code would reasonably expect to see in a fresh binary
  review

If in doubt, ship a store update instead of OTA — OTA is for the web layer
only, never a way to route around review.

## Version compatibility

This app has no native plugin surface beyond `@capacitor/core` +
`@capacitor/ios`/`android` + `@capgo/capacitor-updater` itself. As long as an
OTA bundle doesn't assume a plugin or native capability the installed binary
doesn't have, it's compatible. **If a future change adds a new native
plugin, that release must ship as a new store binary first** — only bundles
built against that same native surface should go out as OTA afterward.

## Rollback

- **Automatic**: any bundle that never calls `notifyAppReady()` (crash,
  white screen, hang) is auto-reverted by Capgo on next launch — no action
  needed.
- **Manual**: to pull a bad update that "works" but is wrong (e.g. a content
  or copy mistake), use the Capgo dashboard to mark the previous bundle on
  that channel as current, or unassign/disable the channel entirely. Devices
  fall back to the last good bundle they already have cached, then to the
  store binary if no cached bundle exists.

## Emergency process

1. Identify the bad bundle in the Capgo dashboard.
2. Revert the channel to the last known good bundle (or disable the channel).
3. Fix the issue in the repo, run the OTA workflow again to `staging`, verify, then `production`.
4. If the issue is severe enough that no cached bundle is safe, submit an
   emergency store update instead — OTA should never be the only recovery path.
