import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { AffiliateProductSet } from '../../../../src/components/AffiliateProductSet'
import { FlavorBars } from '../../../../src/components/FlavorBars'
import { RecipeCard } from '../../../../src/components/RecipeCard'
import { SaveButton } from '../../../../src/components/SaveButton'
import { Screen } from '../../../../src/components/Screen'
import { ShareButton } from '../../../../src/components/ShareButton'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../../src/components/Typography'
import { trackCakeViewed } from '../../../../src/services/analyticsService'
import { getProductsByIds, getProductsForCakeId, getProductsForHubPath, getProductsForIngredient } from '../../../../src/shared/lib/affiliateProducts'
import { cakes, getRecipeForCake } from '../../../../src/shared/lib/data'
import { getDecadeForCake, getRegionEntriesForCake, getRelatedCakes, getTopPairings } from '../../../../src/shared/lib/encyclopedia'
import { getCakeImage } from '../../../../src/shared/lib/images'
import { useTheme } from '../../../../src/theme/useTheme'

function scoreColor(score: number, theme: ReturnType<typeof useTheme>): string {
  if (score >= 70) return theme.colors.gold
  if (score >= 45) return theme.colors.raspberry
  return theme.colors.border
}

export default function CakeDetailScreen() {
  const theme = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const cake = cakes.find((c) => c.id === id)

  useEffect(() => {
    if (cake) trackCakeViewed(cake.id, cake.name)
  }, [cake?.id])

  if (!cake) {
    return (
      <Screen>
        <Title>Cake not found</Title>
        <Body>We couldn't find that cake.</Body>
      </Screen>
    )
  }

  const recipe = getRecipeForCake(cake.id)
  const regionEntries = getRegionEntriesForCake(cake.id)
  const primaryRegion = regionEntries[0]
  const decade = getDecadeForCake(cake.id)
  const locationLabel = primaryRegion?.country ?? decade?.decadeLabel ?? null
  const originPoints = [
    ...(primaryRegion ? [{ label: primaryRegion.country, text: primaryRegion.historyNote }] : []),
    ...(decade ? [{ label: decade.decadeLabel, text: decade.eraContext }] : []),
  ]
  const relatedCakes = getRelatedCakes(cake)
  const pairings = getTopPairings(cake)
  const photo = getCakeImage(cake.id)

  const bakingTools = getProductsForHubPath('/encyclopedia')
  const vanillaMatch = cake.flavorNotes.some((n) => /vanilla/i.test(n)) ? getProductsForIngredient('vanilla-extract') : []
  const chocolateMatch = cake.flavorNotes.some((n) => /chocolate|cocoa/i.test(n)) ? getProductsForIngredient('dark-chocolate') : []
  const cakeSpecificAll = getProductsForCakeId(cake.id)
  const cakeSpecificMatch = cakeSpecificAll.filter((p) => p.category !== 'featured-cake')
  const tasteThisCake = cakeSpecificAll.filter((p) => p.category === 'featured-cake')
  const isOrnate = cake.difficulty === 'hard' && (cake.occasion?.includes('Celebration') ?? false)
  const celebrationFinishes = isOrnate ? getProductsByIds(['product_gel_colors', 'product_gold_leaf', 'product_fancy_sprinkles']) : []

  return (
    <Screen>
      {photo && (
        <View style={[styles.hero, { borderRadius: theme.radius.lg }]}>
          <Image source={{ uri: photo.url }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        </View>
      )}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {locationLabel && <Chip label={locationLabel} />}
        <Chip label={cake.texture} />
        {cake.difficulty && <Chip label={cake.difficulty} />}
        {cake.occasion?.map((o) => <Chip key={o} label={o} />)}
      </View>

      <Title>
        {cake.name}
        {cake.pronunciation && <Caption> ({cake.pronunciation})</Caption>}
      </Title>
      <Body style={{ marginTop: 4 }}>{cake.description}</Body>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <SaveButton type="cake" id={cake.id} />
        <Pressable
          onPress={() => router.push(`/sommelier?cakeId=${cake.id}`)}
          style={[styles.pairButton, { borderColor: theme.colors.gold }]}
        >
          <Body style={{ color: theme.colors.gold, fontWeight: '600' }}>🥂 Pair It</Body>
        </Pressable>
      </View>

      {originPoints.length > 0 && (
        <Section title="🕰️ Origin Story">
          {originPoints.map((p) => (
            <View key={p.label} style={{ marginBottom: 8 }}>
              <Caption style={{ fontWeight: '700', color: theme.colors.raspberry }}>{p.label}</Caption>
              <Body style={{ marginTop: 2 }}>{p.text}</Body>
            </View>
          ))}
        </Section>
      )}

      <Section title="🍰 Flavor Profile">
        <FlavorBars profile={cake.flavorProfile} />
        <Caption style={{ marginTop: 8 }}>Notes: {cake.flavorNotes.join(', ')}</Caption>
      </Section>

      <ShareButton
        payload={{ title: cake.name, text: `${cake.name} — from the Let Them Eat Cake Encyclopedia 🎂` }}
        context="cake-detail"
        label="Share this Cake"
      />

      {recipe && (
        <Section title="📖 Traditional Preparation">
          <RecipeCard recipe={recipe} />
        </Section>
      )}

      {relatedCakes.length > 0 && (
        <Section title="🔗 Related Cakes">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {relatedCakes.map(({ cake: related, reason }) => {
              const relatedPhoto = getCakeImage(related.id)
              return (
                <Pressable key={related.id} onPress={() => router.push(`/discover/cake/${related.id}`)} style={{ width: '47%' }}>
                  <View style={[styles.relatedThumb, { borderRadius: theme.radius.sm }]}>
                    {relatedPhoto && <Image source={{ uri: relatedPhoto.url }} style={StyleSheet.absoluteFill} contentFit="cover" />}
                  </View>
                  <Body style={{ fontWeight: '600', marginTop: 4 }} numberOfLines={1}>
                    {related.name}
                  </Body>
                  <Caption numberOfLines={2}>{reason}</Caption>
                </Pressable>
              )
            })}
          </View>
        </Section>
      )}

      {pairings.length > 0 && (
        <Section title="🥂 Pairings">
          {pairings.map(({ drink, score }) => (
            <View key={drink.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <View style={[styles.scoreBadge, { backgroundColor: scoreColor(score, theme) }]}>
                <Caption style={{ color: '#fff', fontWeight: '700' }}>{score}</Caption>
              </View>
              <Body style={{ marginLeft: 8 }}>{drink.name}</Body>
            </View>
          ))}
          <Pressable onPress={() => router.push('/sommelier')} style={{ marginTop: 8 }}>
            <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>Explore all pairings in the Sommelier →</Body>
          </Pressable>
        </Section>
      )}

      <AffiliateProductSet title="Baking This Cake?" products={[...vanillaMatch, ...chocolateMatch, ...cakeSpecificMatch, ...bakingTools]} context="cake-detail" />
      <AffiliateProductSet title="Celebration Finishes" products={celebrationFinishes} context="cake-detail" />
      <AffiliateProductSet title="Taste This Cake" products={tasteThisCake} context="cake-detail" />
    </Screen>
  )
}

function Chip({ label }: { label: string }) {
  const theme = useTheme()
  return (
    <View style={[styles.chip, { backgroundColor: theme.colors.raspberryBg }]}>
      <Caption style={{ color: theme.colors.raspberry, fontWeight: '600' }}>{label}</Caption>
    </View>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme()
  return (
    <View style={{ marginTop: theme.spacing.lg }}>
      <Subtitle style={{ marginBottom: 8 }}>{title}</Subtitle>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  hero: { height: 220, overflow: 'hidden', backgroundColor: '#3d2314' },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  pairButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1.5, marginTop: 8 },
  relatedThumb: { width: '100%', height: 90, backgroundColor: '#3d2314', overflow: 'hidden' },
  scoreBadge: { width: 30, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
})
