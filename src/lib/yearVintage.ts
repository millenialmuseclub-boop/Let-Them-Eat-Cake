const TWIST_FLAVORS = [
  'salted caramel',
  'espresso',
  'raspberry',
  'toasted coconut',
  'brown butter',
  'cardamom',
  'blood orange',
  'hazelnut',
  'matcha',
  'bourbon',
  'black sesame',
  'passionfruit',
  'rose',
  'ginger',
  'pistachio',
]

const TWIST_ADJECTIVES = ['Ripple', 'Swirl', 'Kissed', 'Glazed', 'Infused', 'Dusted', 'Drizzled', 'Studded']

export interface YearVariant {
  year: number
  variantName: string
  twist: string
  recipeTwistNote: string
}

function titleCase(phrase: string): string {
  return phrase
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Deterministic per-year "vintage" so every exact birth year gets a unique,
 * repeatable result without inventing fake single-year food history — the
 * underlying decade cake and its real history stay intact.
 */
export function getYearVariant(year: number, cakeName: string): YearVariant {
  const flavor = TWIST_FLAVORS[((year % TWIST_FLAVORS.length) + TWIST_FLAVORS.length) % TWIST_FLAVORS.length]
  const adjective = TWIST_ADJECTIVES[Math.floor(year / TWIST_FLAVORS.length) % TWIST_ADJECTIVES.length]

  return {
    year,
    variantName: `The ${titleCase(flavor)} ${adjective} Vintage`,
    twist: `In ${year}, bakers began folding a touch of ${flavor} into the classic ${cakeName}, giving that year's batch its own ${adjective.toLowerCase()} signature.`,
    recipeTwistNote: `This year's twist: fold about 2 tablespoons of ${flavor} (or a few drops of ${flavor} extract) into the batter before baking.`,
  }
}
