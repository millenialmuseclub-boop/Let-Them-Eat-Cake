import { useState } from 'react'
import { toggleWantToTry, toggleTried, toggleFavorite, setNote } from '../../lib/ramen/myRamen'
import { useRamenLibraryRecord } from '../../lib/ramen/useRamenLibrary'
import './SavedRamenControls.css'

/** The three tri-state actions (master spec §24) -- Encyclopedia detail is the primary place
    these are set. States are independent booleans, so any combination coexists (Favorite doesn't
    replace Tried/Want to Try). Render with `key={ramenId}` from the parent so switching between
    ramen detail pages resets the note draft instead of carrying over stale text. */
export function SavedRamenControls({ ramenId }: { ramenId: string }) {
  const record = useRamenLibraryRecord(ramenId)
  const [noteDraft, setNoteDraft] = useState(record?.note ?? '')
  const [justSaved, setJustSaved] = useState(false)

  function handleSaveNote() {
    setNote(ramenId, noteDraft)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1500)
  }

  return (
    <div className="saved-ramen-controls">
      <div className="saved-ramen-buttons">
        <button type="button" className={record?.wantToTry ? 'saved-ramen-btn active' : 'saved-ramen-btn'} onClick={() => toggleWantToTry(ramenId)} aria-pressed={!!record?.wantToTry}>
          ♡ Want to Try
        </button>
        <button type="button" className={record?.tried ? 'saved-ramen-btn active' : 'saved-ramen-btn'} onClick={() => toggleTried(ramenId)} aria-pressed={!!record?.tried}>
          ✓ Tried
        </button>
        <button type="button" className={record?.favorite ? 'saved-ramen-btn active' : 'saved-ramen-btn'} onClick={() => toggleFavorite(ramenId)} aria-pressed={!!record?.favorite}>
          ★ Favorite
        </button>
      </div>

      {record?.tried && (
        <div className="saved-ramen-note">
          <label htmlFor={`note-${ramenId}`}>Private note</label>
          <textarea id={`note-${ramenId}`} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="What did you think?" rows={3} />
          <button type="button" className="btn btn-secondary" onClick={handleSaveNote}>
            {justSaved ? 'Saved ✓' : 'Save Note'}
          </button>
        </div>
      )}
    </div>
  )
}
