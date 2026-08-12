import { View } from 'react-native'
import { ExpandableRow } from '../../../src/components/ExpandableRow'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Title } from '../../../src/components/Typography'
import { techniques } from '../../../src/shared/lib/data'
import { useTheme } from '../../../src/theme/useTheme'

export default function TechniquesScreen() {
  const theme = useTheme()
  return (
    <Screen>
      <Eyebrow>Technique Library</Eyebrow>
      <Title>Real techniques, real troubleshooting</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Pick a technique to see the steps, common mistakes, and a chef's tip.</Body>
      <View>
        {techniques.map((tech) => (
          <ExpandableRow key={tech.id} title={tech.name}>
            <Body style={{ marginBottom: 10 }}>{tech.whatItIs}</Body>
            {tech.steps.map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Body style={{ fontWeight: '700', color: theme.colors.raspberry, width: 20 }}>{i + 1}.</Body>
                <Body style={{ flex: 1 }}>{step}</Body>
              </View>
            ))}
            <Caption style={{ marginTop: 6, color: theme.colors.raspberry }}>
              <Caption style={{ fontWeight: '700' }}>Common mistake: </Caption>
              {tech.commonMistake}
            </Caption>
            <Caption style={{ marginTop: 4, color: theme.colors.gold }}>
              <Caption style={{ fontWeight: '700' }}>Chef's tip: </Caption>
              {tech.chefTip}
            </Caption>
          </ExpandableRow>
        ))}
      </View>
    </Screen>
  )
}
