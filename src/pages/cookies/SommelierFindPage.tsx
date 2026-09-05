import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { findCookies, explainResult } from '../../lib/cookies/sommelier'
import { CookieThumbnail } from '../../components/cookies/CookieHeroImage'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { getCookieImage } from '../../lib/cookies/images'
import type { FindQuery } from '../../types/cookies/sommelier'
import type { CookieFamily, CookieFlavorTag } from '../../types/cookies/cookie'

const FLAVOR_TAGS: CookieFlavorTag[] = ['chocolate-forward', 'nutty', 'citrus', 'spiced', 'fruity', 'buttery', 'caramel', 'coconut', 'floral']
const FAMILIES: (CookieFamily | 'flexible')[] = ['flexible', 'drop', 'rolled', 'shaped', 'bar', 'sandwich', 'wafer']

export function SommelierFindPage() {
  useDocumentTitle('FIND')
  const [query, setQuery] = useState<FindQuery>({
    sweetness: 3,
    richness: 3,
    crispness: 3,
    flavorPreferences: [],
    familyPreference: 'flexible',
  })
  const [submitted, setSubmitted] = useState(false)

  const results = submitted ? findCookies(query, 5) : []

  function toggleFlavorTag(tag: CookieFlavorTag) {
    setQuery((prev) => ({
      ...prev,
      flavorPreferences: prev.flavorPreferences.includes(tag)
        ? prev.flavorPreferences.filter((t) => t !== tag)
        : [...prev.flavorPreferences, tag],
    }))
  }

  return (
    <main className="page-container find-page">
      <PageHeroBand
        image={getCookieImage('cookie_french_sable')}
        eyebrow="Sommelier"
        title="FIND"
        description="Tell us what you like, and we'll match you to real cookies -- no black box, just a plain-language reason for each match."
      />

      <form
        className="find-form"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        {(['sweetness', 'richness', 'crispness'] as const).map((dimension) => (
          <div className="find-slider-row" key={dimension}>
            <label htmlFor={`find-${dimension}`}>{dimension[0].toUpperCase() + dimension.slice(1)}</label>
            <input
              id={`find-${dimension}`}
              type="range"
              min={1}
              max={5}
              value={query[dimension]}
              onChange={(e) => setQuery((prev) => ({ ...prev, [dimension]: Number(e.target.value) }))}
            />
            <span aria-hidden="true">{query[dimension]}/5</span>
          </div>
        ))}

        <fieldset>
          <legend>Flavor preferences</legend>
          <div className="lab-variable-choices" role="group" aria-label="Flavor preferences">
            {FLAVOR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="lab-variable-choice"
                aria-pressed={query.flavorPreferences.includes(tag)}
                onClick={() => toggleFlavorTag(tag)}
              >
                {tag.replace('-', ' ')}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Family preference</legend>
          <div className="lab-variable-choices" role="group" aria-label="Family preference">
            {FAMILIES.map((family) => (
              <button
                key={family}
                type="button"
                className="lab-variable-choice"
                aria-pressed={query.familyPreference === family}
                onClick={() => setQuery((prev) => ({ ...prev, familyPreference: family }))}
              >
                {family}
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="button-primary">Find my cookie</button>
      </form>

      {submitted && (
        <section className="find-results" aria-live="polite">
          <h2>Your Matches</h2>
          <ol className="find-result-list">
            {results.map(({ cookie, result }, index) => (
              <li
                className={`card find-result-card${index === 0 ? ' find-result-card-highlight' : ''}`}
                key={cookie.id}
              >
                <div className="find-result-row">
                  <CookieThumbnail cookieId={cookie.id} name={cookie.name} />
                  <div>
                    <div className="find-result-heading">
                      <h3><Link to={`/cookies/encyclopedia/${cookie.id}`}>{cookie.name}</Link></h3>
                      <span className="find-result-score">{result.score}% match</span>
                    </div>
                    <p className="find-result-details">{explainResult(cookie, result)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  )
}
