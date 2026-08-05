import type { SavedItem, SavedItemType } from '../types/notebook'

const NOTEBOOK_KEY = 'pastryNotebookItems'

export function getSavedItems(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || '[]')
  } catch {
    return []
  }
}

export function isSaved(type: SavedItemType, id: string): boolean {
  return getSavedItems().some((item) => item.type === type && item.id === id)
}

/** Toggles the saved state for an item and returns the new state (true if now saved). */
export function toggleSaved(type: SavedItemType, id: string): boolean {
  const items = getSavedItems()
  const exists = items.some((item) => item.type === type && item.id === id)
  const next = exists
    ? items.filter((item) => !(item.type === type && item.id === id))
    : [...items, { type, id, savedAt: Date.now() }]
  localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(next))
  return !exists
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
