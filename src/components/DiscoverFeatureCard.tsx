import { Link } from 'react-router-dom'
import { CakeThumbnail } from './CakeThumbnail'
import { hapticSelect } from '../lib/haptics'
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
  sourceLabel = 'Unsplash',
}: {
  title: string
  description?: string
  cta: string
  meta?: string
  cakeId?: string
  imageUrl?: string
  imageAlt?: string
  photographer?: string
  photographerUrl?: string
  unsplashUrl?: string
  /** Photo source/network shown in the credit line -- defaults to 'Unsplash' since that's what
      every Cake caller uses; other worlds (Pexels, Wikimedia Commons) pass their own. */
  sourceLabel?: string
}) {
  return (
    <>
      {cakeId && <CakeThumbnail cakeId={cakeId} variant="hero" alt={imageAlt ?? title} />}
      {!cakeId && imageUrl && (
        <div className="discover-feature-card-image">
          <img src={imageUrl} alt={imageAlt ?? title} loading="lazy" />
          {photographer && (
            <p className="discover-feature-card-credit" title={`Photo credit: ${photographer}${sourceLabel ? ` / ${sourceLabel}` : ''}`}>
              {photographer}
              {sourceLabel && ` / ${sourceLabel}`}
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
        {description && <p>{description}</p>}
        {meta && <span className="discover-feature-card-meta">{meta}</span>}
        <span className="btn discover-feature-card-cta">{cta}</span>
      </div>
    </>
  )
}

type DiscoverFeatureCardProps = {
  title: string
  description?: string
  cta: string
  meta?: string
  cakeId?: string
  imageUrl?: string
  imageAlt?: string
  photographer?: string
  photographerUrl?: string
  unsplashUrl?: string
  sourceLabel?: string
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
    <button
      className="discover-feature-card"
      onClick={() => {
        hapticSelect()
        onClick?.()
      }}
    >
      <DiscoverFeatureCardBody {...body} />
    </button>
  )
}
