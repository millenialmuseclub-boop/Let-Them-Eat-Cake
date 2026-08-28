import { getRamenImage } from '../../lib/ramen/images'
import { RamenHeroImage } from './RamenHeroImage'

/** Same fallback rule as Cake's CakeThumbnail: RamenHeroImage renders nothing
    without a photo, but this always shows something -- a real photo once
    photography is sourced, or the branded placeholder icon today -- so card
    geometry never breaks just because Phase 2 has no photography yet. */
export function RamenThumbnail({ ramenId, alt, variant = 'thumbnail' }: { ramenId: string; alt: string; variant?: 'hero' | 'thumbnail' }) {
  if (getRamenImage(ramenId)) {
    return <RamenHeroImage ramenId={ramenId} variant={variant} alt={alt} />
  }
  return (
    <div className={`ramen-hero-image ramen-hero-image-${variant} ramen-hero-image-placeholder`}>
      <img src="/icon-master.svg" alt="" />
    </div>
  )
}
