import type { ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useTheme } from '../theme/useTheme'

/** Standard scrollable screen container — consistent padding/background across every tab. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const theme = useTheme()
  const style = [styles.container, { backgroundColor: theme.colors.bg }]

  if (!scroll) {
    return <View style={style}>{children}</View>
  }

  return (
    <ScrollView style={style} contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xxl }}>
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})
