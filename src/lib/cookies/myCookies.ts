// Same API surface as Cookies' original lib/myCookies.ts, so ported Cookies pages need no logic
// changes -- but backed by the unified cross-world store (lib/savedItems.ts, world: 'cookies').
// Cookies' "baked" concept maps onto the unified store's "tried" field (both mean "I made this").
// The legacy 'letThemEatCookies.myCookies' key is imported non-destructively on first load and
// left untouched on disk.
//
// NOTE: this file intentionally replaces the raw copy that scripts/port-world.mjs produces from
// Cookies' own lib/myCookies.ts (which reimplements a second, standalone localStorage store) --
// keep this adapter version, do not regenerate it from the sibling repo.
import * as savedItems from '../savedItems'
import type { CookieLibraryRecord } from '../../types/cookies/myCookies'

function toRecord(id: string): CookieLibraryRecord {
  const r = savedItems.getRecord('cookies', id)
  return {
    cookieId: id,
    wantToTry: Boolean(r?.wantToTry),
    baked: Boolean(r?.tried),
    favorite: Boolean(r?.favorite),
    note: r?.note,
    savedAt: r?.savedAt ?? Date.now(),
    updatedAt: r?.updatedAt ?? r?.savedAt ?? Date.now(),
  }
}

export function subscribe(listener: () => void): () => void {
  return savedItems.subscribe(listener)
}

// useSyncExternalStore requires getSnapshot to be referentially stable when nothing changed --
// savedItems.getByWorld('cookies') is now itself stable, but the .map() here would still
// allocate a new array every call without this memoization, causing an infinite render loop
// (React error #185).
let lastInput: ReturnType<typeof savedItems.getByWorld> | undefined
let lastOutput: CookieLibraryRecord[] = []

export function getSnapshot(): CookieLibraryRecord[] {
  const input = savedItems.getByWorld('cookies')
  if (input !== lastInput) {
    lastInput = input
    lastOutput = input.map((r) => toRecord(r.id))
  }
  return lastOutput
}

export function getRecord(cookieId: string): CookieLibraryRecord | undefined {
  const r = savedItems.getRecord('cookies', cookieId)
  return r ? toRecord(cookieId) : undefined
}

export function toggleWantToTry(cookieId: string): void {
  savedItems.toggleWantToTry('cookies', cookieId)
}

export function toggleBaked(cookieId: string): void {
  savedItems.toggleTried('cookies', cookieId)
}

export function toggleFavorite(cookieId: string): void {
  savedItems.toggleFavorite('cookies', cookieId)
}

export function setNote(cookieId: string, note: string): void {
  savedItems.setNote('cookies', cookieId, note)
}
