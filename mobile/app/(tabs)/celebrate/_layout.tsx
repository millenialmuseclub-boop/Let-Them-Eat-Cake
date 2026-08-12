import { Stack } from 'expo-router'
import { useTheme } from '../../../src/theme/useTheme'

export default function CelebrateLayout() {
  const theme = useTheme()
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bgCard },
        headerTintColor: theme.colors.raspberry,
        headerTitleStyle: { color: theme.colors.cocoaStrong },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="wedding" options={{ title: 'Wedding' }} />
      <Stack.Screen name="birthday" options={{ title: 'Birthday' }} />
      <Stack.Screen name="other" options={{ title: 'Other Celebrations' }} />
      <Stack.Screen name="time-machine" options={{ title: 'Birthday Time Machine' }} />
    </Stack>
  )
}
