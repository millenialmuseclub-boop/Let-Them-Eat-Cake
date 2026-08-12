import { useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { Screen } from '../../../src/components/Screen'
import { ShareButton } from '../../../src/components/ShareButton'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { trackSommelierPairingGenerated } from '../../../src/services/analyticsService'
import { cakes, drinks } from '../../../src/shared/lib/data'
import { calculatePairingScore, explainPairingScience, rankCakesForDrink, rankPairings } from '../../../src/shared/lib/sommelier'
import type { CakeProfile } from '../../../src/shared/types/cake'
import type { DrinkCategory, DrinkProfile } from '../../../src/shared/types/sommelier'
import { useTheme } from '../../../src/theme/useTheme'

type Mode = 'cake-first' | 'drink-first'

const DRINK_GROUPS: { id: string; label: string; categories: DrinkCategory[] }[] = [
  { id: 'wine-champagne', label: 'Wine & Champagne', categories: ['wine', 'port', 'champagne'] },
  { id: 'coffee', label: 'Coffee', categories: ['coffee'] },
  { id: 'tea', label: 'Tea', categories: ['tea'] },
  { id: 'spirits-beer', label: 'Spirits & Beer', categories: ['spirits', 'beer'] },
  { id: 'cocktails', label: 'Cocktails', categories: ['cocktails'] },
  { id: 'non-alcoholic', label: 'Non-Alcoholic', categories: ['non_alcoholic'] },
]

function scoreColor(score: number, theme: ReturnType<typeof useTheme>) {
  if (score >= 70) return theme.colors.gold
  if (score >= 45) return theme.colors.raspberry
  return theme.colors.border
}

function PairingScience({ cake, drink }: { cake: CakeProfile; drink: DrinkProfile }) {
  const theme = useTheme()
  const result = calculatePairingScore(cake, drink)
  const science = explainPairingScience(cake, drink, result)
  return (
    <View style={{ marginTop: 10, padding: 12, backgroundColor: theme.colors.bg, borderRadius: theme.radius.sm }}>
      <Caption style={{ fontWeight: '700', marginBottom: 6 }}>🔬 PAIRING SCIENCE</Caption>
      {science.bridging && <Body style={{ marginBottom: 4 }}>Bridging: {science.bridging}</Body>}
      {science.cutting && <Body style={{ marginBottom: 4 }}>Cutting: {science.cutting}</Body>}
      {science.echoing && <Body style={{ marginBottom: 4 }}>Echoing: {science.echoing}</Body>}
      <Caption style={{ fontWeight: '700', marginTop: 8, marginBottom: 4 }}>SERVING GUIDANCE</Caption>
      <Caption>Temperature: {drink.serving.temperature}</Caption>
      <Caption>Glassware: {drink.serving.glassware}</Caption>
      {drink.serving.garnish && <Caption>Garnish: {drink.serving.garnish}</Caption>}
      <Caption>Prep tip: {drink.serving.prepTip}</Caption>
    </View>
  )
}

export default function SommelierScreen() {
  const theme = useTheme()
  const params = useLocalSearchParams<{ cakeId?: string; drinkId?: string }>()
  const [mode, setMode] = useState<Mode>(params.drinkId ? 'drink-first' : 'cake-first')

  return (
    <Screen>
      <Eyebrow>Cake Sommelier</Eyebrow>
      <Title>Pair with confidence</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.md }}>Scored by real flavor science, in either direction.</Body>

      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, overflow: 'hidden', marginBottom: theme.spacing.lg, alignSelf: 'flex-start' }}>
        {(['cake-first', 'drink-first'] as Mode[]).map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: mode === m ? theme.colors.raspberry : 'transparent' }}>
            <Caption style={{ color: mode === m ? '#fff' : theme.colors.text, fontWeight: '700' }}>{m === 'cake-first' ? 'Pair by Cake' : 'Pair by Drink'}</Caption>
          </Pressable>
        ))}
      </View>

      {mode === 'cake-first' ? <CakeFirstView initialCakeId={params.cakeId} /> : <DrinkFirstView initialDrinkId={params.drinkId} />}
    </Screen>
  )
}

