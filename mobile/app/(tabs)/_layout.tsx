import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { useTheme } from '../../src/theme/useTheme'

export default function TabsLayout() {
  const theme = useTheme()

  return (
    <Tabs
      initialRouteName="discover"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.raspberry,
        tabBarInactiveTintColor: theme.colors.text + '99',
        tabBarStyle: {
          backgroundColor: theme.colors.bgCard,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workshop"
        options={{
          title: 'Workshop',
          tabBarIcon: ({ color, size }) => <Ionicons name="construct-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sommelier"
        options={{
          title: 'Sommelier',
          tabBarIcon: ({ color, size }) => <Ionicons name="wine-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="celebrate"
        options={{
          title: 'Celebrate',
          tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
