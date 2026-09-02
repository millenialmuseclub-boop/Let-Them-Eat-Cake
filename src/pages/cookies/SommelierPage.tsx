import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { getCookieImage } from '../../lib/cookies/images'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'

export function SommelierPage() {
  useDocumentTitle('Sommelier')
  return (
    <main className="page-container">
      <PageHeroBand
        image={getCookieImage('cookie_dutch_stroopwafel')}
        eyebrow="Sommelier"
        title="Tell us what you're craving"
        description="No LLM guesswork -- a deterministic match with a plain-language reason for every result."
      />
      <div className="workshop-group-grid">
        <Link to="/cookies/sommelier/find" className="workshop-link-card">
          <h2>FIND</h2>
          <p>Answer a few questions about your taste and get ranked cookie matches.</p>
        </Link>
      </div>
    </main>
  )
}
