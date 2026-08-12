import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { FeatureCard } from '../../../src/components/FeatureCard'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { getSavedCakeIds } from '../../../src/services/storageService'
import { cakes } from '../../../src/shared/lib/data'
import { getRegionEntriesForCake } from '../../../src/shared/lib/encyclopedia'
import { getCakeImage } from '../../../src/shared/lib/images'
import { useTheme } from '../../../src/theme/useTheme'

export default function DiscoverScreen() {
  const theme = useTheme()
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    getSavedCakeIds().then(setSavedIds)
  }, [])

  const savedCakes = savedIds
    .map((id) => cakes.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 8)

  return (
    <Screen>
      <Eyebrow>Discover</Eyebrow>
      <Title>Explore the world's cakes</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Through history and geography.</Body>

      <FeatureCard
        title="Cake Encyclopedia"
        description="The stories, flavors, techniques and traditions behind the world's cakes."
        cta="Explore Encyclopedia →"
        cakeId="cake_black_forest"
        onPress={() => router.push('/discover/encyclopedia')}
      />
      <FeatureCard
        title="World Cake Atlas"
        description="Browse any country's most popular cake, complete with a full recipe and background story."
        cta="Open Atlas →"
        cakeId="cake_tres_leches"
        onPress={() => router.push('/discover/atlas')}
      />
      <FeatureCard
        title="Cake Personality"
        description="Answer a few quick questions and get matched to a cake personality."
        cta="Take the Quiz →"
        cakeId="cake_rainbow_drip_2010s"
        onPress={() => router.push('/discover/persona-match')}
      />

      <FeatureCard
        title="Curated Collections"
        description="Hand-picked cake collections organized by flavor, mood, tradition, and occasion."
        cta="Explore Collections →"
        onPress={() => router.push('/discover/collections')}
      />
      <FeatureCard
        title="Curated Kitchen"
        description="A considered edit of the tools, equipment, and ingredients worth keeping close."
        cta="Enter the Kitchen →"
        onPress={() => router.push('/discover/curated-kitchen')}
      />

      <Subtitle style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.sm }}>🍰 Saved Cakes</Subtitle>
      {savedCakes.length === 0 ? (
        <Caption>Cakes you save will show up here.</Caption>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {savedCakes.map((cake) => {
            const origin = getRegionEntriesForCake(cake.id)[0]?.country
            const photo = getCakeImage(cake.id)
            return (
              <Pressable
                key={cake.id}
                onPress={() => router.push(`/discover/cake/${cake.id}`)}
                style={{ width: 104 }}
              >
                <View style={[styles.savedThumb, { borderRadius: theme.radius.sm }]}>
                  {photo && <Image source={{ uri: photo.url }} style={StyleSheet.absoluteFill} contentFit="cover" />}
                </View>
                <Caption numberOfLines={1} style={{ marginTop: 4, fontWeight: '600', color: theme.colors.cocoaStrong }}>
                  {cake.name}
                </Caption>
                {origin && <Caption numberOfLines={1}>{origin}</Caption>}
              </Pressable>
            )
          })}
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  savedThumb: {
    width: 104,
    height: 104,
    backgroundColor: '#3d2314',
    overflow: 'hidden',
  },
})
