import { SocialShareCard } from './SocialShareCard'

export function ShareCard({ year, cakeName, subtitle }: { year: number; cakeName: string; subtitle?: string }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Born in ${year} — My Official Cake is ${cakeName} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow={`Born in ${year}`}
      title={cakeName}
      subtitle={subtitle}
      colorHex="var(--raspberry)"
      shareUrl={shareUrl}
      shareText={shareText}
      filename={`born-in-${year}-cake`}
    />
  )
}
