import { Image } from 'expo-image'
import { Pressable, StyleSheet, View } from 'react-native'
import { getCakeImage } from '../shared/lib/images'
import { useTheme } from '../theme/useTheme'
import { Body, Caption } from './Typography'

interface Props {
  title: string
  description: string
  cta: string
  cakeId?: string
  imageUrl?: string
  meta?: string
  onPress: () => void
}

/** Full-bleed editorial photo card — native equivalent of the web's DiscoverFeatureCard. */
export function FeatureCard({ title, description, cta, cakeId, imageUrl, meta, onPress }: Props) {
  const theme = useTheme()
  const photo = cakeId ? getCakeImage(cakeId) : imageUrl ? { url: imageUrl } : undefined

  return (
    <Pressable onPress={onPress} style={[styles.card, { borderRadius: theme.radius.lg }]}>
      {photo && <Image source={{ uri: photo.url }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />}
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />
      <View style={styles.content}>
        {meta && (
          <View style={[styles.metaBadge, { backgroundColor: theme.colors.raspberry }]}>
            <Caption style={{ color: '#fff', fontWeight: '700' }}>{meta}</Caption>
          </View>
        )}
        <Body style={styles.title}>{title}</Body>
        <Caption style={styles.description} numberOfLines={2}>
          {description}
        </Caption>
        <Body style={[styles.cta, { color: theme.colors.raspberry }]}>{cta}</Body>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    height: 220,
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: '#3d2314',
  },
  scrim: {
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
  },
  metaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: '#f3ece4',
    marginTop: 4,
  },
  cta: {
    marginTop: 10,
    fontWeight: '700',
  },
})
