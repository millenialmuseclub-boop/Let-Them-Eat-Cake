// "Ramen Shops to Know" -- a small, accuracy-first editorial layer (master pass §4), explicitly
// not a restaurant database. Every field here is original editorial writing, not scraped from
// any restaurant or platform. `mapLink` is a plain Google Maps search URL built from the shop
// name/city (never a fabricated place ID or pin), and `officialWebsite` is only ever set when
// the domain is confidently known -- omitted rather than guessed otherwise.

export interface RamenShop {
  id: string
  name: string
  city: string
  region: string
  specialty: string
  editorialNote: string
  relatedRamenIds: string[]
  mapLink: string
  officialWebsite?: string
  sourceNotes: string
}
