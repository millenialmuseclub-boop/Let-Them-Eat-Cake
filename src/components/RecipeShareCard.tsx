import type { CakeProfile } from '../types/cake'
import { SocialShareCard } from './SocialShareCard'

export function RecipeShareCard({ cake }: { cake: CakeProfile }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `Tonight we're baking ${cake.name} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="Tonight We're Baking"
      title={cake.name}
      bodyText={cake.flavorNotes.slice(0, 3).join(' · ')}
      cta="Bake it"
      shareUrl={shareUrl}
      shareText={shareText}
    />
  )
}
