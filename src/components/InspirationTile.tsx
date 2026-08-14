import type { CSSProperties } from 'react'
import { CakeThumbnail } from './CakeThumbnail'
import { hapticSelect } from '../lib/haptics'

/** A choice tile for the Celebrate journeys (Wedding/Birthday/Other Celebrations) --
    shows a real cake photo, editorial scene photo, or falls back to the existing
    swatch/text treatment when neither is available (never a blank/broken area). */
export function InspirationTile({
  onClick,
  className,
  style,
  name,
  description,
  cakeId,
  imageUrl,
  active,
}: {
  onClick: () => void
  className?: string
  style?: CSSProperties
  name: string
  description?: string
  cakeId?: string
  imageUrl?: string
  active?: boolean
}) {
  return (
    <button
      className={`inspiration-tile${className ? ` ${className}` : ''}${active ? ' active' : ''}`}
      style={style}
      onClick={() => {
        hapticSelect()
        onClick()
      }}
    >
      {cakeId ? (
        <CakeThumbnail cakeId={cakeId} alt={name} variant="thumbnail" />
      ) : (
        imageUrl && (
          <div className="inspiration-tile-photo">
            <img src={imageUrl} alt="" loading="lazy" />
          </div>
        )
      )}
      <span className="inspiration-tile-name">{name}</span>
      {description && <span className="inspiration-tile-description">{description}</span>}
    </button>
  )
}
