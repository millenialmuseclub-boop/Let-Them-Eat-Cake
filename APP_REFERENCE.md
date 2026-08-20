# Let Them Eat Cake — Release Reference

This file contains release identifiers and GitHub secret names only.
No private keys, passwords, certificates, keystores, or secret values
should ever be committed to this repository.

Quick-lookup reference for both platforms' release identifiers and secrets. For the full iOS narrative (what's done, how the CI signing pipeline works, troubleshooting), see [IOS_RELEASE_HANDOFF.md](IOS_RELEASE_HANDOFF.md).

## Shared

- Package/Bundle ID (both platforms): `com.letthemeatcake.app`
- App name: Let Them Eat Cake
- Repo: `github.com/millenialmuseclub-boop/Let-Them-Eat-Cake`

## iOS

- Apple Developer Team ID: `J48FJJ3ABL` (Individual — Apple Developer account owner)
- App Store Connect Apple ID: `6801655009`
- Version/build: 1.0 / build 3 (latest shipped)
- Release pipeline: `.github/workflows/ios-release.yml` — manual trigger (`gh workflow run ios-release.yml`), builds on GitHub's macOS runner, no Mac needed

GitHub secrets:

| Secret | Purpose |
|---|---|
| `IOS_DIST_CERT_P12_BASE64` | Apple Distribution certificate + private key |
| `IOS_DIST_CERT_PASSWORD` | Password for the .p12 above |
| `IOS_PROVISION_PROFILE_BASE64` | "Let Them Eat Cake App Store" provisioning profile |
| `APP_STORE_CONNECT_API_KEY_BASE64` | App Store Connect API key (.p8), for upload auth |
| `APP_STORE_CONNECT_KEY_ID` | `D9D9R289GZ` |
| `APP_STORE_CONNECT_ISSUER_ID` | `4fdd638c-f6c1-4e1a-ac69-2b1013c60171` |

Where to find each of these again if needed:
- **Team ID**: developer.apple.com/account → Membership Details
- **App Store Connect Apple ID**: appstoreconnect.apple.com → Apps → App Information → General Information
- **API Key ID / Issuer ID**: appstoreconnect.apple.com → Users and Access → Integrations → App Store Connect API (the `.p8` file itself is only downloadable once, at creation — if lost, revoke and generate a new key)
- **Distribution certificate**: developer.apple.com/account/resources/certificates/list (private key half isn't re-downloadable — only the locally-saved `.p12` has it)
- **Provisioning profile**: developer.apple.com/account/resources/profiles/list (re-downloadable anytime)
- **GitHub secret values**: never visible again once saved — github.com/.../settings/secrets/actions only shows names + last-updated dates

## Android

- Release pipeline: `.github/workflows/android-release.yml` — manual trigger, builds a signed `.aab`
- `namespace` in `android/app/build.gradle` is still `com.millenialmuseclub.letthemeatcake` (harmless internal-only value, doesn't need to match `applicationId`)

GitHub secrets:

| Secret | Purpose |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Release signing keystore |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias inside the keystore |
| `ANDROID_KEY_PASSWORD` | Key password |

## Other shared secrets (not platform-specific)

- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `R2_BUCKET_NAME` — Cloudflare R2, hosts OTA update bundles for both platforms
- `CAPGO_PRIVATE_KEY` — signs/encrypts OTA bundles (public half is in `capacitor.config.ts`)
