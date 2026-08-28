import { Link, useParams } from 'react-router-dom'
import { getRamen, ramen } from '../../lib/ramen/data'
import { getRegionEntryForRamen } from '../../lib/ramen/atlas'
import { RamenHeroImage } from '../../components/ramen/RamenHeroImage'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { FlavorProfileBars } from '../../components/ramen/FlavorProfileBars'
import { SavedRamenControls } from '../../components/ramen/SavedRamenControls'
import { RamenStateBadges } from '../../components/ramen/RamenStateBadges'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './RamenDetailPage.css'

const VARIATION_LABEL: Record<string, string> = {
  traditional: 'Traditional',
  common: 'Common',
  modern: 'Modern variation',
}

// One reusable detail template for every canonical record (master spec §8),
// covering the core fields already defined there: origin story, broth/tare/
// aroma composition, noodle profile, toppings, flavor profile, and a
// traditional/common/modern distinction Cake has no equivalent field for
// (CAKE_REFERENCE_AUDIT.md §4). No Sommelier pairings section yet -- that
// engine doesn't exist until Phase 5.
export function RamenDetailPage() {
  const { id } = useParams<{ id: string }>()
  const item = id ? getRamen(id) : undefined

  useDocumentTitle(item ? `${item.name} — Ramen Encyclopedia | Let Them Eat` : 'Ramen Not Found | Let Them Eat')

  if (!item) {
    return (
      <main className="page ramen-detail-page">
        <h1>Ramen not found</h1>
        <p>
          We couldn't find that ramen. <Link to="/ramen/encyclopedia">Browse the full encyclopedia →</Link>
        </p>
      </main>
    )
  }

  const region = getRegionEntryForRamen(item.id)
  const related = ramen.filter((r) => r.id !== item.id).slice(0, 3)

  return (
    <main className="page ramen-detail-page">
      <div className="card ramen-detail-hero">
        <RamenHeroImage ramenId={item.id} variant="hero" alt={item.name} />
        <div className="ramen-detail-tags">
          {region && <span className="tag">{region.cityMicroRegion}</span>}
          <span className="tag">{VARIATION_LABEL[item.variationTag]}</span>
          <RamenStateBadges ramenId={item.id} />
        </div>
        <h1>
          {item.name}
          {item.romanization && <span className="ramen-detail-pronunciation"> ({item.romanization})</span>}
        </h1>
        <p>{item.description}</p>
        {item.japaneseName && <p className="holding-page-note">{item.japaneseName}</p>}
      </div>

      <section className="card ramen-detail-section">
        <h2>📚 My Ramen</h2>
        <SavedRamenControls key={item.id} ramenId={item.id} />
      </section>

      <section className="card ramen-detail-section">
        <h2>🕰️ Origin & Significance</h2>
        <p>
          <strong>Origin:</strong> {item.origin}
        </p>
        <p>{item.historicalContext}</p>
        <p>{item.culturalSignificance}</p>
        <p className="ramen-detail-variation-note">{item.variationNote}</p>
      </section>

      <section className="card ramen-detail-section">
        <h2>🍲 Composition</h2>
        <ul className="ramen-detail-facts">
          <li>
            <strong>Broth:</strong> {item.broth}
          </li>
          <li>
            <strong>Tare:</strong> {item.tare}
          </li>
          {item.aromaOil && (
            <li>
              <strong>Aroma oil:</strong> {item.aromaOil}
            </li>
          )}
          <li>
            <strong>Noodle style:</strong> {item.noodleStyle} — {item.noodleCharacteristics}
          </li>
          <li>
            <strong>Texture:</strong> {item.texture}
          </li>
        </ul>
      </section>

      <section className="card ramen-detail-section">
        <h2>🍥 Toppings & Protein</h2>
        <p>
          <strong>Traditional toppings:</strong> {item.traditionalToppings.join(', ')}
        </p>
        <p>
          <strong>Common protein:</strong> {item.commonProteins.join(', ')}
        </p>
      </section>

      <section className="card ramen-detail-section">
        <h2>👩‍🍳 Preparation Overview</h2>
        <p>{item.preparationOverview}</p>
      </section>

      <section className="card ramen-detail-section">
        <h2>📊 Flavor Profile</h2>
        <FlavorProfileBars profile={item.flavorProfile} />
      </section>

      {region && (
        <section className="ramen-detail-section">
          <h2>🗺️ On the Atlas</h2>
          <p>{region.historyNote}</p>
          <Link to="/ramen/atlas" className="encyclopedia-link">
            Explore the Ramen Atlas →
          </Link>
        </section>
      )}

      <section className="ramen-detail-section">
        <h2>🔗 More Ramen</h2>
        <div className="ramen-detail-related-grid">
          {related.map((r) => (
            <Link key={r.id} to={`/ramen/ramen/${r.id}`} className="card ramen-detail-related-card">
              <RamenThumbnail ramenId={r.id} alt={r.name} />
              <h3>{r.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
