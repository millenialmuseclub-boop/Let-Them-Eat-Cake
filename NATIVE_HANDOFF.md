# Let Them Eat Cake — Native Conversion Handoff

Written for whoever picks up iOS/Android development. Read this before touching architecture — it captures decisions made across a long series of refinement passes so they don't get silently re-litigated or reversed.

## Current Stack

- React 19 + Vite 8 + TypeScript, React Router v7 (client-side routing only).
- **Zero backend, with one narrow exception that no longer exists**: Bake Off used to run on Netlify Functions + Netlify Blobs; it was fully removed (frontend and backend) during the pre-native freeze. The app today is 100% static — JSON data + client-side logic, deployed as a static build to Netlify (`netlify.toml` still references a functions dir that's now empty; harmless, not cleaned up).
- All content is authored JSON (`src/data/*.json`) imported at build time via `src/lib/data.ts`, a single module that re-exports every dataset with its TypeScript type cast applied. Anyone adding a new dataset follows that exact pattern — import the JSON, cast it, export it.

## Four-Tab Architecture (frozen)

`Discover | Workshop | Sommelier | Celebrate` — exactly these four, enforced by `src/data/hubs.ts` (`HUBS` array) and rendered by `src/components/BottomTabBar.tsx`, which is the **sole** navigation surface at every viewport width (no separate desktop top nav exists anymore). `/` redirects to `/discover` via `<Navigate>` in `App.tsx`.

**Explicitly excluded, do not resurrect without a real product decision**: Home, My Cakes, Bake Off, Baker Directory/Marketplace, user-created Collections. Each was built, then deliberately removed this session per direct product direction — removing them again would be undoing intentional work, not fixing an oversight.

`Discover` and `Celebrate` are **not** rendered by the generic `HubPage.tsx` — they're bespoke pages (`DiscoverPage.tsx`, `CelebrateLandingPage.tsx`) because their content includes real user data (Saved Cakes) or a different visual treatment. `Workshop` and any future purely-static landing hub still go through `HubPage.tsx`.

## Routing / Deep-Link Assumptions

Standard React Router path-based routing, all defined flat in `App.tsx` (no nested route trees). Deep-linkable entities:
- `/cake/:id` — Encyclopedia detail (`id` = cake id, e.g. `cake_pavlova`)
- `/ingredient/:slug` — Ingredient Explorer detail
- `/collections/:id` — curated collection detail
- `/traditions/:id` — Baking Tradition detail
- `/persona-match?personality=<id>` — Persona Match result deep link via query param
- `/encyclopedia?mood=<value>` / `?occasion=<value>` — Encyclopedia index pre-filtered via query param
- `/atlas?country=<value>` — Atlas pre-selected country via query param

None of this depends on browser history state beyond what React Router gives for free — every one of these URLs is independently loadable cold (confirmed pattern; no page assumes it was navigated to from a specific prior screen). This should map cleanly to native deep links / universal links with the same path shape.

## Saved-State / Storage

One `localStorage` key, in `src/lib/`:
- `pastryNotebookItems` (`lib/notebook.ts`) — `{ type: 'cake' | 'personality', id, savedAt }[]`. This is **the** save mechanism — "Saved Cakes" on Discover and the Pastry Notebook page (`/notebook`, saved personalities) both read from it. `SaveButton.tsx` is the only write path (`toggleSaved`).

(A second key, `recentlyViewedCakeIds`, existed earlier but was write-only dead code — nothing ever read it. Removed during the final pre-native completion pass, along with a latent Rules-of-Hooks bug its removal exposed on `CakeDetailPage.tsx`.)

No `sessionStorage` usage anywhere. No cookies. This is a small, well-contained surface — a native `storageService` wrapping `AsyncStorage`/`UserDefaults`/whatever with the same single-key shape is a direct port, not a redesign.

## Share Architecture

Single component, `components/SocialShareCard.tsx`, used by every context-specific share card (`SommelierShareCard`, `CelebrateShareCard`, `BirthdayShareCard`, `OtherCelebrationShareCard`, `PersonaShareCard`, `RecipeShareCard`, plus the older `ShareCard.tsx` still used by Time Machine's exact-birth-year flow — not yet migrated to the newer card system, a known inconsistency, not a bug).

Current behavior: **typography-only cards, no photography/charts/SVGs** (this was a deliberate rebuild during this session — cards used to be photo-based, that whole approach was intentionally discarded). One primary `Share` button: calls `navigator.share()` with a rendered PNG (via `html-to-image`'s `toBlob`) when available, falls back to `navigator.clipboard.writeText()` of the caption + URL when `navigator.share` doesn't exist. No separate Download/Copy-URL buttons anymore.

**Native replacement point**: wrap this in a `shareService` interface — `share({ title, text, url, imageBlob? })` — with the web implementation being exactly what `SocialShareCard.tsx` does today, and native implementations calling the platform share sheet directly. The rendered-PNG step (`html-to-image`) is web-only and should NOT be ported as-is; native can likely skip client-side image rendering entirely and just share text + a deep link, or generate the share image server-side/natively if that visual asset matters enough to keep.

## Affiliate Commerce Architecture

Fully centralized, this is in good shape for native reuse as-is:
- `types/affiliateProduct.ts` — `AffiliateProduct` interface, `AffiliateNetwork` (`shopmy | ltk`), `AffiliateProductCategory` (`equipment | ingredient | beverage-equipment | presentation | featured-cake`).
- `data/affiliateProducts.json` — every product, real tracking URLs, real association fields (`associatedHubPaths`, `associatedTechniqueIds`, `associatedIngredientSlugs`, `associatedCakeIds`, `associatedPairingCategories`). ~46 products as of this handoff.
- `lib/affiliateProducts.ts` — pure query functions (`getProductsForIngredient`, `getProductsForTechnique`, `getProductsForHubPath`, `getProductsForPairingCategory`, `getProductsForCakeId`, `getProductsByIds`). No React, no DOM — ports to native with zero changes, it's just array filtering over the JSON.
- Presentation: `AffiliateProductCard`/`AffiliateProductSet` (always-visible, 5-card cap) and `CuratorsToolDrawer` (collapsed-by-default `<details>`, opens to reveal cards). The `<details>` element is web-only — native needs a bottom-sheet or expandable-section equivalent, but the *data* driving it (`getProductsForHubPath()` etc.) is unchanged.
- Analytics: `lib/analytics.ts` wraps `window.plausible()` (loaded via a `<script>` tag in `index.html`) behind `trackAffiliateViewed`/`trackAffiliateClicked` — already a thin service-style wrapper, easy to swap for a native analytics SDK behind the same two function signatures.
- Links open via plain `<a target="_blank" rel="noreferrer sponsored">` — native should open these in an in-app browser / `SFSafariViewController`/Custom Tabs, not a native webview that could be mistaken for the app's own content, and must never strip query params off the tracking URL.

## Atlas / Map Dependency

`components/AtlasWorldMap.tsx` is the **only** consumer of `react-simple-maps` + `world-atlas` (topojson imported as a static module, zero runtime fetch). This is an SVG-based map renderer — **does not port to native directly**. Options for native: a native map SDK (MapKit/Google Maps) with custom pins at the same hand-authored `[lon, lat]` coordinates already in `lib/atlasCoordinates.ts`, or a WebView embed of just this one component if a full native map isn't worth building initially. The coordinate data itself is real and reusable regardless of rendering approach.

## Image Loading Strategy

All photography is pre-fetched from Unsplash at **build time**, never at runtime:
- `scripts/fetch-cake-images.mjs`, `fetch-drink-images.mjs`, `fetch-scene-images.mjs` — each a one-off Node script, run manually (`node --env-file=.env.local scripts/...`), reading `UNSPLASH_ACCESS_KEY` from `.env.local` (gitignored, confirmed never committed) and writing results into `data/cakeImages.json` / `drinkImages.json` / `sceneImages.json`.
- Runtime code (`lib/images.ts`, `lib/drinkImages.ts`, `lib/sceneImages.ts`) just reads these static JSON maps — **no Unsplash API key ever ships to the client, no runtime network dependency on Unsplash**. This is a real constraint to preserve in native: don't switch to a runtime Unsplash fetch without re-deciding the key-exposure tradeoff that was deliberately avoided here.
- Coverage is partial by design — not every cake/drink has a photo (Unsplash's free-tier rate limit was hit more than once fetching this dataset). Every component that renders one of these images (`CakeHeroImage`, `DrinkImage`) already handles the missing case by rendering nothing — never a broken image, never a placeholder. Native image components should keep this same graceful-absence behavior rather than showing a broken-image icon.
- Images are hotlinked directly to Unsplash's CDN (`images.unsplash.com`), not self-hosted or proxied. No responsive `srcset`/size variants are requested — same original URL at all viewport sizes. A native pass could add Unsplash's own `?w=` sizing params for real bandwidth savings without needing new infrastructure.

## Known Technical Debt

- `components/ShareCard.tsx` (old, text-only) vs. the newer `SocialShareCard.tsx` system — Time Machine's exact-birth-year flow still uses the old one. On inspection during the final pre-native pass, `ShareCard.tsx` turned out to already be a thin wrapper *around* `SocialShareCard.tsx` (not a duplicate system) — the only real difference is a birth-year-specific preset, which is a legitimate use case, not drift. Left as-is; not a blocker.
- `netlify.toml` still declares a `functions` directory and an `/api/*` redirect from the now-deleted Bake Off backend. Inert, not cleaned up.
- `AffiliateProductSet`'s hardcoded 5-card cap silently truncates longer product lists (e.g. Curated Kitchen's "Cakes to Order" section has 15 real products, only 5 show). This is an accepted, deliberate tradeoff for "curated favorites" framing, not a bug — but worth a real decision (pagination? "view all"?) before native, since a hard cap feels more like a bug on a phone screen with room to scroll.
- The bundle is a single ~1.18MB (317KB gzip) JS chunk — Vite's own build warning flags this. Not addressed this pass (no code-splitting introduced); worth revisiting with route-based `React.lazy()` splitting before or during native web-view fallback work, though it's not a blocker for native since native builds don't ship this bundle at all.

## Recipe Data Model (Global Recipe Standard — complete)

Every recipe in `data/recipes.json` (125 of 125) now carries a full structured shape, not just a flat ingredient list:
- Optional Overview fields: `yield`, `prepTimeMinutes`, `bakeTimeMinutes`, `totalTimeMinutes`, `ovenTempC`/`ovenTempF`, `panSize`, `equipment`, `storage`.
- `filling` and `frostingFinish`, each a `RecipeComponent` — either a real component (`name`, `ingredients`, `prep`, and optional `textureGoal`/`applicationNotes`/`chillGuidance`) or an explicit `{ none: true, note }` declaration. Every recipe has one of the two for both fields — never left undefined.
- All fields are additive on top of the original flat `ingredients`/`steps` shape, so nothing else in the app needed to change to support this — `RecipeCard.tsx` renders each section only when present.
- Real culinary judgment was applied throughout rather than a mechanical schema fill: cream-cheese-style frostings that are spread both between layers and on the outside are declared as "no separate filling" (the frosting does both jobs); cakes where fruit is folded directly into the batter (fruitcakes, panettone-style breads) get honest none/none rather than an invented component; syrup soaks, glazes, and dustings are treated as the real `frostingFinish` when that's genuinely the only finish a recipe has.
- Verified end-to-end: every recipe has both fields explicitly set, and a full-catalog ingredient-quantity-sum comparison against the pre-migration data confirmed zero ingredients were lost or duplicated during restructuring (one recipe, Zuger Kirschtorte, deliberately splits a single tracked ingredient into two structured entries per the recipe's own "half the kirsch" instructions — verified the split sums back exactly).
- This is pure data — no new types, components, or routes were needed beyond what batch 1 of this work already added. Nothing here is a native blocker; it's just richer JSON.

## Areas That Should NOT Be Rewritten During Native Conversion

- The scoring engines (`lib/sommelier.ts`, `lib/weddingFlavor.ts`, `lib/weddingArchitecture.ts`, `lib/birthdayMatch.ts`, `lib/personaMatch.ts`) — all pure functions over the JSON data, zero DOM/browser dependency, port to native (or a shared TS package consumed by a React Native app) with **zero changes**. Don't reimplement this logic in Swift/Kotlin; share the TypeScript.
- `lib/affiliateProducts.ts`, `lib/collections.ts`, `lib/encyclopedia.ts`, `lib/ingredients.ts` — same category, pure data-query functions, no native-specific rewrite needed.
- The 4-hub / no-Home / no-My-Cakes architecture decision itself — this was arrived at deliberately across multiple explicit product-direction passes this session, not a placeholder.

## Remaining Blockers Before Starting iOS/Android Development

None that block *starting* — the architecture, data layer, and business logic are all in a portable shape. The two things worth resolving first if there's any flexibility in timing:
1. Whether React Native (sharing the TS data/logic layer directly) or fully-native Swift/Kotlin is the target — this handoff assumes the data/logic layer travels as-is either way, but the amount of *new* code needed differs enormously between the two paths.
2. A real decision on the Atlas map (native map SDK vs. WebView) before that screen gets built, since it's the one component with no straightforward native equivalent already in hand.
