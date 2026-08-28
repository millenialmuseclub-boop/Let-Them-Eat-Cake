import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { LABS } from '../../lib/cookies/data'
import { getSceneImage } from '../../lib/cookies/images'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'

// Small thumbnail per workshop row so the list reads as an editorial index rather than settings
// menu -- each maps to a real, already-sourced scene photo (dough/chocolate labs get their own;
// everything else reuses the closest thematically-appropriate scene rather than going bare).
const ROW_SCENE: Record<string, string> = {
  anatomy: 'scene_dough_lab',
  'build-a-cookie': 'scene_dough_lab',
  'dough-lab': 'scene_dough_lab',
  'chocolate-lab': 'scene_chocolate_lab',
  troubleshooter: 'scene_baking_tray',
}

function RowThumb({ sceneId }: { sceneId?: string }) {
  const scene = sceneId ? getSceneImage(sceneId) : undefined
  if (!scene) return null
  return (
    <img
      src={scene.url}
      alt=""
      loading="lazy"
      style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
    />
  )
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
        <div className="workshop-group-grid">
          <Link to="/cookies/workshop/anatomy" className="workshop-link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <RowThumb sceneId={ROW_SCENE.anatomy} />
            <div>
              <h3>Cookie Anatomy</h3>
              <p>The nine components that make up every cookie, and what each one contributes.</p>
            </div>
          </Link>
          <Link to="/cookies/workshop/build-a-cookie" className="workshop-link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <RowThumb sceneId={ROW_SCENE['build-a-cookie']} />
            <div>
              <h3>Build a Cookie</h3>
              <p>Combine components stage by stage and see how traditional -- or experimental -- the result is.</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="workshop-group" aria-labelledby="master-heading">
        <h2 id="master-heading">Master the Components</h2>
        <div className="workshop-group-grid">
          {allLabs.map((lab) => {
            const isPopulated = populatedLabSlugs.has(lab.slug)
            return isPopulated ? (
              <Link
                to={`/cookies/workshop/labs/${lab.slug}`}
                className="workshop-link-card"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                key={lab.slug}
              >
                <RowThumb sceneId={ROW_SCENE[lab.slug]} />
                <div>
                  <h3>{lab.title}</h3>
                  <p>Open the lab</p>
                </div>
              </Link>
            ) : (
              <div className="workshop-link-card workshop-link-card-coming-soon" key={lab.slug}>
                <h3>{lab.title}</h3>
                <span className="coming-soon-tag">Coming Soon</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="workshop-group" aria-labelledby="solve-heading">
        <h2 id="solve-heading">Solve a Problem</h2>
        <Link
          to="/cookies/workshop/troubleshooter"
          className="workshop-link-card"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
          <RowThumb sceneId={ROW_SCENE.troubleshooter} />
          <div>
            <h3>Troubleshooter</h3>
            <p>What went wrong, and how to fix it next time.</p>
          </div>
        </Link>
      </section>

      <section className="workshop-group" aria-labelledby="shop-heading">
        <h2 id="shop-heading">Shop the Workshop</h2>
        <Link to="/cookies/curated-kitchen" className="workshop-link-card">
          <h3>Curated Kitchen</h3>
          <p>Tools and ingredients from our editorial picks.</p>
        </Link>
      </section>
    </main>
  )
}
