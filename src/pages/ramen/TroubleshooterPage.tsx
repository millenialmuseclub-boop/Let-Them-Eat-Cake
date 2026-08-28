import { useState } from 'react'
import { Link } from 'react-router-dom'
import { troubleshooterProblems } from '../../lib/ramen/data'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './LabPage.css'
import './TroubleshooterPage.css'

// Problem -> diagnostic questions -> likely causes -> corrections -> related lesson. Flat,
// deterministic data (troubleshooter.json), no branching logic engine and no AI -- picking a
// problem just reveals its full authored breakdown.
export function TroubleshooterPage() {
  useDocumentTitle('Troubleshooter | Let Them Eat Ramen')

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = troubleshooterProblems.find((p) => p.id === selectedId)
  const scene = getSceneImage('troubleshooter')

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="A chef preparing ramen in a Tokyo kitchen" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>Troubleshooter</h1>
      <p>Something off about your bowl? Pick the problem closest to what you're tasting.</p>

      <div className="troubleshooter-problem-grid" role="group" aria-label="Choose a problem">
        {troubleshooterProblems.map((p) => (
          <button
            key={p.id}
            className={p.id === selectedId ? 'troubleshooter-problem-button active' : 'troubleshooter-problem-button'}
            onClick={() => setSelectedId(p.id)}
            aria-pressed={p.id === selectedId}
            aria-controls="troubleshooter-detail-panel"
          >
            {p.problem}
          </button>
        ))}
      </div>

      {selected && (
        <div className="card troubleshooter-detail" id="troubleshooter-detail-panel" aria-live="polite">
          <h2>{selected.problem}</h2>

          <h3>Ask yourself</h3>
          <ul>
            {selected.diagnosticQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>

          <h3>Likely causes &amp; corrections</h3>
          {selected.causes.map((c, i) => (
            <div key={i} className="troubleshooter-cause">
              <p className="troubleshooter-cause-text">
                <strong>Cause:</strong> {c.cause}
              </p>
              <p className="troubleshooter-correction-text">
                <strong>Correction:</strong> {c.correction}
              </p>
            </div>
          ))}

          <Link to={selected.relatedLessonPath} className="encyclopedia-link">
            Related lesson: {selected.relatedLessonLabel} →
          </Link>
        </div>
      )}
    </main>
  )
}
