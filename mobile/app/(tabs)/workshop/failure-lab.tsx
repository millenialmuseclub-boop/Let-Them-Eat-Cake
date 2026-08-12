import { View } from 'react-native'
import { ExpandableRow } from '../../../src/components/ExpandableRow'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Title } from '../../../src/components/Typography'
import { cakeFailures } from '../../../src/shared/lib/data'
import { useTheme } from '../../../src/theme/useTheme'

export default function FailureLabScreen() {
  const theme = useTheme()
  return (
    <Screen>
      <Eyebrow>Cake Failure Lab</Eyebrow>
      <Title>Diagnose what went wrong</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Pick the symptom that matches your cake.</Body>
      <View>
        {cakeFailures.map((failure) => (
          <ExpandableRow key={failure.id} title={failure.symptom}>
            <Caption style={{ fontWeight: '700', color: theme.colors.raspberry, marginBottom: 4 }}>Likely causes</Caption>
            {failure.causes.map((cause, i) => (
              <Body key={i} style={{ marginBottom: 2 }}>
                • {cause}
              </Body>
            ))}
            <Caption style={{ fontWeight: '700', color: theme.colors.gold, marginTop: 8, marginBottom: 4 }}>Fixes for next time</Caption>
            {failure.fixes.map((fix, i) => (
              <Body key={i} style={{ marginBottom: 2 }}>
                • {fix}
              </Body>
            ))}
          </ExpandableRow>
        ))}
      </View>
    </Screen>
  )
}
