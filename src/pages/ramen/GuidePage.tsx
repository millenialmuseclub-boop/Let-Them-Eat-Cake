import { Link, useParams } from 'react-router-dom'
import { getGuide } from '../../lib/ramen/slurp'
import { GuideArticle } from '../../components/ramen/GuideArticle'
import { useDocumentTitle } from '../../lib/useDocumentTitle'

// One route/component for all three Culture Guides -- content-driven, not three bespoke pages.
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

  return (
    <main className="page">
      <h1>{guide.title}</h1>
      <p>{guide.description}</p>
      <GuideArticle guide={guide} />
    </main>
  )
}
