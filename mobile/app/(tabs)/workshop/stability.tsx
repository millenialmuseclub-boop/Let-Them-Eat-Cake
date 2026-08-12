import { useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { calculateStability } from '../../../src/shared/lib/stabilityCalculator'
import type { FillingWeight, StabilityTemperature, TransportCondition } from '../../../src/shared/types/stabilityCalculator'
import { useTheme } from '../../../src/theme/useTheme'

function SegmentedControl<T extends string | number>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const theme = useTheme()
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: theme.spacing.md }}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: theme.radius.pill,
            borderWidth: 1,
            borderColor: value === opt.value ? theme.colors.raspberry : theme.colors.border,
            backgroundColor: value === opt.value ? theme.colors.raspberry : 'transparent',
          }}
        >
          <Caption style={{ color: value === opt.value ? '#fff' : theme.colors.text, fontWeight: '600' }}>{opt.label}</Caption>
        </Pressable>
      ))}
    </View>
  )
}

export default function StabilityScreen() {
  const theme = useTheme()
  const [tierCount, setTierCount] = useState(2)
  const [diameterIn, setDiameterIn] = useState(8)
  const [fillingWeight, setFillingWeight] = useState<FillingWeight>('medium')
  const [temperature, setTemperature] = useState<StabilityTemperature>('moderate')
  const [transport, setTransport] = useState<TransportCondition>('none')

  const result = useMemo(
    () => calculateStability({ tierCount, diameterIn, fillingWeight, temperature, transport }),
    [tierCount, diameterIn, fillingWeight, temperature, transport],
  )

  return (
    <Screen>
      <Eyebrow>Cake Stability</Eyebrow>
      <Title>Support & transport calculator</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Real guidance for tier support, chilling, and transport.</Body>

      <Caption style={{ fontWeight: '700', marginBottom: 8 }}>Tiers</Caption>
      <SegmentedControl value={tierCount} options={[1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))} onChange={setTierCount} />

      <Caption style={{ fontWeight: '700', marginBottom: 8 }}>Bottom tier diameter (in)</Caption>
      <SegmentedControl value={diameterIn} options={[6, 8, 10, 12, 14].map((n) => ({ value: n, label: `${n}"` }))} onChange={setDiameterIn} />

      <Caption style={{ fontWeight: '700', marginBottom: 8 }}>Filling weight</Caption>
      <SegmentedControl
        value={fillingWeight}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'medium', label: 'Medium' },
          { value: 'heavy', label: 'Heavy' },
        ]}
        onChange={setFillingWeight}
      />

      <Caption style={{ fontWeight: '700', marginBottom: 8 }}>Serving temperature</Caption>
      <SegmentedControl
        value={temperature}
        options={[
          { value: 'cool', label: 'Cool' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'warm', label: 'Warm' },
        ]}
        onChange={setTemperature}
      />

      <Caption style={{ fontWeight: '700', marginBottom: 8 }}>Transport</Caption>
      <SegmentedControl
        value={transport}
        options={[
          { value: 'none', label: 'None' },
          { value: 'short', label: 'Short trip' },
          { value: 'long', label: 'Long trip' },
        ]}
        onChange={setTransport}
      />

      <View style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md, marginTop: theme.spacing.sm }}>
        <Subtitle>Estimated servings: {result.estimatedServings}</Subtitle>

        <Caption style={{ fontWeight: '700', marginTop: theme.spacing.md, color: theme.colors.raspberry }}>Support</Caption>
        {result.supportNotes.map((n, i) => (
          <Body key={i} style={{ marginTop: 2 }}>
            • {n}
          </Body>
        ))}

        <Caption style={{ fontWeight: '700', marginTop: theme.spacing.md, color: theme.colors.gold }}>Chilling</Caption>
        {result.chillNotes.map((n, i) => (
          <Body key={i} style={{ marginTop: 2 }}>
            • {n}
          </Body>
        ))}

        <Caption style={{ fontWeight: '700', marginTop: theme.spacing.md }}>Display</Caption>
        {result.displayNotes.map((n, i) => (
          <Body key={i} style={{ marginTop: 2 }}>
            • {n}
          </Body>
        ))}
      </View>
    </Screen>
  )
}
