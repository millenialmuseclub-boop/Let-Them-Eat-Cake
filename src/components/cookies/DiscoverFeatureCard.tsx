import { Link } from 'react-router-dom'
import type { CookieImage } from '../../types/cookies/images'

export function DiscoverFeatureCard({
  to,
  title,
  description,
  icon,
  image,
}: {
  to: string
  title: string
  description: string
  icon: string
  image?: CookieImage
}) {
  if (!image) {
    return (
      <Link to={to} className="discover-feature-card">
        <div className="discover-feature-card-scrim">
          <span className="discover-feature-card-icon" aria-hidden="true">{icon}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link to={to} className="discover-feature-card">
      <div className="discover-feature-card-image">
        <img src={image.url} alt="" loading="lazy" />
        <p className="discover-feature-card-credit">Photo by {image.photographer}</p>
      </div>
      <div className="discover-feature-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  )
}
