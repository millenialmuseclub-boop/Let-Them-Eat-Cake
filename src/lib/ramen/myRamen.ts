// Same API surface as Ramen's original lib/myRamen.ts, so ported Ramen pages need no logic
// changes -- but backed by the unified cross-world store (lib/savedItems.ts, world: 'ramen')
// instead of Ramen's own standalone 'ramenLibrary' localStorage key. That legacy key is imported
// non-destructively into the unified store on first load (see savedItems.ts migrateLegacyData)
// and left untouched on disk.
//
// NOTE: this file intentionally replaces the raw copy that scripts/port-world.mjs produces from
// Ramen's own lib/myRamen.ts (which reimplements a second, standalone localStorage store) --
// keep this adapter version, do not regenerate it from the sibling repo.
import * as savedItems from '../savedItems'
import type { RamenLibraryRecord } from '../../types/ramen/myRamen'

function toRecord(id: string): RamenLibraryRecord {
  const r = savedItems.getRecord('ramen', id)
  return {
    ramenId: id,
    wantToTry: Boolean(r?.wantToTry),
    tried: Boolean(r?.tried),
    favorite: Boolean(r?.favorite),
    note: r?.note,
    savedAt: r?.savedAt ?? Date.now(),
    updatedAt: r?.updatedAt ?? r?.savedAt ?? Date.now(),
  }
}

export function subscribe(listener: () => void): () => void {
  return savedItems.subscribe(listener)
}

export function getLibrary(): RamenLibraryRecord[] {
  return savedItems.getByWorld('ramen').map((r) => toRecord(r.id))
}

export function getRecord(ramenId: string): RamenLibraryRecord | undefined {
  const r = savedItems.getRecord('ramen', ramenId)
  return r ? toRecord(ramenId) : undefined
}

export function toggleWantToTry(ramenId: string): RamenLibraryRecord {
  savedItems.toggleWantToTry('ramen', ramenId)
  return toRecord(ramenId)
}

export function toggleTried(ramenId: string): RamenLibraryRecord {
  savedItems.toggleTried('ramen', ramenId)
  return toRecord(ramenId)
}

export function toggleFavorite(ramenId: string): RamenLibraryRecord {
  savedItems.toggleFavorite('ramen', ramenId)
  return toRecord(ramenId)
}

export function setNote(ramenId: string, note: string): RamenLibraryRecord {
  savedItems.setNote('ramen', ramenId, note)
  return toRecord(ramenId)
}
