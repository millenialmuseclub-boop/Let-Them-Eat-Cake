import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '../src/theme/useTheme'

export default function RootLayout() {
  const theme = useTheme()
  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  )
}
