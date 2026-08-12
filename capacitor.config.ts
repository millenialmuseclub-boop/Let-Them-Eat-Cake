import type { CapacitorConfig } from '@capacitor/cli';

// appId is a placeholder — no real reverse-DNS identifier has been reserved
// or assigned yet. Replace with the real one (and keep it consistent with
// mobile/app.json's bundleIdentifier/package, which uses the same
// REPLACE_ME.letthemeatcake placeholder) before any real build or store
// submission — do not submit with this value.
const config: CapacitorConfig = {
  appId: 'REPLACE_ME.letthemeatcake',
  appName: 'Let Them Eat Cake',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      // Silent background download + apply-on-next-launch, matching the
      // "low-friction, never trap the user" UX this app wants. Channel
      // assignment (production/staging) happens per-device via the Capgo
      // dashboard/API, not here — see OTA_UPDATES.md.
      autoUpdate: true,
    },
  },
};

export default config;
