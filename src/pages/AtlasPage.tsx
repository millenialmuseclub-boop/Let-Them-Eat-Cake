import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCake, getRecipe, regions } from '../lib/data'
import { getAllCountries, getCountryEntries, getPrimaryEntry } from '../lib/atlas'
import { RecipeCard } from '../components/RecipeCard'
import { AtlasWorldMap } from '../components/AtlasWorldMap'
import './AtlasPage.css'

export function AtlasPage() {
  const allCountries = useMemo(() => getAllCountries(), [])
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState<string | null>(null)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)

  function handleSearch(value: string) {
    setQuery(value)
    const match = allCountries.find((c) => c.toLowerCase() === value.toLowerCase())
    if (match) {
      setCountry(match)
      setSelectedEntryId(getPrimaryEntry(match)?.id ?? null)
    } else {
      setCountry(null)
      setSelectedEntryId(null)
    }
  }

  const countryEntries = country ? getCountryEntries(country) : []
  const selectedEntry = countryEntries.find((e) => e.id === selectedEntryId) ?? null
  const selectedCake = selectedEntry ? getCake(selectedEntry.cakeId) : null
  const selectedRecipe = selectedEntry ? getRecipe(selectedEntry.recipeId) : null
  const otherEntries = countryEntries.filter((e) => e.id !== selectedEntryId)

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
        </section>
      )}

      {!country && !query && (
        <div className="atlas-grid atlas-browse">
          {regions
            .filter((r) => r.isPrimary)
            .map((entry) => {
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
    </main>
  )
}
