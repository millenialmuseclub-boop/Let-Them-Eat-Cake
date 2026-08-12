import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'

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
