import { useSyncExternalStore } from 'react'
import { subscribe, getRecord, getLibrary } from './myRamen'

/** Live-updating read of one ramen's saved state -- re-renders automatically whenever any
    component anywhere calls toggleWantToTry/toggleTried/toggleFavorite/setNote for this id. */
export function useRamenLibraryRecord(ramenId: string) {
  return useSyncExternalStore(subscribe, () => getRecord(ramenId))
}

/** Live-updating read of the whole library, for My Ramen / My Atlas. */
export function useRamenLibrary() {
  return useSyncExternalStore(subscribe, getLibrary)
}
