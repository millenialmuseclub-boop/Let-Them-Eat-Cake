export type TechniqueCategory = 'Mixing' | 'Baking' | 'Layering & Filling' | 'Frosting' | 'Decorating' | 'Chocolate' | 'Finishing'

export interface Technique {
  id: string
  name: string
  category: TechniqueCategory
  whatItIs: string
  steps: string[]
  commonMistake: string
  chefTip: string
}
