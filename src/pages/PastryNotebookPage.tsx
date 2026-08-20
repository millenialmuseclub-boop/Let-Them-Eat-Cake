import { Link } from 'react-router-dom'
import { getCake, getCakePersonality } from '../lib/data'
import { getSavedCakeIds, getSavedPersonalityIds } from '../lib/notebook'
import { CakeThumbnail } from '../components/CakeThumbnail'
import './PastryNotebookPage.css'

export function PastryNotebookPage() {
  const savedCakes = getSavedCakeIds()
    .map((id) => getCake(id))
    .filter((cake): cake is NonNullable<typeof cake> => Boolean(cake))

  const savedPersonalities = getSavedPersonalityIds()
    .map((id) => getCakePersonality(id))
    .filter((personality): personality is NonNullable<typeof personality> => Boolean(personality))

  const isEmpty = savedCakes.length === 0 && savedPersonalities.length === 0

  return (
    <main className="page notebook-page">
      <h1>Pastry Notebook</h1>
      <p>Your saved cakes and cake personalities, all in one place — stored right in your browser.</p>

      {isEmpty && (
        <p className="notebook-empty">
          Your notebook is empty — save a cake from its encyclopedia entry, or a cake personality from your quiz result, to see them
          here.
        </p>
      )}

      {savedCakes.length > 0 && (
        <>
          <h2 className="notebook-section-heading">🍰 Saved Cakes</h2>
          <div className="notebook-grid">
            {savedCakes.map((cake) => (
              <Link key={cake.id} to={`/cake/${cake.id}`} className="card notebook-card">
                <CakeThumbnail cakeId={cake.id} alt={cake.name} />
                <span className="tag notebook-texture-tag">{cake.texture}</span>
                <h3>{cake.name}</h3>
                <p>{cake.description}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      {savedPersonalities.length > 0 && (
        <>
          <h2 className="notebook-section-heading">🎭 Saved Personalities</h2>
          <div className="notebook-grid">
            {savedPersonalities.map((personality) => (
              <Link
                key={personality.id}
                to={`/persona-match?personality=${personality.id}`}
                className="card notebook-card"
                style={{ borderTopColor: personality.colorHex, borderTopWidth: 4 }}
              >
                <h3>{personality.name}</h3>
                <p className="notebook-personality-title">{personality.personalityTitle}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
