import { Pressable, View } from 'react-native'
import { trackAffiliateClicked } from '../services/analyticsService'
import { openExternalLink } from '../services/externalLinkService'
import type { AffiliateProduct } from '../shared/types/affiliateProduct'
import { useTheme } from '../theme/useTheme'
import { Body, Caption, Subtitle } from './Typography'

const MAX_VISIBLE = 5

const NETWORK_LABEL: Record<AffiliateProduct['network'], string> = {
  shopmy: 'ShopMy',
  ltk: 'LTK',
}

export function AffiliateProductSet({ title, products, context }: { title: string; products: AffiliateProduct[]; context: string }) {
  const theme = useTheme()
  const visible = products.filter((p) => p.active).slice(0, MAX_VISIBLE)
  if (visible.length === 0) return null

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Subtitle style={{ marginBottom: 8 }}>{title}</Subtitle>
      {visible.map((product) => (
        <Pressable
          key={product.id}
          onPress={() => {
            trackAffiliateClicked(product.name, product.network, product.category, context)
            openExternalLink(product.url)
          }}
          style={[styles(theme).row, { borderColor: theme.colors.border }]}
        >
          <Body style={{ fontWeight: '600' }}>{product.name}</Body>
          {product.editorialNote && (
            <Caption numberOfLines={2} style={{ marginTop: 2 }}>
              {product.editorialNote}
            </Caption>
          )}
          <Caption style={{ color: theme.colors.raspberry, marginTop: 4 }}>View Recommendation → via {NETWORK_LABEL[product.network]}</Caption>
        </Pressable>
      ))}
      <Caption style={{ marginTop: 4, fontStyle: 'italic' }}>
        Let Them Eat Cake is independently curated. We may earn a commission when you purchase through selected links.
      </Caption>
    </View>
  )
}

function styles(theme: ReturnType<typeof useTheme>) {
  return {
    row: {
      borderWidth: 1,
      borderRadius: theme.radius.sm,
      padding: 12,
      marginBottom: 8,
    },
  }
}
