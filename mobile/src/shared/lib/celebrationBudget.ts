import type { DecorationCategory, BudgetEstimate } from '../types/weddingCake'

/** Per-serving USD ranges, a rough planning estimate only — not tied to any real vendor's pricing. */
const PER_SERVING_RANGES: Record<DecorationCategory, [number, number]> = {
  natural: [4, 7],
  piped: [6, 9],
  lace: [6, 9],
  geometric: [6, 9],
  floral: [8, 12],
  painted: [8, 12],
  metallic: [8, 12],
}

export function estimateBudget(totalPartySlices: number, decorationCategory: DecorationCategory): BudgetEstimate {
  const [perServingLow, perServingHigh] = PER_SERVING_RANGES[decorationCategory] ?? [6, 9]
  const low = Math.round(perServingLow * totalPartySlices)
  const high = Math.round(perServingHigh * totalPartySlices)

  return {
    low,
    high,
    perServingLow,
    perServingHigh,
    note: 'A rough planning estimate based on typical per-serving pricing tiers — not a quote. Actual cost varies by baker, location, and ingredients.',
  }
}
