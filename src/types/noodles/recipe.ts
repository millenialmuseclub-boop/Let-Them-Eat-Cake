/* Structured Recipe type. Noodles-specific: the audit found NO dedicated Recipe type anywhere in
   Let Them Eat Ramen (its RamenProfile.preparationOverview is a single free-text string) — a
   genuine gap in the family. This type uses Let Them Eat Cookies' RecipeIngredientGroup /
   RecipeInstruction pattern as its template, since Cookies is the strongest recipe architecture
   in the family, extended with a stages/technique-note link back to Workshop. */

export interface RecipeIngredientLine {
  amount: string;
  unit?: string;
  ingredient: string;
  note?: string;
}

export interface RecipeIngredientGroup {
  groupName: string;
  items: RecipeIngredientLine[];
}

export interface RecipeInstruction {
  step: number;
  stage: string;
  instruction: string;
  /** The "why" behind a step, cross-linked back to a Workshop lesson when one exists. */
  techniqueNote?: string;
  relatedLabSlug?: string;
}

export interface Recipe {
  id: string;
  dishId: string;
  title: string;
  yield: string;
  prepTime: string;
  cookTime: string;
  restingTime?: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  equipment: string[];
  ingredientGroups: RecipeIngredientGroup[];
  instructions: RecipeInstruction[];
  cooksNotes?: string[];
  substitutions?: string[];
  storage?: string;
  makeAhead?: string;
  relatedWorkshopLessons?: string[];
  sourceNote: string;
}
