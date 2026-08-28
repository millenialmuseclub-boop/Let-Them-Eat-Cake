import { useParams, Navigate } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { LABS_BY_SLUG } from '../../lib/cookies/data'
import { LabExplorer } from '../../components/cookies/LabExplorer'
import { ContextualCuratedKitchen } from '../../components/ContextualCuratedKitchen'
import { getSceneImage } from '../../lib/cookies/images'

// Only labs with a genuinely matching scene photo get a header image -- flour/sugar/fat/texture
// labs have no corresponding asset in sceneImages.json, so they stay text-led rather than reusing
// an unrelated photo.
const LAB_SCENE_ID: Record<string, string> = {
  'dough-lab': 'scene_dough_lab',
  'chocolate-lab': 'scene_chocolate_lab',
}

export function LabPage() {
  const { labSlug = '' } = useParams()
  const lab = LABS_BY_SLUG.get(labSlug)
  useDocumentTitle(lab?.title ?? 'Lab')

  if (!lab) return <Navigate to="/cookies/workshop" replace />

  const sceneId = LAB_SCENE_ID[lab.slug]
  const scene = sceneId ? getSceneImage(sceneId) : undefined

  return (
    <main className="page-container">
      {scene && (
        <figure className="lab-hero-image">
          <img src={scene.url} alt="" loading="lazy" />
          <figcaption className="lab-hero-credit">Photo by {scene.photographer}</figcaption>
        </figure>
      )}
      <h1>{lab.title}</h1>
      <p>{lab.description}</p>
      <LabExplorer lab={lab} />
      <ContextualCuratedKitchen context={lab.slug} title={`Shop the ${lab.title}`} />
    </main>
  )
}
