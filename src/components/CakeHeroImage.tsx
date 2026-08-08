import { getCakeImage } from '../lib/images'
import './CakeHeroImage.css'

export function CakeHeroImage({ cakeId, variant, alt }: { cakeId: string; variant: 'hero' | 'thumbnail'; alt: string }) {
  const image = getCakeImage(cakeId)
  if (!image) return null

  return (
    <div className={`cake-hero-image cake-hero-image-${variant}`}>
      <img src={image.url} alt={alt} loading="lazy" />
      {variant === 'hero' && (
        <p className="cake-hero-image-credit" title={`Photo by ${image.photographer} on Unsplash`}>
          <a href={image.photographerUrl} target="_blank" rel="noreferrer">
            {image.photographer}
          </a>{' '}
          /{' '}
          <a href={image.unsplashUrl} target="_blank" rel="noreferrer">
            Unsplash
          </a>
        </p>
      )}
    </div>
  )
}
