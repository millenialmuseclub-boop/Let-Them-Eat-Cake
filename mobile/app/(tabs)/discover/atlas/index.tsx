import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Screen } from '../../../../src/components/Screen'
import { Body, Caption, Eyebrow, Subtitle } from '../../../../src/components/Typography'
import { trackAtlasCountryOpened } from '../../../../src/services/analyticsService'
import { ATLAS_COUNTRY_COORDINATES } from '../../../../src/shared/lib/atlasCoordinates'
import { getAllCountries } from '../../../../src/shared/lib/atlas'
import { useTheme } from '../../../../src/theme/useTheme'

/**
 * Native Atlas decision (Phase 1): no react-native-maps / geographic map render.
 * react-simple-maps + world-atlas (the web implementation) is an SVG/DOM map
 * renderer with no native equivalent, and react-native-maps needs a native
 * dev-build config plugin that can't be verified without Xcode/Android Studio
 * in this environment. Two working, real interactions ship instead:
 *  1. "Browse by Country" — a real, primary, fully-functional search + list,
 *     matching the web app's equivalent secondary path exactly.
 *  2. A lightweight "Map View" — real [lon,lat] pins from atlasCoordinates.ts,
 *     placed on a plain equirectangular-projected canvas (no coastlines, no
 *     pinch/zoom). It's an honest, working tap target grid, not a decorative
 *     placeholder — but it is not a geographically accurate map render.
 * See the Phase 1 build report for the full documented decision.
 */

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const MAP_WIDTH = SCREEN_WIDTH - 32
const MAP_HEIGHT = MAP_WIDTH * 0.55

function project(lon: number, lat: number): { x: number; y: number } {
  return {
    x: ((lon + 180) / 360) * MAP_WIDTH,
    y: ((90 - lat) / 180) * MAP_HEIGHT,
  }
}

export default function AtlasScreen() {
  const theme = useTheme()
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'list' | 'map'>('list')
  const countries = useMemo(() => getAllCountries().sort(), [])
  const filtered = countries.filter((c) => c.toLowerCase().includes(query.toLowerCase()))

  function openCountry(country: string) {
    trackAtlasCountryOpened(country)
    router.push(`/discover/atlas/${encodeURIComponent(country)}`)
  }

  return (
    <Screen>
      <Eyebrow>World Cake Atlas</Eyebrow>
      <Subtitle style={{ marginBottom: 12 }}>{countries.length} countries, one signature cake each.</Subtitle>

      <View style={[styles.modeToggle, { borderColor: theme.colors.border }]}>
        {(['list', 'map'] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={[styles.modeBtn, mode === m && { backgroundColor: theme.colors.raspberry }]}
          >
            <Caption style={{ color: mode === m ? '#fff' : theme.colors.text, fontWeight: '600', textTransform: 'capitalize' }}>
              {m === 'list' ? 'Browse by Country' : 'Map View'}
            </Caption>
          </Pressable>
        ))}
      </View>

      {mode === 'list' ? (
        <>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search countries…"
            placeholderTextColor={theme.colors.text + '80'}
            style={[styles.search, { backgroundColor: theme.colors.bgCard, color: theme.colors.text, borderColor: theme.colors.border }]}
          />
          {filtered.map((country) => (
            <Pressable key={country} onPress={() => openCountry(country)} style={[styles.row, { borderBottomColor: theme.colors.border }]}>
              <Body>{country}</Body>
              <Body style={{ color: theme.colors.raspberry }}>→</Body>
            </Pressable>
          ))}
        </>
      ) : (
        <View style={[styles.mapCanvas, { width: MAP_WIDTH, height: MAP_HEIGHT, backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}>
          {countries.map((country) => {
            const coords = ATLAS_COUNTRY_COORDINATES[country]
            if (!coords) return null
            const { x, y } = project(coords[0], coords[1])
            return (
              <Pressable
                key={country}
                onPress={() => openCountry(country)}
                style={[styles.pin, { left: x - 5, top: y - 5, backgroundColor: theme.colors.raspberry }]}
                accessibilityLabel={country}
              />
            )
          })}
          <Caption style={styles.mapCaption}>Tap a pin — proportional plot, not a geographic projection</Caption>
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  modeToggle: { flexDirection: 'row', borderWidth: 1, borderRadius: 100, overflow: 'hidden', alignSelf: 'flex-start', marginBottom: 14 },
  modeBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  mapCanvas: { borderWidth: 1, borderRadius: 12, position: 'relative', overflow: 'hidden' },
  pin: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  mapCaption: { position: 'absolute', bottom: 6, left: 8 },
})
