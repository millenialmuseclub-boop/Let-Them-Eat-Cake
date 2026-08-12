import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { CakePhoto } from '../../../src/components/CakePhoto'
import { Screen } from '../../../src/components/Screen'
import { SaveButton } from '../../../src/components/SaveButton'
import { ShareButton } from '../../../src/components/ShareButton'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { getCake } from '../../../src/shared/lib/data'
import { getTopPairings } from '../../../src/shared/lib/encyclopedia'
import { getCakeForBirthYear } from '../../../src/shared/lib/timeMachine'
import { getYearVariant } from '../../../src/shared/lib/yearVintage'
import { useTheme } from '../../../src/theme/useTheme'

export default function TimeMachineScreen() {
  const theme = useTheme()
  const [yearInput, setYearInput] = useState('')
  const [year, setYear] = useState<number | null>(null)

  const entry = year ? getCakeForBirthYear(year) : null
  const cake = entry ? getCake(entry.cakeId) : null
  const variant = cake && year ? getYearVariant(year, cake.name) : null
  const pairings = cake ? getTopPairings(cake, 1) : []

  return (
    <Screen>
      <Eyebrow>Birthday Time Machine</Eyebrow>
      <Title>What cake defined your birth year?</Title>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <TextInput
          value={yearInput}
          onChangeText={setYearInput}
          placeholder="e.g. 1994"
          placeholderTextColor={theme.colors.text + '80'}
          keyboardType="number-pad"
          style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text }}
        />
        <Pressable
          onPress={() => { const y = parseInt(yearInput, 10); if (!isNaN(y)) setYear(y) }}
          style={{ backgroundColor: theme.colors.raspberry, borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center' }}
        >
          <Body style={{ color: '#fff', fontWeight: '700' }}>Reveal</Body>
        </Pressable>
      </View>

      {entry && cake && variant && (
        <>
          <View style={{ height: 200, borderRadius: theme.radius.lg, overflow: 'hidden', backgroundColor: '#3d2314' }}>
            <CakePhoto cakeId={cake.id} style={{ flex: 1 }} showCredit />
          </View>
          <Caption style={{ marginTop: 8 }}>{entry.decadeLabel}</Caption>
          <Title>{variant.variantName}</Title>
          <Body style={{ marginTop: 4 }}>{variant.twist}</Body>
          <Caption style={{ marginTop: 4, fontStyle: 'italic' }}>{variant.recipeTwistNote}</Caption>

          <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>Why this cake?</Subtitle>
          <Body>{entry.eraContext}</Body>

          {entry.funFact && (
            <>
              <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>A fun fact</Subtitle>
              <Body>{entry.funFact}</Body>
            </>
          )}

          {pairings[0] && (
            <>
              <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>🥂 Pairing</Subtitle>
              <Pressable onPress={() => router.push(`/sommelier?cakeId=${cake.id}`)}>
                <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>{pairings[0].drink.name} →</Body>
              </Pressable>
            </>
          )}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: theme.spacing.lg }}>
            <SaveButton type="cake" id={cake.id} />
            <ShareButton payload={{ text: `Born in ${year} — my official cake is ${variant.variantName} 🎂 #LetThemEatCake` }} context="time-machine" />
          </View>
        </>
      )}
    </Screen>
  )
}
