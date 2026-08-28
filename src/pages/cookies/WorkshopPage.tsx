import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { LABS } from '../../lib/cookies/data'
import { getSceneImage } from '../../lib/cookies/images'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'

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
          <Link to="/cookies/workshop/anatomy" className="workshop-link-card">
            <h3>Cookie Anatomy</h3>
            <p>The nine components that make up every cookie, and what each one contributes.</p>
          </Link>
          <Link to="/cookies/workshop/build-a-cookie" className="workshop-link-card">
            <h3>Build a Cookie</h3>
            <p>Combine components stage by stage and see how traditional -- or experimental -- the result is.</p>
          </Link>
        </div>
      </section>

      <section className="workshop-group" aria-labelledby="master-heading">
        <h2 id="master-heading">Master the Components</h2>
        <div className="workshop-group-grid">
          {allLabs.map((lab) => {
            const isPopulated = populatedLabSlugs.has(lab.slug)
            return isPopulated ? (
              <Link to={`/cookies/workshop/labs/${lab.slug}`} className="workshop-link-card" key={lab.slug}>
                <h3>{lab.title}</h3>
                <p>Open the lab</p>
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
        <Link to="/cookies/workshop/troubleshooter" className="workshop-link-card">
          <h3>Troubleshooter</h3>
          <p>What went wrong, and how to fix it next time.</p>
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
