import { getDrinkImage } from '../lib/drinkImages'
import { DrinkImage } from './DrinkImage'

/** DrinkImage renders nothing when a drink has no photo -- this always shows something for grids/cards where every entry needs to look consistent. */
export function DrinkThumbnail({ drinkId, alt, variant = 'thumbnail' }: { drinkId: string; alt: string; variant?: 'hero' | 'thumbnail' }) {
  if (getDrinkImage(drinkId)) {
    return <DrinkImage drinkId={drinkId} variant={variant} alt={alt} />
  }
  return (
    <div className={`drink-image drink-image-${variant} drink-image-placeholder`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 3h12l-1.5 9a4.5 4.5 0 0 1-9 0L6 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 15v6M8 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
