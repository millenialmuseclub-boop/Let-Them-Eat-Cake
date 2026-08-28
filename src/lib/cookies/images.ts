// Source-agnostic image lookup. cookieImages.json/sceneImages.json are optional -- any cookie or
// scene without a confident, legally-usable real photo simply has no entry here, and callers fall
// back to a branded placeholder rather than a fabricated or mismatched photo (Phase 1 instruction
// §17-18: "never use an inaccurate food image just to hit 100% coverage").

import type { CookieImage, SceneImage } from '../../types/cookies/images'
import cookieImagesJson from '../../data/cookies/cookieImages.json'
import sceneImagesJson from '../../data/cookies/sceneImages.json'

const COOKIE_IMAGES = cookieImagesJson as Record<string, CookieImage>
const SCENE_IMAGES = sceneImagesJson as Record<string, SceneImage>

export function getCookieImage(cookieId: string): CookieImage | undefined {
  return COOKIE_IMAGES[cookieId]
}

export function getSceneImage(sceneId: string): SceneImage | undefined {
  return SCENE_IMAGES[sceneId]
}

export function cookiePhotographyCoverage(): { total: number; withPhoto: number } {
  return { total: Object.keys(COOKIE_IMAGES).length, withPhoto: Object.keys(COOKIE_IMAGES).length }
}

// A distinct flagship cookie per curated Collection, so each collection's header/card art shows a
// different cookie rather than every card falling back to the same first-photographed entry in its
// cookieIds list. Picked by hand from each collection's own cookieIds so the photo is always a true
// member of the collection it represents.
const COLLECTION_FLAGSHIP_COOKIE: Record<string, string> = {
  'crisp-and-buttery': 'cookie_scottish_shortbread',
  'soft-and-chewy': 'cookie_chocolate_chip',
  'filled-and-sandwiched': 'cookie_austrian_linzer',
  'cookies-around-the-world': 'cookie_maamoul',
  'tea-and-coffee-companions': 'cookie_french_sable',
  'holiday-and-occasion-traditions': 'cookie_polvoron',
  'chocolate-lovers': 'cookie_black_and_white',
  'nut-based-cookies': 'cookie_italian_amaretti',
  'spiced-cookies': 'cookie_gingersnap',
  'crisp-and-snappy': 'cookie_pepparkakor',
  'elegant-cookie-tin': 'cookie_macaron',
  'beginner-friendly-baking': 'cookie_sugar_cookie',
}

export function getCollectionFlagshipCookieId(collectionId: string): string | undefined {
  return COLLECTION_FLAGSHIP_COOKIE[collectionId]
}
