// Native replacement for the web's <a target="_blank" rel="noreferrer sponsored">
// affiliate links. Opens in an in-app browser sheet (SFSafariViewController on
// iOS via expo-web-browser, Chrome Custom Tabs on Android) rather than a bare
// WebView or the OS browser — per NATIVE_HANDOFF.md's explicit guidance: never
// a webview that could be mistaken for the app's own content, and the app's
// own navigation stack stays untouched underneath, so returning is a single
// dismiss gesture back into the exact screen the user left.
//
// Tracking URLs are passed through byte-for-byte — nothing here rewrites,
// shortens, or strips query params off an affiliate link.

import * as WebBrowser from 'expo-web-browser'

export async function openExternalLink(url: string): Promise<void> {
  await WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  })
}
