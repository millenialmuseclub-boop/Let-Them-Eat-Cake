# iOS Release Handoff

Written 2026-08-13, last updated 2026-09-08 for a handoff to Codex. A signed build is now shipping to TestFlight entirely from GitHub Actions — no Mac was ever used. Simulator QA needs Xcode on a Mac; physical TestFlight QA can be performed on an iPhone without a Mac. Neither was available during this takeover pass.

**Build 4 / version 2.0 (uploaded 2026-08-28, run `33187821817`)** is the latest native build in TestFlight. Everything below that date is app content/UI: the app is now a merged multi-world product (Cake, Ramen, Cookies, Noodles under one shell — see `src/data/hubs.ts`), not the single-world Cake app the App Store record's version-1.0 copy in this file used to describe.

**Since Build 4, all shipped work has been OTA-only** (JS/CSS/data changes, no native plugin or `capacitor.config.ts` changes) — see `OTA_UPDATES.md` for the mechanism. Eligible production-channel installations can download this content and activate it at the next launch/background transition; offline devices may still have older content. **The PR #3–5 web changes do not require a new binary.** Most recent OTA pushes (all to `production`, all `npm run build`+lint+typecheck clean before publish):
- Cookies Curated Collections route fix + Atlas/Shop feature-photo cards across all four worlds (PR #3)
- Fixed hard-blank hero images for cakes/ramen with no sourced photo (now show a branded "photo coming soon" placeholder instead of nothing) + added missing hero photos to several Cookies hub pages (PR #4)
- Fixed Ramen Atlas map pin tap-precision (Kanto-region cities were hard to tap individually) + brought Noodles Atlas off ad-hoc inline styles onto real CSS classes (PR #5)

**Photography update shipped through OTA production:** 20 verified, attributed dish photos are now bundled locally (6 Cake, 12 Ramen, 2 Cookies). Two dish-photo gaps remain: Kerala Plum Cake and Pepas. See `reports/content-audit.json` and `public/photography/credits.json`.

## Current State

- Apple Developer account: enrolled, Individual, Team ID **J48FJJ3ABL**, Apple Developer Program active (renews Aug 8 2027). Signed in as enchantedheadwear@gmail.com.
- App ID registered: `com.letthemeatcake.app`, no capabilities enabled (none needed — the app uses no push notifications, HealthKit, iCloud, Sign In with Apple, etc.).
- App Store Connect app record: **Apple ID 6801655009**, "Let Them Eat Cake", iOS. **Build 4 (version 2.0) uploaded successfully and is processing/available in TestFlight** as of 2026-08-28 — see `.github/workflows/ios-release.yml` run history for the exact run. Store-listing metadata (screenshots, description, keywords, App Review info) is still **not** filled in — not needed until actual App Store submission, which per the original brief we're deliberately not doing yet.
- Bundle ID: `com.letthemeatcake.app` — matches Android, `capacitor.config.ts`, the registered App ID, and the App Store Connect app record.
- App name: "Let Them Eat Cake". Shipped version `2.0`, build `4`. The source now prepares version `2.0`, build `5` (`CURRENT_PROJECT_VERSION`/`MARKETING_VERSION`); Build 5 has NOT been archived, signed, uploaded, or submitted.
- Icon (1024×1024) and splash screen assets are in place (`ios/App/App/Assets.xcassets`).
- Capacitor plugins synced into the iOS project via SPM (`ios/App/CapApp-SPM/Package.swift`): `@capacitor/app`, `@capacitor/share`, `@capacitor/haptics`, `@capacitor/filesystem`, `@capgo/capacitor-updater`.
- No CocoaPods — this project uses Swift Package Manager for Capacitor's iOS integration, so there's no `Podfile`/`pod install` step. That's expected, not missing.
- Android is behind iOS: last released build was `versionCode 1` / `versionName "1.0"` on 2026-08-14, predating the multi-world merge. Not otherwise covered by this doc (iOS-specific) — flag if Android parity becomes a priority.

## CI signing pipeline (`.github/workflows/ios-release.yml`)

Manual `workflow_dispatch` trigger (`gh workflow run ios-release.yml`, or the Actions tab). Builds the production web bundle, syncs Capacitor, archives, exports, and uploads to App Store Connect — all on a GitHub-hosted macOS runner.

**Signing setup, once:**
- An Apple Distribution certificate was issued via CSR (openssl-generated, no Xcode needed) and its `.p12` (cert + private key, password-protected) stored as GitHub secrets `IOS_DIST_CERT_P12_BASE64` / `IOS_DIST_CERT_PASSWORD`.
- An App Store provisioning profile ("Let Them Eat Cake App Store") for `com.letthemeatcake.app` was generated and stored as `IOS_PROVISION_PROFILE_BASE64`.
- An App Store Connect API key (App Manager role, Key ID + Issuer ID) was generated for upload auth: `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_API_KEY_BASE64`.
- Manual signing for Release is scoped via `ios/release.xcconfig`, wired in as the App target's Release `baseConfigurationReference` in `project.pbxproj` — **not** via `xcodebuild` command-line overrides. Every attempt at command-line signing overrides broke something else (they apply to the whole build graph, including SPM resource-bundle targets that can't be signed, and headless `xcodebuild archive` resolves Automatic signing to "development" purpose regardless of the archive action). Scoping via xcconfig was the fix — see the comment at the top of `ios/release.xcconfig` and the commit history on that file for the full story if this ever needs revisiting.

**To ship a new build:** bump `CURRENT_PROJECT_VERSION` in `project.pbxproj` (App Store Connect rejects duplicate build numbers per version), commit, push, then `gh workflow run ios-release.yml`. No Mac needed.

## Native QA still required

Use Xcode on macOS for simulator testing, or the TestFlight app on a physical iPhone for device testing:
- All four worlds (Cake, Ramen, Cookies, Noodles), each with its own bottom tab bar: Main, Workshop, Atlas, Shop
- World switching from Home, safe-area spacing, native back/navigation, keyboard/forms
- Saved items persistence per world (localStorage-backed, should just work in WKWebView)
- External affiliate links open correctly (Curated Kitchen / Shop in every world)
- Native iOS Share sheet + share cards render/share correctly
- Atlas map interaction specifically on a real device (Ramen's pinch/pan/tap on the Japan map — the pin-density fix in the 2026-09-08 OTA push was verified in a desktop browser emulator, not a real iPhone touch screen)
- Sommelier/pairing flows, Workshop labs, quizzes in each world
- Legal/privacy/support links
- Fix only genuine iOS-specific bugs found here — no product changes.

To open the project locally: `ios/App/App.xcodeproj` (no separate `.xcworkspace` — SPM, not CocoaPods). For local Debug builds/simulator runs, pick Team **J48FJJ3ABL** in Signing & Capabilities; Debug config is untouched (`CODE_SIGN_STYLE = Automatic`), only Release was changed for CI. Testing an actual TestFlight build doesn't require this though — that can happen on any iPhone via the TestFlight app once you're added as a tester, no Xcode required for that part either.

## If something looks wrong

- The App Store Connect app record (6801655009) already exists under `com.letthemeatcake.app` — don't let anything create a second app.
- Duplicate build number: increment `CURRENT_PROJECT_VERSION` before re-running the workflow.

## Prepared Build 5: native binary not shipped

Build 5 should bundle PR #3–5 plus the current navigation, saved-state, photography, Atlas, CSS isolation, route loading, and contextual commerce fixes. Native identity, signing, permissions, OTA public key, and plugin versions are unchanged. The native changes are build numbering, portable Swift package paths, and a privacy resource declaring FileTimestamp C617.1 and UserDefaults CA92.1 for the installed plugins.

Validation commands: npm run lint; npm test; npm run build; APP_BUILD_VERSION=<commit timestamp> npx cap sync ios; npm run ios:normalize; npm run ios:check. Set VITE_R2_PUBLIC_BASE_URL and VITE_OTA_CHANNEL=production before a release web build. CI adds --release checks before touching signing credentials. The local sync validates packaged assets, not executable iOS behavior.

The manual iOS workflow uploads to Apple: do not run it without explicit authorization. First verify physical touch interaction, native sharing, safe areas/text scaling, persistence, offline launch, and signed OTA download/activation/watchdog recovery on a staging build. Browser viewport checks do not satisfy these gates. See TAKEOVER_REPORT.md for the pass evidence and outstanding work.

## Latest verified OTA production publish

The takeover web changes shipped as 953119abf404d80d4897f89f9e8b21103630993e (PR #7), OTA version 1788926462. Workflow 34309325018 succeeded on 2026-09-09 UTC / 2026-09-08 Pacific. The public manifest and encrypted bundle availability were independently verified. Build 4 remains the latest known native binary; Build 5 preparation has not been uploaded. Physical-device OTA activation still needs testing.
