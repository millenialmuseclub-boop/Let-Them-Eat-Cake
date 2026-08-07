import { getDrinkImage } from '../lib/drinkImages'
import './DrinkImage.css'

export function DrinkImage({ drinkId, variant, alt }: { drinkId: string; variant: 'hero' | 'thumbnail'; alt: string }) {
  const image = getDrinkImage(drinkId)
  if (!image) return null

  return (
    <div className={`drink-image drink-image-${variant}`}>
      <img src={image.url} alt={alt} loading="lazy" />
      {variant === 'hero' && (
        <p className="drink-image-credit">
          Photo by{' '}
          <a href={image.photographerUrl} target="_blank" rel="noreferrer">
            {image.photographer}
          </a>{' '}
          on{' '}
          <a href={image.unsplashUrl} target="_blank" rel="noreferrer">
            Unsplash
          </a>
        </p>
      )}
    </div>
  )
}
