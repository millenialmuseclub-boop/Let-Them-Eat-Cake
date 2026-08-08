import type { WeddingPlanResult } from '../types/weddingCake'
import { getCake } from '../lib/data'
import { getCakeImage } from '../lib/images'
import { formatOccasionLabel } from '../lib/weddingCake'
import { SocialShareCard } from './SocialShareCard'

export function CelebrateShareCard({ result }: { result: WeddingPlanResult }) {
  const tierCount = result.architecturePlan.tiers.length
  const totalServings = result.architecturePlan.tiers.reduce((sum, tier) => sum + tier.partySlices, 0)
  const flavorNames = result.tierPicks.map((pick) => getCake(pick.cakeId)?.name).filter((name): name is string => !!name)
  const baseCake = result.tierPicks.find((pick) => pick.role === 'base') ?? result.tierPicks[0]
  const baseCakeProfile = baseCake ? getCake(baseCake.cakeId) : undefined

  const title = `${tierCount}-Tier ${result.aesthetic.name} ${formatOccasionLabel(result.input.occasion)} Cake`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${title} — ${flavorNames.join(' · ')} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="Let Them Eat Cake — Celebrate"
      title={title}
      subtitle={flavorNames.join(' · ')}
      bodyText={`Serves ${totalServings} — finished in ${result.decorationStyle.name}`}
      colorHex={result.aesthetic.swatchHex}
      imageUrl={baseCakeProfile ? getCakeImage(baseCakeProfile.id)?.url : undefined}
      shareUrl={shareUrl}
      shareText={shareText}
      filename="celebration-cake-concept"
    />
  )
}
