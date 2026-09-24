# World Food Atlas

The global `/atlas` experience reuses the existing React Simple Maps / Natural Earth world geometry and Ramen Atlas screen-space clustering. It introduces no map service, native plugin, backend, or subscription. The four specialist atlases remain available; the original Cake recipe explorer is at `/atlas/cakes`, and `/atlas/region/:region` is preserved.

## Content and identifiers

`scripts/atlas-catalog.mjs` adapts the existing Cake/Cookie regions, Ramen profiles and Noodle place references into `src/data/foodAtlas.json`. `npm run prebuild` regenerates it together with search and geographic centers. Six timeline-only cakes lack canonical geographic associations and remain searchable rather than receiving invented origins. The resulting Atlas contains 240 foods and 68 places.

Country names follow the existing ISO numeric shape mapping. England, Scotland and Wales share the United Kingdom shape but retain their regional labels. Shared cookie traditions remain associated with each listed place. The Noodles Malaysia/Singapore group resolves through the actual city reference; Penang is not mapped to Singapore. Korea's existing historically qualified place labels remain intact.

`country`, `world`, `region` and `food` query parameters preserve the exploration across reload, Back and sharing. Canonical recipes and deep stories continue to use their existing detail URLs.

## Taste this place

`src/data/jetSetDestinations.ts` is the only cross-app connection configuration. Each entry has the existing Jet Set destination slug, country, city, an explicit food ID allowlist and a verified public editorial-guide URL. Jet Set has an editorial website but no public web app. Its installed iOS Info.plist has no city-link URL scheme configured, so these links open published guides rather than guessing app deep links. No native changes were made.

The Mexico City, Santa Teresa/Rio and Cartagena guide URLs were checked successfully on 2026-09-24. Country-level cards invite further exploration; food-level cards require an explicit match. Wording never claims that the travel city is the food's birthplace. For example, Brazil's Pernambuco-associated bolo de rolo does not receive a Rio food handoff. To add a destination, verify the published guide and geographic relationship, then add the mapping and corresponding tests.

## Verification

`tests/food-atlas.test.mjs` validates every food/coordinate reference and regional/Jet Set associations. `scripts/audit-world-atlas.mjs` checks keyboard clusters, zoom/reset, Japan → ramen → Sapporo → miso → canonical recipe, history/reload, incompatible filters, travel gating, distinct Cookie Encyclopedia photos and 320/390/1440px layouts with reduced motion. The existing discovery and saved-data regression suites also apply.

No paid mapping or live data fetch is needed for the map. Local photos work offline; remote photos retain the existing graceful image fallback when unavailable. Device activation of OTA bundles still requires a physical installed app to verify; browser tests do not substitute for that hardware check.
