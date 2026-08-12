import { Image } from 'expo-image'
import { useState } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import { getCakeImage } from '../shared/lib/images'
import { useTheme } from '../theme/useTheme'
import { Caption } from './Typography'

const BLURHASH_PLACEHOLDER = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofWCj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQof'

/**
 * Native equivalent of the web's CakeHeroImage / CakeFeatureCard image handling:
 * renders nothing (not a broken-image icon) when a cake has no fetched photo yet,
 * since coverage is intentionally partial across the 125-cake catalog.
 */
export function CakePhoto({ cakeId, style, showCredit }: { cakeId: string; style?: ViewStyle; showCredit?: boolean }) {
  const theme = useTheme()
  const [failed, setFailed] = useState(false)
  const photo = getCakeImage(cakeId)

  if (!photo || failed) return null

  return (
    <View style={style}>
      <Image
        source={{ uri: photo.url }}
        style={StyleSheet.absoluteFill}
        placeholder={{ blurhash: BLURHASH_PLACEHOLDER }}
        contentFit="cover"
        transition={200}
        onError={() => setFailed(true)}
        cachePolicy="memory-disk"
      />
      {showCredit && (
        <View style={[styles.credit, { backgroundColor: theme.colors.bg + 'cc' }]}>
          <Caption>{photo.photographer} / Unsplash</Caption>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  credit: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
})
