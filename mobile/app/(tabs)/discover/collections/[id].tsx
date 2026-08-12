import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import { Screen } from '../../../../src/components/Screen'
import { Body, Caption, Eyebrow, Title } from '../../../../src/components/Typography'
import { getCollectionCakes } from '../../../../src/shared/lib/collections'
import { collections } from '../../../../src/shared/lib/data'
import { getCakeImage } from '../../../../src/shared/lib/images'
import { useTheme } from '../../../../src/theme/useTheme'

export default function CollectionDetailScreen() {
  const theme = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const collection = collections.find((c) => c.id === id)
  if (!collection) return null
  const cakes = getCollectionCakes(collection)

  return (
    <Screen>
      <Eyebrow>{collection.icon} Curated Collection</Eyebrow>
      <Title>{collection.title}</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.md }}>{collection.description}</Body>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {cakes.map((cake) => {
          const photo = getCakeImage(cake.id)
          return (
            <Pressable key={cake.id} onPress={() => router.push(`/discover/cake/${cake.id}`)} style={{ width: '47%' }}>
              <View style={[styles.thumb, { borderRadius: theme.radius.sm }]}>
                {photo && <Image source={{ uri: photo.url }} style={StyleSheet.absoluteFill} contentFit="cover" />}
              </View>
              <Body style={{ fontWeight: '600', marginTop: 4 }} numberOfLines={1}>
                {cake.name}
              </Body>
              <Caption numberOfLines={1}>{cake.texture}</Caption>
            </Pressable>
          )
        })}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  thumb: { width: '100%', height: 110, backgroundColor: '#3d2314', overflow: 'hidden' },
})
