import type { ArchitectureType, FrostingType, TierRole, TierSpec, TierArchitecturePlan, WeddingAesthetic, WeddingCulture } from '../types/weddingCake'

/** Wilton-style round-tier serving chart. party = 1"x2" celebratory slice, venue = 1"x1" reception slice. */
export const TIER_SERVING_CHART: { diameterIn: number; partySlices: number; venueSlices: number }[] = [
  { diameterIn: 6, partySlices: 12, venueSlices: 24 },
  { diameterIn: 8, partySlices: 24, venueSlices: 32 },
  { diameterIn: 10, partySlices: 38, venueSlices: 56 },
  { diameterIn: 12, partySlices: 56, venueSlices: 78 },
  { diameterIn: 14, partySlices: 78, venueSlices: 98 },
  { diameterIn: 16, partySlices: 100, venueSlices: 120 },
  { diameterIn: 18, partySlices: 122, venueSlices: 144 },
  { diameterIn: 20, partySlices: 148, venueSlices: 172 },
]

export const ARCHITECTURE_FROSTING_MAP: Record<ArchitectureType, FrostingType> = {
  'classic-tiered-sponge': 'swiss-meringue-buttercream',
  'semi-naked-bare': 'swiss-meringue-buttercream',
  'fondant-sculpted': 'fondant',
  'croquembouche-choux-tower': 'swiss-meringue-buttercream',
  'ring-tower-kransekake': 'swiss-meringue-buttercream',
  'separated-pillar-display': 'fondant',
}

const ARCHITECTURE_STABILITY_NOTES: Record<ArchitectureType, string> = {
  'classic-tiered-sponge': 'Standard dowel rods per tier beneath a cardboard cake board.',
  'semi-naked-bare': 'Lighter frosting load tolerates standard dowels; boards should still be full-diameter for stability.',
  'fondant-sculpted': 'Fondant adds significant weight — use extra dowels and reinforced boards under every tier.',
  'croquembouche-choux-tower': 'No dowels — the caramel-bonded choux structure is self-supporting on a stable cone base; needs a dry, low-humidity room.',
  'ring-tower-kransekake': 'No dowels — rings are self-supporting when stacked on a flat cake stand; keep away from direct heat so the icing lattice holds.',
  'separated-pillar-display': 'Each tier rests on pillars over the one below; boards must be cut to full support diameter with pillars centered precisely.',
}

const SELF_SUPPORTING_ARCHITECTURES: ArchitectureType[] = ['croquembouche-choux-tower', 'ring-tower-kransekake']

function defaultTierCount(guestCount: number): 2 | 3 | 4 {
  if (guestCount <= 40) return 2
  if (guestCount <= 120) return 3
  return 4
}

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]]
  if (arr.length < k) return []
  const [first, ...rest] = arr
  const withFirst = combinations(rest, k - 1).map((combo) => [first, ...combo])
  const withoutFirst = combinations(rest, k)
  return [...withFirst, ...withoutFirst]
}

function selectTierDiameters(guestCount: number): { diameters: number[]; cappedGuestCountWarning?: string } {
  for (let n = defaultTierCount(guestCount); n <= 4; n++) {
    const combos = combinations(TIER_SERVING_CHART, n)
    let best: typeof TIER_SERVING_CHART | null = null
    let bestWaste = Infinity
    for (const combo of combos) {
      const total = combo.reduce((sum, row) => sum + row.venueSlices, 0)
      if (total < guestCount) continue
      const waste = total - guestCount
      const baseDiameter = Math.max(...combo.map((row) => row.diameterIn))
      const bestBaseDiameter = best ? Math.max(...best.map((row) => row.diameterIn)) : Infinity
      if (waste < bestWaste || (waste === bestWaste && baseDiameter < bestBaseDiameter)) {
        best = combo
        bestWaste = waste
      }
    }
    if (best) {
      return { diameters: best.map((row) => row.diameterIn).sort((a, b) => b - a) }
    }
  }

  const top4 = TIER_SERVING_CHART.slice(-4)
    .map((row) => row.diameterIn)
    .sort((a, b) => b - a)
  return {
    diameters: top4,
    cappedGuestCountWarning: 'Guest count exceeds standard tier capacity — plan a sheet-cake kitchen extension to serve the overflow.',
  }
}

function assignRoles(diametersDesc: number[]): TierSpec[] {
  return diametersDesc.map((diameterIn, index) => {
    const chartRow = TIER_SERVING_CHART.find((row) => row.diameterIn === diameterIn)!
    let role: TierRole
    if (index === 0) role = 'base'
    else if (index === diametersDesc.length - 1) role = 'top'
    else role = 'middle'
    return { role, diameterIn, partySlices: chartRow.partySlices, venueSlices: chartRow.venueSlices }
  })
}

function getStabilityNotes(architecture: ArchitectureType, tierCount: number): string[] {
  const notes = [ARCHITECTURE_STABILITY_NOTES[architecture]]
  if (tierCount >= 3 && !SELF_SUPPORTING_ARCHITECTURES.includes(architecture)) {
    notes.push('At 3+ tiers, use an SPS (Single Plate System) separator instead of plain dowels for load distribution.')
  }
  return notes
}

export function pickArchitecture(aesthetic: WeddingAesthetic, culture: WeddingCulture): { architecture: ArchitectureType; reason: string } {
  if (culture.architectureNudge) {
    return {
      architecture: culture.architectureNudge,
      reason: `${culture.name}'s wedding tradition strongly favors this structure, taking priority over the general ${aesthetic.name} styling.`,
    }
  }
  return {
    architecture: aesthetic.architectureNudge,
    reason: `The ${aesthetic.name} aesthetic is expressed here as this structure.`,
  }
}

export function generateTierPlan(guestCount: number, aesthetic: WeddingAesthetic, culture: WeddingCulture): TierArchitecturePlan {
  const { architecture, reason } = pickArchitecture(aesthetic, culture)
  const { diameters, cappedGuestCountWarning } = selectTierDiameters(guestCount)
  const tiers = assignRoles(diameters)
  return {
    architecture,
    architectureReason: reason,
    tiers,
    stabilityNotes: getStabilityNotes(architecture, tiers.length),
    cappedGuestCountWarning,
  }
}

export function buildCuttingGuide(tiers: TierSpec[]): string[] {
  return tiers.map((tier) => {
    const roleLabel = tier.role === 'top' ? 'Top tier' : tier.role === 'base' ? 'Base tier' : 'Middle tier'
    return `${roleLabel} (${tier.diameterIn}"): cut a circle roughly 2" in from the edge, slice that inner circle into wedges, then cut the outer ring into 1"x1" venue-style pieces — about ${tier.venueSlices} servings this way, or ${tier.partySlices} larger 1"x2" party-style slices for fewer, bigger portions.`
  })
}
