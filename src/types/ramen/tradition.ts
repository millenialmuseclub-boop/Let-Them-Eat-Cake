// Editorial regional groupings (master pass §1B/§3) -- one dataset serving two surfaces:
// Encyclopedia's "Ramen Traditions by Region" (rich editorial read) and Atlas's "Browse by
// Origin" (compact Region -> City -> Ramen hierarchy). References canonical ramen.json ids only;
// no ramen content is duplicated here. `definingTendencies` is deliberately phrased as common
// patterns, not universal rules -- see each entry's own wording.

export interface RegionalTradition {
  id: string
  region: string
  introduction: string
  definingTendencies: string[]
  cities: string[]
  ramenIds: string[]
}
