import type { CakePersonality } from '../types/personaMatch'
import { getPersonalityImage } from '../lib/personalityImages'
import { SocialShareCard } from './SocialShareCard'

export function PersonaShareCard({ personality, deepLinkPath }: { personality: CakePersonality; deepLinkPath: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${deepLinkPath}` : deepLinkPath
  const shareText = `My cake personality is ${personality.name} — ${personality.personalityTitle} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="My Cake Personality Is"
      title={personality.name}
      subtitle={personality.personalityTitle}
      bodyText={personality.description}
      colorHex={personality.colorHex}
      imageUrl={getPersonalityImage(personality.id)?.url}
      shareUrl={shareUrl}
      shareText={shareText}
      filename={`${personality.id}-cake-personality`}
    />
  )
}
