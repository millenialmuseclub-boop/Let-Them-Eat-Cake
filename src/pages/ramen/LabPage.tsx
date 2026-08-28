import { Link, useLocation } from 'react-router-dom'
import { getLab } from '../../lib/ramen/labs'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { LabExplorer } from '../../components/ramen/LabExplorer'
import { ContextualCuratedKitchen } from '../../components/ContextualCuratedKitchen'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './LabPage.css'

// One route/component for all four Labs -- content-driven, same pattern as Slurp's GuidePage.
// Each Lab's flat route (/ramen/broth-lab, /ramen/noodle-lab, ...) has its last path segment as
// the slug (matching labs.json's own `slug` field 1:1), so the pathname's last segment is used
// directly rather than a :slug route param. (Originally `pathname.slice(1)`, which assumed the
// route was mounted at the site root; now that Ramen is mounted under /ramen/*, the last segment
// is taken instead so this keeps working regardless of mount prefix.)
export function LabPage() {
  const { pathname } = useLocation()
  const slug = pathname.split('/').filter(Boolean).pop() ?? ''
  const lab = getLab(slug)
  const scene = getSceneImage(slug)

  useDocumentTitle(lab ? `${lab.title} | Let Them Eat Ramen` : 'Lab Not Found | Let Them Eat Ramen')

  if (!lab) {
    return (
      <main className="page">
        <h1>Lab not found</h1>
        <p>
          We couldn't find that lab. <Link to="/ramen/workshop">Back to Workshop →</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt={lab.title} loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>{lab.title}</h1>
      <p>{lab.description}</p>

      <LabExplorer lab={lab} />

      <ContextualCuratedKitchen context={slug} title="From the Curated Kitchen" />

      <div className="lab-cross-links">
        <Link to="/ramen/ramen-anatomy" className="encyclopedia-link">
          See this component in Ramen Anatomy →
        </Link>
        {lab.bowlComponentCategory && (
          <Link to="/ramen/build-a-bowl" className="encyclopedia-link">
            Try it in Build a Bowl →
          </Link>
        )}
      </div>
    </main>
  )
}
