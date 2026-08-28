/* Core domain model for Let Them Eat Noodles.
   Family-reusable shape (flat records joined by string id, no ORM) inherited from Cake/Ramen/
   Cookies. The relationship model itself — NoodleType -> NoodleDish -> Technique -> Place ->
   Recipe — is Noodles-specific: nothing in the family has a "same underlying product, many
   culturally-distinct dishes" relationship, because Cake/Cookies/Ramen each model one flat
   food entity. This file is the thing that makes Noodles not "Ramen again." */

export type NoodleBase =
  | 'wheat'
  | 'rice'
  | 'buckwheat'
  | 'sweet-potato-starch'
  | 'mung-bean-starch'
  | 'egg-wheat'
  | 'other-starch';

export type NoodleForm =
  | 'strand'
  | 'ribbon'
  | 'vermicelli'
  | 'sheet'
  | 'hand-torn'
  | 'extruded';

export type TechniqueId =
  | 'hand-pulled'
  | 'hand-torn'
  | 'knife-cut'
  | 'rolled-and-cut'
  | 'extruded'
  | 'stretched'
  | 'shaved';

export type PreparationStyle =
  | 'soup'
  | 'dry-sauced'
  | 'stir-fried'
  | 'chilled'
  | 'dressed';

/** A noodle TYPE — the physical product (base + form + how it's made). Multiple dishes across
    different cuisines can reference the same, or a closely related, noodle type. This is the
    entity that prevents duplicate "noodle" records per dish. */
export interface NoodleType {
  id: string;
  name: string;
  localNames?: { language: string; name: string; romanization?: string }[];
  base: NoodleBase;
  form: NoodleForm;
  techniqueIds: TechniqueId[];
  /** Careful, non-absolutist origin language — a region of strong historical association, not a
      claimed single birthplace. */
  originNote: string;
  description: string;
  texture: string;
  /** Other noodle types this one is closely related to or sometimes conflated with, with a note
      on the actual distinction (never silently merged). */
  relatedNoodleTypeIds?: string[];
}

export type FlavorTag =
  | 'garlicky'
  | 'sesame'
  | 'chili'
  | 'savory'
  | 'tangy'
  | 'herbal'
  | 'nutty'
  | 'fermented'
  | 'smoky'
  | 'aromatic'
  | 'fresh'
  | 'citrus'
  | 'sweet';

export interface FlavorProfile {
  /** 0 = brothy, 5 = dry */
  brothiness: number;
  /** 0 = delicate, 5 = bold */
  boldness: number;
  /** 0 = light, 5 = rich */
  richness: number;
  /** 0 = soft, 5 = chewy */
  chewiness: number;
  /** 0 = mild, 5 = spicy */
  spice: number;
}

export interface PlaceRef {
  regionId: string;
  countryId: string;
  cityOrAreaId?: string;
}

/** A canonical NOODLE DISH — the actual thing someone orders/eats. References a NoodleType rather
    than re-describing the noodle. */
export interface NoodleDish {
  id: string;
  name: string;
  localName?: string;
  romanization?: string;
  alternateNames?: string[];
  noodleTypeId: string;
  place: PlaceRef;
  preparationStyle: PreparationStyle;
  primaryTechniqueIds: TechniqueId[];
  culturalContext: string;
  historicalContext: string;
  flavorProfile: FlavorProfile;
  flavorTags: FlavorTag[];
  brothOrSauceRelationship: string;
  relatedDishIds?: string[];
  relatedNoodleTypeIds?: string[];
  workshopLessonSlugs?: string[];
  recipeId: string;
  sourceNote: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  regionId: string;
  name: string;
}

export interface Place {
  id: string;
  countryId: string;
  name: string;
  kind: 'city' | 'area' | 'province';
  /** Roughly-central coordinates for the restrained Atlas map layer. Optional — the Atlas must
      work entirely from the list view without this. */
  coordinates?: [number, number]; // [longitude, latitude]
  noteOnSignificance: string;
}

export interface Technique {
  id: TechniqueId;
  name: string;
  summary: string;
  longDescription: string;
  noodleTypeIds: string[];
}
