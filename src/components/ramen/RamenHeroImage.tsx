import { getRamenImage, displayImageUrl } from '../../lib/ramen/images'
import './RamenHeroImage.css'

/** Same component shape as Cake's CakeHeroImage: renders nothing when there's
    no photo for this id. Card/grid contexts should use RamenThumbnail
    instead, which always renders something (real photo or placeholder). */
export function RamenHeroImage({ ramenId, variant, alt }: { ramenId: string; variant: 'hero' | 'thumbnail'; alt: string }) {
  const image = getRamenImage(ramenId)
  if (!image) return null

  return (
    <div className={`ramen-hero-image ramen-hero-image-${variant}`}>
      <img src={displayImageUrl(image, variant)} alt={alt} loading="lazy" />
      {variant === 'hero' && (
        <span className="ramen-hero-image-credit" title={`Photo by ${image.photographer} on ${image.source}`}>
          {image.photographer} / {image.source}
        </span>
      )}
    </div>
  )
}
