import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, View } from 'react-native'
import { CakePhoto } from '../../../../src/components/CakePhoto'
import { Screen } from '../../../../src/components/Screen'
import { Body, Caption, Eyebrow, Subtitle, Title } from '../../../../src/components/Typography'
import { getCountryEntries, getRelatedCountries } from '../../../../src/shared/lib/atlas'
import { getCake } from '../../../../src/shared/lib/data'
import { useTheme } from '../../../../src/theme/useTheme'

export default function AtlasCountryScreen() {
  const theme = useTheme()
  const { country } = useLocalSearchParams<{ country: string }>()
  const decodedCountry = decodeURIComponent(country ?? '')
  const entries = getCountryEntries(decodedCountry)
  const primary = entries.find((e) => e.isPrimary) ?? entries[0]
  const secondary = entries.filter((e) => e.id !== primary?.id)
  const relatedCountries = getRelatedCountries(decodedCountry)

  if (!primary) {
    return (
      <Screen>
        <Title>No entry yet</Title>
        <Body>{decodedCountry} isn't in the Atlas yet.</Body>
      </Screen>
    )
  }

  const cake = getCake(primary.cakeId)

  return (
    <Screen>
      <Eyebrow>{decodedCountry}</Eyebrow>
      {cake && (
        <>
          <View style={{ height: 200, borderRadius: theme.radius.lg, overflow: 'hidden', marginTop: 8, backgroundColor: '#3d2314' }}>
            <CakePhoto cakeId={cake.id} style={{ flex: 1 }} showCredit />
          </View>
          <Title>{cake.name}</Title>
          {primary.cityMicroRegion && <Caption>{primary.cityMicroRegion}</Caption>}
          <Body style={{ marginTop: 8 }}>{primary.shortDescription}</Body>

          <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>🕰️ Cultural Story</Subtitle>
          <Body>{primary.historyNote}</Body>

          <Pressable onPress={() => router.push(`/discover/cake/${cake.id}`)} style={{ marginTop: theme.spacing.lg }}>
            <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>View full Encyclopedia entry & recipe →</Body>
          </Pressable>
        </>
      )}

      {secondary.length > 0 && (
        <>
          <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>Also from {decodedCountry}</Subtitle>
          {secondary.map((entry) => {
            const secCake = getCake(entry.cakeId)
            if (!secCake) return null
            return (
              <Pressable key={entry.id} onPress={() => router.push(`/discover/cake/${secCake.id}`)} style={{ paddingVertical: 6 }}>
                <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>{secCake.name} →</Body>
              </Pressable>
            )
          })}
        </>
      )}

      {relatedCountries.length > 0 && (
        <>
          <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 6 }}>Regional Variations</Subtitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {relatedCountries.map((c) => (
              <Pressable
                key={c}
                onPress={() => router.push(`/discover/atlas/${encodeURIComponent(c)}`)}
                style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: theme.colors.raspberryBg }}
              >
                <Caption style={{ color: theme.colors.raspberry, fontWeight: '600' }}>{c}</Caption>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </Screen>
  )
}
