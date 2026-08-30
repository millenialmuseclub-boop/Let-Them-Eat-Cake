// Unified saved-items store for all four worlds, replacing the four apps' separate personal
// libraries (Cake's `pastryNotebookItems`, Ramen's `ramenLibrary`, Cookies'
// `letThemEatCookies.myCookies`, Noodles' `let-them-eat-noodles:my-noodles:v1`).
//
// Same module-level pub/sub + in-memory-cache pattern Ramen/Cookies/Noodles all converged on
// independently (see their myRamen.ts/myCookies.ts/useMyNoodles.ts) -- useSyncExternalStore
// requires getSnapshot to return a referentially stable value when nothing changed, so writes
// replace the cache wholesale rather than re-parsing localStorage on every read.
//
// On first load in the merged app, `migrateLegacyData()` imports all four legacy keys into the
// new unified key, additively and non-destructively: it never deletes or rewrites the legacy
// keys, and it never overwrites a record that migration (or a later save) already created for
// the same world+id. This runs once, guarded by a migration-complete marker.

import type { SavedItemRecord, SavedItemsPayload, World } from '../types/savedItems'

const STORAGE_KEY = 'letThemEat.savedItems.v1'
const MIGRATION_MARKER_KEY = 'letThemEat.savedItems.migrated.v1'
const CURRENT_VERSION = 1

const LEGACY_CAKE_KEY = 'pastryNotebookItems'
const LEGACY_RAMEN_KEY = 'ramenLibrary'
const LEGACY_COOKIES_KEY = 'letThemEatCookies.myCookies'
const LEGACY_NOODLES_KEY = 'let-them-eat-noodles:my-noodles:v1'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

