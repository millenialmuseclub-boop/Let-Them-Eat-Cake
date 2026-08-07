import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cakes, collections } from '../lib/data'
import { getRegionEntriesForCake, getDecadeForCake } from '../lib/encyclopedia'
import { CakeHeroImage } from '../components/CakeHeroImage'
import './CakeEncyclopediaIndexPage.css'

const FEATURED_COLLECTION_IDS = ['chocolate-classics', 'coconut-tropical', 'cozy-sunday', 'celebration-worthy']

function getLocationTag(cakeId: string): string | null {
  const region = getRegionEntriesForCake(cakeId)[0]
  if (region) return region.country
  const decade = getDecadeForCake(cakeId)
  if (decade) return decade.decadeLabel
  return null
}

export function CakeEncyclopediaIndexPage() {
  const [query, setQuery] = useState('')
  const featuredCollections = FEATURED_COLLECTION_IDS.map((id) => collections.find((c) => c.id === id)).filter((c) => c !== undefined)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cakes
    return cakes.filter(
      (cake) =>
        cake.name.toLowerCase().includes(q) ||
        cake.flavorNotes.some((note) => note.toLowerCase().includes(q)) ||
        cake.texture.toLowerCase().includes(q) ||
        (getLocationTag(cake.id)?.toLowerCase().includes(q) ?? false),
    )
  }, [query])

  return (
    <main className="page encyclopedia-index-page">
      <h1>Cake Encyclopedia</h1>
      <p>Browse the full archive — search by name, flavor, texture, or origin.</p>

      <section className="encyclopedia-collections-row">
        <div className="encyclopedia-collections-header">
          <h2>✨ Curated Collections</h2>
          <Link to="/collections" className="encyclopedia-link">
            See all →
          </Link>
        </div>
        <div className="encyclopedia-collections-grid">
          {featuredCollections.map((collection) => (
            <Link key={collection.id} to={`/collections/${collection.id}`} className="card encyclopedia-collection-card">
              <span aria-hidden="true">{collection.icon}</span> {collection.title}
            </Link>
          ))}
        </div>
      </section>

      <div className="encyclopedia-secondary-links">
        <Link to="/ingredients" className="encyclopedia-link">
          🧂 Browse by Ingredient →
        </Link>
        <Link to="/traditions" className="encyclopedia-link">
          🌍 Baking Traditions →
        </Link>
      </div>

      <div className="encyclopedia-search">
        <input type="text" placeholder="Search cakes (e.g. chocolate, dense, Japan)" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 && <p className="encyclopedia-empty">No cakes match "{query}".</p>}

      <div className="encyclopedia-grid">
        {filtered.map((cake) => {
          const locationTag = getLocationTag(cake.id)
          return (
            <Link key={cake.id} to={`/cake/${cake.id}`} className="card encyclopedia-card">
              <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
              <div className="encyclopedia-card-tags">
                {locationTag && <span className="tag">{locationTag}</span>}
                <span className="tag encyclopedia-texture-tag">{cake.texture}</span>
              </div>
              <h3>{cake.name}</h3>
              <p>{cake.description}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
