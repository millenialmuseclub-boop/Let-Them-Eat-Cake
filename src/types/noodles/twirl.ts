/* Twirl — the food-specific editorial/cultural magazine experience (Cake/Ramen/Cookies each have
   an equivalent: Pastry Notebook editorial, Slurp, Crumb). Original writing only, no generic
   AI-blog tone, no reproduced published prose. */

export interface TwirlStory {
  slug: string;
  title: string;
  dek: string;
  body: string[]; // paragraphs, original editorial writing
  relatedDishIds?: string[];
  relatedNoodleTypeIds?: string[];
}

export interface VocabularyTerm {
  term: string;
  localScript?: string;
  pronunciation?: string;
  definition: string;
}
