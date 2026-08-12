import { router } from 'expo-router'
import { Pressable } from 'react-native'
import { FeatureCard } from '../../../src/components/FeatureCard'
import { Screen } from '../../../src/components/Screen'
import { Body, Eyebrow, Title } from '../../../src/components/Typography'
import { useTheme } from '../../../src/theme/useTheme'

export default function CelebrateScreen() {
  const theme = useTheme()
  return (
    <Screen>
      <Eyebrow>Celebrate</Eyebrow>
      <Title>Design a cake with us</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Not fill out a form about one. Choose what you're celebrating.</Body>

      <FeatureCard
        title="Wedding"
        description="A premium, detailed design and logistics experience."
        cta="Begin →"
        cakeId="cake_jfk_wedding"
        onPress={() => router.push('/celebrate/wedding')}
      />
      <FeatureCard
        title="Birthday"
        description="A joyful, personalized cake-planning experience."
        cta="Begin →"
        cakeId="cake_rainbow_drip_2010s"
        onPress={() => router.push('/celebrate/birthday')}
      />
      <FeatureCard
        title="Other Celebrations"
        description="A lighter, faster planning experience for anniversaries, showers, graduations, holidays, and more."
        cta="Begin →"
        cakeId="cake_lamington"
        onPress={() => router.push('/celebrate/other')}
      />

      <Pressable onPress={() => router.push('/celebrate/time-machine')} style={{ marginTop: theme.spacing.sm }}>
        <Body style={{ color: theme.colors.gold, fontWeight: '600' }}>🎂 Curious what cake defined your birth year? Try the Birthday Time Machine →</Body>
      </Pressable>
    </Screen>
  )
}
