import { getIngredientImage } from '../lib/ingredientImages'
import './IngredientThumbnail.css'

/** Always renders something -- a real photo when we have one, otherwise the branded
    placeholder -- so ingredient cards never fall back to text-only. */
export function IngredientThumbnail({ slug, alt }: { slug: string; alt: string }) {
  const image = getIngredientImage(slug)

  if (image) {
    return (
      <div className="ingredient-thumbnail">
        <img src={image.url} alt={alt} loading="lazy" />
      </div>
    )
  }

  return (
    <div className="ingredient-thumbnail ingredient-thumbnail-placeholder">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 3c-3 3-5 6-5 9a5 5 0 0 0 10 0c0-3-2-6-5-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
