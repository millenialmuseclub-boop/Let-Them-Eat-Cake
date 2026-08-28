import { sceneImages } from './data'
import type { SceneImage } from '../../types/ramen/sceneImage'

export function getSceneImage(id: string): SceneImage | undefined {
  return sceneImages[id]
}
