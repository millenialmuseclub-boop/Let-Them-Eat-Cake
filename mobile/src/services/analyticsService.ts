// Platform-independent analytics interface. Web wraps window.plausible()
// behind trackAffiliateViewed/trackAffiliateClicked (src/lib/analytics.ts);
// this is the same event-name contract extended to the full event set the
// Phase 1 spec calls for. No analytics SDK is wired up yet — track() is a
// deliberate no-op today (console-logged in dev only) so the *shape* of
// every call site is correct and ready for a real native SDK (e.g. a
// Plausible/Amplitude/PostHog RN client) to be dropped in behind this one
// function without touching a single call site.

interface EventProps {
  [key: string]: string
}

function track(event: string, props: EventProps = {}): void {
  if (__DEV__) {
    console.log('[analytics]', event, props)
  }
  // No-op in production until a real native analytics SDK is chosen and wired in.
}

export function trackCakeViewed(cakeId: string, cakeName: string): void {
  track('Cake Viewed', { cakeId, cakeName })
}

export function trackSearch(query: string, resultCount: number): void {
  track('Search', { query, resultCount: String(resultCount) })
}

export function trackAtlasCountryOpened(country: string): void {
  track('Atlas Country Opened', { country })
}

export function trackSommelierPairingGenerated(mode: 'cake-first' | 'drink-first', subjectId: string): void {
  track('Sommelier Pairing Generated', { mode, subjectId })
}

export function trackRecipeOpened(recipeId: string): void {
  track('Recipe Opened', { recipeId })
}

export function trackPantryRecipeGenerated(matchTier: string, recipeId: string): void {
  track('Pantry Recipe Generated', { matchTier, recipeId })
}

export function trackCakeSaved(cakeId: string): void {
  track('Cake Saved', { cakeId })
}

export function trackCakeUnsaved(cakeId: string): void {
  track('Cake Unsaved', { cakeId })
}

export function trackShareInitiated(context: string): void {
  track('Share Initiated', { context })
}

export function trackCelebrationGenerated(flow: 'wedding' | 'birthday' | 'other', cakeId: string): void {
  track('Celebration Generated', { flow, cakeId })
}

export function trackAffiliateClicked(productName: string, network: string, category: string, context: string): void {
  track('Affiliate Link Clicked', { productName, network, category, context })
}

export function trackAffiliateViewed(productName: string, network: string, category: string, context: string): void {
  track('Affiliate Recommendation Viewed', { productName, network, category, context })
}
