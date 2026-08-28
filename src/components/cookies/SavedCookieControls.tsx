import { useCookieLibraryRecord } from '../../lib/cookies/useCookieLibrary'

export function SavedCookieControls({ cookieId }: { cookieId: string }) {
  const { wantToTry, baked, favorite, toggleWantToTry, toggleBaked, toggleFavorite } = useCookieLibraryRecord(cookieId)
  return (
    <div className="saved-cookie-controls" role="group" aria-label="Save this cookie">
      <button type="button" className="cookie-state-badge" aria-pressed={wantToTry} onClick={toggleWantToTry}>
        <span aria-hidden="true">{wantToTry ? '✓ ' : ''}</span>Want to Try
      </button>
      <button type="button" className="cookie-state-badge" aria-pressed={baked} onClick={toggleBaked}>
        <span aria-hidden="true">{baked ? '✓ ' : ''}</span>Baked / Tried
      </button>
      <button type="button" className="cookie-state-badge cookie-state-badge-favorite" aria-pressed={favorite} onClick={toggleFavorite}>
        <span aria-hidden="true">{favorite ? '★ ' : '☆ '}</span>Favorite
      </button>
    </div>
  )
}
