import { Pressable } from 'react-native'
import { trackShareInitiated } from '../services/analyticsService'
import { share, type SharePayload } from '../services/shareService'
import { useTheme } from '../theme/useTheme'
import { Body } from './Typography'

export function ShareButton({ payload, context, label = 'Share' }: { payload: SharePayload; context: string; label?: string }) {
  const theme = useTheme()
  return (
    <Pressable
      onPress={() => {
        trackShareInitiated(context)
        share(payload)
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={{
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: theme.radius.pill,
        borderWidth: 1.5,
        borderColor: theme.colors.gold,
        marginTop: theme.spacing.sm,
      }}
    >
      <Body style={{ color: theme.colors.gold, fontWeight: '600' }}>📣 {label}</Body>
    </Pressable>
  )
}
