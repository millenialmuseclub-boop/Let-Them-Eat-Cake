import type { CakeProfile } from '../types/cake'
import { SocialShareCard } from './SocialShareCard'

export function RecipeShareCard({ cake }: { cake: CakeProfile }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cake/${cake.id}` : ''
  const shareText = `Tonight we're baking ${cake.name} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="Tonight We're Baking"
      title={cake.name}
      bodyText={cake.description}
      cta="Save the recipe"
      shareUrl={shareUrl}
      shareText={shareText}
      filename={`${cake.id}-recipe`}
    />
  )
}
