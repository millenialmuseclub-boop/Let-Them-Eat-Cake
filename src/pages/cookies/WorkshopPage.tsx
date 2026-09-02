import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { LABS } from '../../lib/cookies/data'
import { getSceneImage, getCookieImage } from '../../lib/cookies/images'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { DiscoverFeatureCard } from '../../components/cookies/DiscoverFeatureCard'

// Cake's and Ramen's own Workshop pages use full photo-led feature cards (DiscoverFeatureCard,
// ~280px photo + gradient-scrim title) for every live lab. Only 3 generic "scene" photos exist
// (dough/chocolate/baking-tray) -- reusing scene_dough_lab for Anatomy, Build-a-Cookie, AND Dough
// Lab (plus the hero above) meant the same photo rendered 4 times on one screen. Anatomy and
// Build-a-Cookie now use distinct real cookie photos from the 49-cookie library instead, so only
// Dough Lab's card still legitimately shares the hero's dough photo (accurate, not lazy reuse).
const LAB_SCENE: Record<string, string> = {
  'dough-lab': 'scene_dough_lab',
  'chocolate-lab': 'scene_chocolate_lab',
  troubleshooter: 'scene_baking_tray',
}
const LAB_COOKIE: Record<string, string> = {
  anatomy: 'cookie_sugar_cookie',
  'build-a-cookie': 'cookie_snickerdoodle',
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
            image={getCookieImage(LAB_COOKIE.anatomy)}
          />
          <DiscoverFeatureCard
            to="/cookies/workshop/build-a-cookie"
            title="Build a Cookie"
            description="Combine components stage by stage and see how traditional -- or experimental -- the result is."
            icon="🥣"
            image={getCookieImage(LAB_COOKIE['build-a-cookie'])}
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
                <div className="workshop-link-card workshop-link-card-coming-soon" key={lab.slug} aria-disabled="true">
                  <div className="coming-soon-row">
                    <h3>{lab.title}</h3>
                    <span className="coming-soon-tag">Coming Soon</span>
                  </div>
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
            image={getCookieImage('cookie_macaron')}
          />
        </div>
      </section>
    </main>
  )
}
