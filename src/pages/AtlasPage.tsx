import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCake, getRecipe } from '../lib/data'
import {
  ATLAS_DISPLAY_REGIONS,
  getAllCountries,
  getCountriesForDisplayRegion,
  getCountryEntries,
  getPrimaryEntry,
  getRelatedCountries,
  type AtlasDisplayRegion,
} from '../lib/atlas'
import { getFirstPhotographedCakeId } from '../lib/images'
import { RecipeCard } from '../components/RecipeCard'
import { AtlasWorldMap } from '../components/AtlasWorldMap'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import './AtlasPage.css'

export function AtlasPage() {
  const allCountries = useMemo(() => getAllCountries(), [])
  const [searchParams] = useSearchParams()
  const countryParam = searchParams.get('country')
  const initialCountry = countryParam ? allCountries.find((c) => c.toLowerCase() === countryParam.toLowerCase()) ?? null : null

  const [query, setQuery] = useState(initialCountry ?? '')
  const [country, setCountry] = useState<string | null>(initialCountry)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(initialCountry ? getPrimaryEntry(initialCountry)?.id ?? null : null)
  const [selectedRegion, setSelectedRegion] = useState<AtlasDisplayRegion | null>(null)

  useDocumentTitle(country ? `${country} — Global Cake Atlas | Let Them Eat Cake` : 'Global Cake Atlas | Let Them Eat Cake')

  function handleSearch(value: string) {
    setQuery(value)
    const match = allCountries.find((c) => c.toLowerCase() === value.toLowerCase())
    if (match) {
      setCountry(match)
      setSelectedEntryId(getPrimaryEntry(match)?.id ?? null)
      setSelectedRegion(null)
    } else {
      setCountry(null)
      setSelectedEntryId(null)
    }
  }

  const regionEntries = useMemo(() => (selectedRegion ? getCountriesForDisplayRegion(selectedRegion) : []), [selectedRegion])

  const countryEntries = country ? getCountryEntries(country) : []
  const selectedEntry = countryEntries.find((e) => e.id === selectedEntryId) ?? null
  const selectedCake = selectedEntry ? getCake(selectedEntry.cakeId) : null
  const selectedRecipe = selectedEntry ? getRecipe(selectedEntry.recipeId) : null
  const otherEntries = countryEntries.filter((e) => e.id !== selectedEntryId)
  const relatedCountries = country ? getRelatedCountries(country) : []

  return (
    <main className="page atlas-page">
      <h1>Global Cake Atlas</h1>
      <p>
        Discover iconic cakes and baking traditions around the world — click a pin or search a country for a full recipe and background
        story.
      </p>

      <AtlasWorldMap countries={allCountries} selectedCountry={country} onSelectCountry={handleSearch} />

      <div className="atlas-search">
        <h2 className="atlas-search-heading">🔎 Search Countries</h2>
        <input
          type="text"
          list="atlas-countries"
          placeholder="Search a country (e.g. Japan, Mexico, Sweden)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <datalist id="atlas-countries">
          {allCountries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {query && !country && <p className="atlas-empty">No country matches "{query}" yet — try one from the suggestions.</p>}

      {selectedEntry && selectedCake && selectedRecipe && (
        <section className="atlas-result">
          <div className="card">
            <CakeHeroImage cakeId={selectedCake.id} variant="hero" alt={selectedCake.name} />
            <span className="tag">{country}</span>
            {selectedEntry.cityMicroRegion && <span className="tag atlas-city-tag">{selectedEntry.cityMicroRegion}</span>}
            <h2>🎂 Cake Heritage</h2>
            <h3>{selectedCake.name}</h3>
            <p>{selectedCake.description}</p>
            <Link to={`/cake/${selectedCake.id}`} className="encyclopedia-link">
              View full encyclopedia entry →
            </Link>
          </div>

          <h2 className="recipe-heading">📖 Signature Cake</h2>
          <RecipeCard key={selectedRecipe.id} recipe={selectedRecipe} />
          <Link to="/sommelier" className="btn btn-secondary atlas-sommelier-link">
            Explore pairings in the Sommelier →
          </Link>

          {otherEntries.length > 0 && (
            <>
              <h2 className="recipe-heading">More Signature Cakes from {country}</h2>
              <div className="discover-feature-grid">
                {otherEntries.map((entry) => {
                  const cake = getCake(entry.cakeId)
                  return (
                    <DiscoverFeatureCard
                      key={entry.id}
                      onClick={() => setSelectedEntryId(entry.id)}
                      title={cake?.name ?? entry.country}
                      description={entry.shortDescription}
                      meta={entry.cityMicroRegion}
                      cta="View →"
                      cakeId={getFirstPhotographedCakeId([entry.cakeId]) ?? entry.cakeId}
                    />
                  )
                })}
              </div>
            </>
          )}

          <section className="atlas-cultural-story">
            <h2>📜 Cultural Story</h2>
            <details>
              <summary>Read the background story</summary>
              <p>{selectedEntry.historyNote}</p>
            </details>
          </section>

          {relatedCountries.length > 0 && (
            <>
              <h2 className="recipe-heading">🌍 Regional Variations</h2>
              <div className="atlas-chip-row">
                {relatedCountries.map((c) => (
                  <button key={c} className="atlas-chip" onClick={() => handleSearch(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {!country && !query && (
        <>
          <section className="atlas-row">
            <h2>🌍 Browse by Region</h2>
            <div className="atlas-chip-row">
              {ATLAS_DISPLAY_REGIONS.map((region) => (
                <button
                  key={region}
                  className={selectedRegion === region ? 'atlas-chip active' : 'atlas-chip'}
                  onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </section>

          {selectedRegion && (
            <div className="discover-feature-grid atlas-browse">
              {regionEntries.map((entry) => (
                <DiscoverFeatureCard
                  key={entry.id}
                  onClick={() => handleSearch(entry.country)}
                  title={entry.country}
                  description={entry.shortDescription}
                  cta="Explore →"
                  cakeId={getFirstPhotographedCakeId([entry.cakeId]) ?? entry.cakeId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
