# iOS Release Handoff

Written 2026-08-13, updated 2026-08-14. For whoever picks this up on a Mac — a Mac with Xcode is required for everything left below, none of it can be done from Windows. Repo-side prep and all Apple-account-side prep that doesn't require Xcode are both done.

## Current State

- Apple Developer account: enrolled, Individual, Team ID **J48FJJ3ABL**, Apple Developer Program active (renews Aug 8 2027). Signed in as enchantedheadwear@gmail.com.
- App ID registered: `com.letthemeatcake.app`, no capabilities enabled (none needed — the app uses no push notifications, HealthKit, iCloud, Sign In with Apple, etc.).
- App Store Connect app record created: **Apple ID 6801655009**, "Let Them Eat Cake", iOS, version 1.0, currently "Prepare for Submission". Store-listing metadata (screenshots, description, keywords, App Review info) has **not** been filled in yet — none of it blocks a build upload, and it doesn't need to happen until right before actual submission.
- Bundle ID: `com.letthemeatcake.app` — matches Android, `capacitor.config.ts`, the registered App ID, and the App Store Connect app record.
- App name: "Let Them Eat Cake". Version `1.0`, build `1` (`ios/App/App.xcodeproj/project.pbxproj`).
- Icon (1024×1024) and splash screen assets are in place (`ios/App/App/Assets.xcassets`).
- Capacitor plugins synced into the iOS project via SPM (`ios/App/CapApp-SPM/Package.swift`): `@capacitor/app`, `@capacitor/share`, `@capgo/capacitor-updater`.
- No CocoaPods — this project uses Swift Package Manager for Capacitor's iOS integration, so there's no `Podfile`/`pod install` step. That's expected, not missing.
- No signing team configured yet in the Xcode project (`DEVELOPMENT_TEAM` is unset) — this happens in Xcode itself once opened on a Mac, no repo change needed since `CODE_SIGN_STYLE` is already `Automatic`.

## Steps, in order, on the Mac

1. **Open `ios/App/App.xcworkspace` in Xcode** (not the `.xcodeproj` — Capacitor's SPM setup expects the workspace).
2. **Signing & Capabilities tab**: select Team **J48FJJ3ABL** (the account is already enrolled — this just needs picking from the dropdown), leave `CODE_SIGN_STYLE = Automatic` so Xcode provisions the certificate/profile itself.
3. Run `npx cap sync ios` again right before building, to pick up any web changes made between now and then.
4. **Native QA pass** (simulator or device) — this hasn't been done at all yet, since it requires Xcode:
   - Four bottom tabs: Main, Workshop, Sommelier, Celebrate
   - Safe-area spacing, native back/navigation, keyboard/forms
   - Saved Cakes persistence (localStorage-backed, should just work in WKWebView)
   - External affiliate links open correctly
   - Native iOS Share sheet + share cards render/share correctly
   - Atlas, Pantry Raid, Sommelier, Celebrate flows
   - Legal/privacy/support links
   - Fix only genuine iOS-specific bugs found here — no product changes.
5. **Product → Archive** (Release configuration).
6. **Distribute App → App Store Connect → Upload** — this uploads straight into the existing app record (6801655009), no new app gets created.
7. Wait for Apple's processing, confirm the build shows up in TestFlight. Do not submit for App Review yet — that's a separate, deliberate step.

## If something looks wrong

- The App Store Connect app record (6801655009) already exists under `com.letthemeatcake.app` — Xcode's archive/distribute flow should just find and upload to it. If Xcode instead offers to create a new app, stop; something's mismatched.
- If build number `1` was already used in a prior upload attempt, increment `CURRENT_PROJECT_VERSION` in the target's build settings before archiving (App Store Connect rejects duplicate build numbers per version).
