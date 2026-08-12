import type { ReactNode } from 'react'
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native'
import { useTheme } from '../theme/useTheme'

export function Card({ children, onPress, style }: { children: ReactNode; onPress?: () => void; style?: ViewStyle }) {
  const theme = useTheme()
  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.bgCard,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
    },
    style,
  ]

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [...cardStyle, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    )
  }
  return <View style={cardStyle}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
  },
})
