/** Source-agnostic image record -- Ramen sources photography from Pexels (see PHOTOGRAPHY.md),
    not Unsplash like Cake, so this carries a `source` label instead of hardcoding one provider's
    name into the type/credit line. */
export interface RamenImage {
  url: string
  photographer: string
  photographerUrl?: string
  source: string
  sourceUrl?: string
}
