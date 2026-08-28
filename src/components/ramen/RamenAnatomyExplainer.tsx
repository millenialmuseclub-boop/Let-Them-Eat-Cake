import { useState } from 'react'
import { ramenAnatomyStages } from '../../lib/ramen/data'
import './RamenAnatomyExplainer.css'

// Adapted directly from Cake's CakeAnatomyExplainer interaction pattern
// (CAKE_REFERENCE_AUDIT.md §6) -- same tap-a-stage flow, ramen's own field
// names (whatItIs/contributes/commonExamples/interaction, master spec §11).
export function RamenAnatomyExplainer() {
  const [expandedId, setExpandedId] = useState<string | null>(ramenAnatomyStages[0]?.id ?? null)
  const expandedStage = ramenAnatomyStages.find((s) => s.id === expandedId)

  return (
    <div className="anatomy-explainer">
      <div className="anatomy-flow">
        {ramenAnatomyStages.map((stage) => (
          <button
            key={stage.id}
            className={expandedId === stage.id ? 'anatomy-step active' : 'anatomy-step'}
            onClick={() => setExpandedId(expandedId === stage.id ? null : stage.id)}
            aria-expanded={expandedId === stage.id}
            aria-controls="anatomy-detail-panel"
          >
            {stage.name}
          </button>
        ))}
      </div>

      {expandedStage && (
        <div className="card anatomy-detail" id="anatomy-detail-panel" role="region" aria-label={`${expandedStage.name} details`}>
          <h3>{expandedStage.name}</h3>
          <p>
            <strong>What it is:</strong> {expandedStage.whatItIs}
          </p>
          <p>
            <strong>What it contributes:</strong> {expandedStage.contributes}
          </p>
          <p>
            <strong>Common examples:</strong> {expandedStage.commonExamples.join(', ')}
          </p>
          <p className="anatomy-interaction">
            <strong>🔗 How it interacts:</strong> {expandedStage.interaction}
          </p>
        </div>
      )}
    </div>
  )
}
