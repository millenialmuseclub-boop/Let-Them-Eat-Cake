import type { CakeProfile } from '../types/cake'
import type { DrinkProfile } from '../types/sommelier'
import { getCakeImage } from '../lib/images'
import { getDrinkImage } from '../lib/drinkImages'
import { SocialShareCard } from './SocialShareCard'
import './SommelierShareCard.css'

export function SommelierShareCard({ cake, drink, score, reason }: { cake: CakeProfile; drink: DrinkProfile; score: number; reason: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `${cake.name} + ${drink.name} — a ${score}/100 pairing 🍰🥂 #LetThemEatCake`
  const cakeImageUrl = getCakeImage(cake.id)?.url
  const drinkImageUrl = getDrinkImage(drink.id)?.url

  return (
    <SocialShareCard
      eyebrow="Cake Sommelier"
      title={`${cake.name} + ${drink.name}`}
      subtitle={`${score}/100 Pairing`}
      bodyText={reason}
      colorHex="var(--raspberry)"
      shareUrl={shareUrl}
      shareText={shareText}
      filename={`${cake.id}-${drink.id}-pairing`}
    >
      {(cakeImageUrl || drinkImageUrl) && (
        <div className="sommelier-share-photos">
          {cakeImageUrl && <img src={cakeImageUrl} alt="" crossOrigin="anonymous" />}
          {drinkImageUrl && <img src={drinkImageUrl} alt="" crossOrigin="anonymous" />}
        </div>
      )}
    </SocialShareCard>
  )
}
