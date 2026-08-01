import { useState } from 'react'
import { getCake, regions } from '../lib/data'
import { addStamp, getPassport, hasStamp } from '../lib/passport'
import type { AtlasRegion } from '../types/atlas'
import './AtlasPage.css'

const REGION_ORDER: AtlasRegion[] = ['Latin America', 'Europe', 'Asia & Middle East', 'North America', 'Africa', 'Oceania']

export function AtlasPage() {
  const [passport, setPassport] = useState(getPassport())

  function handleCollect(stampId: string) {
    setPassport(addStamp(stampId))
  }

  const groups = REGION_ORDER.map((region) => ({
    region,
    entries: regions.filter((entry) => entry.region === region),
  })).filter((group) => group.entries.length > 0)

  return (
    <main className="page atlas-page">
      <h1>Global Cake Atlas</h1>
      <p>Explore regional cakes from around the world and collect a passport stamp for each one you discover.</p>

      <div className="card passport-summary">
        <span className="tag">
          {passport.stamps.length} / {regions.length} stamps collected
        </span>
      </div>

      {groups.map((group) => (
        <section key={group.region} className="atlas-region">
          <h2>{group.region}</h2>
          <div className="atlas-grid">
            {group.entries.map((entry) => {
              const cake = getCake(entry.cakeId)
              const collected = hasStamp(entry.passportStampId)
              return (
                <div key={entry.id} className="card atlas-card">
                  <p className="atlas-location">
                    {entry.country}
                    {entry.cityMicroRegion ? ` · ${entry.cityMicroRegion}` : ''}
                  </p>
                  <h3>{cake?.name}</h3>
                  <p>{entry.shortDescription}</p>
                  <button
                    className={collected ? 'btn btn-secondary' : 'btn'}
                    onClick={() => handleCollect(entry.passportStampId)}
                    disabled={collected}
                  >
                    {collected ? '✓ Stamped' : 'Collect stamp'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
