import { getCakeImage } from '../lib/images'
import './CakeHeroImage.css'

export function CakeHeroImage({ cakeId, variant, alt }: { cakeId: string; variant: 'hero' | 'thumbnail'; alt: string }) {
  const image = getCakeImage(cakeId)
  if (!image) return null

  return (
    <div className={`cake-hero-image cake-hero-image-${variant}`}>
      <img src={image.url} alt={alt} loading="lazy" />
      {variant === 'hero' && (
        <span className="cake-hero-image-credit" title={`Photo by ${image.photographer} on Unsplash`}>
          {image.photographer} / Unsplash
        </span>
      )}
    </div>
  )
}
