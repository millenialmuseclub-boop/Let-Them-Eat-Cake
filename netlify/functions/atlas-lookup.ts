import type { Handler } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const CAKE_SCHEMA = {
  type: 'object',
  properties: {
    search_location: { type: 'string' },
    resolved_location: {
      type: 'object',
      properties: {
        city: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        region_state: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        country: { type: 'string' },
      },
      required: ['city', 'region_state', 'country'],
      additionalProperties: false,
    },
    cake: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        local_name: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        tagline: { type: 'string' },
        origin: {
          type: 'object',
          properties: {
            creation_era: { type: 'string' },
            history_and_significance: { type: 'string' },
          },
          required: ['creation_era', 'history_and_significance'],
          additionalProperties: false,
        },
        key_flavor_profile: { type: 'array', items: { type: 'string' } },
        recipe: {
          type: 'object',
          properties: {
            prep_time: { type: 'string' },
            bake_time: { type: 'string' },
            difficulty: { type: 'string', enum: ['Easy', 'Intermediate', 'Advanced'] },
            servings: { type: 'integer' },
            ingredients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  item: { type: 'string' },
                  amount: { type: 'string' },
                  unit: { type: 'string' },
                  category: { type: 'string', enum: ['Cake Base', 'Frosting', 'Filling', 'Decor'] },
                },
                required: ['item', 'amount', 'unit', 'category'],
                additionalProperties: false,
              },
            },
            instructions: { type: 'array', items: { type: 'string' } },
            baker_notes: { type: 'string' },
          },
          required: ['prep_time', 'bake_time', 'difficulty', 'servings', 'ingredients', 'instructions', 'baker_notes'],
          additionalProperties: false,
        },
      },
      required: ['name', 'local_name', 'tagline', 'origin', 'key_flavor_profile', 'recipe'],
      additionalProperties: false,
    },
  },
  required: ['search_location', 'resolved_location', 'cake'],
  additionalProperties: false,
} as const

function buildPrompt(location: string): string {
  return `You are an expert culinary historian and master pastry chef specializing in global baking traditions.

Task:
Analyze the input location: "${location}". Identify the most iconic, traditional, or culturally significant cake associated with this location.

Requirements & Fallback Rules:
1. Precision: If a specific city or region has a well-known local specialty (e.g., Vienna -> Sachertorte, Linz -> Linzer Torte, Black Forest -> Schwarzwälder Kirschtorte), select that specific cake.
2. Broad Locations: If the location is a broader region/country, choose the most globally recognized national cake.
3. Fallback: If the location does not have a distinct local cake, identify the nearest regional specialty or the broader national iconic cake.

Give real, accurate ingredients with metric measurements and a genuinely bakeable recipe. Keep the history concise (2-3 sentences) but specific.`
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let location: unknown
  try {
    location = JSON.parse(event.body || '{}').location
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  if (typeof location !== 'string' || location.trim().length === 0 || location.length > 200) {
    return { statusCode: 400, body: JSON.stringify({ error: 'location must be a non-empty string under 200 characters' }) }
  }

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4096,
      thinking: { type: 'disabled' },
      output_config: { format: { type: 'json_schema', schema: CAKE_SCHEMA } },
      messages: [{ role: 'user', content: buildPrompt(location.trim()) }],
    })

    if (response.stop_reason === 'refusal') {
      return { statusCode: 502, body: JSON.stringify({ error: 'The model declined this request.' }) }
    }

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return { statusCode: 502, body: JSON.stringify({ error: 'No content returned from the model.' }) }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: textBlock.text,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { statusCode: 502, body: JSON.stringify({ error: `Lookup failed: ${message}` }) }
  }
}
