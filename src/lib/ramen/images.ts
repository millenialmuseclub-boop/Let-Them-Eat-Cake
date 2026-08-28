// Same pattern as Cake's src/lib/images.ts (CAKE_REFERENCE_AUDIT.md §12):
// an entity-keyed image record, looked up by id, with no fallback baked in
// here -- the branded-placeholder fallback lives in RamenThumbnail so every
// consumer gets consistent behavior when a photo doesn't exist yet.

import { ramenImages } from './data'
import type { RamenImage } from '../../types/ramen/ramenImage'

export function getRamenImage(ramenId: string): RamenImage | undefined {
  return ramenImages[ramenId]
}

type Displayable = { url: string; source: string }

/** Stored `RamenImage.url`s are Pexels' clean canonical URL, which serves the full original
    (e.g. 6720px wide, ~3MB for the Tokyo Shoyu photo) -- fine as a durable, un-parameterized
    source URL to store, but far more than any card or hero ever needs to render. Pexels serves
    resized/compressed variants of the same photo via query params (no separate upload, same
    photo, same attribution), so this asks for one sized to the variant instead of shipping the
    original over the wire. Only applies to Pexels; other future sources render unmodified. */
export function displayImageUrl(image: Displayable, variant: 'hero' | 'thumbnail'): string {
  if (image.source !== 'Pexels') return image.url
  const width = variant === 'hero' ? 800 : 320
  return `${image.url}?auto=compress&cs=tinysrgb&w=${width}`
}
