import type { CakeProfile } from '../types/cake'
import { SocialShareCard } from './SocialShareCard'

export function BirthdayShareCard({ cake, energyName, flavorName }: { cake: CakeProfile; energyName: string; flavorName: string; whyItFits?: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `My birthday cake is ${cake.name} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="Your Birthday Cake"
      title={cake.name}
      subtitle={`${energyName} · ${flavorName}`}
      bodyText="Made for the moment."
      cta="Create your own"
      shareUrl={shareUrl}
      shareText={shareText}
    />
  )
}
