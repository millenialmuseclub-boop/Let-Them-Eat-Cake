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
import { birthdayEnergies, birthdayFlavors, getCake } from '../../../src/shared/lib/data'
import { pickBirthdayCake } from '../../../src/shared/lib/birthdayMatch'
import { getTopPairings } from '../../../src/shared/lib/encyclopedia'
import type { BirthdayEnergy, BirthdayFlavor } from '../../../src/shared/types/birthday'
import { useTheme } from '../../../src/theme/useTheme'

const BIRTHDAY_CAKE_PRODUCT_IDS_BY_FLAVOR: Record<string, string[]> = {
  Funfetti: ['product_cake_confetti'],
  Chocolate: ['product_cake_brooklyn_blackout', 'product_cake_earls_court_chocolate', 'product_cake_molten_lava'],
}
const BIRTHDAY_CAKE_PRODUCT_IDS_BY_ENERGY: Record<string, string[]> = {
  Romantic: ['product_cake_bridgerton_lemon_lavender'],
}

const WHO_OPTIONS = ['Me', 'Adult', 'Child', 'Teen', 'Milestone Birthday']

type Step = 'who' | 'energy' | 'flavor' | 'result'

export default function BirthdayScreen() {
  const theme = useTheme()
  const [step, setStep] = useState<Step>('who')
  const [who, setWho] = useState('')
  const [energy, setEnergy] = useState<BirthdayEnergy>()
  const [flavor, setFlavor] = useState<BirthdayFlavor>()

  if (step === 'result' && energy && flavor) {
    const cake = pickBirthdayCake(flavor.keywords, energy.texture, energy.mood)
    const pairings = getTopPairings(cake, 1)
    const inspiration = getProductsByIds([...(BIRTHDAY_CAKE_PRODUCT_IDS_BY_FLAVOR[flavor.name] ?? []), ...(BIRTHDAY_CAKE_PRODUCT_IDS_BY_ENERGY[energy.name] ?? [])])

    return (
      <Screen>
        <Eyebrow>Birthday</Eyebrow>
        <Title>{cake.name}</Title>
        <Body style={{ marginTop: 4 }}>Perfect for {who || 'their'} birthday.</Body>

        <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>🍰 Flavor</Subtitle>
        <Caption>{cake.flavorNotes.join(' · ')}</Caption>

        <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>✨ Why It Fits</Subtitle>
        <Body>
          A {energy.name.toLowerCase()} {flavor.name.toLowerCase()} cake, matched for {who ? `a ${who.toLowerCase()}'s` : 'their'} birthday.
        </Body>

        {pairings[0] && (
          <>
            <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>🥂 Perfect Pairing</Subtitle>
            <Pressable onPress={() => router.push(`/sommelier?cakeId=${cake.id}`)}>
              <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>{pairings[0].drink.name} — Explore in the Sommelier →</Body>
            </Pressable>
          </>
        )}

        <AffiliateProductSet title="Cake Inspiration" products={inspiration} context="birthday" />

        <Pressable onPress={() => router.push('/celebrate/time-machine')} style={{ marginTop: theme.spacing.md }}>
          <Body style={{ color: theme.colors.gold, fontWeight: '600' }}>🎂 Curious what cake defined your birth year? Try the Birthday Time Machine →</Body>
        </Pressable>

        <Pressable onPress={() => router.push(`/discover/cake/${cake.id}`)} style={{ marginTop: theme.spacing.md }}>
          <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>View Recipe →</Body>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: theme.spacing.md }}>
          <SaveButton type="cake" id={cake.id} />
          <ShareButton payload={{ text: `${cake.name} — the perfect birthday cake 🎂` }} context="birthday" />
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <Eyebrow>Birthday</Eyebrow>
      {step === 'who' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>Who's celebrating?</Title>
          {WHO_OPTIONS.map((w) => (
            <OptionRow key={w} title={w} onPress={() => { setWho(w); setStep('energy') }} />
          ))}
        </>
      )}
      {step === 'energy' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>What kind of birthday?</Title>
          {birthdayEnergies.map((e) => (
            <OptionRow key={e.id} title={e.name} description={e.description} onPress={() => { setEnergy(e); setStep('flavor') }} />
          ))}
        </>
      )}
      {step === 'flavor' && (
        <>
          <Title style={{ marginBottom: theme.spacing.md }}>What will make them happiest?</Title>
          {birthdayFlavors.map((f) => (
            <OptionRow key={f.id} title={f.name} description={f.description} onPress={() => { setFlavor(f); trackCelebrationGenerated('birthday', ''); setStep('result') }} />
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
      {description && <Caption style={{ marginTop: 2 }}>{description}</Caption>}
    </Pressable>
  )
}
