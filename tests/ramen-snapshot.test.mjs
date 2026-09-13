import '../scripts/register-typescript.mjs'
import test from 'node:test'
import assert from 'node:assert/strict'

test('a saved ramen record remains a stable snapshot and updates after edits', async () => {
  const values = new Map()
  globalThis.window = {localStorage: {getItem: key => values.get(key) ?? null, setItem: (key,value) => values.set(key,value)}}
  const ramen = await import('../src/lib/ramen/myRamen.ts')
  assert.equal(ramen.getRecord('ramen_sapporo_miso'), undefined)
  ramen.toggleFavorite('ramen_sapporo_miso')
  const saved = ramen.getRecord('ramen_sapporo_miso')
  assert.equal(saved.favorite, true)
  assert.equal(ramen.getRecord('ramen_sapporo_miso'), saved)
  assert.equal(ramen.getLibrary()[0], saved)
  ramen.setNote('ramen_sapporo_miso', 'Try with corn')
  const edited = ramen.getRecord('ramen_sapporo_miso')
  assert.notEqual(edited, saved)
  assert.equal(edited.note, 'Try with corn')
  assert.equal(ramen.getRecord('ramen_sapporo_miso'), edited)
})
