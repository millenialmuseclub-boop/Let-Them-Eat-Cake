import { weddingCultures, weddingAesthetics, weddingSeasons, getRecipe, getCake } from './data'
import { generateTierPlan, buildCuttingGuide, ARCHITECTURE_FROSTING_MAP } from './weddingArchitecture'
import { pickTiers } from './weddingFlavor'
import { auditAllergens } from './weddingAllergens'
import type { ArchitectureType, FrostingType, TierRole, WeddingPlanInput, WeddingPlanResult } from '../types/weddingCake'

const ALLERGEN_FOOTER_NOTE =
  'Consider a small nut-free/dairy-free mini cutting tier for allergic guests rather than substituting the whole design.'

export function generateWeddingPlan(input: WeddingPlanInput): WeddingPlanResult {
  const culture = weddingCultures.find((c) => c.id === input.cultureId)
  const aesthetic = weddingAesthetics.find((a) => a.id === input.aestheticId)
  const seasonEntry = weddingSeasons.find((s) => s.id === input.season)

  if (!culture || !aesthetic || !seasonEntry) {
    throw new Error('Invalid wedding plan input: unknown culture, aesthetic, or season id.')
  }

  const architecturePlan = generateTierPlan(input.guestCount, aesthetic, culture)
  const chosenFrosting = ARCHITECTURE_FROSTING_MAP[architecturePlan.architecture]
  const frostingGuidanceEntry = seasonEntry.frostingGuidance.find((g) => g.frosting === chosenFrosting)!
  const frostingGuidance = input.variant === 'indoor' ? frostingGuidanceEntry.indoor : frostingGuidanceEntry.outdoor

  const tierPicks = pickTiers(seasonEntry, culture, input.diet, architecturePlan.tiers.length)

  const pickedRecipes = tierPicks.map((pick) => getRecipe(pick.recipeId)).filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe))

  const allergenAudit = auditAllergens(pickedRecipes, input.diet)
  const cuttingGuide = buildCuttingGuide(architecturePlan.tiers)

  return {
    input,
    culture,
    aesthetic,
    seasonEntry,
    chosenFrosting,
    frostingGuidance,
    architecturePlan,
    tierPicks,
    allergenAudit,
    allergenFooterNote: ALLERGEN_FOOTER_NOTE,
    cuttingGuide,
  }
}

const ARCHITECTURE_LABELS: Record<ArchitectureType, string> = {
  'classic-tiered-sponge': 'Classic Tiered Sponge',
  'semi-naked-bare': 'Semi-Naked / Bare Layer',
  'fondant-sculpted': 'Fondant Sculpted',
  'croquembouche-choux-tower': 'Croquembouche / Choux Tower',
  'ring-tower-kransekake': 'Ring Tower / Kransekake',
  'separated-pillar-display': 'Separated Pillar Display',
}

const FROSTING_LABELS: Record<FrostingType, string> = {
  'swiss-meringue-buttercream': 'Swiss Meringue Buttercream',
  fondant: 'Fondant',
  'whipped-cream': 'Whipped Cream',
}

export function formatArchitectureLabel(type: ArchitectureType): string {
  return ARCHITECTURE_LABELS[type]
}

export function formatFrostingLabel(type: FrostingType): string {
  return FROSTING_LABELS[type]
}

export function formatRoleLabel(role: TierRole): string {
  if (role === 'top') return 'Top Tier (Anniversary Tier)'
  if (role === 'base') return 'Base Tier'
  return 'Middle Tier'
}

export function toMarkdown(result: WeddingPlanResult): string {
  const { culture, aesthetic, seasonEntry, architecturePlan, tierPicks, allergenAudit, allergenFooterNote, cuttingGuide, chosenFrosting, frostingGuidance, input } = result
  const lines: string[] = []

  lines.push('# Wedding Cake Profile & Master Planning Sheet')
  lines.push('')
  lines.push(
    `**Location/Culture:** ${culture.name} · **Guests:** ${input.guestCount} · **Season:** ${seasonEntry.name} (${input.variant}) · **Aesthetic:** ${aesthetic.name} · **Dietary:** ${input.diet}`,
  )
  lines.push('')

  lines.push('## 💍 Cultural History & Traditions')
  lines.push('')
  lines.push(`**Traditions:** ${culture.traditions}`)
  lines.push('')
  lines.push(`**Symbolism:** ${culture.symbolism}`)
  lines.push('')
  lines.push(`**Ritual:** ${culture.ritual}`)
  lines.push('')

  lines.push('## 🏰 Cake Type & Structural Architecture')
  lines.push('')
  lines.push(`**Structure:** ${formatArchitectureLabel(architecturePlan.architecture)} — ${architecturePlan.architectureReason}`)
  lines.push('')
  lines.push('**Tier breakdown:**')
  for (const tier of architecturePlan.tiers) {
    lines.push(`- ${formatRoleLabel(tier.role)}: ${tier.diameterIn}" — ${tier.venueSlices} venue slices (1"x1") / ${tier.partySlices} party slices (1"x2")`)
  }
  lines.push('')
  lines.push('**Structural stability notes:**')
  for (const note of architecturePlan.stabilityNotes) {
    lines.push(`- ${note}`)
  }
  if (architecturePlan.cappedGuestCountWarning) {
    lines.push(`- ⚠️ ${architecturePlan.cappedGuestCountWarning}`)
  }
  lines.push('')

  lines.push('## 🍂 Seasonal Flavor Harmony & Timing')
  lines.push('')
  lines.push(`**Seasonal profile:** ${seasonEntry.name} favors flavors like ${seasonEntry.flavorAffinityNotes.join(', ')}.`)
  lines.push('')
  lines.push(`**Temperature & weather warning (${formatFrostingLabel(chosenFrosting)}, ${input.variant}):** ${frostingGuidance}`)
  lines.push('')

  lines.push('## 🍰 Multi-Tier Flavor Specifications')
  lines.push('')
  for (const pick of tierPicks) {
    const cake = getCake(pick.cakeId)
    lines.push(`**${formatRoleLabel(pick.role)}:** ${cake?.name ?? pick.cakeId}`)
    for (const reason of pick.reason) {
      lines.push(`- ${reason}`)
    }
    if (pick.dietCaveat) {
      lines.push(`- ⚠️ ${pick.dietCaveat}`)
    }
    lines.push('')
  }

  lines.push('## ⚠️ Allergen & Dietary Compliance')
  lines.push('')
  for (const entry of allergenAudit) {
    if (!entry.present) continue
    lines.push(`**${entry.allergen}** (${entry.status}): ${entry.guidance}`)
  }
  lines.push('')
  lines.push(allergenFooterNote)
  lines.push('')

  lines.push('## 🎨 Aesthetic Decor & Baker Logistics')
  lines.push('')
  lines.push(`**Exterior finish & palette:** ${aesthetic.paletteGuidance} ${aesthetic.textureGuidance} ${culture.decorHint}.`)
  lines.push('')
  lines.push('**Caterer cutting guide:**')
  for (const line of cuttingGuide) {
    lines.push(`- ${line}`)
  }

  return lines.join('\n')
}
