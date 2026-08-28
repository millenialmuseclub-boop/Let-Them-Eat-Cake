// Same API surface as Noodles' original lib/useMyNoodles.ts (states[]-array model), so ported
// Noodles pages need no logic changes -- but backed by the unified cross-world store
// (lib/savedItems.ts, world: 'noodles') instead of Noodles' own
// 'let-them-eat-noodles:my-noodles:v1' localStorage key. That legacy key is imported
// non-destructively on first load and left untouched on disk.
import { useSyncExternalStore } from 'react'
import * as savedItems from '../savedItems'
import type { MyNoodlesEntry, MyNoodlesState } from '../../types/noodles/myNoodles'

function toEntry(dishId: string): MyNoodlesEntry | undefined {
  const r = savedItems.getRecord('noodles', dishId)
  if (!r) return undefined
  const states: MyNoodlesState[] = []
  if (r.wantToTry) states.push('want-to-try')
  if (r.tried) states.push('tried')
  if (r.favorite) states.push('favorite')
  if (states.length === 0 && !r.note) return undefined
  return { dishId, states, note: r.note, savedAt: new Date(r.savedAt).toISOString() }
}

function getSnapshot(): MyNoodlesEntry[] {
  return savedItems
    .getByWorld('noodles')
    .map((r) => toEntry(r.id))
    .filter((e): e is MyNoodlesEntry => Boolean(e))
}

function getServerSnapshot() {
  return [] as MyNoodlesEntry[]
}

export function toggleState(dishId: string, state: MyNoodlesState) {
  if (state === 'want-to-try') savedItems.toggleWantToTry('noodles', dishId)
  else if (state === 'tried') savedItems.toggleTried('noodles', dishId)
  else savedItems.toggleFavorite('noodles', dishId)
}

export function setNote(dishId: string, note: string) {
  savedItems.setNote('noodles', dishId, note)
}

export function useMyNoodles() {
  return useSyncExternalStore(savedItems.subscribe, getSnapshot, getServerSnapshot)
}

export function useMyNoodlesEntry(dishId: string): MyNoodlesEntry | undefined {
  const entries = useMyNoodles()
  return entries.find((e) => e.dishId === dishId)
}
