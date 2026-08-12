import { Stack } from 'expo-router'
import { useTheme } from '../../../src/theme/useTheme'

export default function WorkshopLayout() {
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
      <Stack.Screen name="assembly-lab" options={{ title: 'Assembly Lab' }} />
      <Stack.Screen name="anatomy" options={{ title: 'Cake Anatomy' }} />
      <Stack.Screen name="stability" options={{ title: 'Cake Stability' }} />
      <Stack.Screen name="techniques" options={{ title: 'Technique Library' }} />
      <Stack.Screen name="science" options={{ title: 'Cake Science' }} />
      <Stack.Screen name="blueprints" options={{ title: 'Real Cake Blueprints' }} />
      <Stack.Screen name="failure-lab" options={{ title: 'Cake Failure Lab' }} />
      <Stack.Screen name="pantry-raid" options={{ title: 'Pantry Raid' }} />
    </Stack>
  )
}
