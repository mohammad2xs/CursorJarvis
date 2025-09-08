import axios from 'axios'
import { db } from './db'
import { PerplexityQuery, PerplexityResponse, AccountSignal } from '@/types'

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions'

export class PerplexityService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || ''
    if (!this.apiKey) {
      console.warn('PERPLEXITY_API_KEY not found in environment variables')
    }
  }

  async query(query: string, companyId?: string): Promise<PerplexityResponse> {
    if (!this.apiKey) {
      throw new Error('Perplexity API key not configured')
    }

    // Check cache first
    const cached = await this.getCachedResponse(query, companyId)
    if (cached) {
      return cached
    }

    try {
      const response = await axios.post(
        PERPLEXITY_API_URL,
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 1000,
          temperature: 0.2,
          top_p: 0.9,
          return_citations: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result: PerplexityResponse = {
        answer: response.data.choices[0].message.content,
        sources: response.data.citations?.map((citation: Record<string, unknown>) => ({
          title: citation.title || 'Source',
          url: citation.url || '',
          snippet: citation.snippet || ''
        })) || []
      }

      // Cache the response
      await this.cacheResponse(query, result, companyId)

      return result
    } catch (error) {
      console.error('Perplexity API error:', error)
      throw new Error('Failed to query Perplexity API')
    }
  }

  private async getCachedResponse(query: string, companyId?: string): Promise<PerplexityResponse | null> {
    try {
      const cached = await db.perplexityCache.findFirst({
        where: {
          query,
          companyId: companyId || null,
          ttl: {
            gt: new Date()
          }
        }
      })

      if (cached) {
        return JSON.parse(cached.response)
      }
    } catch (error) {
      console.error('Error checking cache:', error)
    }
    return null
  }

  private async cacheResponse(query: string, response: PerplexityResponse, companyId?: string): Promise<void> {
    try {
      const ttl = new Date()
      ttl.setHours(ttl.getHours() + 7) // 7 days TTL

      await db.perplexityCache.create({
        data: {
          query,
          response: JSON.stringify(response),
          companyId: companyId || null,
          ttl
        }
      })
    } catch (error) {
      console.error('Error caching response:', error)
    }
  }

  async processAccountSignals(companyId: string, signals: PerplexityResponse[]): Promise<AccountSignal[]> {
    const accountSignals: AccountSignal[] = []

    for (const signal of signals) {
      try {
        // Extract key information from the response
        const title = this.extractTitle(signal.answer)
        const summary = this.extractSummary(signal.answer)
        const tags = this.extractTags(signal.answer)

        const accountSignal = await db.accountSignal.create({
          data: {
            title,
            summary,
            source: 'perplexity',
            url: signal.sources[0]?.url || '',
            detectedAt: new Date(),
            tags,
            provenance: JSON.stringify(signal),
            companyId
          }
        })

        accountSignals.push(accountSignal)
      } catch (error) {
        console.error('Error processing account signal:', error)
      }
    }

    return accountSignals
  }

  private extractTitle(answer: string): string {
    // Extract the first sentence or a meaningful title from the answer
    const sentences = answer.split('.')
    return sentences[0].trim().substring(0, 100)
  }

  private extractSummary(answer: string): string {
    // Extract key points from the answer
    const lines = answer.split('\n').filter(line => line.trim())
    return lines.slice(0, 3).join(' ').substring(0, 500)
  }

  private extractTags(answer: string): string[] {
    const tags: string[] = []
    const lowerAnswer = answer.toLowerCase()

    // Extract relevant tags based on content
    if (lowerAnswer.includes('hiring') || lowerAnswer.includes('hire')) {
      tags.push('hiring')
    }
    if (lowerAnswer.includes('product') || lowerAnswer.includes('launch')) {
      tags.push('product')
    }
    if (lowerAnswer.includes('esg') || lowerAnswer.includes('sustainability')) {
      tags.push('esg')
    }
    if (lowerAnswer.includes('news') || lowerAnswer.includes('announcement')) {
      tags.push('news')
    }
    if (lowerAnswer.includes('competitor') || lowerAnswer.includes('competition')) {
      tags.push('competitor')
    }
    if (lowerAnswer.includes('regulatory') || lowerAnswer.includes('regulation')) {
      tags.push('regulatory')
    }

    return tags
  }

  // Pre-defined query templates for different use cases
  async getDailyAccountPulse(companyName: string, subIndustry: string): Promise<PerplexityResponse> {
    const query = `Recent news, hiring, product launches, ESG or regulatory updates for ${companyName} in ${subIndustry} (last 14 days).`
    return this.query(query)
  }

  async getLeadershipChanges(companyName: string): Promise<PerplexityResponse> {
    const query = `Notable leadership changes or campaigns at ${companyName} (last 60 days).`
    return this.query(query)
  }

  async getIndustryTrends(subIndustry: string): Promise<PerplexityResponse> {
    const query = `Key industry trends affecting ${subIndustry} this quarter; implications for brand/content/creative ops.`
    return this.query(query)
  }

  async getPreMeetingBrief(companyName: string, subIndustry: string, contactTitle?: string): Promise<PerplexityResponse> {
    const query = `What's changed at ${companyName} (last 30 days), key stakeholders, likely priorities by ${contactTitle || 'decision makers'}, and risks/objections we should expect?`
    return this.query(query)
  }

  async getProofPoints(companyName: string, subIndustry: string): Promise<PerplexityResponse> {
    const query = `What are 3 proof points or case-study angles relevant to ${companyName} for ${subIndustry} today?`
    return this.query(query)
  }

  async getCompetitiveIntelligence(companyName: string, subIndustry: string): Promise<PerplexityResponse> {
    const query = `Competitive moves vs. ${companyName} (partners, agencies, rival launches); any openings for outreach next week?`
    return this.query(query)
  }

  async getProcurementHurdles(subIndustry: string): Promise<PerplexityResponse> {
    const query = `Typical procurement/legal hurdles in ${subIndustry} for creative/content platforms; mitigation tactics.`
    return this.query(query)
  }

  async getROILanguage(subIndustry: string): Promise<PerplexityResponse> {
    const query = `ROI language customers in ${subIndustry} respond to; finance-savvy framing.`
    return this.query(query)
  }

  async getLinkedInTopics(companyName: string, subIndustry: string): Promise<PerplexityResponse> {
    const query = `Which LinkedIn topics are resonating with ${companyName} in ${subIndustry} this month? Provide 5 prompts + comment angles.`
    return this.query(query)
  }
}

export const perplexityService = new PerplexityService()
