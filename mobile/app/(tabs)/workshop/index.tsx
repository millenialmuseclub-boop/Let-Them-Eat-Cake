import { router } from 'expo-router'
import { Pressable, View } from 'react-native'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Title } from '../../../src/components/Typography'
import { useTheme } from '../../../src/theme/useTheme'

// Matches hubs.ts's Workshop item list on the frozen web app exactly (8 items,
// including Assembly Lab — the Phase 1 spec's own section 18 list names only
// 7, omitting Assembly Lab; since it's a real, current, shipped web feature,
// dropping it would violate "no major frozen feature silently dropped," so
// it's kept. Flagged explicitly in the Phase 1 build report.)
const MODULES = [
  { path: '/workshop/assembly-lab', title: 'Assembly Lab', description: 'Build a cake layer by layer and see the recipe update live.' },
  { path: '/workshop/anatomy', title: 'Cake Anatomy', description: 'The stages of a professional cake, explained.' },
  { path: '/workshop/stability', title: 'Cake Stability', description: 'Calculate tier support, chilling, and transport guidance.' },
  { path: '/workshop/techniques', title: 'Technique Library', description: 'Real techniques, lessons, and troubleshooting.' },
  { path: '/workshop/science', title: 'Cake Science', description: 'The why behind the how.' },
  { path: '/workshop/blueprints', title: 'Real Cake Blueprints', description: 'See how iconic cakes are actually built.' },
  { path: '/workshop/failure-lab', title: 'Cake Failure Lab', description: 'Diagnose what went wrong — and how to fix it next time.' },
  { path: '/workshop/pantry-raid', title: 'Pantry Raid', description: "What's in your kitchen? Find the cake that needs the least shopping." },
] as const

export default function WorkshopScreen() {
  const theme = useTheme()
  return (
    <Screen>
      <Eyebrow>Workshop</Eyebrow>
      <Title>Master the craft</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Build, calculate, and show off your next cake.</Body>

      <View>
        {MODULES.map((mod) => (
          <Pressable
            key={mod.path}
            onPress={() => router.push(mod.path)}
            style={{
              padding: 16,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.bgCard,
              marginBottom: 10,
            }}
          >
            <Body style={{ fontWeight: '700' }}>{mod.title}</Body>
            <Caption style={{ marginTop: 2 }}>{mod.description}</Caption>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}
