import { getCakeImage } from '../lib/images'
import { useState } from 'react'
import './CakeHeroImage.css'

export function CakeHeroImage({ cakeId, variant, alt }: { cakeId: string; variant: 'hero' | 'thumbnail'; alt: string }) {
  const image = getCakeImage(cakeId)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  if (!image) return null
  if (failedUrl === image.url) return <div className={`cake-hero-image cake-hero-image-${variant} cake-hero-image-placeholder`} role="img" aria-label={`${alt} — photo unavailable`}><span>Photo unavailable</span></div>

  return (
    <div className={`cake-hero-image cake-hero-image-${variant}`}>
      <img src={image.url} alt={alt} loading={variant === 'hero' ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedUrl(image.url)} />
      {variant === 'hero' && (
        <span className="cake-hero-image-credit" title={`Photo by ${image.photographer} on ${image.source ?? 'Unsplash'}`}>
          {image.photographer} / {image.source ?? 'Unsplash'}
        </span>
      )}
    </div>
  )
}
