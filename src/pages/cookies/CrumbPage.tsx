import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { getCookieImage, getSceneImage } from '../../lib/cookies/images'
import { DiscoverFeatureCard } from '../../components/cookies/DiscoverFeatureCard'

export function CrumbPage() {
  useDocumentTitle('Crumb')
  return (
    <main className="page-container">
      <header className="crumb-masthead">
        <p className="crumb-masthead-eyebrow">A Small Cookie Culture Magazine</p>
        <h1>Crumb</h1>
        <p>Culture, history, vocabulary, and cookie trivia -- the stories behind the recipes.</p>
      </header>

      <section className="discover-feature-grid" aria-label="Featured Crumb stories">
        <DiscoverFeatureCard
          to="/cookies/crumb/101"
          title="Cookie 101"
          description="The essential primer on how cookies work."
          icon="📖"
          image={getSceneImage('scene_baking_tray')}
        />
        <DiscoverFeatureCard
          to="/cookies/crumb/trails"
          title="Cookie Trails"
          description="Themed paths through the Encyclopedia."
          icon="🧭"
          image={getCookieImage('cookie_scottish_shortbread')}
        />
      </section>

      <div className="workshop-group-grid crumb-secondary-grid">
        <Link to="/cookies/atlas" className="workshop-link-card">
          <h2>Cookie Traditions</h2>
          <p>Explore traditions by region.</p>
        </Link>
        <Link to="/cookies/crumb/vocabulary" className="workshop-link-card">
          <h2>Cookie Vocabulary</h2>
          <p>Key baking terms explained.</p>
        </Link>
        <Link to="/cookies/sommelier/find" className="workshop-link-card">
          <h2>Find Your Cookie</h2>
          <p>Get matched to a cookie based on your taste.</p>
        </Link>
        <Link to="/cookies/crumb/quiz" className="workshop-link-card">
          <h2>Cookie 101 Quiz</h2>
          <p>Test what you've learned.</p>
        </Link>
      </div>
    </main>
  )
}
