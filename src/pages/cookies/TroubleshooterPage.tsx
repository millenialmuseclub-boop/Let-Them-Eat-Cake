import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { TROUBLESHOOTER } from '../../lib/cookies/data'
import { getSceneImage } from '../../lib/cookies/images'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'

export function TroubleshooterPage() {
  useDocumentTitle('Troubleshooter')
  return (
    <main className="page-container">
      <PageHeroBand
        image={getSceneImage('scene_baking_tray')}
        eyebrow="Workshop"
        title="Troubleshooter"
        description="What went wrong with your cookies, and how to fix it next time."
      />
      <div className="troubleshooter-list">
        {TROUBLESHOOTER.map((problem) => (
          <details className="traditions-accordion-item" key={problem.id}>
            <summary>{problem.problem}</summary>
            <h3>Likely causes</h3>
            <ul>{problem.likelyCauses.map((cause) => <li key={cause}>{cause}</li>)}</ul>
            <h3>Fixes</h3>
            <ul>{problem.corrections.map((fix) => <li key={fix}>{fix}</li>)}</ul>
            {problem.relatedLabSlug && (
              <p><Link to={`/cookies/workshop/labs/${problem.relatedLabSlug}`}>Related Lab →</Link></p>
            )}
          </details>
        ))}
      </div>
    </main>
  )
}
