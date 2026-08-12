import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { AffiliateProductSet } from '../../../src/components/AffiliateProductSet'
import { Screen } from '../../../src/components/Screen'
import { SaveButton } from '../../../src/components/SaveButton'
import { ShareButton } from '../../../src/components/ShareButton'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { trackCelebrationGenerated } from '../../../src/services/analyticsService'
import { getProductsByIds } from '../../../src/shared/lib/affiliateProducts'
import { pickBirthdayCake } from '../../../src/shared/lib/birthdayMatch'
import { birthdayFlavors, otherCelebrationMoods, otherCelebrationOccasions } from '../../../src/shared/lib/data'
import type { BirthdayEnergy, BirthdayFlavor } from '../../../src/shared/types/birthday'
import type { OtherCelebrationOccasion } from '../../../src/shared/types/otherCelebration'
import { useTheme } from '../../../src/theme/useTheme'

const OTHER_CAKE_PRODUCT_IDS_BY_MOOD: Record<string, string[]> = {
  Romantic: ['product_cake_bridgerton_lemon_lavender'],
  Traditional: ['product_cake_red_velvet', 'product_cake_hummingbird', 'product_cake_seven_layer_caramel'],
}
const OTHER_CAKE_PRODUCT_IDS_BY_FLAVOR: Record<string, string[]> = {
  Chocolate: ['product_cake_brooklyn_blackout', 'product_cake_earls_court_chocolate', 'product_cake_molten_lava'],
}

type Step = 'occasion' | 'mood' | 'flavor' | 'result'

export default function OtherCelebrationScreen() {
  const theme = useTheme()
  const [step, setStep] = useState<Step>('occasion')
  const [occasion, setOccasion] = useState<OtherCelebrationOccasion>()
  const [mood, setMood] = useState<BirthdayEnergy>()
  const [flavors, setFlavors] = useState<BirthdayFlavor[]>([])

  function toggleFlavor(f: BirthdayFlavor) {
    setFlavors((prev) => {
      if (prev.some((p) => p.id === f.id)) return prev.filter((p) => p.id !== f.id)
      if (prev.length >= 2) return [prev[1], f]
      return [...prev, f]
    })
  }

  if (step === 'result' && occasion && mood && flavors.length > 0) {
    const keywords = flavors.flatMap((f) => f.keywords)
    const cake = pickBirthdayCake(keywords, mood.texture, mood.mood)
    const flavorNames = flavors.map((f) => f.name)
    const inspiration = getProductsByIds([...(OTHER_CAKE_PRODUCT_IDS_BY_MOOD[mood.name] ?? []), ...flavorNames.flatMap((f) => OTHER_CAKE_PRODUCT_IDS_BY_FLAVOR[f] ?? [])])

    return (
      <Screen>
        <Eyebrow>{occasion.name}</Eyebrow>
        <Title>{cake.name}</Title>
        <Body style={{ marginTop: 4 }}>
          A {mood.name.toLowerCase()} cake for your {occasion.name.toLowerCase()}, in {flavorNames.join(' & ').toLowerCase()}.
        </Body>

        <AffiliateProductSet title="Cake Inspiration" products={inspiration} context="other-celebration" />

        <Pressable onPress={() => router.push(`/discover/cake/${cake.id}`)} style={{ marginTop: theme.spacing.md }}>
          <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>View Recipe →</Body>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: theme.spacing.md }}>
          <SaveButton type="cake" id={cake.id} />
          <ShareButton payload={{ text: `${cake.name} — perfect for a ${occasion.name.toLowerCase()} 🎉` }} context="other-celebration" />
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <Eyebrow>Other Celebrations</Eyebrow>
      {step === 'occasion' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>What are we celebrating?</Title>
          {otherCelebrationOccasions.map((o) => (
            <OptionRow key={o.id} title={o.name} onPress={() => { setOccasion(o); setStep('mood') }} />
          ))}
        </>
      )}
      {step === 'mood' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>What's the mood?</Title>
          {otherCelebrationMoods.map((m) => (
            <OptionRow key={m.id} title={m.name} description={m.description} onPress={() => { setMood(m); setStep('flavor') }} />
          ))}
        </>
      )}
      {step === 'flavor' && (
        <>
          <Title style={{ marginBottom: 4 }}>Pick up to 2 flavors</Title>
          <Caption style={{ marginBottom: theme.spacing.md }}>{flavors.length} of 2 selected</Caption>
          {birthdayFlavors.map((f) => {
            const active = flavors.some((p) => p.id === f.id)
            return (
              <Pressable
                key={f.id}
                onPress={() => toggleFlavor(f)}
                style={{ padding: 16, borderRadius: theme.radius.md, borderWidth: 1, borderColor: active ? theme.colors.raspberry : theme.colors.border, backgroundColor: active ? theme.colors.raspberryBg : theme.colors.bgCard, marginBottom: 10 }}
              >
                <Body style={{ fontWeight: '700' }}>{f.name}</Body>
              </Pressable>
            )
          })}
          <Pressable
            disabled={flavors.length === 0}
            onPress={() => { trackCelebrationGenerated('other', ''); setStep('result') }}
            style={{ backgroundColor: flavors.length ? theme.colors.raspberry : theme.colors.border, borderRadius: theme.radius.pill, paddingVertical: 14, alignItems: 'center', marginTop: 8 }}
          >
            <Body style={{ color: '#fff', fontWeight: '700' }}>Create My Cake</Body>
          </Pressable>
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
      {description && <Caption style={{ marginTop: 2 }}>{description}</Caption>}
    </Pressable>
  )
}
