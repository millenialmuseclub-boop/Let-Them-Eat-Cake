import { useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import { RecipeCard } from '../../../src/components/RecipeCard'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { trackPantryRecipeGenerated } from '../../../src/services/analyticsService'
import { emergencyRecipes, getRecipe } from '../../../src/shared/lib/data'
import { matchEmergencyRecipes } from '../../../src/shared/lib/pantry'
import type { MatchTier, PantryIngredient } from '../../../src/shared/types/pantry'
import { useTheme } from '../../../src/theme/useTheme'

const INGREDIENTS: { value: PantryIngredient; label: string }[] = [
  { value: 'flour', label: 'All-purpose flour' },
  { value: 'self-rising-flour', label: 'Self-rising flour' },
  { value: 'sugar', label: 'Sugar' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'butter', label: 'Butter' },
  { value: 'vegetable-oil', label: 'Vegetable oil' },
  { value: 'milk', label: 'Milk' },
  { value: 'yogurt', label: 'Yogurt' },
  { value: 'cocoa-powder', label: 'Cocoa powder' },
  { value: 'baking-soda', label: 'Baking soda' },
  { value: 'baking-powder', label: 'Baking powder' },
  { value: 'vinegar', label: 'Vinegar' },
  { value: 'vanilla-extract', label: 'Vanilla extract' },
  { value: 'applesauce', label: 'Applesauce' },
  { value: 'condensed-milk', label: 'Condensed milk' },
  { value: 'salt', label: 'Salt' },
  { value: 'cinnamon', label: 'Cinnamon' },
  { value: 'lemon-juice', label: 'Lemon juice' },
]

const TIER_LABEL: Record<MatchTier, string> = {
  best: '✨ Best Match',
  great: '👍 Great Match',
  creative: '💡 Creative Match',
  far: '',
}

export default function PantryRaidScreen() {
  const theme = useTheme()
  const [onHand, setOnHand] = useState<Set<PantryIngredient>>(new Set())
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const matches = useMemo(() => {
    const results = matchEmergencyRecipes([...onHand], emergencyRecipes)
    return results.filter((m) => m.tier !== 'far')
  }, [onHand])

  function toggle(ing: PantryIngredient) {
    setOnHand((prev) => {
      const next = new Set(prev)
      if (next.has(ing)) next.delete(ing)
      else next.add(ing)
      return next
    })
  }

  const grouped: Record<MatchTier, typeof matches> = { best: [], great: [], creative: [], far: [] }
  for (const m of matches) grouped[m.tier].push(m)

  return (
    <Screen>
      <Eyebrow>Pantry Raid</Eyebrow>
      <Title>What's in your kitchen?</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.md }}>Check off what you have and we'll find the emergency cake that needs the least shopping.</Body>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.md }}>
        {INGREDIENTS.map((ing) => {
          const active = onHand.has(ing.value)
          return (
            <Pressable
              key={ing.value}
              onPress={() => toggle(ing.value)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: theme.radius.pill,
                borderWidth: 1,
                borderColor: active ? theme.colors.raspberry : theme.colors.border,
                backgroundColor: active ? theme.colors.raspberry : 'transparent',
              }}
            >
              <Caption style={{ color: active ? '#fff' : theme.colors.text, fontWeight: '600' }}>{ing.label}</Caption>
            </Pressable>
          )
        })}
      </View>

      <Pressable
        onPress={() => setSearched(true)}
        style={{ backgroundColor: theme.colors.raspberry, borderRadius: theme.radius.pill, paddingVertical: 14, alignItems: 'center', marginBottom: theme.spacing.lg }}
      >
        <Body style={{ color: '#fff', fontWeight: '700' }}>🍰 Create Something</Body>
      </Pressable>

      {searched &&
        (['best', 'great', 'creative'] as MatchTier[]).map((tier) =>
          grouped[tier].length === 0 ? null : (
            <View key={tier} style={{ marginBottom: theme.spacing.lg }}>
              <Subtitle style={{ marginBottom: 4 }}>{TIER_LABEL[tier]}</Subtitle>
              {grouped[tier].map((match) => {
                const recipe = getRecipe(match.recipe.recipeId)
                const isExpanded = expandedId === match.recipe.id
                return (
                  <View key={match.recipe.id} style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 14, marginBottom: 10 }}>
                    <Body style={{ fontWeight: '700' }}>{match.recipe.name}</Body>
                    <Caption style={{ marginTop: 2 }}>{match.matchReason}</Caption>
                    <Caption style={{ marginTop: 4 }}>
                      You have {match.recipe.requiredIngredients.length - match.missing.length} of {match.recipe.requiredIngredients.length} ingredients
                    </Caption>
                    {match.applicableSubstitutions.length > 0 && (
                      <View style={{ marginTop: 6 }}>
                        {match.applicableSubstitutions.map((sub) => (
                          <Caption key={sub.missingIngredient} style={{ color: theme.colors.gold }}>
                            Missing {sub.missingIngredient} → use {sub.replacement} ({sub.flavorImpact})
                          </Caption>
                        ))}
                      </View>
                    )}
                    <Pressable
                      onPress={() => {
                        const next = isExpanded ? null : match.recipe.id
                        setExpandedId(next)
                        if (next) trackPantryRecipeGenerated(match.tier, match.recipe.recipeId)
                      }}
                      style={{ marginTop: 8 }}
                    >
                      <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>{isExpanded ? 'Hide full recipe' : 'Show full recipe'}</Body>
                    </Pressable>
                    {isExpanded && recipe && (
                      <View style={{ marginTop: 12 }}>
                        <RecipeCard recipe={recipe} />
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          ),
        )}

      {searched && matches.length === 0 && <Caption>No matches yet — try checking off a few more ingredients.</Caption>}
    </Screen>
  )
}
