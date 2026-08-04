import { useState } from 'react'
import { cakeAnatomyStages } from '../lib/data'
import './CakeAnatomyExplainer.css'

export function CakeAnatomyExplainer() {
  const [expandedId, setExpandedId] = useState<string | null>(cakeAnatomyStages[0]?.id ?? null)
  const expandedStage = cakeAnatomyStages.find((s) => s.id === expandedId)

  return (
    <div className="anatomy-explainer">
      <div className="anatomy-flow">
        {cakeAnatomyStages.map((stage, i) => (
          <div key={stage.id} className="anatomy-step-wrap">
            <button className={expandedId === stage.id ? 'anatomy-step active' : 'anatomy-step'} onClick={() => setExpandedId(expandedId === stage.id ? null : stage.id)}>
              {stage.name}
            </button>
            {i < cakeAnatomyStages.length - 1 && (
              <span className="anatomy-arrow" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {expandedStage && (
        <div className="card anatomy-detail">
          <h3>{expandedStage.name}</h3>
          <p>
            <strong>Purpose:</strong> {expandedStage.purpose}
          </p>
          <p>
            <strong>Texture contribution:</strong> {expandedStage.textureContribution}
          </p>
          <p>
            <strong>Structural role:</strong> {expandedStage.structuralRole}
          </p>
          <p>
            <strong>Flavor impact:</strong> {expandedStage.flavorImpact}
          </p>
        </div>
      )}
    </div>
  )
}
