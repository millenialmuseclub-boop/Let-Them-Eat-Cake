import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { cakes } from '../lib/data'
import { getRegionEntriesForCake, getDecadeForCake } from '../lib/encyclopedia'
import { getCakeOfTheDay } from '../lib/discovery'
import { CakeHeroImage } from '../components/CakeHeroImage'
import type { CakeTexture } from '../types/cake'
import type { MoodTag } from '../types/persona'
import './CakeEncyclopediaIndexPage.css'

const TEXTURES: CakeTexture[] = ['sponge', 'dense', 'creamy', 'crumbly']

function getLocationTag(cakeId: string): string | null {
  const region = getRegionEntriesForCake(cakeId)[0]
  if (region) return region.country
  const decade = getDecadeForCake(cakeId)
  if (decade) return decade.decadeLabel
  return null
}

function topFlavorNotes(limit: number): string[] {
  const counts = new Map<string, number>()
  for (const cake of cakes) {
    for (const note of cake.flavorNotes) counts.set(note, (counts.get(note) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([note]) => note)
}

function distinctOccasions(): string[] {
  const seen = new Set<string>()
  for (const cake of cakes) for (const o of cake.occasion ?? []) seen.add(o)
  return [...seen].sort()
}

const TOP_FLAVORS = topFlavorNotes(8)
const OCCASIONS = distinctOccasions()

function CakeCard({ cake }: { cake: (typeof cakes)[number] }) {
  const locationTag = getLocationTag(cake.id)
  return (
    <Link to={`/cake/${cake.id}`} className="card encyclopedia-card">
      <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
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
  const occasionParam = searchParams.get('occasion')
  const moodParam = searchParams.get('mood')

  const [query, setQuery] = useState('')
  const [activeChip, setActiveChip] = useState<{ type: 'texture' | 'flavor' | 'occasion' | 'mood'; value: string } | null>(
    occasionParam ? { type: 'occasion', value: occasionParam } : moodParam ? { type: 'mood', value: moodParam } : null,
  )

  const cakeOfTheDay = getCakeOfTheDay()

  const q = query.trim().toLowerCase()
  const isBrowsing = q.length > 0 || activeChip !== null

  const filtered = useMemo(() => {
    let result = cakes
    if (activeChip?.type === 'texture') result = result.filter((c) => c.texture === activeChip.value)
    if (activeChip?.type === 'flavor') result = result.filter((c) => c.flavorNotes.includes(activeChip.value))
    if (activeChip?.type === 'occasion') result = result.filter((c) => c.occasion?.includes(activeChip.value))
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

  function selectChip(type: 'texture' | 'flavor' | 'occasion', value: string) {
    setActiveChip((prev) => (prev?.type === type && prev.value === value ? null : { type, value }))
  }

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
            <h2>🍮 Browse by Texture</h2>
            <div className="encyclopedia-chip-row">
              {TEXTURES.map((t) => (
                <button key={t} className="encyclopedia-chip" onClick={() => selectChip('texture', t)}>
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="encyclopedia-row">
            <h2>🍫 Browse by Flavor</h2>
            <div className="encyclopedia-chip-row">
              {TOP_FLAVORS.map((f) => (
                <button key={f} className="encyclopedia-chip" onClick={() => selectChip('flavor', f)}>
                  {f}
                </button>
              ))}
            </div>
          </section>

          <section className="encyclopedia-row">
            <h2>🎉 Browse by Occasion</h2>
            <div className="encyclopedia-chip-row">
              {OCCASIONS.map((o) => (
                <button key={o} className="encyclopedia-chip" onClick={() => selectChip('occasion', o)}>
                  {o}
                </button>
              ))}
            </div>
          </section>

          <section className="encyclopedia-row encyclopedia-secondary-links">
            <Link to="/ingredients" className="encyclopedia-link">
              🧂 Browse by Ingredient →
            </Link>
            <Link to="/traditions" className="encyclopedia-link">
              🌍 Baking Traditions →
            </Link>
          </section>
        </>
      )}
    </main>
  )
}
