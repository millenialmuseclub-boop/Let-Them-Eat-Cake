// Native replacement for the web's src/lib/notebook.ts, which wraps
// localStorage directly. Same key name (`pastryNotebookItems`), same JSON
// shape, same function signatures — so the exact same "Saved Cakes" /
// Pastry Notebook semantics carry over with zero behavior change, just a
// different storage backend (AsyncStorage instead of localStorage).
//
// AsyncStorage is async by nature (unlike localStorage), so every call here
// returns a Promise — the one real API difference callers must account for.

import AsyncStorage from '@react-native-async-storage/async-storage'
import type { SavedItem, SavedItemType } from '../shared/types/notebook'

const NOTEBOOK_KEY = 'pastryNotebookItems'

export async function getSavedItems(): Promise<SavedItem[]> {
  try {
    const raw = await AsyncStorage.getItem(NOTEBOOK_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function isSaved(type: SavedItemType, id: string): Promise<boolean> {
  const items = await getSavedItems()
  return items.some((item) => item.type === type && item.id === id)
}

/** Toggles the saved state for an item and returns the new state (true if now saved). */
export async function toggleSaved(type: SavedItemType, id: string): Promise<boolean> {
  const items = await getSavedItems()
  const exists = items.some((item) => item.type === type && item.id === id)
  const next = exists
    ? items.filter((item) => !(item.type === type && item.id === id))
    : [...items, { type, id, savedAt: Date.now() }]
  await AsyncStorage.setItem(NOTEBOOK_KEY, JSON.stringify(next))
  return !exists
}

export async function getSavedCakeIds(): Promise<string[]> {
  const items = await getSavedItems()
  return items.filter((item) => item.type === 'cake').map((item) => item.id)
}

export async function getSavedPersonalityIds(): Promise<string[]> {
  const items = await getSavedItems()
  return items.filter((item) => item.type === 'personality').map((item) => item.id)
}
