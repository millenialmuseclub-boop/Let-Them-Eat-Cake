# World Food Atlas

The global `/atlas` experience reuses the existing React Simple Maps / Natural Earth world geometry and Ramen Atlas screen-space clustering. It introduces no map service, native plugin, backend, or subscription. The four specialist atlases remain available; the original Cake recipe explorer is at `/atlas/cakes`, and `/atlas/region/:region` is preserved.

## Content and identifiers

`scripts/atlas-catalog.mjs` adapts the existing Cake/Cookie regions, Ramen profiles and Noodle place references into `src/data/foodAtlas.json`. `npm run prebuild` regenerates it together with search and geographic centers. Six timeline-only cakes lack canonical geographic associations and remain searchable rather than receiving invented origins. The resulting Atlas contains 240 foods and 68 places.

Country names follow the existing ISO numeric shape mapping. England, Scotland and Wales share the United Kingdom shape but retain their regional labels. Shared cookie traditions remain associated with each listed place. The Noodles Malaysia/Singapore group resolves through the actual city reference; Penang is not mapped to Singapore. Korea's existing historically qualified place labels remain intact.

`country`, `world`, `region`, `food` and `trail` query parameters preserve the exploration across reload, Back and sharing. Canonical recipes and deep stories continue to use their existing detail URLs.

## Taste this place

`src/data/jetSetDestinations.ts` is the only cross-app connection configuration. Each entry has the existing Jet Set destination slug, country, city, an explicit food ID allowlist and a verified public editorial-guide URL. Jet Set has an editorial website but no public web app. Its installed iOS Info.plist has no city-link URL scheme configured, so these links open published guides rather than guessing app deep links. No native changes were made.

The Mexico City, Santa Teresa/Rio, Cartagena, Buenos Aires café-culture and Santiago guide URLs were checked successfully on 2026-09-24. Country-level cards invite further exploration; food-level cards require an explicit match. Wording never claims that the travel city is the food's birthplace. For example, Brazil's Pernambuco-associated bolo de rolo does not receive a Rio food handoff. To add a destination, verify the published guide and geographic relationship, then add the mapping and corresponding tests.

## Verification

`tests/food-atlas.test.mjs` validates every food/coordinate reference and regional/Jet Set associations. `scripts/audit-world-atlas.mjs` checks keyboard clusters, zoom/reset, Japan → ramen → Sapporo → miso → canonical recipe, history/reload, incompatible filters, travel gating, distinct Cookie Encyclopedia photos and 320/390/1440px layouts with reduced motion. The existing discovery and saved-data regression suites also apply.

No paid mapping or live data fetch is needed for the map. Local photos work offline; remote photos retain the existing graceful image fallback when unavailable. Device activation of OTA bundles still requires a physical installed app to verify; browser tests do not substitute for that hardware check.

## Guided tasting trails

`src/data/atlasJourneys.ts` curates six three-stop comparisons across Japan, Mexico, Vietnam, Italy, France and Argentina. Each stop references an existing food and canonical story. These are tasting comparisons, not transport itineraries or exclusive-origin claims. Mixed-world trails appear under All worlds; filtered trails must match every stop. Invalid country/world/region/food combinations fall back to normal Atlas exploration.

The URL carries the selected stop. Previous/next controls, direct stop buttons, reload and browser Back preserve the journey. `scripts/audit-atlas-journeys.mjs` verifies all 18 stops, 320/390/1440px layouts, unavailable remote images, local covers and destination links.

The photography refresh caches the existing licensed cookie and Vietnamese noodle photos as compressed local WebP files, with full attribution in `/photo-credits`. The bún bò Huế image was corrected after the old source explicitly described a nonstandard preparation. Noodle context now uses each dish’s own cultural entry instead of attaching a region’s phở-specific history to unrelated dishes.
