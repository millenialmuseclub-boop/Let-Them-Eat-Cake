import { useState } from 'react'
import { techniques } from '../lib/data'
import { getProductsForTechnique } from '../lib/affiliateProducts'
import { CuratorsToolDrawer } from './CuratorsToolDrawer'
import './TechniqueLibrary.css'

export function TechniqueLibrary() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="technique-library">
      <div className="technique-chip-row">
        {techniques.map((technique) => (
          <button
            key={technique.id}
            className={expandedId === technique.id ? 'technique-chip active' : 'technique-chip'}
            onClick={() => setExpandedId(expandedId === technique.id ? null : technique.id)}
          >
            {technique.name}
          </button>
        ))}
      </div>

      {expandedId &&
        (() => {
          const technique = techniques.find((t) => t.id === expandedId)!
          return (
            <div className="card technique-detail">
              <h3>{technique.name}</h3>
              <p>{technique.whatItIs}</p>
              <ol className="technique-steps">
                {technique.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <p className="technique-mistake">
                <strong>⚠️ Common mistake:</strong> {technique.commonMistake}
              </p>
              <p className="technique-tip">
                <strong>👩‍🍳 Chef tip:</strong> {technique.chefTip}
              </p>
              <CuratorsToolDrawer products={getProductsForTechnique(technique.id)} />
            </div>
          )
        })()}
    </div>
  )
}