function readJSON<T>(key: string): T | undefined {
  if (!hasWindow()) return undefined
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return undefined
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

function loadCurrent(): SavedItemRecord[] {
  const payload = readJSON<SavedItemsPayload>(STORAGE_KEY)
  if (!payload || payload.version !== CURRENT_VERSION || !Array.isArray(payload.items)) return []
  return payload.items
}

function recordKey(world: World, id: string): string {
  return `${world}:${id}`
}

/** Reads the four legacy per-app keys and converts them to unified records. Never mutates them. */
function readLegacyRecords(): SavedItemRecord[] {
  const out: SavedItemRecord[] = []

  // Cake: pastryNotebookItems = [{ type: 'cake' | 'personality', id, savedAt }]
  const cakeLegacy = readJSON<Array<{ type: string; id: string; savedAt: number }>>(LEGACY_CAKE_KEY)
  if (Array.isArray(cakeLegacy)) {
    for (const item of cakeLegacy) {
      if (!item || typeof item.id !== 'string') continue
      out.push({
        world: 'cake',
        id: item.id,
        itemType: item.type,
        saved: true,
        savedAt: typeof item.savedAt === 'number' ? item.savedAt : Date.now(),
      })
    }
  }

  // Ramen: ramenLibrary = { version, items: [{ ramenId, wantToTry, tried, favorite, note, savedAt, updatedAt }] }
  const ramenLegacy = readJSON<{
    version?: number
    items?: Array<{
      ramenId: string
      wantToTry?: boolean
      tried?: boolean
      favorite?: boolean
      note?: string
      savedAt?: number
      updatedAt?: number
    }>
  }>(LEGACY_RAMEN_KEY)
  if (ramenLegacy && Array.isArray(ramenLegacy.items)) {
    for (const item of ramenLegacy.items) {
      if (!item || typeof item.ramenId !== 'string') continue
      out.push({
        world: 'ramen',
        id: item.ramenId,
        itemType: 'ramen',
        wantToTry: item.wantToTry,
        tried: item.tried,
        favorite: item.favorite,
        note: item.note,
        savedAt: item.savedAt ?? Date.now(),
        updatedAt: item.updatedAt,
      })
    }
  }

  // Cookies: letThemEatCookies.myCookies = { version, items: [{ cookieId, wantToTry, baked, favorite, note, savedAt, updatedAt }] }
  const cookiesLegacy = readJSON<{
    version?: number
    items?: Array<{
      cookieId: string
      wantToTry?: boolean
      baked?: boolean
      favorite?: boolean
      note?: string
      savedAt?: number
      updatedAt?: number
    }>
  }>(LEGACY_COOKIES_KEY)
  if (cookiesLegacy && Array.isArray(cookiesLegacy.items)) {
    for (const item of cookiesLegacy.items) {
      if (!item || typeof item.cookieId !== 'string') continue
      out.push({
        world: 'cookies',
        id: item.cookieId,
        itemType: 'cookie',
        wantToTry: item.wantToTry,
        tried: item.baked, // Cookies' "baked" maps onto the unified "tried" field
        favorite: item.favorite,
        note: item.note,
        savedAt: item.savedAt ?? Date.now(),
        updatedAt: item.updatedAt,
      })
    }
  }

  // Noodles: let-them-eat-noodles:my-noodles:v1 = [{ dishId, states: ('want-to-try'|'tried'|'favorite')[], note, savedAt(iso) }]
  const noodlesLegacy = readJSON<Array<{ dishId: string; states?: string[]; note?: string; savedAt?: string }>>(
    LEGACY_NOODLES_KEY,
  )
  if (Array.isArray(noodlesLegacy)) {
    for (const item of noodlesLegacy) {
      if (!item || typeof item.dishId !== 'string') continue
      const states = Array.isArray(item.states) ? item.states : []
      const savedAtMs = item.savedAt ? Date.parse(item.savedAt) : Date.now()
      out.push({
        world: 'noodles',
        id: item.dishId,
        itemType: 'dish',
        wantToTry: states.includes('want-to-try'),
        tried: states.includes('tried'),
        favorite: states.includes('favorite'),
        note: item.note,
        savedAt: Number.isFinite(savedAtMs) ? savedAtMs : Date.now(),
      })
    }
  }

  return out
}

function persist(items: SavedItemRecord[]) {
  cache = items
  byWorldCache = {}
  if (hasWindow()) {
    const payload: SavedItemsPayload = { version: CURRENT_VERSION, items }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }
  listeners.forEach((listener) => listener())
}

function migrateLegacyData(existing: SavedItemRecord[]): SavedItemRecord[] {
  if (!hasWindow()) return existing
  if (window.localStorage.getItem(MIGRATION_MARKER_KEY)) return existing

  const legacy = readLegacyRecords()
  const existingKeys = new Set(existing.map((r) => recordKey(r.world, r.id)))
  const merged = [...existing]
  for (const record of legacy) {
    if (!existingKeys.has(recordKey(record.world, record.id))) {
      merged.push(record)
      existingKeys.add(recordKey(record.world, record.id))
    }
  }

  window.localStorage.setItem(MIGRATION_MARKER_KEY, String(Date.now()))
  if (merged.length !== existing.length) {
    const payload: SavedItemsPayload = { version: CURRENT_VERSION, items: merged }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }
  return merged
}

let cache: SavedItemRecord[] = migrateLegacyData(loadCurrent())

// useSyncExternalStore requires getSnapshot to return a referentially stable value when nothing
// changed -- `cache.filter()` allocated a new array on every call regardless, so any component
// reading it via useSyncExternalStore saw a "new" snapshot on every render and re-rendered
// forever (React error #185). Cached here per world, invalidated only when persist() actually
// replaces `cache`.
let byWorldCache: Partial<Record<World, SavedItemRecord[]>> = {}

const listeners = new Set<() => void>()

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getAll(): SavedItemRecord[] {
  return cache
}

export function getByWorld(world: World): SavedItemRecord[] {
  return (byWorldCache[world] ??= cache.filter((r) => r.world === world))
}

export function getRecord(world: World, id: string): SavedItemRecord | undefined {
  return cache.find((r) => r.world === world && r.id === id)
}

type MutablePatch = Partial<Pick<SavedItemRecord, 'saved' | 'wantToTry' | 'tried' | 'favorite' | 'note' | 'itemType'>>

function hasAnyState(record: SavedItemRecord): boolean {
  return Boolean(record.saved || record.wantToTry || record.tried || record.favorite || record.note)
}

function upsert(world: World, id: string, patch: MutablePatch): SavedItemRecord {
  const now = Date.now()
  const existing = getRecord(world, id)
  const record: SavedItemRecord = existing
    ? { ...existing, ...patch, updatedAt: now }
    : { world, id, savedAt: now, updatedAt: now, ...patch }

  const items = hasAnyState(record)
    ? existing
      ? cache.map((r) => (r.world === world && r.id === id ? record : r))
      : [...cache, record]
    : cache.filter((r) => !(r.world === world && r.id === id))

  persist(items)
  return record
}

export function toggleSaved(world: World, id: string, itemType?: string): boolean {
  const next = !getRecord(world, id)?.saved
  upsert(world, id, { saved: next, itemType })
  return next
}

export function toggleWantToTry(world: World, id: string): boolean {
  const next = !getRecord(world, id)?.wantToTry
  upsert(world, id, { wantToTry: next })
  return next
}

export function toggleTried(world: World, id: string): boolean {
  const next = !getRecord(world, id)?.tried
  upsert(world, id, { tried: next })
  return next
}

export function toggleFavorite(world: World, id: string): boolean {
  const next = !getRecord(world, id)?.favorite
  upsert(world, id, { favorite: next })
  return next
}

export function setNote(world: World, id: string, note: string): void {
  upsert(world, id, { note: note.trim() ? note : undefined })
}

export function isSaved(world: World, id: string): boolean {
  return Boolean(getRecord(world, id)?.saved)
}
