// Ported 1:1 from the frozen web app's src/index.css custom properties.
// Light values are the web's default (`:root`); dark values are the web's
// `@media (prefers-color-scheme: dark)` override. Native picks between them
// via useColorScheme() in theme/useTheme.ts, mirroring the web's automatic
// system-driven behavior exactly (no manual light/dark toggle exists on web
// either).

export const lightColors = {
  cream: '#fff8f0',
  cocoa: '#3d2314',
  raspberry: '#e88d9e',
  raspberryBg: 'rgba(232, 141, 158, 0.15)',
  gold: '#d4af37',

  text: '#3d2314',
  cocoaStrong: '#3d2314',
  bg: '#fff8f0',
  bgCard: '#ffffff',
  border: 'rgba(61, 35, 20, 0.12)',
  shadow: 'rgba(61, 35, 20, 0.08)',
}

export const darkColors = {
  cream: '#fff8f0',
  cocoa: '#3d2314',
  raspberry: '#e88d9e',
  raspberryBg: 'rgba(232, 141, 158, 0.2)',
  gold: '#d4af37',

  text: '#f3ece4',
  cocoaStrong: '#f3ece4',
  bg: '#1c1310',
  bgCard: '#2a1c15',
  border: 'rgba(243, 236, 228, 0.14)',
  shadow: 'rgba(0, 0, 0, 0.35)',
}

export type ThemeColors = typeof lightColors
