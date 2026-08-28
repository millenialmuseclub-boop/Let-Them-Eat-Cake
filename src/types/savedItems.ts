// Unified saved-items model for the merged "Let Them Eat" app.
//
// Each of the four worlds (Cake, Ramen, Cookies, Noodles) shipped its own local-only,
// no-accounts "personal library" before the merge, with different field names and different
// richness (Cake: plain saved/unsaved; Ramen: want-to-try/tried/favorite/note; Cookies: same
// shape as Ramen but "baked" instead of "tried"; Noodles: a states[] array covering the same
// three states). This type is the superset that can represent all four without losing any of
// them, namespaced by `world` so ids never collide across worlds.
//
// See src/lib/savedItems.ts for the store + one-time, non-destructive migration off the four
// legacy per-app localStorage keys.

export type World = 'cake' | 'ramen' | 'cookies' | 'noodles'

export interface SavedItemRecord {
  world: World
  id: string
  /** Optional sub-type within a world -- e.g. Cake distinguishes 'cake' vs 'personality' saves. */
  itemType?: string
  /** Simple bookmark flag -- what Cake's original single-boolean save meant. */
  saved?: boolean
  wantToTry?: boolean
  /** Ramen/Noodles naming for "I made this". Cookies' "baked" is normalized to this same field. */
  tried?: boolean
  favorite?: boolean
  /** Private, local-only note. */
  note?: string
  savedAt: number
  updatedAt?: number
}

export interface SavedItemsPayload {
  version: 1
  items: SavedItemRecord[]
}
