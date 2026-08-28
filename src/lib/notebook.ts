// Cake's original saved-items API, now a thin compatibility shim over the unified cross-world
// store in lib/savedItems.ts (world: 'cake'). Kept with the exact same exported signatures so
// existing callers (SaveButton, PastryNotebookPage) don't need to change, and so any existing
// user's `pastryNotebookItems` data keeps working -- it's migrated into the unified store
// on first load (see lib/savedItems.ts migrateLegacyData) and the original key is left untouched.
import type { SavedItem, SavedItemType } from '../types/notebook'
import { getByWorld, isSaved as isSavedUnified, toggleSaved as toggleSavedUnified } from './savedItems'

export function getSavedItems(): SavedItem[] {
  return getByWorld('cake')
    .filter((record) => record.saved)
    .map((record) => ({
      type: (record.itemType ?? 'cake') as SavedItemType,
      id: record.id,
      savedAt: record.savedAt,
    }))
}

export function isSaved(type: SavedItemType, id: string): boolean {
  const record = getByWorld('cake').find((r) => r.id === id && r.saved)
  return Boolean(record && (record.itemType ?? 'cake') === type)
}

/** Toggles the saved state for an item and returns the new state (true if now saved). */
export function toggleSaved(type: SavedItemType, id: string): boolean {
  return toggleSavedUnified('cake', id, type)
}

export function getSavedCakeIds(): string[] {
  return getSavedItems()
    .filter((item) => item.type === 'cake')
    .map((item) => item.id)
}

export function getSavedPersonalityIds(): string[] {
  return getSavedItems()
    .filter((item) => item.type === 'personality')
    .map((item) => item.id)
}

// Re-exported in case other code wants the raw unified check without the type filter.
export const isSavedAnyType = (id: string): boolean => isSavedUnified('cake', id)
