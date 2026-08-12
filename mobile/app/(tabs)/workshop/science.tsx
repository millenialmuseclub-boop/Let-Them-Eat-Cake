import { View } from 'react-native'
import { ExpandableRow } from '../../../src/components/ExpandableRow'
import { Screen } from '../../../src/components/Screen'
import { Body, Eyebrow, Title } from '../../../src/components/Typography'
import { cakeScienceTopics } from '../../../src/shared/lib/data'
import { useTheme } from '../../../src/theme/useTheme'

export default function ScienceScreen() {
  const theme = useTheme()
  return (
    <Screen>
      <Eyebrow>Cake Science</Eyebrow>
      <Title>The why behind the how</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>The chemistry and physics behind every step.</Body>
      <View>
        {cakeScienceTopics.map((topic) => (
          <ExpandableRow key={topic.id} title={topic.name}>
            <Body>{topic.explanation}</Body>
          </ExpandableRow>
        ))}
      </View>
    </Screen>
  )
}
