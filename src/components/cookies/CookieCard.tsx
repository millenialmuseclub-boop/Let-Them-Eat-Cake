import { Link } from 'react-router-dom'
import type { CookieProfile } from '../../types/cookies/cookie'
import { CookieThumbnail } from './CookieHeroImage'

export function CookieCard({ cookie }: { cookie: CookieProfile }) {
  return (
    <Link to={`/cookies/encyclopedia/${cookie.id}`} className="cookie-card">
      <CookieThumbnail cookieId={cookie.id} name={cookie.name} />
      <div className="cookie-card-body">
        <h3 className="cookie-card-title">{cookie.name}</h3>
        <p className="cookie-card-origin">{cookie.origin}</p>
        <p className="cookie-card-description">{cookie.description}</p>
        <div className="cookie-card-tags">
          <span className="tag">{cookie.family}</span>
          <span className="tag">{cookie.textureCategory}</span>
        </div>
      </div>
    </Link>
  )
}
