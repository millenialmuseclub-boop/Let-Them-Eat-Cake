import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lab } from '../../types/ramen/lab'
import './RamenAnatomyExplainer.css'
import './FlavorProfileBars.css'
import './LabExplorer.css'

/** One reusable interactive architecture for every Workshop Lab (Broth/Noodle/Tare/Aroma Oil,
    master spec §10) instead of four unrelated page systems. Two parts: a tap-to-expand concept
    glossary (same pattern as RamenAnatomyExplainer) and a set of qualitative variable pickers --
    deliberately not a calculator, so picking an option shows a described effect plus a couple of
    named 0-5 bars, never a numeric input/output. */
export function LabExplorer({ lab }: { lab: Lab }) {
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(lab.concepts[0]?.id ?? null)
  const [selectedOptionByVariable, setSelectedOptionByVariable] = useState<Record<string, string>>(() =>
    Object.fromEntries(lab.variables.map((v) => [v.id, v.options[0].id])),
  )

  const expandedConcept = lab.concepts.find((c) => c.id === expandedConceptId)

  return (
    <div className="lab-explorer">
      <section>
        <h2>Concepts</h2>
        <div className="anatomy-flow">
          {lab.concepts.map((concept) => (
            <button
              key={concept.id}
              className={expandedConceptId === concept.id ? 'anatomy-step active' : 'anatomy-step'}
              onClick={() => setExpandedConceptId(expandedConceptId === concept.id ? null : concept.id)}
              aria-expanded={expandedConceptId === concept.id}
              aria-controls="lab-concept-detail-panel"
            >
              {concept.term}
            </button>
          ))}
        </div>

        {expandedConcept && (
          <div className="card anatomy-detail" id="lab-concept-detail-panel" role="region" aria-label={`${expandedConcept.term} details`}>
            <h3>{expandedConcept.term}</h3>
            <p>{expandedConcept.definition}</p>
            {expandedConcept.relatedRamenIds && expandedConcept.relatedRamenIds.length > 0 && (
              <p className="lab-related-ramen">
                Seen in:{' '}
                {expandedConcept.relatedRamenIds.map((id, i) => (
                  <span key={id}>
                    {i > 0 && ', '}
                    <Link to={`/ramen/ramen/${id}`}>{id.replace('ramen_', '').replace(/_/g, ' ')}</Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        <h2>Try It</h2>
        <p className="lab-try-it-note">Pick an option for each variable and see how it changes the result -- no math, just cause and effect.</p>

        {lab.variables.map((variable) => {
          const selectedId = selectedOptionByVariable[variable.id]
          const selectedOption = variable.options.find((o) => o.id === selectedId) ?? variable.options[0]

          return (
            <div key={variable.id} className="card lab-variable-card">
              <h3 id={`lab-variable-${variable.id}-label`}>{variable.label}</h3>
              <div className="lab-variable-options" role="group" aria-labelledby={`lab-variable-${variable.id}-label`}>
                {variable.options.map((option) => (
                  <button
                    key={option.id}
                    className={option.id === selectedOption.id ? 'lab-variable-option active' : 'lab-variable-option'}
                    onClick={() => setSelectedOptionByVariable((prev) => ({ ...prev, [variable.id]: option.id }))}
                    aria-pressed={option.id === selectedOption.id}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <p className="lab-variable-effect" aria-live="polite">
                {selectedOption.effect}
              </p>

              <div className="flavor-profile-bars">
                {selectedOption.bars.map((bar) => (
                  <div key={bar.label} className="flavor-profile-row">
                    <span>{bar.label}</span>
                    <div className="flavor-profile-track">
                      <div className="flavor-profile-fill" style={{ width: `${(bar.value / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {selectedOption.relatedRamenIds && selectedOption.relatedRamenIds.length > 0 && (
                <p className="lab-related-ramen">
                  Seen in:{' '}
                  {selectedOption.relatedRamenIds.map((id, i) => (
                    <span key={id}>
                      {i > 0 && ', '}
                      <Link to={`/ramen/ramen/${id}`}>{id.replace('ramen_', '').replace(/_/g, ' ')}</Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
