import { router } from 'expo-router'
import { View } from 'react-native'
import { FeatureCard } from '../../../../src/components/FeatureCard'
import { Screen } from '../../../../src/components/Screen'
import { getCollectionCakes } from '../../../../src/shared/lib/collections'
import { collections } from '../../../../src/shared/lib/data'

export default function CollectionsIndexScreen() {
  return (
    <Screen>
      <View>
        {collections.map((collection) => {
          const cakes = getCollectionCakes(collection)
          const coverId = cakes.find((c) => c.id)?.id
          return (
            <FeatureCard
              key={collection.id}
              title={`${collection.icon} ${collection.title}`}
              description={collection.description}
              cta={`${cakes.length} cakes →`}
              cakeId={coverId}
              onPress={() => router.push(`/discover/collections/${collection.id}`)}
            />
          )
        })}
      </View>
    </Screen>
  )
}
