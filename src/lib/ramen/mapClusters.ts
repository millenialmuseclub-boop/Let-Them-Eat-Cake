export interface MapPoint<T> { x: number; y: number; items: T[] }

/** Merge overlapping screen-space targets, including overlap created by a new centroid. */
export function clusterMapPoints<T>(points: MapPoint<T>[], separation = 48): MapPoint<T>[] {
  const clusters = points.map((point) => ({ ...point, items: [...point.items] }))
  let merged = true
  while (merged) {
    merged = false
    outer: for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const a = clusters[i], b = clusters[j]
        if (Math.hypot(a.x - b.x, a.y - b.y) >= separation) continue
        const total = a.items.length + b.items.length
        clusters[i] = {
          x: (a.x * a.items.length + b.x * b.items.length) / total,
          y: (a.y * a.items.length + b.y * b.items.length) / total,
          items: [...a.items, ...b.items],
        }
        clusters.splice(j, 1)
        merged = true
        break outer
      }
    }
  }
  return clusters
}
