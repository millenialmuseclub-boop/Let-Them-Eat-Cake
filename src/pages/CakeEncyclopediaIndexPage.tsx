import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { cakes, bakingTraditions } from '../lib/data'
import { getRegionEntriesForCake, getDecadeForCake, distinctOrigins } from '../lib/encyclopedia'
import { getTraditionCakes } from '../lib/bakingTraditions'
import { getCakeOfTheDay } from '../lib/discovery'
import { getFirstPhotographedCakeId } from '../lib/images'
import { CakeThumbnail } from '../components/CakeThumbnail'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import type { MoodTag } from '../types/persona'
import './CakeEncyclopediaIndexPage.css'

function getLocationTag(cakeId: string): string | null {
  const region = getRegionEntriesForCake(cakeId)[0]
  if (region) return region.country
  const decade = getDecadeForCake(cakeId)
  if (decade) return decade.decadeLabel
  return null
}

const ORIGINS = distinctOrigins()
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function cakeCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'cake' : 'cakes'}`
}

function CakeCard({ cake }: { cake: (typeof cakes)[number] }) {
  const locationTag = getLocationTag(cake.id)
  return (
    <Link to={`/cake/${cake.id}`} className="card encyclopedia-card">
      <CakeThumbnail cakeId={cake.id} alt={cake.name} />
      <div className="encyclopedia-card-tags">
        {locationTag && <span className="tag">{locationTag}</span>}
        <span className="tag encyclopedia-texture-tag">{cake.texture}</span>
      </div>
      <h3>{cake.name}</h3>
      <p>{cake.description}</p>
    </Link>
  )
}

export function CakeEncyclopediaIndexPage() {
  const [searchParams] = useSearchParams()
  const moodParam = searchParams.get('mood')

  const [query, setQuery] = useState('')
  const [activeChip, setActiveChip] = useState<{ type: 'origin' | 'mood'; value: string } | null>(
    moodParam ? { type: 'mood', value: moodParam } : null,
  )
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const cakeOfTheDay = getCakeOfTheDay()

  const q = query.trim().toLowerCase()
  const isBrowsing = q.length > 0 || activeChip !== null

  const filtered = useMemo(() => {
    let result = cakes
    if (activeChip?.type === 'origin') result = result.filter((c) => getRegionEntriesForCake(c.id).some((r) => r.region === activeChip.value))
    if (activeChip?.type === 'mood') result = result.filter((c) => c.personaTags?.moods?.includes(activeChip.value as MoodTag))
    if (q) {
      result = result.filter(
        (cake) =>
          cake.name.toLowerCase().includes(q) ||
          cake.flavorNotes.some((note) => note.toLowerCase().includes(q)) ||
          cake.texture.toLowerCase().includes(q) ||
          (getLocationTag(cake.id)?.toLowerCase().includes(q) ?? false),
      )
    }
    return result
  }, [q, activeChip])

  function selectChip(type: 'origin', value: string) {
    setActiveChip((prev) => (prev?.type === type && prev.value === value ? null : { type, value }))
  }

  const originGroups = useMemo(
    () =>
      ORIGINS.map((region) => {
        const regionCakes = cakes.filter((c) => getRegionEntriesForCake(c.id).some((r) => r.region === region))
        return { region, count: regionCakes.length, repCakeId: getFirstPhotographedCakeId(regionCakes.map((c) => c.id)) ?? regionCakes[0]?.id }
      }),
    [],
  )

  const lettersWithCakes = useMemo(() => new Set(cakes.map((c) => c.name[0]?.toUpperCase())), [])
  const letterCakes = useMemo(
    () => (selectedLetter ? cakes.filter((c) => c.name[0]?.toUpperCase() === selectedLetter).sort((a, b) => a.name.localeCompare(b.name)) : []),
    [selectedLetter],
  )

  const traditionGroups = useMemo(
    () =>
      bakingTraditions.map((tradition) => {
        const traditionCakes = getTraditionCakes(tradition)
        return { tradition, count: traditionCakes.length, repCakeId: getFirstPhotographedCakeId(traditionCakes.map((c) => c.id)) ?? traditionCakes[0]?.id }
      }),
    [],
  )

  return (
    <main className="page encyclopedia-index-page">
      <h1>Cake Encyclopedia</h1>
      <p>The stories, flavors, techniques and traditions behind the world's cakes.</p>

      <div className="encyclopedia-search">
        <input
          type="text"
          placeholder="Search cakes (e.g. chocolate, dense, Japan)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveChip(null)
          }}
        />
      </div>

      {isBrowsing ? (
        <>
          {activeChip && (
            <p className="encyclopedia-active-filter">
              Showing cakes for <strong>{activeChip.value}</strong>{' '}
              <button className="encyclopedia-clear-filter" onClick={() => setActiveChip(null)}>
                Clear ✕
              </button>
            </p>
          )}
          {filtered.length === 0 && <p className="encyclopedia-empty">No cakes match "{query}".</p>}
          <div className="encyclopedia-grid">
            {filtered.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        </>
      ) : (
        <>
          <section className="encyclopedia-row">
            <h2>🎂 Cake of the Day</h2>
            <Link to={`/cake/${cakeOfTheDay.id}`} className="card encyclopedia-cake-of-day">
              <CakeHeroImage cakeId={cakeOfTheDay.id} variant="hero" alt={cakeOfTheDay.name} />
              <h3>{cakeOfTheDay.name}</h3>
              <p>{cakeOfTheDay.description}</p>
            </Link>
          </section>

          <section className="encyclopedia-row">
            <h2>🌍 Browse by Origin</h2>
            <div className="discover-feature-grid">
              {originGroups.map(
                ({ region, count, repCakeId }) =>
                  repCakeId && (
                    <DiscoverFeatureCard
                      key={region}
                      onClick={() => selectChip('origin', region)}
                      title={region}
                      description={cakeCountLabel(count)}
                      cta="Explore →"
                      cakeId={repCakeId}
                    />
                  ),
              )}
            </div>
          </section>

          <section className="encyclopedia-row">
            <h2>🌍 Baking Traditions</h2>
            <div className="discover-feature-grid">
              {traditionGroups.map(
                ({ tradition, count, repCakeId }) =>
                  repCakeId && (
                    <DiscoverFeatureCard
                      key={tradition.id}
                      to={`/traditions/${tradition.id}`}
                      title={tradition.title}
                      description={tradition.specialty}
                      meta={cakeCountLabel(count)}
                      cta="Explore →"
                      cakeId={repCakeId}
                    />
                  ),
              )}
            </div>
          </section>

          <section className="encyclopedia-row">
            <h2>🔤 Browse A–Z</h2>
            <div className="encyclopedia-az-row">
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  className={selectedLetter === letter ? 'encyclopedia-az-chip active' : 'encyclopedia-az-chip'}
                  disabled={!lettersWithCakes.has(letter)}
                  onClick={() => setSelectedLetter((prev) => (prev === letter ? null : letter))}
                >
                  {letter}
                </button>
              ))}
            </div>
            {selectedLetter && (
              <div className="encyclopedia-grid encyclopedia-az-results">
                {letterCakes.map((cake) => (
                  <CakeCard key={cake.id} cake={cake} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}
