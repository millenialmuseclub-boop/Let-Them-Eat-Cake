import type { WeddingPlanResult } from '../types/weddingCake'
import { getCake } from '../lib/data'
import { formatOccasionLabel } from '../lib/weddingCake'
import { SocialShareCard } from './SocialShareCard'

export function CelebrateShareCard({ result }: { result: WeddingPlanResult }) {
  const flavorNames = result.tierPicks.map((pick) => getCake(pick.cakeId)?.name).filter((name): name is string => !!name)
  const leadFlavor = flavorNames[0]
  const occasionLabel = formatOccasionLabel(result.input.occasion)

  const title = `${result.aesthetic.name} ${occasionLabel} Cake`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${title} — ${flavorNames.join(' · ')} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow={`Our ${occasionLabel} Cake`}
      title={leadFlavor ?? title}
      subtitle={occasionLabel}
      bodyText={result.decorationStyle.name}
      cta="Designed with Let Them Eat Cake"
      shareUrl={shareUrl}
      shareText={shareText}
    />
  )
}
