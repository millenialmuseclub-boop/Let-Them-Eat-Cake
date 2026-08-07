import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCake, getRecipe, regions, collections } from '../lib/data'
import { getAllCountries, getCountryEntries, getPrimaryEntry, getRelatedCountries } from '../lib/atlas'
import { FEATURED_COLLECTION_IDS } from '../lib/collections'
import { RecipeCard } from '../components/RecipeCard'
import { AtlasWorldMap } from '../components/AtlasWorldMap'
import { CakeHeroImage } from '../components/CakeHeroImage'
import type { AtlasRegion } from '../types/atlas'
import './AtlasPage.css'

const ATLAS_REGIONS: AtlasRegion[] = ['Africa', 'Asia & Middle East', 'Europe', 'Latin America', 'North America', 'Oceania']

export function AtlasPage() {
  const allCountries = useMemo(() => getAllCountries(), [])
  const [searchParams] = useSearchParams()
  const countryParam = searchParams.get('country')
  const initialCountry = countryParam ? allCountries.find((c) => c.toLowerCase() === countryParam.toLowerCase()) ?? null : null

  const [query, setQuery] = useState(initialCountry ?? '')
  const [country, setCountry] = useState<string | null>(initialCountry)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(initialCountry ? getPrimaryEntry(initialCountry)?.id ?? null : null)
  const [selectedRegion, setSelectedRegion] = useState<AtlasRegion | null>(null)

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

  const featuredCollections = FEATURED_COLLECTION_IDS.map((id) => collections.find((c) => c.id === id)).filter((c) => c !== undefined)
  const regionEntries = selectedRegion ? regions.filter((r) => r.isPrimary && r.region === selectedRegion) : []

  const countryEntries = country ? getCountryEntries(country) : []
  const selectedEntry = countryEntries.find((e) => e.id === selectedEntryId) ?? null
  const selectedCake = selectedEntry ? getCake(selectedEntry.cakeId) : null
  const selectedRecipe = selectedEntry ? getRecipe(selectedEntry.recipeId) : null
  const otherEntries = countryEntries.filter((e) => e.id !== selectedEntryId)
  const relatedCountries = country ? getRelatedCountries(country) : []

  return (
    <main className="page atlas-page">
      <h1>Global Cake Atlas</h1>
      <p>Click a pin on the map — or search a country below — to find its most popular cake, complete with a full recipe and background story.</p>

      <AtlasWorldMap countries={allCountries} selectedCountry={country} onSelectCountry={handleSearch} />

      <div className="atlas-search">
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
            <h2>{selectedCake.name}</h2>
            <p>{selectedCake.description}</p>
            <h3>Background story</h3>
            <p>{selectedEntry.historyNote}</p>
            <Link to={`/cake/${selectedCake.id}`} className="encyclopedia-link">
              View full encyclopedia entry →
            </Link>
          </div>

          <h2 className="recipe-heading">Recipe</h2>
          <RecipeCard key={selectedRecipe.id} recipe={selectedRecipe} />

          {otherEntries.length > 0 && (
            <>
              <h2 className="recipe-heading">Other favorites from {country}</h2>
              <div className="atlas-grid">
                {otherEntries.map((entry) => {
                  const cake = getCake(entry.cakeId)
                  return (
                    <button key={entry.id} className="card atlas-card" onClick={() => setSelectedEntryId(entry.id)}>
                      {entry.cityMicroRegion && <p className="atlas-location">{entry.cityMicroRegion}</p>}
                      <h3>{cake?.name}</h3>
                      <p>{entry.shortDescription}</p>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {relatedCountries.length > 0 && (
            <>
              <h2 className="recipe-heading">Related Countries</h2>
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
              {ATLAS_REGIONS.map((region) => (
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
            <div className="atlas-grid atlas-browse">
              {regionEntries.map((entry) => {
                const cake = getCake(entry.cakeId)
                return (
                  <button key={entry.id} className="card atlas-card" onClick={() => handleSearch(entry.country)}>
                    <p className="atlas-location">{entry.country}</p>
                    <h3>{cake?.name}</h3>
                    <p>{entry.shortDescription}</p>
                  </button>
                )
              })}
            </div>
          )}

          <section className="atlas-row">
            <div className="atlas-row-header">
              <h2>✨ Explore a Collection</h2>
              <Link to="/collections" className="encyclopedia-link">
                See all →
              </Link>
            </div>
            <div className="atlas-chip-row">
              {featuredCollections.map((collection) => (
                <Link key={collection.id} to={`/collections/${collection.id}`} className="card atlas-collection-card">
                  <span aria-hidden="true">{collection.icon}</span> {collection.title}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
