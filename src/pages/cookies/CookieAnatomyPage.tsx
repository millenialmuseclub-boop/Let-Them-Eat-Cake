import { useState } from 'react'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { COOKIE_ANATOMY } from '../../lib/cookies/data'

export function CookieAnatomyPage() {
  useDocumentTitle('Cookie Anatomy')
  const [expanded, setExpanded] = useState<string | null>(COOKIE_ANATOMY[0]?.id ?? null)

  return (
    <main className="page-container">
      <h1>Cookie Anatomy</h1>
      <p>Every cookie is built from the same nine kinds of components, combined differently.</p>

      <div className="anatomy-flow">
        {COOKIE_ANATOMY.map((stage) => {
          const isExpanded = expanded === stage.id
          return (
            <div className="anatomy-step" key={stage.id}>
              <button
                type="button"
                className="anatomy-step-toggle"
                aria-expanded={isExpanded}
                aria-controls={`anatomy-${stage.id}`}
                onClick={() => setExpanded(isExpanded ? null : stage.id)}
              >
                {stage.name}
              </button>
              {isExpanded && (
                <div id={`anatomy-${stage.id}`} className="anatomy-detail">
                  <p><strong>What it is:</strong> {stage.whatItIs}</p>
                  <p><strong>What it contributes:</strong> {stage.contributes}</p>
                  <p><strong>Common forms:</strong> {stage.commonForms.join(', ')}</p>
                  <p><strong>How it interacts:</strong> {stage.interaction}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
