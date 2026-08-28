import { dishes } from '../../data/noodles/dishes';
import type { FindCraving, FindMatch } from '../../types/noodles/sommelier';
import type { NoodleDish } from '../../types/noodles/noodle';

/* Deterministic weighted scoring — no LLM/AI call anywhere in this file, matching the proven
   Cake/Ramen Sommelier pattern. Results explain WHY they match, not just what matched. */

const DIMENSION_WEIGHT = 10;
const TAG_WEIGHT = 8;

function dimensionScore(dish: NoodleDish, craving: FindCraving): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 50; // baseline

  const dims: [keyof FindCraving, keyof NoodleDish['flavorProfile'], string][] = [
    ['brothiness', 'brothiness', 'broth level'],
    ['boldness', 'boldness', 'boldness'],
    ['richness', 'richness', 'richness'],
    ['chewiness', 'chewiness', 'chewiness'],
    ['spice', 'spice', 'spice'],
  ];

  for (const [cravingKey, profileKey, label] of dims) {
    const target = craving[cravingKey] as number;
    const actual = dish.flavorProfile[profileKey];
    const distance = Math.abs(target - actual);
    const dimScore = DIMENSION_WEIGHT - distance * 2;
    score += dimScore;
    if (distance <= 1) {
      reasons.push(`Matches your ${label} craving closely.`);
    }
  }

  const sharedTags = craving.desiredTags.filter((tag) => dish.flavorTags.includes(tag));
  score += sharedTags.length * TAG_WEIGHT;
  if (sharedTags.length > 0) {
    reasons.push(`Carries the ${sharedTags.join(', ')} notes you're after.`);
  }

  return { score, reasons };
}

export function findMatches(craving: FindCraving, limit = 5): FindMatch[] {
  return dishes
    .map((dish) => {
      const { score, reasons } = dimensionScore(dish, craving);
      return { dishId: dish.id, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
