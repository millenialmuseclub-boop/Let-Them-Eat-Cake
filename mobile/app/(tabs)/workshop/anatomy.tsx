import { View } from 'react-native'
import { ExpandableRow } from '../../../src/components/ExpandableRow'
import { Screen } from '../../../src/components/Screen'
import { Body, Caption, Eyebrow, Title } from '../../../src/components/Typography'
import { cakeAnatomyStages } from '../../../src/shared/lib/data'
import { useTheme } from '../../../src/theme/useTheme'

export default function AnatomyScreen() {
  const theme = useTheme()
  return (
    <Screen>
      <Eyebrow>Cake Anatomy</Eyebrow>
      <Title>The stages of a cake</Title>
      <Body style={{ marginTop: 4, marginBottom: theme.spacing.lg }}>Every layer, explained.</Body>
      <View>
        {cakeAnatomyStages.map((stage) => (
          <ExpandableRow key={stage.id} title={stage.name}>
            <Body style={{ marginBottom: 8 }}>{stage.purpose}</Body>
            <Caption style={{ marginBottom: 4 }}>
              <Caption style={{ fontWeight: '700' }}>Texture: </Caption>
              {stage.textureContribution}
            </Caption>
            <Caption style={{ marginBottom: 4 }}>
              <Caption style={{ fontWeight: '700' }}>Structural role: </Caption>
              {stage.structuralRole}
            </Caption>
            <Caption style={{ marginBottom: 4 }}>
              <Caption style={{ fontWeight: '700' }}>Flavor impact: </Caption>
              {stage.flavorImpact}
            </Caption>
            <Caption style={{ marginBottom: 4, color: theme.colors.raspberry }}>
              <Caption style={{ fontWeight: '700' }}>Common mistake: </Caption>
              {stage.commonMistake}
            </Caption>
            <Caption style={{ color: theme.colors.gold }}>
              <Caption style={{ fontWeight: '700' }}>Pro tip: </Caption>
              {stage.proTip}
            </Caption>
          </ExpandableRow>
        ))}
      </View>
    </Screen>
  )
}
