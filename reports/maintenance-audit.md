# Let Them Eat — maintenance audit

September 13, 2026. Changes are in the local workspace; no deployment or native release was performed.

## Fixed

- Fixed a Ramen detail-page crash after saving a favorite. The record adapter now returns the stable cached snapshot required by React. Added a regression test.
- Cake favorite buttons now subscribe to the existing store, so their state follows item changes and other saves.
- Fixed mobile hero overflow on Cake pages and the Ramen builder/library. Removed negative image margins from unpadded discovery and celebration cards so image edges and credits stay visible.
- Added reusable failure handling to previously unguarded editorial, commerce, ingredient, drink, Atlas, Lab, and home images. Uses existing bundled artwork and preserves image geometry. Removed duplicated fallback labels in Cake/Ramen and Noodles overlay cards.
- Corrected the mismatched Kransekake photo, which had shown a slice of layered cake. Its replacement and attribution come from [Kjetil Ree's Commons photograph](https://commons.wikimedia.org/wiki/File:Kransekake.jpg), licensed CC BY-SA 3.0. Downloading was rate-limited, so this remains a remote source with a fallback; source/license links are on Photography Credits.

## Affiliate Improvements

- Added the existing disclosure beside contextual Lab recommendations in Ramen, Cookies, and Noodles. Kept the established ShopMy/LTK links, sponsored attributes, and Cake click analytics.
- Changed Lab section labels to “Tools for this technique” and generic offer labels to product-specific recommendations.
- Added the existing scale offer to Rice Noodle Lab and existing board/scraper offers to Hand-Pulled Lab. No affiliate URLs were fabricated.
- Checked 98 distinct affiliate destinations with GET requests: 83 returned HTTP 200 and 15 blocked inspection. A 200 response alone does not establish product identity, stock, or commission attribution; titles and available stock metadata were also reviewed. Some Amazon responses were generic pages.
- Paused ten unique URLs across 17 catalog records: eight mismatched recommendations and two out-of-stock products. The active-offer count changed from 126 to 115 because shared catalogs can contain multiple records for one URL. Records and URLs are retained for correction/reactivation; the valid alternative KitchenAid cutter offer remains available.

## Needs My Approval

Please supply corrected affiliate links or approve the destination products before reactivation:

| Recommendation | Observed destination/problem |
| --- | --- |
| Red + Green ramen/noodle bowl set | Fuji Blossom rice bowl set of four |
| Yatai Keiji set | Williams-Sonoma Famille Rose bowl/spoon URL; full page blocked |
| Noodle strainer basket | RSVP Berry Colander |
| Japanese spoon-and-chopstick set | Bento Kishimoto lunch box |
| KitchenAid cutter, ShopMy offer | SMEG mixer attachment |
| Japanese noodle knife | Miyabi Nakiri vegetable knife |
| Edible gold leaf | Edible glitter |
| Agrimontana chestnut paste | Amoretti roasted chestnut compound |
| 14-inch Maria Flor cake stand | Merchant metadata reports OutOfStock |
| Cacao-Fruit Gâteau Basque | Merchant metadata reports OutOfStock |

Exact URLs and affected records: [affiliate actions](affiliate-actions.json). Full merchant evidence: [product checks](affiliate-product-checks.json).

Additional editorial review: the Blue Multi-Swirl bowl opens a pad-print set of four; the Bamboo Noodle Tray opens an acacia serving tray; the Cake Pan opens a brand catalog. These useful but imprecise recommendations remain available pending wording/product decisions. Merchant blocks and generic responses still require manual verification. Commission payout attribution cannot be confirmed from redirects alone.

Photo coverage is Cake 117/118, Ramen 25/25, Cookies 51/52, Noodles 51/51. Pepas and Kerala Plum Cake still need suitable, licensed photographs. Many cross-world product cards still use branded artwork because approved product photography is absent. No substitute food photos were invented. Wikimedia returned 429 responses for many existing sources, so coverage counts describe configured photos, not guaranteed availability.

## Rallii + Luxe Jetter

- Rallii: one callout after the content on /ramen/atlas and /noodles/atlas, connecting regional food discovery with the journey.
- Luxe Jetter: one callout on /celebrate, connecting celebration travel with wardrobe planning.
- Both use the exact App Store URLs supplied by you; both returned HTTP 200 with the correct app title. The callouts use existing typography, colors, and understated dividers, with 44px link targets.

## Code Cleanup

Removed the unreferenced CakeIllustration component and its stylesheet after checking component imports and CSS-class references. Removed unreachable pending/verification branches and their CSS in the active-only commerce renderer, plus a sort whose comparisons were always equal. Consolidated image error handling without adding dependencies or changing the content architecture.

Existing native configuration, signing, bundle IDs, OTA, deployment settings, storage keys, and analytics/privacy behavior were left intact. The largest shared data bundle remains approximately 639 KB minified / 137 KB gzip; its existing build warning remains. No referenced local assets were missing, and no public asset exceeded 1 MB in the scan.

## Validation

- TypeScript and production build: pass. Existing large-chunk warning remains.
- Lint: pass. Tests: 12/12 pass, including the new saved-Ramen snapshot regression.
- Internal routing: 99 literal/hub destinations checked across 309 reachable modules and 114 route patterns.
- Browser sweep: 88 routes at 390px and 1440px, 176 checks; no route failures, page exceptions, duplicate IDs, or horizontal overflow after fixes. Includes static routes and representative detail pages; not every content record or calculator/quiz combination.
- Interaction checks: 19 pass — all four saves survive reload; world switching and saved library work; companion URLs match; five Lab placements disclose; six screens survive forced remote-image failures without broken image elements.
- Additional 320px checks: seven representative screens pass overflow checks, including celebration fallback rendering.
- Visual review: home, all worlds, celebration, Atlas, companion placements, and fallback screens inspected. Screenshots are in this reports folder.
- External editorial links: all 11 Ramen shop/map links returned HTTP 200.
- Image/affiliate HEAD scan: 329 targets, no 404/410 responses; 116 require review due to blocking, unsupported HEAD, or rate limiting. Subsequent merchant GET checks above resolve some of those results. One sweep captured images during failed-request transitions; dedicated failure tests confirmed replacement rendering.
- Real iOS/Safari testing was unavailable: WebKit is not installed. Chromium mobile emulation does not validate native sharing, safe areas on hardware, App Store handoff, or Capacitor lifecycle behavior.

## Recommended Next 5

1. Correct/reactivate the eight mismatched affiliate recommendations and recheck the two unavailable products.
2. Source licensed Pepas and Kerala Plum Cake photography, plus approved photos for the most useful commerce cards.
3. Bundle high-visibility Wikimedia photographs through the existing WebP/credits pipeline when rate limits permit; prioritize Cookies, Noodles, and Kransekake.
4. Run a physical-iPhone release check covering safe areas, saved data after native relaunch, sharing, and companion App Store handoff.
5. Split the large Cake data payload conservatively by feature, with saved-state and route regressions kept in place.
