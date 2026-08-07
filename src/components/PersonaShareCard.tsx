import type { CakePersonality } from '../types/personaMatch'
import { FlavorRadarChart } from './FlavorRadarChart'
import { SocialShareCard } from './SocialShareCard'

export function PersonaShareCard({ personality, deepLinkPath }: { personality: CakePersonality; deepLinkPath: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${deepLinkPath}` : deepLinkPath
  const shareText = `My cake personality is ${personality.name} — ${personality.personalityTitle} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="My Cake Personality Is"
      title={personality.name}
      subtitle={personality.personalityTitle}
      colorHex={personality.colorHex}
      shareUrl={shareUrl}
      shareText={shareText}
      filename={`${personality.id}-cake-personality`}
    >
      <FlavorRadarChart profile={personality.targetFlavorProfile} colorHex="#ffffff" />
    </SocialShareCard>
  )
}
