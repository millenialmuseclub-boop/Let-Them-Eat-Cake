import { useSyncExternalStore } from 'react'
import { subscribe, getSnapshot, getRecord, toggleWantToTry, toggleBaked, toggleFavorite, setNote } from './myCookies'
import type { CookieLibraryRecord } from '../../types/cookies/myCookies'

export function useCookieLibrary(): CookieLibraryRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useCookieLibraryRecord(cookieId: string) {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const record = getRecord(cookieId)
  return {
    record,
    wantToTry: record?.wantToTry ?? false,
    baked: record?.baked ?? false,
    favorite: record?.favorite ?? false,
    note: record?.note ?? '',
    toggleWantToTry: () => toggleWantToTry(cookieId),
    toggleBaked: () => toggleBaked(cookieId),
    toggleFavorite: () => toggleFavorite(cookieId),
    setNote: (note: string) => setNote(cookieId, note),
  }
}
