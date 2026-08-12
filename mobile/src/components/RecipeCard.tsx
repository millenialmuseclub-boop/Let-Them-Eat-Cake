import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { scaleRecipe, scaleRecipeComponent, type ScaledIngredient, type UnitSystem } from '../shared/lib/units'
import type { DietTag, Recipe, RecipeComponent } from '../shared/types/cake'
import { useTheme } from '../theme/useTheme'
import { Body, Caption, Subtitle } from './Typography'

const DIET_OPTIONS: { value: DietTag | 'none'; label: string }[] = [
  { value: 'none', label: 'No substitutions' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'egg-free', label: 'Egg-free' },
  { value: 'nut-free', label: 'Nut-free' },
]

function IngredientList({ ingredients }: { ingredients: ScaledIngredient[] }) {
  const theme = useTheme()
  return (
    <View style={{ marginBottom: theme.spacing.sm }}>
      {ingredients.map((ing) => (
        <View key={ing.id} style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Body style={{ fontWeight: '700', color: theme.colors.cocoaStrong, width: 90 }}>
            {ing.qty} {ing.unit === 'count' ? '' : ing.unit}
          </Body>
          <View style={{ flex: 1 }}>
            <Body>{ing.name}</Body>
            {ing.substitutionNote && <Caption style={{ color: theme.colors.raspberry }}>use {ing.substitutionNote}</Caption>}
          </View>
        </View>
      ))}
    </View>
  )
}

function RecipeComponentSection({ title, component, scaled }: { title: string; component: RecipeComponent; scaled: ScaledIngredient[] | null }) {
  const theme = useTheme()
  return (
    <View style={[styles.componentSection, { backgroundColor: theme.colors.bg, borderRadius: theme.radius.sm }]}>
      {'none' in component ? (
        <>
          <Subtitle>{title}</Subtitle>
          <Caption style={{ fontStyle: 'italic', marginTop: 4 }}>{component.note}</Caption>
        </>
      ) : (
        <>
          <Subtitle>
            {title}: {component.name}
          </Subtitle>
          {scaled && <View style={{ marginTop: 8 }}><IngredientList ingredients={scaled} /></View>}
          <Body style={{ marginTop: 4 }}>{component.prep}</Body>
          {component.textureGoal && <Caption style={{ marginTop: 4 }}>Texture goal: {component.textureGoal}</Caption>}
          {component.applicationNotes && <Caption style={{ marginTop: 2 }}>Application: {component.applicationNotes}</Caption>}
          {component.chillGuidance && <Caption style={{ marginTop: 2 }}>Chill/rest: {component.chillGuidance}</Caption>}
        </>
      )}
    </View>
  )
}

