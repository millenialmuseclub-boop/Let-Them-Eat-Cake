import { View } from 'react-native'
import type { FlavorProfile } from '../shared/types/cake'
import { useTheme } from '../theme/useTheme'
import { Caption } from './Typography'

const AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'fatRichness', label: 'Richness' },
  { key: 'acidity', label: 'Acidity' },
  { key: 'intensity', label: 'Intensity' },
]

export function FlavorBars({ profile }: { profile: FlavorProfile }) {
  const theme = useTheme()
  return (
    <View style={{ gap: 8 }}>
      {AXES.map((axis) => (
        <View key={axis.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Caption style={{ width: 78 }}>{axis.label}</Caption>
          <View style={{ flex: 1, height: 6, backgroundColor: theme.colors.border, borderRadius: 3 }}>
            <View
              style={{
                width: `${(profile[axis.key] / 5) * 100}%`,
                height: 6,
                backgroundColor: theme.colors.raspberry,
                borderRadius: 3,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  )
}
