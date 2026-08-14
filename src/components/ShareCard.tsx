import { SocialShareCard } from './SocialShareCard'

export function ShareCard({
  year,
  cakeName,
  subtitle,
  bodyText,
}: {
  year: number
  cakeName: string
  subtitle?: string
  bodyText?: string
}) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Born in ${year} — My Official Cake is ${cakeName} 🎂 #LetThemEatCake`

  return (
    <SocialShareCard
      eyebrow="The Cake Of"
      title={String(year)}
      subtitle={subtitle ?? cakeName}
      bodyText={bodyText}
      cta="What cake were you born into?"
      shareUrl={shareUrl}
      shareText={shareText}
    />
  )
}