/** Native port of the web's RecipeCard.tsx — same schema, same scaling logic, kitchen-friendly layout. */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const theme = useTheme()
  const [servings, setServings] = useState(recipe.baseServings)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [diet, setDiet] = useState<DietTag | 'none'>('none')

  const activeDiet = diet === 'none' ? undefined : diet
  const ingredients = scaleRecipe(recipe, servings, unitSystem, activeDiet)
  const scaledFilling = recipe.filling ? scaleRecipeComponent(recipe.filling, recipe, servings, unitSystem, activeDiet) : null
  const scaledFrostingFinish = recipe.frostingFinish ? scaleRecipeComponent(recipe.frostingFinish, recipe, servings, unitSystem, activeDiet) : null

  const hasOverview = Boolean(
    recipe.yield || recipe.prepTimeMinutes || recipe.bakeTimeMinutes || recipe.totalTimeMinutes || recipe.ovenTempC || recipe.panSize || (recipe.equipment && recipe.equipment.length > 0),
  )

  return (
    <View>
      {hasOverview && (
        <View style={[styles.overview, { borderBottomColor: theme.colors.border }]}>
          <Subtitle>Overview</Subtitle>
          <View style={styles.overviewGrid}>
            {recipe.yield && <Caption style={styles.overviewItem}>Yield: {recipe.yield} servings</Caption>}
            {recipe.prepTimeMinutes && <Caption style={styles.overviewItem}>Prep: {recipe.prepTimeMinutes} min</Caption>}
            {recipe.bakeTimeMinutes && <Caption style={styles.overviewItem}>Bake: {recipe.bakeTimeMinutes} min</Caption>}
            {recipe.totalTimeMinutes && <Caption style={styles.overviewItem}>Total: {recipe.totalTimeMinutes} min</Caption>}
            {recipe.ovenTempC && recipe.ovenTempF && (
              <Caption style={styles.overviewItem}>
                Oven: {recipe.ovenTempC}°C ({recipe.ovenTempF}°F)
              </Caption>
            )}
            {recipe.panSize && <Caption style={styles.overviewItem}>Pan: {recipe.panSize}</Caption>}
            {recipe.equipment && recipe.equipment.length > 0 && <Caption style={styles.overviewItem}>Equipment: {recipe.equipment.join(', ')}</Caption>}
          </View>
        </View>
      )}

      <View style={[styles.controls, { borderBottomColor: theme.colors.border }]}>
        <View>
          <Caption>Servings</Caption>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Pressable
              onPress={() => setServings((s) => Math.max(1, s - 1))}
              style={[styles.stepper, { borderColor: theme.colors.border }]}
              accessibilityLabel="Decrease servings"
            >
              <Body style={{ fontWeight: '700' }}>−</Body>
            </Pressable>
            <Body style={{ minWidth: 24, textAlign: 'center' }}>{servings}</Body>
            <Pressable
              onPress={() => setServings((s) => Math.min(50, s + 1))}
              style={[styles.stepper, { borderColor: theme.colors.border }]}
              accessibilityLabel="Increase servings"
            >
              <Body style={{ fontWeight: '700' }}>+</Body>
            </Pressable>
          </View>
        </View>

        <View style={[styles.unitToggle, { borderColor: theme.colors.border }]}>
          {(['metric', 'imperial'] as UnitSystem[]).map((sys) => (
            <Pressable
              key={sys}
              onPress={() => setUnitSystem(sys)}
              style={[styles.unitToggleBtn, unitSystem === sys && { backgroundColor: theme.colors.raspberry }]}
            >
              <Caption style={{ color: unitSystem === sys ? '#fff' : theme.colors.text, fontWeight: '600', textTransform: 'capitalize' }}>{sys}</Caption>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: theme.spacing.sm }}>
        {DIET_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setDiet(opt.value)}
            style={[
              styles.dietChip,
              { borderColor: theme.colors.border },
              diet === opt.value && { backgroundColor: theme.colors.gold, borderColor: theme.colors.gold },
            ]}
          >
            <Caption style={{ color: diet === opt.value ? '#fff' : theme.colors.text }}>{opt.label}</Caption>
          </Pressable>
        ))}
      </View>

      <Subtitle>{recipe.filling || recipe.frostingFinish ? 'Cake / Sponge' : 'Ingredients'}</Subtitle>
      <View style={{ marginTop: 8, marginBottom: 12 }}>
        <IngredientList ingredients={ingredients} />
      </View>

      {recipe.filling && <RecipeComponentSection title="Filling" component={recipe.filling} scaled={scaledFilling} />}
      {recipe.frostingFinish && <RecipeComponentSection title="Frosting & Finish" component={recipe.frostingFinish} scaled={scaledFrostingFinish} />}

      <Subtitle style={{ marginTop: 8 }}>Assembly / Steps</Subtitle>
      <View style={{ marginTop: 8 }}>
        {recipe.steps.map((step, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Body style={{ fontWeight: '700', color: theme.colors.raspberry, width: 24 }}>{i + 1}.</Body>
            <Body style={{ flex: 1 }}>{step}</Body>
          </View>
        ))}
      </View>

      {recipe.storage && (
        <Caption style={{ marginTop: 8 }}>
          <Caption style={{ fontWeight: '700' }}>Storage: </Caption>
          {recipe.storage}
        </Caption>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  overview: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 12, marginBottom: 12 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  overviewItem: { marginRight: 12 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 12, marginBottom: 12 },
  stepper: { width: 32, height: 32, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  unitToggle: { flexDirection: 'row', borderWidth: 1, borderRadius: 100, overflow: 'hidden' },
  unitToggleBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  dietChip: { borderWidth: 1, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 },
  componentSection: { padding: 12, marginBottom: 12 },
})
