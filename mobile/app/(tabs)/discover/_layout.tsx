import { Stack } from 'expo-router'
import { useTheme } from '../../../src/theme/useTheme'

export default function DiscoverLayout() {
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
      <Stack.Screen name="encyclopedia" options={{ title: 'Encyclopedia' }} />
      <Stack.Screen name="cake/[id]" options={{ title: '' }} />
      <Stack.Screen name="atlas/index" options={{ title: 'World Cake Atlas' }} />
      <Stack.Screen name="atlas/[country]" options={{ title: '' }} />
      <Stack.Screen name="persona-match" options={{ title: 'Cake Personality' }} />
      <Stack.Screen name="collections/index" options={{ title: 'Curated Collections' }} />
      <Stack.Screen name="collections/[id]" options={{ title: '' }} />
      <Stack.Screen name="curated-kitchen" options={{ title: 'Curated Kitchen' }} />
    </Stack>
  )
}
