import { dishes } from '../../data/noodles/dishes';
import { noodleTypes } from '../../data/noodles/noodleTypes';
import { recipes } from '../../data/noodles/recipes';
import { techniques } from '../../data/noodles/techniques';
import { regions, countries, places } from '../../data/noodles/geo';
import type { NoodleDish, NoodleType, Technique, PlaceRef } from '../../types/noodles/noodle';

/* Flat-JSON-joined-by-id lookups — family-reusable pattern, no ORM. */

export function getDish(id: string): NoodleDish | undefined {
  return dishes.find((d) => d.id === id);
}

export function getNoodleType(id: string): NoodleType | undefined {
  return noodleTypes.find((n) => n.id === id);
}

export function getRecipeForDish(dishId: string) {
  return recipes.find((r) => r.dishId === dishId);
}

export function getTechnique(id: string): Technique | undefined {
  return techniques.find((t) => t.id === id);
}

export function getDishesForNoodleType(noodleTypeId: string): NoodleDish[] {
  return dishes.filter((d) => d.noodleTypeId === noodleTypeId);
}

export function getRelatedDishes(dish: NoodleDish): NoodleDish[] {
  return (dish.relatedDishIds ?? []).map(getDish).filter((d): d is NoodleDish => Boolean(d));
}

export function getPlaceLabel(place: PlaceRef): string {
  const country = countries.find((c) => c.id === place.countryId);
  const specificPlace = place.cityOrAreaId ? places.find((p) => p.id === place.cityOrAreaId) : undefined;
  if (specificPlace) return `${specificPlace.name}, ${country?.name ?? ''}`;
  return country?.name ?? '';
}

export function getRegionForCountry(countryId: string) {
  const country = countries.find((c) => c.id === countryId);
  return regions.find((r) => r.id === country?.regionId);
}

export { dishes, noodleTypes, recipes, techniques, regions, countries, places };
