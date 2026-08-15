# iOS Release Handoff

Written 2026-08-13, last updated 2026-08-15. A signed build is now shipping to TestFlight entirely from GitHub Actions — no Mac was ever used. The one thing still genuinely blocked without a Mac is native QA in a simulator/device (see below); everything about getting a build signed and uploaded is done and repeatable.

## Current State

- Apple Developer account: enrolled, Individual, Team ID **J48FJJ3ABL**, Apple Developer Program active (renews Aug 8 2027). Signed in as enchantedheadwear@gmail.com.
- App ID registered: `com.letthemeatcake.app`, no capabilities enabled (none needed — the app uses no push notifications, HealthKit, iCloud, Sign In with Apple, etc.).
- App Store Connect app record: **Apple ID 6801655009**, "Let Them Eat Cake", iOS. **Build 1 (version 1.0) uploaded successfully and is processing/available in TestFlight** as of 2026-08-15 — see `.github/workflows/ios-release.yml` run history for the exact run. Store-listing metadata (screenshots, description, keywords, App Review info) is still **not** filled in — not needed until actual App Store submission, which per the original brief we're deliberately not doing yet.
- Bundle ID: `com.letthemeatcake.app` — matches Android, `capacitor.config.ts`, the registered App ID, and the App Store Connect app record.
- App name: "Let Them Eat Cake". Version `1.0`, build `1` (`ios/App/App.xcodeproj/project.pbxproj`).
- Icon (1024×1024) and splash screen assets are in place (`ios/App/App/Assets.xcassets`).
- Capacitor plugins synced into the iOS project via SPM (`ios/App/CapApp-SPM/Package.swift`): `@capacitor/app`, `@capacitor/share`, `@capgo/capacitor-updater`.
- No CocoaPods — this project uses Swift Package Manager for Capacitor's iOS integration, so there's no `Podfile`/`pod install` step. That's expected, not missing.

## CI signing pipeline (`.github/workflows/ios-release.yml`)

Manual `workflow_dispatch` trigger (`gh workflow run ios-release.yml`, or the Actions tab). Builds the production web bundle, syncs Capacitor, archives, exports, and uploads to App Store Connect — all on a GitHub-hosted macOS runner.

**Signing setup, once:**
- An Apple Distribution certificate was issued via CSR (openssl-generated, no Xcode needed) and its `.p12` (cert + private key, password-protected) stored as GitHub secrets `IOS_DIST_CERT_P12_BASE64` / `IOS_DIST_CERT_PASSWORD`.
- An App Store provisioning profile ("Let Them Eat Cake App Store") for `com.letthemeatcake.app` was generated and stored as `IOS_PROVISION_PROFILE_BASE64`.
- An App Store Connect API key (App Manager role, Key ID + Issuer ID) was generated for upload auth: `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_API_KEY_BASE64`.
- Manual signing for Release is scoped via `ios/release.xcconfig`, wired in as the App target's Release `baseConfigurationReference` in `project.pbxproj` — **not** via `xcodebuild` command-line overrides. Every attempt at command-line signing overrides broke something else (they apply to the whole build graph, including SPM resource-bundle targets that can't be signed, and headless `xcodebuild archive` resolves Automatic signing to "development" purpose regardless of the archive action). Scoping via xcconfig was the fix — see the comment at the top of `ios/release.xcconfig` and the commit history on that file for the full story if this ever needs revisiting.

**To ship a new build:** bump `CURRENT_PROJECT_VERSION` in `project.pbxproj` (App Store Connect rejects duplicate build numbers per version), commit, push, then `gh workflow run ios-release.yml`. No Mac needed.

## What still needs a Mac

Native QA in a simulator or on a device — this genuinely cannot happen without Xcode:
- Four bottom tabs: Main, Workshop, Sommelier, Celebrate
- Safe-area spacing, native back/navigation, keyboard/forms
- Saved Cakes persistence (localStorage-backed, should just work in WKWebView)
- External affiliate links open correctly
- Native iOS Share sheet + share cards render/share correctly
- Atlas, Pantry Raid, Sommelier, Celebrate flows
- Legal/privacy/support links
- Fix only genuine iOS-specific bugs found here — no product changes.

To open the project locally: `ios/App/App.xcodeproj` (no separate `.xcworkspace` — SPM, not CocoaPods). For local Debug builds/simulator runs, pick Team **J48FJJ3ABL** in Signing & Capabilities; Debug config is untouched (`CODE_SIGN_STYLE = Automatic`), only Release was changed for CI. Testing an actual TestFlight build doesn't require this though — that can happen on any iPhone via the TestFlight app once you're added as a tester, no Xcode required for that part either.

## If something looks wrong

- The App Store Connect app record (6801655009) already exists under `com.letthemeatcake.app` — don't let anything create a second app.
- Duplicate build number: increment `CURRENT_PROJECT_VERSION` before re-running the workflow.
