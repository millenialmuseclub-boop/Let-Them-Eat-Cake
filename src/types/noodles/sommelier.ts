/* Sommelier FIND — deterministic weighted scoring, same pattern proven across Cake/Ramen: no
   LLM/AI call anywhere in this module. CREATE and PAIR are explicitly out of scope for Phase 1
   per the master spec. */

import type { FlavorProfile, FlavorTag } from './noodle';

export interface FindCraving {
  brothiness: number; // 0-5, matched against FlavorProfile.brothiness
  boldness: number;
  richness: number;
  chewiness: number;
  spice: number;
  desiredTags: FlavorTag[];
}

export interface FindMatch {
  dishId: string;
  score: number;
  reasons: string[];
}

export type { FlavorProfile };
