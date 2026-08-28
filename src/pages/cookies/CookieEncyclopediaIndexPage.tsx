import { useMemo, useState } from 'react'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { COOKIES, TRADITIONS } from '../../lib/cookies/data'
import { CookieCard } from '../../components/cookies/CookieCard'

const AZ = Array.from(new Set(COOKIES.map((c) => c.name[0].toUpperCase()))).sort()

export function CookieEncyclopediaIndexPage() {
  useDocumentTitle('Cookie Encyclopedia')
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState<string | null>(null)
  const [family, setFamily] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return COOKIES.filter((c) => {
      if (letter && !c.name.toUpperCase().startsWith(letter)) return false
      if (family && c.family !== family) return false
      if (query && !`${c.name} ${c.origin} ${c.description}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [query, letter, family])

  const families = Array.from(new Set(COOKIES.map((c) => c.family)))

  return (
    <main className="page-container">
      <h1>Cookie Encyclopedia</h1>
      <p>Browse {COOKIES.length} cookies from traditions around the world.</p>

      <div className="encyclopedia-search">
        <label htmlFor="encyclopedia-search-input">Search</label>
        <input
          id="encyclopedia-search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, origin, or description"
        />
      </div>

      <div className="encyclopedia-az-chips" role="group" aria-label="Browse A to Z">
        <button type="button" className="encyclopedia-chip" aria-pressed={letter === null} onClick={() => setLetter(null)}>All</button>
        {AZ.map((l) => (
          <button key={l} type="button" className="encyclopedia-chip" aria-pressed={letter === l} onClick={() => setLetter(letter === l ? null : l)}>
            {l}
          </button>
        ))}
      </div>

      <div className="encyclopedia-az-chips" role="group" aria-label="Browse by family">
        <button type="button" className="encyclopedia-chip" aria-pressed={family === null} onClick={() => setFamily(null)}>All Families</button>
        {families.map((f) => (
          <button key={f} type="button" className="encyclopedia-chip" aria-pressed={family === f} onClick={() => setFamily(family === f ? null : f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="encyclopedia-grid">
        {filtered.map((cookie) => (
          <CookieCard cookie={cookie} key={cookie.id} />
        ))}
        {filtered.length === 0 && <p>No cookies match those filters.</p>}
      </div>

      <section className="encyclopedia-traditions" aria-labelledby="traditions-heading">
        <h2 id="traditions-heading">Traditions by Region</h2>
        <div className="traditions-accordion">
          {TRADITIONS.map((tradition) => (
            <details className="traditions-accordion-item" key={tradition.id}>
              <summary>{tradition.worldRegion}</summary>
              <p>{tradition.introduction}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
