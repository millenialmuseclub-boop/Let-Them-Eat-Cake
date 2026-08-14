# iOS Release Handoff

Written 2026-08-13, for whoever picks this up once the Apple Developer account exists (a Mac with Xcode is required for everything below — none of it can be done from this Windows environment). Repo-side prep is done; this is what's left.

## Current State

- Bundle ID: `com.letthemeatcake.app` — matches Android and `capacitor.config.ts`. No App Store Connect app exists yet, so this was free to set without conflict.
- App name: "Let Them Eat Cake". Version `1.0`, build `1` (`ios/App/App.xcodeproj/project.pbxproj`).
- Icon (1024×1024) and splash screen assets are in place (`ios/App/App/Assets.xcassets`).
- Capacitor plugins synced into the iOS project via SPM (`ios/App/CapApp-SPM/Package.swift`): `@capacitor/app`, `@capacitor/share`, `@capgo/capacitor-updater`.
- No CocoaPods — this project uses Swift Package Manager for Capacitor's iOS integration, so there's no `Podfile`/`pod install` step. That's expected, not missing.
- No signing team configured (`DEVELOPMENT_TEAM` is unset in the Xcode project) — nothing to configure until the Apple Developer account exists.

## Steps, in order, once the Apple Developer account is created

1. **Enroll in the Apple Developer Program** (developer.apple.com) — takes up to 48h if identity verification is needed.
2. **Register the App ID** in the developer portal: `com.letthemeatcake.app`, matching what's already in the Xcode project.
3. **Create the app record in App Store Connect**, bundle ID `com.letthemeatcake.app`, name "Let Them Eat Cake".
4. **Open `ios/App/App.xcworkspace` in Xcode on a Mac** (not the `.xcodeproj` — Capacitor's SPM setup expects the workspace).
5. **Signing & Capabilities tab**: select your Team, leave `CODE_SIGN_STYLE = Automatic` (already set) so Xcode provisions the certificate/profile itself.
6. Run `npx cap sync ios` again right before building, to pick up any web changes made between now and then.
7. **Native QA pass** (simulator or device) — this hasn't been done at all yet, since it requires Xcode:
   - Four bottom tabs: Main, Workshop, Sommelier, Celebrate
   - Safe-area spacing, native back/navigation, keyboard/forms
   - Saved Cakes persistence (localStorage-backed, should just work in WKWebView)
   - External affiliate links open correctly
   - Native iOS Share sheet + share cards render/share correctly
   - Atlas, Pantry Raid, Sommelier, Celebrate flows
   - Legal/privacy/support links
   - Fix only genuine iOS-specific bugs found here — no product changes.
8. **Product → Archive** (Release configuration).
9. **Distribute App → App Store Connect → Upload.**
10. Wait for Apple's processing, confirm the build shows up in TestFlight. Do not submit for App Review yet — that's a separate, deliberate step.

## If something looks wrong

- If App Store Connect already has an app under a *different* bundle ID than `com.letthemeatcake.app` (e.g. if someone registered it manually before this), stop and reconcile before archiving — do not let Xcode create a second app record.
- If build number `1` was already used in a prior upload attempt, increment `CURRENT_PROJECT_VERSION` in the target's build settings before archiving (App Store Connect rejects duplicate build numbers per version).
