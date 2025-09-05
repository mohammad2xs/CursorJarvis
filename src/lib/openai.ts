import axios from 'axios'

export interface OpenAIChatResponse {
  answer: string
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export class OpenAIService {
  private apiKey: string
  private model: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    if (!this.apiKey) {
      console.warn('OPENAI_API_KEY not found in environment variables')
    }
  }

  async chat(prompt: string): Promise<OpenAIChatResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a concise, expert assistant.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1200,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      )

      const answer: string = response.data?.choices?.[0]?.message?.content || ''
      return { answer }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to query OpenAI API')
    }
  }
}

export const openAIService = new OpenAIService()


