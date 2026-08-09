import type { CakeProfile } from '../types/cake'
import { SocialShareCard } from './SocialShareCard'

export function OtherCelebrationShareCard({
  cake,
  occasionName,
  moodName,
  whyItFits,
}: {
  cake: CakeProfile
  occasionName: string
  moodName: string
  whyItFits: string
}) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `My ${occasionName} cake is ${cake.name} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow={`Let Them Eat Cake — ${occasionName}`}
      title={cake.name}
      subtitle={moodName}
      bodyLabel="Why it fits"
      bodyText={whyItFits}
      cta="Plan your own celebration cake"
      shareUrl={shareUrl}
      shareText={shareText}
      filename={`${cake.id}-celebration-cake`}
    />
  )
}
