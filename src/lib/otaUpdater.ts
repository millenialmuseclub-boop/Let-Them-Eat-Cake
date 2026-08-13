import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { OTA_MANIFEST_URL } from './otaConfig'

// Shape the CI encrypt step writes into manifest.json (see .github/workflows/ota-publish.yml).
// All four fields are required: bundles are encrypted, so download() needs
// checksum + sessionKey (not just url) to verify and decrypt.
interface OtaManifest {
  version: string
  url: string
  checksum: string
  sessionKey: string
}

// Prevents a second check from starting while one is already in flight.
let checkInFlight: Promise<boolean> | null = null

/**
 * Tells Capgo the current bundle (the one that just launched, whether the
 * store binary's bundled web assets or a previously-applied OTA update)
 * booted successfully. This is the crash-safety mechanism: if this is never
 * called, Capgo assumes the bundle is bad and auto-reverts to the last known
 * good version on next launch — so a broken OTA update can never brick the
 * app or leave it on a blank screen.
 *
 * No-ops on web (Capacitor.isNativePlatform() is false there) and swallows
 * any native-call failure — this must never be able to block or crash app
 * startup. See OTA_UPDATES.md for the full update/rollback strategy.
 */
export async function markAppReady(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  try {
    await CapacitorUpdater.notifyAppReady()
  } catch {
    // Never let a Capgo failure affect the running app.
  }
}

/**
 * Zero-server OTA check (see OTA_UPDATES.md): polls a static manifest.json on
 * R2 and, if it names a newer version, downloads the signed+encrypted bundle
 * and schedules it to apply at the *next* launch/background transition.
 *
 * Deliberately uses `next()`, not `set()` + `reload()` — an immediate reload
 * mid-session causes a jarring double-boot (open on the old bundle, detect the
 * update, white-screen, reload). `next()` defers the swap to a natural
 * boundary instead, where state loss is already expected.
 *
 * No-ops on web, when the manifest URL isn't configured, or when offline.
 * Never throws — any failure (network, bad signature, corrupt zip) just
 * leaves the user on their current working bundle.
 */
export async function checkForOtaUpdate(): Promise<boolean> {
  if (checkInFlight) return checkInFlight
  checkInFlight = doCheck().finally(() => {
    checkInFlight = null
  })
  return checkInFlight
}

async function doCheck(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false
  if (!OTA_MANIFEST_URL) return false
  if (!navigator.onLine) return false

  try {
    const res = await fetch(OTA_MANIFEST_URL, { cache: 'no-store' })
    if (!res.ok) return false
    const manifest = (await res.json()) as OtaManifest

    const { bundle } = await CapacitorUpdater.current()
    if (manifest.version === bundle.version) return false

    const downloaded = await CapacitorUpdater.download({
      url: manifest.url,
      version: manifest.version,
      checksum: manifest.checksum,
      sessionKey: manifest.sessionKey,
    })

    await CapacitorUpdater.next({ id: downloaded.id })
    return true
  } catch {
    return false
  }
}
