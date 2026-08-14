import type { CakeProfile } from '../types/cake'
import type { DrinkProfile } from '../types/sommelier'
import { SocialShareCard } from './SocialShareCard'

export function SommelierShareCard({ cake, drink, score }: { cake: CakeProfile; drink: DrinkProfile; score: number; reason?: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `${cake.name} + ${drink.name} — a ${score}/100 pairing 🍰🥂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="The Cake Sommelier"
      title={`${cake.name} × ${drink.name}`}
      subtitle={`${score}/100 Pairing`}
      bodyText={`${cake.flavorNotes[0]} meets ${drink.flavorNotes[0]}.`}
      cta="Find your pairing"
      shareUrl={shareUrl}
      shareText={shareText}
    />
  )
}
