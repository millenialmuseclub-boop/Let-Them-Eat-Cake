// Build-time OTA settings for the zero-server pattern (see OTA_UPDATES.md).
// Both values are baked into dist/ at `npm run build` time via Vite env vars —
// there is no runtime lookup, so a build only ever polls one channel.

const CHANNEL = (import.meta.env.VITE_OTA_CHANNEL as string | undefined) || 'production'

const R2_PUBLIC_BASE_URL = import.meta.env.VITE_R2_PUBLIC_BASE_URL as string | undefined

// Undefined until the R2 bucket's public URL is wired into CI/.env.local —
// checkForOtaUpdate() no-ops rather than throwing when this is unset.
export const OTA_MANIFEST_URL = R2_PUBLIC_BASE_URL
  ? `${R2_PUBLIC_BASE_URL}/updates/${CHANNEL}/manifest.json`
  : undefined
