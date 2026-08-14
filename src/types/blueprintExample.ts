export interface BlueprintExample {
  id: string
  name: string
  description: string
  cakeId?: string
  layers: { name: string; note: string }[]
}
