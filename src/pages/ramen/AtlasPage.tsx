import { useState } from 'react'
import { Link } from 'react-router-dom'
import { regions, traditions, shops, getRamen } from '../../lib/ramen/data'
import { getEntryForCity, getAllCities } from '../../lib/ramen/atlas'
import { AtlasMap } from '../../components/ramen/AtlasMap'
import { RamenHeroImage } from '../../components/ramen/RamenHeroImage'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { RamenStateBadges } from '../../components/ramen/RamenStateBadges'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './AtlasPage.css'

// Adapted from Cake's AtlasPage (CAKE_REFERENCE_AUDIT.md §5): map + search,
// selecting an entry shows its canonical Encyclopedia record inline with a
// link through to the full detail page -- the Atlas rule from master spec §9
// (select from Atlas → canonical Encyclopedia entry, never a separate Atlas
// article) applies exactly as it does in Cake. City chips stand in for
// Cake's country datalist search, since Ramen's Phase 1 anchors are cities
// within Japan, not countries (master spec §9). Browse by Origin and Ramen
// Shops to Know (master pass §3/§4) both reuse the same regions.json /
// traditions.json data the map already runs on -- no separate geography.
export function AtlasPage() {
  const cities = getAllCities()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  useDocumentTitle(selectedCity ? `${selectedCity} — Ramen Atlas | Let Them Eat Ramen` : 'Ramen Atlas | Let Them Eat Ramen')

  const selectedEntry = selectedCity ? getEntryForCity(selectedCity) : null
  const selectedRamen = selectedEntry ? getRamen(selectedEntry.ramenId) : null

  return (
    <main className="page atlas-page">
      <h1>Ramen Atlas</h1>
      <p>Discover the regions and cities that define ramen — tap a pin, or a city below, for its signature style and story.</p>

      <AtlasMap entries={regions} selectedCity={selectedCity} onSelectCity={setSelectedCity} />

      <div className="atlas-city-list" role="group" aria-label="Browse by city">
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            className={selectedCity === city ? 'atlas-city-chip active' : 'atlas-city-chip'}
            onClick={() => setSelectedCity(city)}
            aria-pressed={selectedCity === city}
          >
            {city}
          </button>
        ))}
      </div>

      {selectedEntry && selectedRamen && (
        <section className="atlas-result card">
          <RamenHeroImage ramenId={selectedRamen.id} variant="hero" alt={selectedRamen.name} />
          <span className="tag">{selectedEntry.cityMicroRegion}</span>
          <RamenStateBadges ramenId={selectedRamen.id} />
          <h2>{selectedRamen.name}</h2>
          <p>{selectedEntry.shortDescription}</p>
          <p className="holding-page-note">{selectedEntry.historyNote}</p>
          <Link to={`/ramen/ramen/${selectedRamen.id}`} className="encyclopedia-link">
            View full encyclopedia entry →
          </Link>
        </section>
      )}

      <section className="atlas-row">
        <h2>🗂️ Browse by Origin</h2>
        <p className="atlas-row-note">Understand ramen geography without touching the map -- region, then city, then the bowl it defines.</p>
        <div className="atlas-origin-grid">
          {traditions.map((t) => {
            // Group each region's ramen by their actual city, read straight from regions.json --
            // reusing the real relationship rather than matching traditions.json's own city
            // labels (which are for editorial display, not guaranteed to match string-for-string).
            const byCity = new Map<string, string[]>()
            for (const id of t.ramenIds) {
              const city = regions.find((r) => r.ramenId === id)?.cityMicroRegion ?? 'Elsewhere in the region'
              byCity.set(city, [...(byCity.get(city) ?? []), id])
            }
            return (
              <div key={t.id} className="card atlas-origin-region-card">
                <h3>{t.region}</h3>
                {[...byCity.entries()].map(([city, ids]) => (
                  <div key={city} className="atlas-origin-city">
                    <span className="atlas-origin-city-name">{city}</span>
                    <div className="atlas-origin-ramen-list">
                      {ids.map((id) => {
                        const item = getRamen(id)
                        return (
                          item && (
                            <Link key={id} to={`/ramen/ramen/${id}`} className="atlas-origin-ramen-link">
                              {item.name}
                            </Link>
                          )
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </section>

      <section className="atlas-row">
        <h2>🏮 Ramen Shops to Know</h2>
        <p className="atlas-row-note">
          A small, accuracy-first set of historically significant shops -- not a directory, not reviews. See <Link to="/ramen/about">About &amp; Legal</Link> for sourcing notes.
        </p>
        <div className="atlas-shops-grid">
          {shops.map((shop) => (
            <div key={shop.id} className="card atlas-shop-card">
              <RamenThumbnail ramenId={shop.relatedRamenIds[0]} alt={`${shop.specialty}, the style ${shop.name} is known for`} />
              <span className="tag">{shop.city}</span>
              <h3>{shop.name}</h3>
              <p className="atlas-shop-specialty">{shop.specialty}</p>
              <p>{shop.editorialNote}</p>
              <div className="atlas-shop-links">
                <a href={shop.mapLink} target="_blank" rel="noreferrer" className="encyclopedia-link">
                  View on map →
                </a>
                {shop.officialWebsite && (
                  <a href={shop.officialWebsite} target="_blank" rel="noreferrer" className="encyclopedia-link">
                    Official site →
                  </a>
                )}
              </div>
              {shop.relatedRamenIds.map((id) => {
                const item = getRamen(id)
                return (
                  item && (
                    <Link key={id} to={`/ramen/ramen/${id}`} className="atlas-shop-related-ramen">
                      {item.name} →
                    </Link>
                  )
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
