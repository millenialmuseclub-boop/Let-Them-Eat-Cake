// Verified 2026-09-24 against Jet Set's published website and destination source data.
// Keep links explicit: no guessed city URLs, broad country regexes, or automatic promotion.
// Add a destination only after checking the article and the food's geographic relationship.
export const jetSetDestinations = [
  {
    id: 'mexico-city', country: 'Mexico', city: 'Mexico City',
    foodIds: ['cookie_marranitos', 'cake_tres_leches', 'cake_chocoflan', 'cake_pan_de_elote'],
    url: 'https://thebrunchmanifesto.blog/2025/10/22/mexico-city-by-cruiser-bike-parks-culture-and-ciclovia-charm/',
    note: 'Continue your Mexico discoveries through the parks, cafés and neighborhoods of Mexico City.',
  },
  {
    id: 'rio-de-janeiro', country: 'Brazil', city: 'Rio de Janeiro',
    foodIds: ['cake_brigadeiro_cake', 'cake_bolo_de_fuba'],
    url: 'https://thebrunchmanifesto.blog/2026/01/01/santa-teresa-rio-de-janeiro-where-time-slows-and-color-lingers/',
    note: 'Explore another side of Brazil with Jet Set’s walk through Santa Teresa in Rio.',
  },
  {
    id: 'cartagena', country: 'Colombia', city: 'Cartagena',
    foodIds: ['cake_torta_negra'],
    url: 'https://thebrunchmanifesto.blog/2026/02/17/cartagena-day-2/',
    note: 'Continue exploring Colombia with a day in Cartagena’s historic old town.',
  },
]
