import { Link } from 'react-router-dom'
import { CakeThumbnail } from './CakeThumbnail'
import './DiscoverFeatureCard.css'

function DiscoverFeatureCardBody({
  title,
  description,
  cta,
  meta,
  cakeId,
  imageUrl,
  imageAlt,
  photographer,
}: {
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
    <>
      {cakeId && <CakeThumbnail cakeId={cakeId} variant="hero" alt={imageAlt ?? title} />}
      {!cakeId && imageUrl && (
        <div className="discover-feature-card-image">
          <img src={imageUrl} alt={imageAlt ?? title} loading="lazy" />
          {photographer && (
            <p className="discover-feature-card-credit" title={`Photo by ${photographer} on Unsplash`}>
              {photographer} / Unsplash
            </p>
          )}
        </div>
      )}
      {!cakeId && !imageUrl && (
        <div className="cake-hero-image cake-hero-image-hero cake-hero-image-placeholder">
          <img src="/icon-master.svg" alt="" />
        </div>
      )}
      <div className="discover-feature-card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        {meta && <span className="discover-feature-card-meta">{meta}</span>}
        <span className="btn discover-feature-card-cta">{cta}</span>
      </div>
    </>
  )
}

type DiscoverFeatureCardProps = {
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
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

export function DiscoverFeatureCard(props: DiscoverFeatureCardProps) {
  const { to, onClick, ...body } = props

  if (to) {
    return (
      <Link to={to} className="discover-feature-card">
        <DiscoverFeatureCardBody {...body} />
      </Link>
    )
  }

  return (
    <button className="discover-feature-card" onClick={onClick}>
      <DiscoverFeatureCardBody {...body} />
    </button>
  )
}