function CakeFirstView({ initialCakeId }: { initialCakeId?: string }) {
  const theme = useTheme()
  const [query, setQuery] = useState('')
  const [cakeId, setCakeId] = useState(initialCakeId ?? cakes[0].id)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)

  const cake = cakes.find((c) => c.id === cakeId)!
  const matches = query.trim() ? cakes.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : []
  const pairings = useMemo(() => rankPairings(cake, drinks), [cake.id])
  const top = pairings[0]
  const alsoExcellent = pairings.slice(1, 4)
  const activeGroup = DRINK_GROUPS.find((g) => g.id === activeGroupId)
  const categoryPairings = activeGroup ? pairings.filter((p) => activeGroup.categories.includes(p.drink.category)) : []

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={`Cake: ${cake.name} — search to change…`}
        placeholderTextColor={theme.colors.text + '80'}
        style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, color: theme.colors.text }}
      />
      {matches.map((c) => (
        <Pressable key={c.id} onPress={() => { setCakeId(c.id); setQuery(''); setExpandedId(null); setActiveGroupId(null); trackSommelierPairingGenerated('cake-first', c.id) }} style={{ paddingVertical: 8 }}>
          <Body style={{ color: theme.colors.raspberry }}>{c.name}</Body>
        </Pressable>
      ))}

      {!query && top && (
        <>
          <Subtitle style={{ marginTop: theme.spacing.md, marginBottom: 8 }}>🥇 Top Pairing</Subtitle>
          <PairingRow cake={cake} drink={top.drink} score={top.score} sharedNotes={top.breakdown.sharedNotes} expanded={expandedId === top.drink.id} onToggle={() => setExpandedId(expandedId === top.drink.id ? null : top.drink.id)} />

          <Subtitle style={{ marginTop: theme.spacing.md, marginBottom: 8 }}>Also Excellent</Subtitle>
          {alsoExcellent.map((p) => (
            <PairingRow key={p.drink.id} cake={cake} drink={p.drink} score={p.score} sharedNotes={p.breakdown.sharedNotes} expanded={expandedId === p.drink.id} onToggle={() => setExpandedId(expandedId === p.drink.id ? null : p.drink.id)} />
          ))}

          <ShareButton payload={{ text: `${cake.name} pairs perfectly with ${top.drink.name} 🥂` }} context="sommelier-cake-first" />

          <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>Explore by Category</Subtitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {DRINK_GROUPS.map((group) => (
              <Pressable key={group.id} onPress={() => setActiveGroupId(group.id === activeGroupId ? null : group.id)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.pill, backgroundColor: activeGroupId === group.id ? theme.colors.gold : theme.colors.raspberryBg }}>
                <Caption style={{ color: activeGroupId === group.id ? '#fff' : theme.colors.raspberry, fontWeight: '600' }}>{group.label}</Caption>
              </Pressable>
            ))}
          </View>
          {activeGroup && (
            <View style={{ marginTop: 10 }}>
              {categoryPairings.length === 0 ? (
                <Caption>No {activeGroup.label.toLowerCase()} pairings yet for this cake.</Caption>
              ) : (
                categoryPairings.map((p) => (
                  <PairingRow key={p.drink.id} cake={cake} drink={p.drink} score={p.score} sharedNotes={p.breakdown.sharedNotes} expanded={expandedId === p.drink.id} onToggle={() => setExpandedId(expandedId === p.drink.id ? null : p.drink.id)} />
                ))
              )}
            </View>
          )}
        </>
      )}
    </View>
  )
}

