import { View } from 'react-native'
import { ExpandableRow } from '../../../src/components/ExpandableRow'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Title } from '../../../src/components/Typography'
import { blueprintExamples } from '../../../src/shared/lib/data'
import { useTheme } from '../../../src/theme/useTheme'

export default function BlueprintsScreen() {
  const theme = useTheme()
  return (
    <Screen>
      <Eyebrow>Real Cake Blueprints</Eyebrow>
      <Title>How iconic cakes are built</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Real layer structures from real cakes.</Body>
      <View>
        {blueprintExamples.map((example) => (
          <ExpandableRow key={example.id} title={example.name}>
            <Body style={{ marginBottom: 10 }}>{example.description}</Body>
            {example.layers.map((layer, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Caption style={{ fontWeight: '700', width: 90, color: theme.colors.raspberry }}>{layer.name}</Caption>
                <Caption style={{ flex: 1 }}>{layer.note}</Caption>
              </View>
            ))}
          </ExpandableRow>
        ))}
      </View>
    </Screen>
  )
}
