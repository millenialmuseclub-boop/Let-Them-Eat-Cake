import { Link, useParams } from 'react-router-dom'
import { getGuide } from '../../lib/ramen/slurp'
import { GuideArticle } from '../../components/ramen/GuideArticle'
import { RamenHeroImage } from '../../components/ramen/RamenHeroImage'
import { useDocumentTitle } from '../../lib/useDocumentTitle'

// None of the three Culture Guides is really "about" one specific bowl the way a Lab or Trail
// is, so there's no single obviously-correct photo per guide the way sceneImages.json covers
// Labs/Troubleshooter/Vocabulary. Rather than leave these -- the most text-heavy pages left in
// Ramen -- with zero visual anchor, each guide gets the same real ramen photo already used for
// its own tile on the Slurp index (SlurpPage's RAMEN_IDS, same order/positions), so the guide
// opens on a continuation of the photo you just tapped rather than a new, disconnected one.
const GUIDE_RAMEN_ID: Record<string, string> = {
  'shop-101': 'ramen_nagoya_taiwan',
  ordering: 'ramen_hakata_tonkotsu',
  'how-to-eat': 'ramen_tokyo_shoyu',
}

export function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? getGuide(slug) : undefined

  useDocumentTitle(guide ? `${guide.title} | Let Them Eat` : 'Guide Not Found | Let Them Eat')

  if (!guide) {
    return (
      <main className="page">
        <h1>Guide not found</h1>
        <p>
          We couldn't find that guide. <Link to="/ramen/slurp">Back to Slurp →</Link>
        </p>
      </main>
    )
  }

  const ramenId = GUIDE_RAMEN_ID[guide.slug]

  return (
    <main className="page">
      {ramenId && <RamenHeroImage ramenId={ramenId} variant="hero" alt={guide.title} />}
      <h1>{guide.title}</h1>
      <p>{guide.description}</p>
      <GuideArticle guide={guide} />
    </main>
  )
}
