import test from 'node:test'
import assert from 'node:assert/strict'

const key = 'letThemEat.savedItems.v1'
const marker = 'letThemEat.savedItems.migrated.v1'
let sequence = 0
async function load(seed = {}, fail = () => false) {
  const values = new Map(Object.entries(seed))
  globalThis.window = { localStorage: {
    getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => { if (fail(name)) throw new Error('Storage unavailable'); values.set(name, value) },
  } }
  const store = await import(`../src/lib/savedItems.ts?test=${sequence++}`)
  return { store, values }
}

test('all four legacy libraries migrate without rewriting originals', async () => {
  const seed = {
    pastryNotebookItems: JSON.stringify([{ type: 'cake', id: 'old-cake', savedAt: 123 }]),
    ramenLibrary: JSON.stringify({ items: [{ ramenId: 'same-id', favorite: true, note: 'less salt', savedAt: 234 }] }),
    'letThemEatCookies.myCookies': JSON.stringify({ items: [{ cookieId: 'same-id', baked: true, savedAt: 345 }] }),
    'let-them-eat-noodles:my-noodles:v1': JSON.stringify([{ dishId: 'pho', states: ['want-to-try'], savedAt: '2026-08-01' }]),
  }
  const { store, values } = await load(seed)
  assert.equal(store.getAll().length, 4)
  assert.equal(store.getRecord('cake', 'old-cake').savedAt, 123)
  assert.equal(store.getRecord('ramen', 'same-id').note, 'less salt')
  assert.equal(store.getRecord('cookies', 'same-id').tried, true)
  assert.equal(store.getRecord('noodles', 'pho').wantToTry, true)
  for (const [name, value] of Object.entries(seed)) assert.equal(values.get(name), value)
  assert.ok(values.get(marker))
})

test('migration preserves newer unified records and stable snapshots', async () => {
  const { store } = await load({
    [key]: JSON.stringify({ version: 1, items: [{ world: 'cake', id: 'cake', saved: true, savedAt: 900 }] }),
    pastryNotebookItems: JSON.stringify([{ type: 'cake', id: 'cake', savedAt: 100 }]),
  })
  assert.equal(store.getRecord('cake', 'cake').savedAt, 900)
  assert.equal(store.getByWorld('cake'), store.getByWorld('cake'))
  const snapshot = store.getByWorld('cake')
  store.toggleFavorite('ramen', 'ramen')
  assert.notEqual(store.getByWorld('cake'), snapshot)
  assert.equal(store.getRecord('cake', 'cake').saved, true)
})

test('failed migration does not mark completion; next launch recovers legacy saves', async () => {
  const seed = { pastryNotebookItems: JSON.stringify([{ id: 'cake', type: 'cake', savedAt: 123 }]) }
  const first = await load(seed, (name) => name === key)
  assert.equal(first.values.has(marker), false)
  assert.equal(first.store.getRecord('cake', 'cake').saved, true)
  assert.equal(first.store.getStorageIssue(), true)
  const next = await load(Object.fromEntries(first.values))
  assert.equal(next.store.getRecord('cake', 'cake').savedAt, 123)
  assert.ok(next.values.get(marker))
})

test('failed saves stay in memory, notify subscribers, and recover when storage returns', async () => {
  let fail = false
  const { store, values } = await load({}, () => fail)
  let notifications = 0
  const unsubscribe = store.subscribe(() => notifications++)
  fail = true
  store.toggleSaved('cake', 'cake', 'cake')
  assert.equal(store.isSaved('cake', 'cake'), true)
  assert.equal(store.getStorageIssue(), true)
  fail = false
  store.setNote('cake', 'cake', 'Keep this recipe')
  assert.equal(store.getStorageIssue(), false)
  assert.equal(JSON.parse(values.get(key)).items[0].note, 'Keep this recipe')
  assert.equal(notifications, 2)
  unsubscribe()
})

test('unrecognized saved data is never replaced with an empty library', async () => {
  for (const raw of ['broken JSON', JSON.stringify({ version: 2, items: [] }), JSON.stringify({ version: 1, items: [null] })]) {
    const { store, values } = await load({ [key]: raw })
    store.toggleFavorite('cookies', 'cookie')
    assert.equal(values.get(key), raw)
    assert.equal(values.has(marker), false)
    assert.equal(store.getStorageIssue(), true)
  }
})

test('removing one world save preserves other worlds and legacy records', async () => {
  const { store, values } = await load({ pastryNotebookItems: JSON.stringify([{ id: 'same', type: 'cake', savedAt: 1 }]) })
  store.toggleFavorite('cookies', 'same')
  store.toggleSaved('cake', 'same', 'cake')
  assert.equal(store.isSaved('cake', 'same'), false)
  assert.equal(store.getRecord('cookies', 'same').favorite, true)
  const next = await load(Object.fromEntries(values))
  assert.equal(next.store.isSaved('cake', 'same'), false)
  assert.equal(next.store.getRecord('cookies', 'same').favorite, true)
})
