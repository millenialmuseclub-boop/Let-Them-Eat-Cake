import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow } from '../../../src/components/Typography'
import { trackSearch } from '../../../src/services/analyticsService'
import { cakes } from '../../../src/shared/lib/data'
import { getCakeImage } from '../../../src/shared/lib/images'
import { useTheme } from '../../../src/theme/useTheme'

export default function EncyclopediaScreen() {
  const theme = useTheme()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = !q
      ? cakes
      : cakes.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.flavorNotes.some((n) => n.toLowerCase().includes(q)) ||
            c.texture.toLowerCase().includes(q),
        )
    if (q) trackSearch(q, filtered.length)
    return filtered
  }, [query])

  return (
    <Screen>
      <Eyebrow>Cake Encyclopedia</Eyebrow>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name, flavor, or texture…"
        placeholderTextColor={theme.colors.text + '80'}
        style={[
          styles.search,
          { backgroundColor: theme.colors.bgCard, color: theme.colors.text, borderColor: theme.colors.border },
        ]}
      />

      {!query && (
        <Caption style={{ marginBottom: theme.spacing.sm }}>
          {results.length} cakes across the world — search above, or browse below.
        </Caption>
      )}

      <View>
        {results.map((cake) => {
          const photo = getCakeImage(cake.id)
          return (
            <Pressable
              key={cake.id}
              onPress={() => router.push(`/discover/cake/${cake.id}`)}
              style={[styles.row, { borderBottomColor: theme.colors.border }]}
            >
              <View style={[styles.thumb, { borderRadius: theme.radius.sm }]}>
                {photo && <Image source={{ uri: photo.url }} style={StyleSheet.absoluteFill} contentFit="cover" />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Body style={{ fontWeight: '600' }}>{cake.name}</Body>
                <Caption numberOfLines={1}>
                  {cake.texture} · {cake.flavorNotes.slice(0, 3).join(', ')}
                </Caption>
              </View>
            </Pressable>
          )
        })}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    width: 56,
    height: 56,
    backgroundColor: '#3d2314',
    overflow: 'hidden',
  },
})
