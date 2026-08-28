import { Link } from 'react-router-dom'
import { ramen } from '../../lib/ramen/data'
import { useRamenLibrary } from '../../lib/ramen/useRamenLibrary'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './MyRamenPage.css'

// Private, local-only library (master spec §24) -- organized by state rather than one flat list,
// since a ramen can be Tried and a Favorite at the same time (states are independent, not
// mutually exclusive). Reads live via useRamenLibrary, so toggling a state on the Encyclopedia
// detail page and coming straight back here always reflects the current, correct state.
export function MyRamenPage() {
  useDocumentTitle('My Ramen | Let Them Eat')

  const library = useRamenLibrary()

  const favorites = library.filter((r) => r.favorite)
  const tried = library.filter((r) => r.tried)
  const wantToTry = library.filter((r) => r.wantToTry)

  function ramenFor(id: string) {
    return ramen.find((r) => r.id === id)
  }

  return (
    <main className="page my-ramen-page">
      <h1>My Ramen</h1>
      <p>Your private ramen library — Want to Try, Tried, and Favorites, all stored on this device. Nothing here is sent anywhere.</p>

      <section className="my-ramen-section">
        <h2>★ Favorites</h2>
        {favorites.length === 0 ? (
          <p className="my-ramen-empty">
            No favorites yet. Mark a bowl as a favorite from its <Link to="/ramen/encyclopedia">Encyclopedia entry</Link>.
          </p>
        ) : (
          <div className="my-ramen-grid">
            {favorites.map((r) => {
              const item = ramenFor(r.ramenId)
              return item && <MyRamenCard key={r.ramenId} ramenId={item.id} name={item.name} note={r.note} />
            })}
          </div>
        )}
      </section>

      <section className="my-ramen-section">
        <h2>✓ Tried</h2>
        {tried.length === 0 ? (
          <p className="my-ramen-empty">
            Nothing marked as tried yet. Once you've had a bowl, mark it tried and optionally leave yourself a note.
          </p>
        ) : (
          <div className="my-ramen-grid">
            {tried.map((r) => {
              const item = ramenFor(r.ramenId)
              return item && <MyRamenCard key={r.ramenId} ramenId={item.id} name={item.name} note={r.note} />
            })}
          </div>
        )}
      </section>

      <section className="my-ramen-section">
        <h2>♡ Want to Try</h2>
        {wantToTry.length === 0 ? (
          <p className="my-ramen-empty">
            Nothing on your list yet. Browse the <Link to="/ramen/encyclopedia">Encyclopedia</Link> or try <Link to="/ramen/sommelier/find">Sommelier FIND</Link> to find your next bowl.
          </p>
        ) : (
          <div className="my-ramen-grid">
            {wantToTry.map((r) => {
              const item = ramenFor(r.ramenId)
              return item && <MyRamenCard key={r.ramenId} ramenId={item.id} name={item.name} />
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function MyRamenCard({ ramenId, name, note }: { ramenId: string; name: string; note?: string }) {
  return (
    <Link to={`/ramen/ramen/${ramenId}`} className="card my-ramen-card">
      <RamenThumbnail ramenId={ramenId} alt={name} />
      <h3>{name}</h3>
      {note && <p className="my-ramen-note">"{note}"</p>}
    </Link>
  )
}
