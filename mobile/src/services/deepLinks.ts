// Deep-link URL builders. Expo Router (configured via app.json's `scheme:
// "letthemeatcake"`) makes every file under app/ a deep-linkable path for
// free — these helpers just centralize the *shape* of those paths so every
// screen that links to a cake, a recipe, a pairing, etc. agrees on the same
// URL structure, mirroring the web app's route shape documented in
// NATIVE_HANDOFF.md:
//
//   web                                    native (custom scheme + universal link path)
//   /cake/:id                              letthemeatcake://discover/cake/:id
//   /collections/:id                       letthemeatcake://discover/collections/:id
//   /persona-match?personality=:id         letthemeatcake://discover/persona-match?personality=:id
//   /sommelier (cake-first)                letthemeatcake://sommelier?cakeId=:id
//   /sommelier (drink-first)               letthemeatcake://sommelier?drinkId=:id
//   (embedded in cake detail, no own route) letthemeatcake://discover/cake/:id  (recipe is part of cake detail on both platforms)
//   Birthday Time Machine                  letthemeatcake://celebrate/time-machine?year=:year
//   Wedding / Birthday / Other flows       letthemeatcake://celebrate/wedding | /birthday | /other
//
// Production universal-link domains (https://letthemeatcake.app/... or similar)
// are NOT configured here — no such domain is set up yet, so inventing one
// would be exactly the kind of fabricated production config the brief warns
// against. Associating a real domain (apple-app-site-association /
// assetlinks.json) is flagged as required configuration in the Phase 1
// report, not implemented.

export const deepLinks = {
  cake: (id: string) => `/discover/cake/${id}` as const,
  collection: (id: string) => `/discover/collections/${id}` as const,
  personaResult: (personalityId: string) => `/discover/persona-match?personality=${personalityId}` as const,
  sommelierCakeFirst: (cakeId: string) => `/sommelier?cakeId=${cakeId}` as const,
  sommelierDrinkFirst: (drinkId: string) => `/sommelier?drinkId=${drinkId}` as const,
  timeMachineYear: (year: number) => `/celebrate/time-machine?year=${year}` as const,
  wedding: () => `/celebrate/wedding` as const,
  birthday: () => `/celebrate/birthday` as const,
  otherCelebration: () => `/celebrate/other` as const,
}
