import type { CakeProfile } from '../types/cake'
import { SocialShareCard } from './SocialShareCard'

export function BirthdayShareCard({ cake, energyName, flavorName, whyItFits }: { cake: CakeProfile; energyName: string; flavorName: string; whyItFits: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `My birthday cake is ${cake.name} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="Let Them Eat Cake — Birthday"
      title={cake.name}
      subtitle={`${energyName} · ${flavorName}`}
      bodyLabel="Why it fits"
      bodyText={whyItFits}
      cta="Create your own birthday cake"
      shareUrl={shareUrl}
      shareText={shareText}
      filename={`${cake.id}-birthday-cake`}
    />
  )
}