function DrinkFirstView({ initialDrinkId }: { initialDrinkId?: string }) {
  const theme = useTheme()
  const [groupId, setGroupId] = useState<string | null>(null)
  const [drinkId, setDrinkId] = useState<string | null>(initialDrinkId ?? null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const drink = drinkId ? drinks.find((d) => d.id === drinkId) : undefined
  const group = DRINK_GROUPS.find((g) => g.id === groupId)
  const groupDrinks = group ? drinks.filter((d) => group.categories.includes(d.category)) : []

  if (!drink) {
    return (
      <View>
        {!group ? (
          <>
            <Caption style={{ marginBottom: 8 }}>Choose a beverage category</Caption>
            {DRINK_GROUPS.map((g) => (
              <Pressable key={g.id} onPress={() => setGroupId(g.id)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                <Body style={{ fontWeight: '600' }}>{g.label}</Body>
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <Pressable onPress={() => setGroupId(null)} style={{ marginBottom: 8 }}>
              <Caption style={{ color: theme.colors.raspberry }}>← Back to categories</Caption>
            </Pressable>
            {groupDrinks.map((d) => (
              <Pressable key={d.id} onPress={() => { setDrinkId(d.id); trackSommelierPairingGenerated('drink-first', d.id) }} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                <Body style={{ fontWeight: '600' }}>{d.name}</Body>
              </Pressable>
            ))}
          </>
        )}
      </View>
    )
  }

  const rankings = useMemo(() => rankCakesForDrink(drink, cakes), [drink.id])
  const top = rankings[0]
  const alsoExcellent = rankings.slice(1, 4)

  return (
    <View>
      <Pressable onPress={() => setDrinkId(null)} style={{ marginBottom: 8 }}>
        <Caption style={{ color: theme.colors.raspberry }}>← Back to drinks</Caption>
      </Pressable>
      <Subtitle>{drink.name}</Subtitle>
      <Caption style={{ marginBottom: 8 }}>Notes: {drink.flavorNotes.join(', ')}</Caption>
      <Caption>Temperature: {drink.serving.temperature}</Caption>
      <Caption>Glassware: {drink.serving.glassware}</Caption>

      {top && (
        <>
          <Subtitle style={{ marginTop: theme.spacing.md, marginBottom: 8 }}>🥇 Top Pairing</Subtitle>
          <PairingRow cake={top.cake} drink={drink} score={top.score} sharedNotes={top.breakdown.sharedNotes} expanded={expandedId === top.cake.id} onToggle={() => setExpandedId(expandedId === top.cake.id ? null : top.cake.id)} label={top.cake.name} />

          <Subtitle style={{ marginTop: theme.spacing.md, marginBottom: 8 }}>Also Excellent</Subtitle>
          {alsoExcellent.map((p) => (
            <PairingRow key={p.cake.id} cake={p.cake} drink={drink} score={p.score} sharedNotes={p.breakdown.sharedNotes} expanded={expandedId === p.cake.id} onToggle={() => setExpandedId(expandedId === p.cake.id ? null : p.cake.id)} label={p.cake.name} />
          ))}

          <ShareButton payload={{ text: `${drink.name} pairs perfectly with ${top.cake.name} 🥂` }} context="sommelier-drink-first" />
        </>
      )}
    </View>
  )
}

function PairingRow({
  cake,
  drink,
  score,
  sharedNotes,
  expanded,
  onToggle,
  label,
}: {
  cake: CakeProfile
  drink: DrinkProfile
  score: number
  sharedNotes: string[]
  expanded: boolean
  onToggle: () => void
  label?: string
}) {
  const theme = useTheme()
  return (
    <Pressable onPress={onToggle} style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 12, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 32, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: scoreColor(score, theme) }}>
          <Caption style={{ color: '#fff', fontWeight: '700' }}>{score}</Caption>
        </View>
        <Body style={{ marginLeft: 10, fontWeight: '600' }}>{label ?? drink.name}</Body>
      </View>
      {sharedNotes.length > 0 && <Caption style={{ marginTop: 4 }}>Shared notes: {sharedNotes.join(', ')}</Caption>}
      {expanded && <PairingScience cake={cake} drink={drink} />}
    </Pressable>
  )
}
