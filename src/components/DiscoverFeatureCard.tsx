import { Link } from 'react-router-dom'
import { CakeHeroImage } from './CakeHeroImage'
import './DiscoverFeatureCard.css'

export function DiscoverFeatureCard({
  to,
  title,
  description,
  cta,
  meta,
  cakeId,
  imageUrl,
  imageAlt,
  photographer,
  photographerUrl,
  unsplashUrl,
}: {
  to: string
  title: string
  description: string
  cta: string
  meta?: string
  cakeId?: string
  imageUrl?: string
  imageAlt?: string
  photographer?: string
  photographerUrl?: string
  unsplashUrl?: string
}) {
  return (
    <Link to={to} className="discover-feature-card">
      {cakeId && <CakeHeroImage cakeId={cakeId} variant="hero" alt={imageAlt ?? title} />}
      {imageUrl && (
        <div className="discover-feature-card-image">
          <img src={imageUrl} alt={imageAlt ?? title} loading="lazy" />
          {photographer && photographerUrl && unsplashUrl && (
            <p className="discover-feature-card-credit" title={`Photo by ${photographer} on Unsplash`}>
              <a href={photographerUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                {photographer}
              </a>{' '}
              /{' '}
              <a href={unsplashUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                Unsplash
              </a>
            </p>
          )}
        </div>
      )}
      <div className="discover-feature-card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        {meta && <span className="discover-feature-card-meta">{meta}</span>}
        <span className="btn discover-feature-card-cta">{cta}</span>
      </div>
    </Link>
  )
}
