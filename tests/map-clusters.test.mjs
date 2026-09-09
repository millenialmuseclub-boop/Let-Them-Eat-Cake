import test from 'node:test'
import assert from 'node:assert/strict'
import { clusterMapPoints } from '../src/lib/ramen/mapClusters.ts'

test('nearby targets become an explicit choice; isolated destinations remain individually selectable', () => {
  const points = [{ x: 0, y: 0, items: ['Tokyo'] }, { x: 3, y: 2, items: ['Ikebukuro'] }, { x: 150, y: 100, items: ['Sapporo'] }]
  const clusters = clusterMapPoints(points)
  assert.equal(clusters.length, 2)
  assert.deepEqual(clusters[0].items, ['Tokyo', 'Ikebukuro'])
  assert.deepEqual(points[0].items, ['Tokyo'])
})

test('all targets are separated and no destinations disappear at phone/tablet widths or zoom levels', () => {
  for (const width of [320, 375, 390, 430, 768, 1024]) for (const zoom of [2.2, 3.2, 8]) {
    const points = Array.from({ length: 25 }, (_, i) => ({ x: (i % 5) * width / 15 * zoom, y: Math.floor(i / 5) * 7 * zoom, items: [i] }))
    const clusters = clusterMapPoints(points)
    assert.equal(clusters.flatMap((point) => point.items).length, points.length)
    for (let i = 0; i < clusters.length; i++) for (let j = i + 1; j < clusters.length; j++) {
      assert.ok(Math.hypot(clusters[i].x - clusters[j].x, clusters[i].y - clusters[j].y) >= 48)
    }
  }
})
