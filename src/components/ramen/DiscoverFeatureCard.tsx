import { Link } from 'react-router-dom'
import { RamenThumbnail } from './RamenThumbnail'
import { displayImageUrl } from '../../lib/ramen/images'
import './DiscoverFeatureCard.css'

type DiscoverFeatureCardProps = {
  title: string
  description?: string
  cta: string
  meta?: string
  ramenId?: string
  /** Generic (non-ramen) editorial photography -- Workshop Labs, Main, Slurp, etc. Ignored when `ramenId` is set. */
  imageUrl?: string
  photographer?: string
  photographerUrl?: string
  source?: string
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

function DiscoverFeatureCardBody({ title, description, cta, meta, ramenId, imageUrl, photographer, source }: Omit<DiscoverFeatureCardProps, 'to' | 'onClick'>) {
  return (
    <>
      {ramenId ? (
        <RamenThumbnail ramenId={ramenId} variant="hero" alt={title} />
      ) : imageUrl ? (
        <div className="discover-feature-card-image">
          <img src={displayImageUrl({ url: imageUrl, source: source ?? '' }, 'hero')} alt={title} loading="lazy" />
          {photographer && (
            <span className="discover-feature-card-credit" title={`Photo by ${photographer}${source ? ` on ${source}` : ''}`}>
              {photographer}
              {source ? ` / ${source}` : ''}
            </span>
          )}
        </div>
      ) : (
        <RamenThumbnail ramenId="" variant="hero" alt={title} />
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
