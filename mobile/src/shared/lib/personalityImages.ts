import { personalityImages } from './data'
import type { PersonalityImage } from '../types/personalityImage'

export function getPersonalityImage(personalityId: string): PersonalityImage | undefined {
  return personalityImages[personalityId]
}
