import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { trackCakeSaved, trackCakeUnsaved } from '../services/analyticsService'
import { isSaved, toggleSaved } from '../services/storageService'
import type { SavedItemType } from '../shared/types/notebook'
import { useTheme } from '../theme/useTheme'
import { Body } from './Typography'

export function SaveButton({ type, id }: { type: SavedItemType; id: string }) {
  const theme = useTheme()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let mounted = true
    isSaved(type, id).then((value) => {
      if (mounted) setSaved(value)
    })
    return () => {
      mounted = false
    }
  }, [type, id])

  async function handlePress() {
    const nextSaved = await toggleSaved(type, id)
    setSaved(nextSaved)
    if (type === 'cake') {
      if (nextSaved) trackCakeSaved(id)
      else trackCakeUnsaved(id)
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove from Notebook' : 'Save to Notebook'}
      accessibilityState={{ selected: saved }}
      hitSlop={8}
      style={{
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: theme.radius.pill,
        backgroundColor: saved ? theme.colors.raspberry : 'transparent',
        borderWidth: saved ? 0 : 1.5,
        borderColor: theme.colors.raspberry,
        marginTop: theme.spacing.sm,
      }}
    >
      <Body style={{ color: saved ? '#fff' : theme.colors.raspberry, fontWeight: '600' }}>
        {saved ? '✓ Saved to Notebook' : '🔖 Save to Notebook'}
      </Body>
    </Pressable>
  )
}
