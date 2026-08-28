import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ramen, traditions, getRamen } from '../../lib/ramen/data'
import { getRegionEntryForRamen } from '../../lib/ramen/atlas'
import { getRamenOfTheDay } from '../../lib/ramen/discovery'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { RamenCard } from '../../components/ramen/RamenCard'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './RamenEncyclopediaIndexPage.css'

// Carries the rich discovery experience per the corrected master spec §8: Ramen of the Day +
// full browse/search, matching where Cake's own equivalent content actually lives
// (CAKE_REFERENCE_AUDIT.md §4). A-Z browse and Traditions by Region (master pass §1) both reuse
// the same canonical ramen/RamenCard -- no duplicate records, just two more ways into them.
//
// "Stop the endless scroll" (UI Refinement + Native App Setup pass): unfiltered A-Z shows a
// bounded preview with "View All 25" rather than always rendering the full catalog, and
// Traditions collapses into per-region accordions instead of eight full card grids stacked one
// after another -- the same content, reachable intentionally rather than dumped in one scroll.

const LETTERS = Array.from(new Set(ramen.map((r) => r.name[0].toUpperCase()))).sort()
const AZ_PREVIEW_COUNT = 8

export function RamenEncyclopediaIndexPage() {
  useDocumentTitle('Ramen Encyclopedia — Origins, Broths & Flavors | Let Them Eat Ramen')

  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState<string | null>(null)
  const [showAllAz, setShowAllAz] = useState(false)
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null)
  const ramenOfTheDay = getRamenOfTheDay()
  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!q) return ramen
    return ramen.filter((item) => {
      const region = getRegionEntryForRamen(item.id)
      return (
        item.name.toLowerCase().includes(q) ||
        item.broth.toLowerCase().includes(q) ||
        item.tare.toLowerCase().includes(q) ||
        item.noodleStyle.toLowerCase().includes(q) ||
        (region?.cityMicroRegion.toLowerCase().includes(q) ?? false)
      )
    })
  }, [q])

  const azFiltered = letter ? ramen.filter((r) => r.name[0].toUpperCase() === letter) : ramen
  const azVisible = letter || showAllAz ? azFiltered : azFiltered.slice(0, AZ_PREVIEW_COUNT)

  function chooseLetter(l: string | null) {
    setLetter(l)
    setShowAllAz(false)
  }

  return (
    <main className="page encyclopedia-index-page">
      <h1>Ramen Encyclopedia</h1>
      <p>Explore ramen origins, broths, noodles, and regional traditions from across Japan.</p>

      <div className="encyclopedia-search">
        <input
          type="text"
          placeholder="Search ramen (e.g. miso, tonkotsu, Hokkaido)"
          aria-label="Search ramen"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {q ? (
        <>
          {filtered.length === 0 && <p className="encyclopedia-empty">No ramen match "{query}".</p>}
          <div className="encyclopedia-grid">
            {filtered.map((item) => (
              <RamenCard key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <>
          <section className="encyclopedia-row">
            <h2>🍜 Ramen of the Day</h2>
            <Link to={`/ramen/ramen/${ramenOfTheDay.id}`} className="card encyclopedia-cake-of-day">
              <RamenThumbnail ramenId={ramenOfTheDay.id} variant="hero" alt={ramenOfTheDay.name} />
              <h3>{ramenOfTheDay.name}</h3>
              <p>{ramenOfTheDay.description}</p>
            </Link>
          </section>

          <section className="encyclopedia-row">
            <h2>🔤 Browse A–Z</h2>
            <div className="encyclopedia-az-row" role="group" aria-label="Filter by first letter">
              <button className={letter === null ? 'encyclopedia-az-chip active' : 'encyclopedia-az-chip'} onClick={() => chooseLetter(null)} aria-pressed={letter === null}>
                All
              </button>
              {LETTERS.map((l) => (
                <button key={l} className={letter === l ? 'encyclopedia-az-chip active' : 'encyclopedia-az-chip'} onClick={() => chooseLetter(l)} aria-pressed={letter === l}>
                  {l}
                </button>
              ))}
            </div>
            <div className="encyclopedia-grid">
              {azVisible.map((item) => (
                <RamenCard key={item.id} item={item} />
              ))}
            </div>
            {!letter && !showAllAz && azFiltered.length > AZ_PREVIEW_COUNT && (
              <button className="btn btn-secondary encyclopedia-view-all" onClick={() => setShowAllAz(true)}>
                View All {azFiltered.length} →
              </button>
            )}
          </section>

          <section className="encyclopedia-row">
            <h2>🗾 Ramen Traditions by Region</h2>
            <p className="encyclopedia-traditions-note">Common tendencies, not universal rules -- every region has real exceptions. Tap a region to explore it.</p>
            <div className="encyclopedia-traditions-accordion">
              {traditions.map((t) => {
                const isOpen = expandedRegion === t.id
                return (
                  <div key={t.id} className="card encyclopedia-tradition-card">
                    <button className="encyclopedia-tradition-toggle" onClick={() => setExpandedRegion(isOpen ? null : t.id)}>
                      <h3>{t.region}</h3>
                      <span className="encyclopedia-tradition-meta">
                        {t.ramenIds.length} {t.ramenIds.length === 1 ? 'bowl' : 'bowls'} · {isOpen ? 'Hide' : 'Show'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="encyclopedia-tradition-body">
                        <p>{t.introduction}</p>
                        <ul className="encyclopedia-tradition-tendencies">
                          {t.definingTendencies.map((tendency, i) => (
                            <li key={i}>{tendency}</li>
                          ))}
                        </ul>
                        <p className="encyclopedia-tradition-cities">
                          <strong>Cities:</strong> {t.cities.join(', ')}
                        </p>
                        <div className="encyclopedia-grid">
                          {t.ramenIds.map((id) => {
                            const item = getRamen(id)
                            return item && <RamenCard key={id} item={item} />
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
