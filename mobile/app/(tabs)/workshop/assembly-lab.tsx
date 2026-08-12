import { useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import { RecipeCard } from '../../../src/components/RecipeCard'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { buildAssembledRecipe, describeCombo, getComponentsByCategory } from '../../../src/shared/lib/assemblyLab'
import type { AssemblyComponent } from '../../../src/shared/types/assemblyLab'
import { useTheme } from '../../../src/theme/useTheme'

function PickerRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: AssemblyComponent[]
  selected: AssemblyComponent | undefined
  onSelect: (c: AssemblyComponent) => void
}) {
  const theme = useTheme()
  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Caption style={{ fontWeight: '700', marginBottom: 6 }}>{label}</Caption>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {options.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: theme.radius.pill,
              borderWidth: 1,
              borderColor: selected?.id === opt.id ? theme.colors.raspberry : theme.colors.border,
              backgroundColor: selected?.id === opt.id ? theme.colors.raspberry : 'transparent',
            }}
          >
            <Caption style={{ color: selected?.id === opt.id ? '#fff' : theme.colors.text, fontWeight: '600' }}>{opt.name}</Caption>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default function AssemblyLabScreen() {
  const theme = useTheme()
  const sponges = getComponentsByCategory('sponge')
  const fillings = getComponentsByCategory('filling')
  const frostings = getComponentsByCategory('frosting')
  const garnishes = getComponentsByCategory('garnish')

  const [sponge, setSponge] = useState<AssemblyComponent>(sponges[0])
  const [filling, setFilling] = useState<AssemblyComponent>(fillings[0])
  const [frosting, setFrosting] = useState<AssemblyComponent>(frostings[0])
  const [garnish, setGarnish] = useState<AssemblyComponent | undefined>(garnishes[0])

  const recipe = useMemo(() => buildAssembledRecipe(sponge, filling, frosting, garnish), [sponge, filling, frosting, garnish])
  const description = useMemo(() => describeCombo(sponge, filling, frosting, garnish), [sponge, filling, frosting, garnish])

  return (
    <Screen>
      <Eyebrow>Assembly Lab</Eyebrow>
      <Title>Build your own cake</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Pick a sponge, filling, frosting, and garnish — the recipe updates live.</Body>

      <PickerRow label="Sponge" options={sponges} selected={sponge} onSelect={setSponge} />
      <PickerRow label="Filling" options={fillings} selected={filling} onSelect={setFilling} />
      <PickerRow label="Frosting" options={frostings} selected={frosting} onSelect={setFrosting} />
      <PickerRow label="Garnish" options={garnishes} selected={garnish} onSelect={setGarnish} />

      <View style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md }}>
        <Subtitle style={{ marginBottom: 8 }}>Your Creation</Subtitle>
        <Body style={{ marginBottom: theme.spacing.md, fontStyle: 'italic' }}>{description}</Body>
        <RecipeCard recipe={recipe} />
      </View>
    </Screen>
  )
}
