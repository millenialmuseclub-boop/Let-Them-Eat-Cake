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
        description="Find a cookie for your taste: choose sweetness, richness, crispness and the flavors you love. Every match explains why it fits."
      />
      <div className="workshop-group-grid">
        <Link to="/cookies/sommelier/find" className="workshop-link-card">
          <h2>Find my cookie</h2>
          <p>Answer a few questions about your taste and get ranked cookie matches.</p>
        </Link>
      </div>
      <section className="workshop-group">
        <h2>Start with a texture</h2>
        <p>Use the crispness slider to explore tender, chewy or crisp cookies, then refine the flavors. A match is a starting point for discovery, not a guarantee of personal taste.</p>
        <Link to="/explore?world=cookies&q=crumbly">Explore crumbly cookies →</Link>
        <p><Link to="/cookies/workshop/labs/dough-lab">Learn how mixing and chilling change the texture →</Link></p>
      </section>
    </main>
  )
}
