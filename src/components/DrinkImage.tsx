import { getDrinkImage } from '../lib/drinkImages'
import './DrinkImage.css'

export function DrinkImage({ drinkId, variant, alt }: { drinkId: string; variant: 'hero' | 'thumbnail'; alt: string }) {
  const image = getDrinkImage(drinkId)
  if (!image) return null

  return (
    <div className={`drink-image drink-image-${variant}`}>
      <img src={image.url} alt={alt} loading="lazy" />
      {variant === 'hero' && (
        <span className="drink-image-credit" title={`Photo by ${image.photographer} on Unsplash`}>
          {image.photographer} / Unsplash
        </span>
      )}
    </div>
  )
}
