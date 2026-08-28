import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { LABS } from '../../lib/cookies/data'
import { getSceneImage } from '../../lib/cookies/images'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { DiscoverFeatureCard } from '../../components/cookies/DiscoverFeatureCard'

// Cake's and Ramen's own Workshop pages use full photo-led feature cards (DiscoverFeatureCard,
// ~280px photo + gradient-scrim title) for every live lab -- Cookies Workshop previously used a
// much smaller 52px inline row thumbnail for the same content, a visibly lower bar even though
// the photography existed. Matched to the same card language here; each maps to a real,
// already-sourced scene photo (dough/chocolate labs get their own; everything else reuses the
// closest thematically-appropriate scene rather than going bare).
const LAB_SCENE: Record<string, string> = {
  anatomy: 'scene_dough_lab',
  'build-a-cookie': 'scene_dough_lab',
  'dough-lab': 'scene_dough_lab',
  'chocolate-lab': 'scene_chocolate_lab',
  troubleshooter: 'scene_baking_tray',
}

export function WorkshopPage() {
  useDocumentTitle('Workshop')
  const populatedLabSlugs = new Set(LABS.map((l) => l.slug))
  const allLabs = [
    { slug: 'dough-lab', title: 'Dough Lab' },
    { slug: 'flour-lab', title: 'Flour Lab' },
    { slug: 'sugar-lab', title: 'Sugar Lab' },
    { slug: 'fat-lab', title: 'Butter & Fat Lab' },
    { slug: 'chocolate-lab', title: 'Chocolate Lab' },
    { slug: 'texture-lab', title: 'Texture Lab' },
  ]

  return (
    <main className="page-container">
      <PageHeroBand
        image={getSceneImage('scene_dough_lab')}
        eyebrow="The Workshop"
        title="Workshop"
        description="Understand the craft behind every cookie -- from ingredients to technique."
      />

      <section className="workshop-group" aria-labelledby="understand-heading">
        <h2 id="understand-heading">Understand the Cookie</h2>
        <div className="discover-feature-grid">
          <DiscoverFeatureCard
            to="/cookies/workshop/anatomy"
            title="Cookie Anatomy"
            description="The nine components that make up every cookie, and what each one contributes."
            icon="🍪"
            image={getSceneImage(LAB_SCENE.anatomy)}
          />
          <DiscoverFeatureCard
            to="/cookies/workshop/build-a-cookie"
            title="Build a Cookie"
            description="Combine components stage by stage and see how traditional -- or experimental -- the result is."
            icon="🥣"
            image={getSceneImage(LAB_SCENE['build-a-cookie'])}
          />
        </div>
      </section>

      <section className="workshop-group" aria-labelledby="master-heading">
        <h2 id="master-heading">Master the Components</h2>
        <div className="discover-feature-grid">
          {allLabs
            .filter((lab) => populatedLabSlugs.has(lab.slug))
            .map((lab) => (
              <DiscoverFeatureCard
                key={lab.slug}
                to={`/cookies/workshop/labs/${lab.slug}`}
                title={lab.title}
                description="Open the lab"
                icon="🧪"
                image={getSceneImage(LAB_SCENE[lab.slug])}
              />
            ))}
        </div>
        {allLabs.some((lab) => !populatedLabSlugs.has(lab.slug)) && (
          <div className="workshop-group-grid" style={{ marginTop: 16 }}>
            {allLabs
              .filter((lab) => !populatedLabSlugs.has(lab.slug))
              .map((lab) => (
                <div className="workshop-link-card workshop-link-card-coming-soon" key={lab.slug}>
                  <h3>{lab.title}</h3>
                  <span className="coming-soon-tag">Coming Soon</span>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="workshop-group" aria-labelledby="solve-heading">
        <h2 id="solve-heading">Solve a Problem</h2>
        <div className="discover-feature-grid">
          <DiscoverFeatureCard
            to="/cookies/workshop/troubleshooter"
            title="Troubleshooter"
            description="What went wrong, and how to fix it next time."
            icon="🔎"
            image={getSceneImage(LAB_SCENE.troubleshooter)}
          />
        </div>
      </section>

      <section className="workshop-group" aria-labelledby="shop-heading">
        <h2 id="shop-heading">Shop the Workshop</h2>
        <div className="discover-feature-grid">
          <DiscoverFeatureCard
            to="/cookies/curated-kitchen"
            title="Curated Kitchen"
            description="Tools and ingredients from our editorial picks."
            icon="🛍️"
          />
        </div>
      </section>
    </main>
  )
}
