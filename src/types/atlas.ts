export type IngredientCategory = 'Cake Base' | 'Frosting' | 'Filling' | 'Decor'
export type RecipeDifficulty = 'Easy' | 'Intermediate' | 'Advanced'

export interface AiRecipeIngredient {
  item: string
  amount: string
  unit: string
  category: IngredientCategory
}

export interface AiCakeRecipe {
  prep_time: string
  bake_time: string
  difficulty: RecipeDifficulty
  servings: number
  ingredients: AiRecipeIngredient[]
  instructions: string[]
  baker_notes: string
}

export interface AiCakeResult {
  search_location: string
  resolved_location: {
    city: string | null
    region_state: string | null
    country: string
  }
  cake: {
    name: string
    local_name: string | null
    tagline: string
    origin: {
      creation_era: string
      history_and_significance: string
    }
    key_flavor_profile: string[]
    recipe: AiCakeRecipe
  }
}
