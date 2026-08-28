import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lab, LabVariable } from '../../types/cookies/lab'

function VariablePicker({ variable }: { variable: LabVariable }) {
  const [selectedId, setSelectedId] = useState(variable.options[0]?.id)
  const selected = variable.options.find((o) => o.id === selectedId) ?? variable.options[0]

  return (
    <div className="lab-variable">
      <h3 className="lab-variable-label">{variable.label}</h3>
      <div className="lab-variable-choices" role="group" aria-label={variable.label}>
        {variable.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="lab-variable-choice"
            aria-pressed={option.id === selected?.id}
            onClick={() => setSelectedId(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className="lab-variable-effect" aria-live="polite">
          <p>{selected.effect}</p>
          <div className="lab-variable-bars">
            {selected.bars.map((bar) => (
              <div className="lab-variable-bar-row" key={bar.label}>
                <span className="lab-variable-bar-label">{bar.label}</span>
                <div className="flavor-profile-bar-track" role="img" aria-label={`${bar.label}: ${bar.value} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`flavor-profile-bar-segment${i < bar.value ? ' filled' : ''}`} aria-hidden="true" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {selected.relatedCookieIds && selected.relatedCookieIds.length > 0 && (
            <p className="lab-variable-related">
              Seen in:{' '}
              {selected.relatedCookieIds.map((id, i) => (
                <span key={id}>
                  {i > 0 ? ', ' : ''}
                  <Link to={`/cookies/encyclopedia/${id}`}>{id.replace('cookie_', '').replace(/_/g, ' ')}</Link>
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function LabExplorer({ lab }: { lab: Lab }) {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)

  return (
    <div className="lab-explorer">
      <section className="lab-concepts" aria-label="Concept glossary">
        <h2>Concept Glossary</h2>
        <ul className="lab-concept-list">
          {lab.concepts.map((concept) => {
            const isExpanded = expandedConcept === concept.id
            return (
              <li key={concept.id} className="lab-concept-item">
                <button
                  type="button"
                  className="lab-concept-toggle"
                  aria-expanded={isExpanded}
                  aria-controls={`concept-${concept.id}`}
                  onClick={() => setExpandedConcept(isExpanded ? null : concept.id)}
                >
                  {concept.term}
                </button>
                {isExpanded && (
                  <div id={`concept-${concept.id}`} className="lab-concept-definition">
                    <p>{concept.definition}</p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
      <section className="lab-variables" aria-label="Variables">
        <h2>Explore the Variables</h2>
        {lab.variables.map((variable) => (
          <VariablePicker key={variable.id} variable={variable} />
        ))}
      </section>
    </div>
  )
}
