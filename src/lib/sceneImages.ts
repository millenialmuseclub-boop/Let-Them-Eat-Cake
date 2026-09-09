import sceneImagesJson from '../data/sceneImages.json'
import type { SceneImage } from '../types/sceneImage'
const sceneImages = sceneImagesJson as Record<string, SceneImage>

export function getSceneImage(id: string) {
  return sceneImages[id]
}
