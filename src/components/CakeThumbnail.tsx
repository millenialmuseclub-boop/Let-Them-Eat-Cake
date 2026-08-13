import { getCakeImage } from '../lib/images'
import { CakeHeroImage } from './CakeHeroImage'

/** CakeHeroImage renders nothing when a cake has no photo -- this always shows something, real photo or the placeholder icon, for grids/cards where every entry needs to look consistent. */
export function CakeThumbnail({ cakeId, alt, variant = 'thumbnail' }: { cakeId: string; alt: string; variant?: 'hero' | 'thumbnail' }) {
  if (getCakeImage(cakeId)) {
    return <CakeHeroImage cakeId={cakeId} variant={variant} alt={alt} />
  }
  return (
    <div className={`cake-hero-image cake-hero-image-${variant} cake-hero-image-placeholder`}>
      <img src="/icon-master.svg" alt="" />
    </div>
  )
}
