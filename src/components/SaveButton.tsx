import { useState } from 'react'
import type { SavedItemType } from '../types/notebook'
import { isSaved, toggleSaved } from '../lib/notebook'
import './SaveButton.css'

export function SaveButton({ type, id }: { type: SavedItemType; id: string }) {
  const [saved, setSaved] = useState(() => isSaved(type, id))

  function handleClick() {
    setSaved(toggleSaved(type, id))
  }

  return (
    <button className={saved ? 'btn btn-secondary save-button saved' : 'btn btn-secondary save-button'} onClick={handleClick}>
      {saved ? '✓ Saved to Notebook' : '🔖 Save to Notebook'}
    </button>
  )
}
