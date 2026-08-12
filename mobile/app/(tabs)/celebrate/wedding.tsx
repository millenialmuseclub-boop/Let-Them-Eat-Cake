import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { AffiliateProductSet } from '../../../src/components/AffiliateProductSet'
import { Screen } from '../../../src/components/Screen'
import { ShareButton } from '../../../src/components/ShareButton'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { trackCelebrationGenerated } from '../../../src/services/analyticsService'
import { getCake, weddingAesthetics, weddingCultures, weddingSeasons } from '../../../src/shared/lib/data'
import { getProductsByIds } from '../../../src/shared/lib/affiliateProducts'
import { buildCuttingGuide, generateTierPlan, pickArchitecture } from '../../../src/shared/lib/weddingArchitecture'
import { pickTiers } from '../../../src/shared/lib/weddingFlavor'
import type { WeddingAesthetic, WeddingCulture, WeddingSeasonEntry } from '../../../src/shared/types/weddingCake'
import { useTheme } from '../../../src/theme/useTheme'

const GUEST_OPTIONS = [50, 100, 150, 250]

// Cake Inspiration mapping — same pattern as the web app's WeddingResultSummary.tsx,
// keyed by aesthetic name.
const WEDDING_CAKE_PRODUCT_IDS: Record<string, string[]> = {
  'Black Tie': ['product_cake_jfk_wedding'],
  'Garden Romantic': ['product_cake_bridgerton_lemon_lavender'],
}

type Step = 'style' | 'guests' | 'season' | 'result'

export default function WeddingScreen() {
  const theme = useTheme()
  const [step, setStep] = useState<Step>('style')
  const [aesthetic, setAesthetic] = useState<WeddingAesthetic>()
  const [culture, setCulture] = useState<WeddingCulture>(weddingCultures[0])
  const [guests, setGuests] = useState(100)
  const [season, setSeason] = useState<WeddingSeasonEntry>()

  if (step === 'result' && aesthetic && season) {
    const { architecture, reason } = pickArchitecture(aesthetic, culture)
    const plan = generateTierPlan(guests, aesthetic, culture)
    const picks = pickTiers(season, culture, 'none', plan.tiers.length)
    const cuttingGuide = buildCuttingGuide(plan.tiers)
    const inspiration = getProductsByIds(WEDDING_CAKE_PRODUCT_IDS[aesthetic.name] ?? [])

    return (
      <Screen>
        <Eyebrow>Your Celebration Concept</Eyebrow>
        <Title>{aesthetic.name}</Title>
        <Body style={{ marginTop: 4 }}>{reason}</Body>

        <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>🏰 Structure</Subtitle>
        <Caption>{architecture.replace(/-/g, ' ')} — {plan.tiers.length} tiers, serves ~{guests}</Caption>
        {plan.stabilityNotes.map((n, i) => (
          <Body key={i} style={{ marginTop: 4 }}>
            • {n}
          </Body>
        ))}

        <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>🍰 Tier Flavors</Subtitle>
        {picks.map((pick) => {
          const cake = getCake(pick.cakeId)
          return (
            <View key={`${pick.role}-${pick.cakeId}`} style={{ marginBottom: 10 }}>
              <Body style={{ fontWeight: '700' }}>
                {pick.role.toUpperCase()}: {cake?.name}
              </Body>
              {pick.reason.map((r, i) => (
                <Caption key={i}>• {r}</Caption>
              ))}
            </View>
          )
        })}

        <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>🔪 Cutting Guide</Subtitle>
        {cuttingGuide.map((line, i) => (
          <Body key={i} style={{ marginBottom: 2 }}>
            {line}
          </Body>
        ))}

        <AffiliateProductSet title="Cake Inspiration" products={inspiration} context="wedding" />
        <ShareButton payload={{ text: `Our wedding cake concept: ${aesthetic.name} 💍` }} context="wedding" />
      </Screen>
    )
  }

  return (
    <Screen>
      <Eyebrow>Wedding</Eyebrow>
      {step === 'style' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>Choose a style</Title>
          {weddingAesthetics.map((a) => (
            <OptionRow key={a.id} title={a.name} description={a.description} onPress={() => { setAesthetic(a); setStep('guests') }} />
          ))}
        </>
      )}
      {step === 'guests' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>How many guests?</Title>
          {GUEST_OPTIONS.map((g) => (
            <OptionRow key={g} title={`${g} guests`} onPress={() => { setGuests(g); setStep('season') }} />
          ))}
        </>
      )}
      {step === 'season' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>What season?</Title>
          {weddingSeasons.map((s) => (
            <OptionRow key={s.id} title={s.name} onPress={() => { setSeason(s); trackCelebrationGenerated('wedding', ''); setStep('result') }} />
          ))}
        </>
      )}
    </Screen>
  )
}

function OptionRow({ title, description, onPress }: { title: string; description?: string; onPress: () => void }) {
  const theme = useTheme()
  return (
    <Pressable onPress={onPress} style={{ padding: 16, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.bgCard, marginBottom: 10 }}>
      <Body style={{ fontWeight: '700' }}>{title}</Body>
      {description && (
        <Caption style={{ marginTop: 2 }} numberOfLines={2}>
          {description}
        </Caption>
      )}
    </Pressable>
  )
}
