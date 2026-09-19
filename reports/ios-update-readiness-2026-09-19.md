# Let Them Eat — release preparation, 19 September 2026

## Subsequent submission request

The user subsequently authorized the App Store update and submission. The authenticated App Store Connect record showed a **2.1** draft and published 2.0. Source and static validation were corrected to **2.1 (5)**. Release commit `932c413` was pushed to `codex/ios-2-1-gold-icon`; signed build/upload workflow `35446160060` was dispatched. The preparation-only status below describes the earlier checkpoint, before this authorization. Submission completion must be verified separately in App Store Connect.

**Ready for the next approved iOS build: YES.** This is repository/build readiness, not a claim that an Xcode archive, physical iPhone test, or App Store review has passed. No upload, deployment, workflow dispatch, or OTA publication was performed. Changes remain local for review.

## Commercial improvements

- Created 15 real ShopMy links in the authenticated account; exact URLs, merchant destinations, artwork, and provenance are in `release-shopmy-links.json`.
- Added recommendations to 52 cookie entries, 25 ramen entries, 51 noodle dishes, and 25 noodle types, using each record's family, tare, preparation, or technique. Each detail section shows at most three products.
- Expanded existing workshops and shops with baking sheets, a scoop, baking mat, cooling rack, square pan, rolling pin, steamer, wok, noodle basket, white miso, shoyu, sesame oil, matcha, Ivan Ramen, and 100 Cookies. Cake uses the rack, pan, and rolling pin in its existing technique drawers.
- Cake now has active tool associations for 11 of 17 techniques. Removed milk chocolate from dark-chocolate associations; cocoa recommendations now require cocoa in the recipe.
- Workshop sections initially show six products, with a working expansion button. Detail cards include the existing commission disclosure. Cake recommendations deduplicate product IDs.
- Corrected seven old shared product descriptions to match merchant destinations (bowls, chopsticks/rests, spoon collection, and acacia tray). Renamed the Cake Pan link to a bakeware collection because it lands at the retailer's collection/home page. Tracking URLs were preserved.
- Preserved previously paused mismatched offers; the retired strainer route was not re-enabled. A new, verified basket link supplies that placement.
- Existing cake gifts, serving pieces, beverage equipment, and food discovery remain intact. Restaurant/map links remain editorial; no invented commission claim or booking URL was added.

## Optional links still needed

These opportunities remain hidden or use existing alternatives. They do not block this build.

| Content/product | Ideal placement | Link needed |
| --- | --- | --- |
| Dark baking chocolate | Chocolate recipes and ingredient entries | Verified dark/semisweet baking chocolate affiliate link |
| Niboshi and bonito flakes | Ramen broth lab | Verified food-grade pantry products |
| Doubanjiang, black garlic, menma, shichimi | Tare, aroma-oil, and bowl finishing | Verified specialty ingredient links |
| Cake transport and structural supports | Transport and doweling techniques | Cake carrier, food-safe dowels/boards |
| Japanese noodle knife / dough proofing box | Noodle shaping and resting | Verified replacement/product links |
| Food classes/experiences | Relevant Atlas locations | Actual approved partner booking links for a specific location |

## Icon and quality

- Approved gold fork-and-pasta artwork preserved at `assets/branding/let-them-eat-gold-fork-master.png`.
- Installed iOS 1024×1024 opaque PNG; existing asset catalog filename/reference preserved. Updated web/PWA, Android icon derivatives, and existing Play Store icon for consistency.
- Generator now uses the repository master, checks source size/squareness, and strips output transparency. iOS static check explicitly rejects alpha.
- Added actual product artwork for the new shared cards and fitted it without cropping.
- Fixed an observed cookie-page CSS collision that made commerce button text the same color as its background; verified white text on raspberry buttons at 320px.
- Existing content has 244 photographs across 246 entries. Kerala Plum Cake and Pepas still lack specific photography and retain the existing fallback. No unrelated photograph was substituted.

## Analytics

Reused Plausible. Shared shop, recipe, and home product links record Affiliate Link Clicked with product ID/name, category, network, and route context. Route changes record Content Viewed with world. Ramen restaurant/map links record Experience Link Clicked. Existing Cake click/impression events remain. No query strings, saved notes, accounts, or new analytics dependency were added. Provider exceptions cannot block navigation. Event receipt in the production Plausible dashboard was not verified.

## Verification

- Production TypeScript/Vite build passed with the verified production R2 public URL. Existing approximately 640KB data-chunk warning remains.
- Lint passed; all 14 tests passed, including saved-data migration/recovery and new recommendation/analytics checks.
- Route test checked 99 link destinations across 310 reachable source modules and 114 route patterns.
- Live audit checked 334 unique commercial/image URLs: 209 HEAD responses succeeded, 21 were blocked with 403, nine rejected HEAD with 405, and 95 Wikimedia sources were rate-limited. GET follow-up resolved one of the nine; the remaining eight were rate-limited. No 404/410 was observed. Blocking/rate limits are not evidence that destinations are healthy or dead.
- All 103 distinct active commercial URLs were included: 74 responded successfully using HEAD or GET; 29 require browser/manual availability verification because of merchant blocking/rate limits. New links were matched to the actual product in authenticated ShopMy before insertion.
- An additional 62 product-artwork and restaurant/map URLs all returned successful responses; results are in `release-extra-links.json`.
- Browser checks covered home, all four worlds, recipe details, technique library, shops, workshops/labs, Atlas, Sommelier, and About at 320px and 390px; representative pages also checked at 768px. No horizontal overflow or console errors observed on those routes. Verified six-to-fifteen workshop expansion and a favorite surviving reload; restored the test favorite afterward.
- The attempted `/ingredient/matcha` check correctly returned not found: there is no such existing Cake ingredient. Removed the unused Cake association; matcha remains in Cookies' existing pantry shop.
- Capacitor iOS sync passed, portable Swift package paths normalized, and release static checks passed: bundled production assets match `dist`, icon dimensions/opacity correct, privacy manifest included, no remote server launch URL, existing updater configuration preserved.
- Identity remains `com.letthemeatcake.app`, marketing version **2.0**, build **5**. Recent GitHub iOS history was inspected read-only; no workflow was triggered. App Store Connect's current build inventory was not independently queried.

## Before public submission

After the user approves a native build, confirm signing/archive success and test on an iPhone: cold launch, installed icon, safe areas, favorite persistence, native share sheet, merchant opening/return, and update behavior. Recheck App Store Connect build-number availability at that time. Windows cannot perform Xcode/device validation. Merchant availability and the two missing photos remain documented limitations, not concealed passes.
