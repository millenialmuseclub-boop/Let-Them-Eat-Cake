import type { ReactNode } from 'react'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useTheme } from '../theme/useTheme'
import { Body } from './Typography'

/** Progressive-disclosure row — collapsed by default, matches spec's "reduce visual overload" guidance for Workshop. */
export function ExpandableRow({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, marginBottom: 10, overflow: 'hidden' }}>
      <Pressable onPress={() => setOpen((o) => !o)} style={{ padding: 14, backgroundColor: theme.colors.bgCard }}>
        <Body style={{ fontWeight: '700' }}>
          {open ? '▾ ' : '▸ '}
          {title}
        </Body>
      </Pressable>
      {open && <View style={{ padding: 14, paddingTop: 0, backgroundColor: theme.colors.bgCard }}>{children}</View>}
    </View>
  )
}
