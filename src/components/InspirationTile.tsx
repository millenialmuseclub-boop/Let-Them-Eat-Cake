import type { CSSProperties } from 'react'
import { CakeThumbnail } from './CakeThumbnail'
import { hapticSelect } from '../lib/haptics'

/** A choice tile for the Celebrate journeys (Wedding/Birthday/Other Celebrations) --
    shows a real cake photo, editorial scene photo, or falls back to the existing
    swatch/text treatment when neither is available (never a blank/broken area). */
/** `compact` renders the same tile as a small horizontal row (thumbnail + text), matching the
    Sommelier drink-select-row treatment -- for simple multiple-choice steps where the full-bleed
    vertical card is more scroll than the choice warrants. */
export function InspirationTile({
  onClick,
  className,
  style,
  name,
  description,
  cakeId,
  imageUrl,
  active,
  compact,
}: {
  onClick: () => void
  className?: string
  style?: CSSProperties
  name: string
  description?: string
  cakeId?: string
  imageUrl?: string
  active?: boolean
  compact?: boolean
}) {
  const photo = cakeId ? (
    <CakeThumbnail cakeId={cakeId} alt={name} variant="thumbnail" />
  ) : (
    imageUrl && (
      <div className="inspiration-tile-photo">
        <img src={imageUrl} alt="" loading="lazy" />
      </div>
    )
  )
  const text = (
    <>
      <span className="inspiration-tile-name">{name}</span>
      {description && <span className="inspiration-tile-description">{description}</span>}
    </>
  )

  return (
    <button
      className={`inspiration-tile${compact ? ' compact' : ''}${className ? ` ${className}` : ''}${active ? ' active' : ''}`}
      style={style}
      onClick={() => {
        hapticSelect()
        onClick()
      }}
    >
      {photo}
      {compact ? <span className="inspiration-tile-text">{text}</span> : text}
    </button>
  )
}
