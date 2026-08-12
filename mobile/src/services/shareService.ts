// Native replacement for the web's SocialShareCard.tsx share button.
// Web calls navigator.share({ title, text, url }) with a clipboard-write
// fallback when the Web Share API isn't available. Native has a real share
// sheet everywhere, so there's no fallback path to port — RN's built-in
// Share module opens the platform share sheet directly.
//
// Deliberately does NOT attach an image file. The web app's share cards were
// redesigned to be typography-only (no cake/drink photography, no radar
// charts, no rendered PNG) specifically so the shared payload stays a fast,
// story-safe text+link — see NATIVE_HANDOFF.md. Native sharing preserves
// that same "share the hook, not the explanation" philosophy: same
// eyebrow/title/subtitle/CTA-shaped short text, no image asset.

import { Platform, Share } from 'react-native'

export interface SharePayload {
  /** Short, punchy line — same role as web's shareText. */
  text: string
  /** Deep link back into the app for this content, if one exists yet. */
  url?: string
  /** iOS only: shown as the share sheet's subject/title context. */
  title?: string
}

export async function share(payload: SharePayload): Promise<{ shared: boolean }> {
  const message = payload.url ? `${payload.text} ${payload.url}` : payload.text
  try {
    const result = await Share.share(
      Platform.select({
        ios: { message: payload.text, url: payload.url, title: payload.title },
        default: { message, title: payload.title },
      }) as { message: string; url?: string; title?: string },
    )
    return { shared: result.action === Share.sharedAction }
  } catch {
    return { shared: false }
  }
}
