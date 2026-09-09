# Takeover report — 2026-09-08

## Baseline and product map

PR #6 was merged into main at 51e37eeb9525e8f0f68db0b556000590fee6cd38 before implementation. The local checkout was clean at that revision. PR #3–6 and IOS_RELEASE_HANDOFF.md were reviewed; the live Netlify app was inspected. NATIVE_HANDOFF.md remains deleted.

This is a Vite/React/TypeScript SPA with four worlds under one BrowserRouter. src/data/hubs.ts defines the shared world departments; App.tsx owns route composition; src/lib/savedItems.ts owns the unified local library. World modules retain their own content and identity. Cake commerce retains its established adapter; the other three worlds use src/lib/products.ts and ContextualCuratedKitchen. There are no new accounts or services.

## Completed

- Isolated sibling-world CSS to stop visited routes from changing another world's layout. Preserved Cake appearance in a complete SPA world-switch cycle.
- Added an explicit current-world/change-world link, accurate active department on deep routes, world-aware back fallback, route loading feedback, and missing-route recovery.
- Reworked Noodles Workshop into grouped landscape lesson cards with useful summaries; corrected overlapping headings and constrained short landscape heroes. Restored independent Cookies feature-card styling and added Crumb photography.
- Added source-specific image-error fallbacks and eager hero loading where applicable. Bundled 20 visually inspected, accurately attributed WebP photos: 6 Cake, 12 Ramen, 2 Cookies. Attribution/license/source links are available at /photo-credits and in public/photography/credits.json. Rejected a misleading restaurant-exterior source and replaced it with an actual Wakayama bowl.
- Ramen Atlas now uses explicit clusters of nearby cities, 44px targets at resting zoom, visible zoom/reset controls, keyboard selection, focus on the city picker, selected-state feedback, and drag suppression. Geography artwork is hidden from the accessibility tree.
- Saved-state migration writes the payload before recording completion. Failed writes retain in-session state and show an honest notice; unreadable/future payloads are preserved on disk. Legacy keys are never cleared. Existing newer unified records win during migration.
- Contextual commerce respects the current world and hides products without active offers. Shared product IDs retain combined world/context/offer membership. Updated disclosure branding and added Home disclosure.
- Lazy-loaded Cake routes and removed unused copies of the three sibling OTA updater/config modules. The shared updater remains authoritative. OTA readiness follows the initial route commit; corrected the obsolete manual rollback instructions.
- Applied compatible sharp, nanoid, and xmldom security patches without changing Capacitor/plugin versions. Advisory count fell from 10 (7 high) to 7 (4 high). Remaining advisories involve d3-color and build/development dependency chains; no forced major upgrades were applied.

## Validation

Automated: TypeScript/production build, oxlint, and 11 tests pass. Tests cover all four legacy libraries, failed migration retry, failed-save recovery, preservation of unreadable/future payloads, cross-world removal/reload, stable subscriptions, route/world selection, and nonoverlapping cluster coverage across phone/tablet sizes and zooms. Static route analysis checks 99 literal/hub destinations against 114 route patterns across 307 reachable source modules. Dynamic route parameters and every editorial statement are not exhaustively verified by this test.

Content audit: Cake 117/118, Ramen 25/25, Cookies 51/52, Noodles 51/51 have distinct per-catalog source images. Two verified-photo gaps remain (Kerala Plum Cake and Pepas); existing honest placeholders remain. There are 126 active offers with valid HTTPS destinations. The initial 329-URL network audit found 213 HTTP 200 responses and no 404/410 responses. 116 requests were inconclusive (rate limiting, blocked/method-rejected requests, upstream errors); this does not establish that every merchant destination works. Eight shared URL groups are recorded for review, chiefly the same tools represented across catalogs. See reports/content-audit.json.

Browser: inspected the live baseline and the local changed app. Exercised key Main/Workshop/Atlas/Shop/Sommelier/Encyclopedia/Crumb screens at 375 and 430px phone widths, Cookies at 768px tablet width, and Noodles Workshop at 932x430 landscape. Verified Cake save → notebook → reload persistence, the complete four-world SPA switch cycle without Cake style changes, Atlas cluster → Tokyo selection, focus movement, zoom/reset, and absence of horizontal overflow on inspected routes. No application error was observed during these checks. These are targeted checks, not exhaustive screenshots of every route.

Performance: the generated entry chunk fell from approximately 1.37MB (365KB gzip) to 338KB (100KB gzip) after route splitting. This is the entry chunk, not total initial network transfer. A shared data chunk remains about 639KB (137KB gzip); further data splitting is a possible follow-up. New photography is optimized and locally bundled; existing remote images still require a network or browser cache.

Simulator: not performed. Physical iPhone/iPad: not performed. Native offline launch, safe-area behavior, system share sheets, native touch/scroll, and signed OTA activation/watchdog rollback still require execution on Apple hardware or a simulator. Static bundled-asset checks cannot prove those behaviors.

## iOS readiness and release boundaries

Latest known shipped binary: version 2.0 / Build 4. Source prepares version 2.0 / Build 5. Bundle identity com.letthemeatcake.app, signing, permissions, deployment target iOS 15, plugin versions, and OTA key/configuration remain unchanged. Build 5 adds portable SPM paths and the required-reason privacy resource for installed Filesystem/UserDefaults use. The 1024px icon, project resource membership, plugin paths, config, and byte-for-byte bundled assets are checked by scripts/check-ios.mjs after cap sync and ios:normalize.

No Xcode archive, signing, TestFlight upload, or Apple submission was performed. The manual release workflow now validates web tests and release configuration before signing. It must not be dispatched without explicit authorization.

## OTA status

Build 4 contains the previous native snapshot. Per the incoming handoff, PR #3–5 shipped later through OTA production; devices must actually download and activate that OTA before showing it. PR #6 was documentation cleanup. This takeover adds the web changes described above and separate native Build 5 preparation. Native project/privacy/build-number changes cannot be delivered by OTA.

The user authorized OTA production publication. PR #7 merged the implementation commit 5a05c24 as 953119abf404d80d4897f89f9e8b21103630993e. Production workflow 34309325018 succeeded on 2026-09-09 UTC (2026-09-08 Pacific): lint, 11 tests, build, signing/encryption, and R2 upload all passed. The public manifest was independently verified at version 1788926462 with that exact SHA; the encrypted bundle returned HTTP 200 (3,359,936 bytes). The live Netlify /photo-credits page also showed all 20 new credits with no browser console errors. Native-device download/activation is still untested. Workflow: https://github.com/millenialmuseclub-boop/Let-Them-Eat-Cake/actions/runs/34309325018

## Remaining release checks

Before a native release: run the physical/simulator checks above, especially Ramen touch/scroll on small and large iPhones, offline bundled launch, saved libraries across OTA, native sharing, and staging OTA activation/recovery. Fill App Store listing metadata if making a store submission. Two photo gaps and inconclusive merchant requests remain content follow-ups, not reasons to substitute inaccurate imagery. Review the remaining seven dependency advisories in a separate compatible upgrade pass.

## Git state at preparation

Implementation branch: codex/takeover-polish; implementation commit 5a05c24 was pushed and merged through PR #7. OTA deployed merge commit 953119a. This documentation follow-up records the verified result; it does not require another OTA publish. No native deployment.
