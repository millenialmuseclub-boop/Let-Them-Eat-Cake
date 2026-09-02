import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { getCookieImage, getSceneImage } from '../../lib/cookies/images'
import { DiscoverFeatureCard } from '../../components/cookies/DiscoverFeatureCard'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'

function RowThumb({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
    />
  )
}

export function CrumbPage() {
  useDocumentTitle('Crumb')
  return (
    <main className="page-container">
      <PageHeroBand
        image={getCookieImage('cookie_speculaas')}
        eyebrow="A Small Cookie Culture Magazine"
        title="Crumb"
        description="Culture, history, vocabulary, and cookie trivia -- the stories behind the recipes."
      />

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
        <Link to="/cookies/atlas" className="workshop-link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <RowThumb src={getCookieImage('cookie_maamoul')?.url} alt="" />
          <div>
            <h2>Cookie Traditions</h2>
            <p>Explore traditions by region.</p>
          </div>
        </Link>
        <Link to="/cookies/crumb/vocabulary" className="workshop-link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <RowThumb src={getSceneImage('scene_dough_lab')?.url} alt="" />
          <div>
            <h2>Cookie Vocabulary</h2>
            <p>Key baking terms explained.</p>
          </div>
        </Link>
        <Link to="/cookies/sommelier/find" className="workshop-link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <RowThumb src={getCookieImage('cookie_french_sable')?.url} alt="" />
          <div>
            <h2>Find Your Cookie</h2>
            <p>Get matched to a cookie based on your taste.</p>
          </div>
        </Link>
        <Link to="/cookies/crumb/quiz" className="workshop-link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <RowThumb src={getSceneImage('scene_chocolate_lab')?.url} alt="" />
          <div>
            <h2>Cookie 101 Quiz</h2>
            <p>Test what you've learned.</p>
          </div>
        </Link>
      </div>
    </main>
  )
}
