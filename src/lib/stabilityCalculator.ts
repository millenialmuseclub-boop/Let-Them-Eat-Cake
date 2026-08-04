import type { StabilityInput, StabilityResult } from '../types/stabilityCalculator'

export function calculateStability(input: StabilityInput): StabilityResult {
  const { tierCount, diameterIn, fillingWeight, temperature, transport } = input

  const supportNotes: string[] = []
  if (tierCount <= 1) {
    supportNotes.push('A single tier needs no internal supports — just a sturdy board underneath.')
  } else if (tierCount === 2) {
    supportNotes.push('Use 4 plain dowel rods spaced evenly in the base tier to carry the weight of the tier above.')
  } else {
    supportNotes.push(
      `At ${tierCount} tiers, use dowel rods in every tier below the top, or switch to an SPS (Single Plate System) separator for cleaner, more even support.`,
    )
  }
  if (diameterIn >= 14) {
    supportNotes.push('At this size, reinforce every board with a double layer of corrugated cardboard or foam board before stacking.')
  }

  const chillNotes: string[] = []
  if (fillingWeight === 'heavy') {
    chillNotes.push('Chill at least 4-6 hours, ideally overnight — heavy fillings like ganache or curd need full time to set before the cake can be stacked or sliced cleanly.')
  } else if (fillingWeight === 'medium') {
    chillNotes.push('Chill at least 2 hours before stacking or serving.')
  } else {
    chillNotes.push('A light filling like whipped cream only needs 30-60 minutes of chilling before serving.')
  }
  if (temperature === 'warm') {
    chillNotes.push('In warm conditions, keep the cake refrigerated until as close to serving time as possible.')
  }

  const displayNotes: string[] = []
  if (temperature === 'warm') {
    displayNotes.push(
      fillingWeight === 'heavy'
        ? 'Limit room-temperature display to under 2 hours, even with a sturdier filling.'
        : 'Limit room-temperature display to under 1 hour in warm conditions.',
    )
  } else {
    displayNotes.push('Safe for room-temperature display for 3-4 hours in cool-to-moderate conditions.')
  }
  if (transport === 'long') {
    displayNotes.push('For long transport, assemble the final tier — and any delicate garnish — on site rather than fully stacking before the drive.')
  } else if (transport === 'short') {
    displayNotes.push('Transport flat and chilled in a non-slip box; add any delicate garnish after arrival.')
  }

  return { supportNotes, chillNotes, displayNotes }
}
