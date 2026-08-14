import type { CakeProfile } from '../types/cake'
import { SocialShareCard } from './SocialShareCard'

export function OtherCelebrationShareCard({
  cake,
  occasionName,
  moodName,
}: {
  cake: CakeProfile
  occasionName: string
  moodName: string
  whyItFits?: string
}) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `My ${occasionName} cake is ${cake.name} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow={`Your ${occasionName} Cake`}
      title={cake.name}
      subtitle={moodName}
      bodyText="Made for the moment."
      cta="Plan your own"
      shareUrl={shareUrl}
      shareText={shareText}
    />
  )
}
