/* Metric → US/imperial conversion for Noodles recipe ingredient lines.
   All Noodles recipes are authored in grams/kg/ml/L (see src/data/noodles/recipes.ts),
   so this derives a US-kitchen-friendly equivalent to show alongside the metric amount
   rather than replacing it.

   Weight-to-volume conversions (grams -> cups) are ingredient-density-dependent — flour,
   sugar, and butter each pack differently — so those use a small per-category density
   table. Anything not recognized as a "measure by volume" baking ingredient (meat, bones,
   vegetables, noodles, whole spices, etc.) converts by weight alone (oz/lb), which is how
   US recipes actually measure those ingredients too. Volume units (ml/L) convert straight
   to cups/tbsp/tsp/fl oz since that conversion never depends on density. */

type DensityCategory =
  | 'flour-standard'
  | 'flour-rice'
  | 'sugar-granulated'
  | 'sugar-brown'
  | 'sugar-palm'
  | 'butter'
  | 'salt'
  | 'cornstarch';

// Grams per US cup, per ingredient category.
const CUP_DENSITY_G: Record<DensityCategory, number> = {
  'flour-standard': 120,
  'flour-rice': 158,
  'sugar-granulated': 200,
  'sugar-brown': 213,
  'sugar-palm': 220,
  butter: 227,
  salt: 292,
  cornstarch: 128,
};

function detectDensityCategory(ingredient: string): DensityCategory | null {
  const s = ingredient.toLowerCase();
  if (/rice flour/.test(s)) return 'flour-rice';
  if (/flour/.test(s)) return 'flour-standard';
  if (/brown sugar/.test(s)) return 'sugar-brown';
  if (/palm sugar/.test(s)) return 'sugar-palm';
  if (/rock sugar|sugar/.test(s)) return 'sugar-granulated';
  if (/\bbutter\b/.test(s)) return 'butter';
  if (/\bsalt\b/.test(s)) return 'salt';
  if (/cornstarch/.test(s)) return 'cornstarch';
  return null;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Rounds `value` to the nearest 1/`denom` and renders it as a mixed number, e.g. "1 1/2". */
function formatMixedNumber(value: number, denom: number): string {
  const roundedTotal = Math.round(value * denom);
  let whole = Math.floor(roundedTotal / denom);
  let fracNum = roundedTotal % denom;
  if (fracNum === 0) return `${whole}`;
  const g = gcd(fracNum, denom);
  fracNum /= g;
  const fracDenom = denom / g;
  return whole > 0 ? `${whole} ${fracNum}/${fracDenom}` : `${fracNum}/${fracDenom}`;
}

function formatCups(cups: number): string | null {
  if (cups < 0.06) return null; // negligible — not worth showing as cups
  const rounded = Math.round(cups * 4) / 4;
  const label = rounded > 1 ? 'cups' : 'cup';
  return `${formatMixedNumber(cups, 4)} ${label}`;
}

function formatTbspOrTsp(tbsp: number): string {
  if (tbsp >= 0.9) {
    return `${formatMixedNumber(tbsp, 2)} tbsp`;
  }
  const tsp = tbsp * 3;
  return `${formatMixedNumber(Math.max(tsp, 0.25), 4)} tsp`;
}

function formatOzOrLb(oz: number): string {
  if (oz >= 16) {
    const lb = oz / 16;
    const rounded = Math.round(lb * 10) / 10;
    return `${rounded % 1 === 0 ? rounded : rounded.toFixed(1)} lb`;
  }
  const rounded = Math.round(oz * 2) / 2;
  return `${rounded % 1 === 0 ? rounded : rounded.toFixed(1)} oz`;
}

/**
 * Returns a US/imperial equivalent string for a metric ingredient amount, or null when the
 * unit isn't one we convert (counts, "to taste", already-imperial tbsp/tsp, etc).
 */
export function getImperialEquivalent(
  amount: string,
  unit: string | undefined,
  ingredient: string
): string | null {
  if (!unit) return null;
  const n = parseFloat(amount);
  if (Number.isNaN(n)) return null;

  const u = unit.toLowerCase();

  if (u === 'g' || u === 'kg') {
    const grams = u === 'kg' ? n * 1000 : n;
    const category = detectDensityCategory(ingredient);
    if (category) {
      const cups = grams / CUP_DENSITY_G[category];
      if (cups >= 0.2) {
        const formatted = formatCups(cups);
        if (formatted) return formatted;
      }
      const tbsp = cups * 16;
      if (tbsp >= 0.4) return formatTbspOrTsp(tbsp);
    }
    const oz = grams / 28.3495;
    return formatOzOrLb(oz);
  }

  if (u === 'ml' || u === 'l') {
    const ml = u === 'l' ? n * 1000 : n;
    const cups = ml / 236.588;
    if (cups >= 0.2) {
      const formatted = formatCups(cups);
      if (formatted) return formatted;
    }
    const tbsp = ml / 14.7868;
    if (tbsp >= 0.4) return formatTbspOrTsp(tbsp);
    const flOz = ml / 29.5735;
    return `${Math.round(flOz * 2) / 2} fl oz`;
  }

  return null;
}
