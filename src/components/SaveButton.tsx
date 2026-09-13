import { useSyncExternalStore } from 'react'
import type { SavedItemType } from '../types/notebook'
import { isSaved, toggleSaved } from '../lib/notebook'
import { hapticToggle } from '../lib/haptics'
import { subscribe } from '../lib/savedItems'
import './SaveButton.css'

export function SaveButton({ type, id }: { type: SavedItemType; id: string }) {
  const saved = useSyncExternalStore(subscribe, () => isSaved(type, id), () => false)

  function handleClick() {
    toggleSaved(type, id)
    hapticToggle()
  }

  return (
    <button
      type="button"
      className={saved ? 'save-button saved' : 'save-button'}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
      title={saved ? 'Remove from favorites' : 'Save to favorites'}
    >
      {saved ? '♥' : '♡'}
    </button>
  )
}
