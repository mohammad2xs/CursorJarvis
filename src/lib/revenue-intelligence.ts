import { db } from './db'
import { openAIService } from './openai'
import { RevenueTrend } from '@/types'

export interface RevenueAttribution {
  id: string
  accountId: string
  contactId?: string
  opportunityId?: string
  revenue: number
  attributionSource: 'direct_sale' | 'incidental_purchase' | 'renewal' | 'expansion'
  attributionReason: string
  conversationId?: string
  callId?: string
  timestamp: Date
  gettyImagesProduct: string
  department: string
  useCase: string
}

export interface RevenueForecast {
  accountId: string
  currentRevenue: number
  projectedRevenue: {
    next30Days: number
    next90Days: number
    next6Months: number
    nextYear: number
  }
  confidence: number
  keyDrivers: string[]
  risks: string[]
  opportunities: string[]
}

export interface RevenueOptimization {
  accountId: string
  currentRevenue: number
  potentialRevenue: number
  optimizationStrategies: OptimizationStrategy[]
  priority: 'high' | 'medium' | 'low'
  expectedImpact: number
  timeline: string
}

export interface OptimizationStrategy {
  strategy: string
  description: string
  expectedRevenue: number
  effort: 'low' | 'medium' | 'high'
  timeline: string
  successMetrics: string[]
}

export interface GettyImagesRevenueData {
  accountId: string
  totalRevenue: number
  revenueByProduct: Record<string, number>
  revenueByDepartment: Record<string, number>
  revenueByUseCase: Record<string, number>
  growthRate: number
  lastPurchase: Date
  averageOrderValue: number
  purchaseFrequency: number
}

interface HistoricalRevenueData {
  month: string
  revenue: number
}

interface GettyAccountData {
  tier: 1 | 2 | 3
  industry: string
  growthPotential: 'High' | 'Medium' | 'Low'
}

export class RevenueIntelligenceService {
  async trackRevenueAttribution(attribution: Omit<RevenueAttribution, 'id' | 'timestamp'>): Promise<RevenueAttribution> {
    try {
      const newAttribution: RevenueAttribution = {
        id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...attribution
      }

      // Store in database
      await db.revenueAttribution.create({
        data: newAttribution
      })

      // Update account revenue tracking
      await this.updateAccountRevenue(attribution.accountId, attribution.revenue)

      // Generate AI insights
      await this.generateRevenueInsights(attribution.accountId)

      return newAttribution
    } catch (error) {
      console.error('Error tracking revenue attribution:', error)
      throw new Error('Failed to track revenue attribution')
    }
  }

  async generateRevenueForecast(accountId: string): Promise<RevenueForecast> {
    try {
      // Get historical revenue data
      const historicalData = await this.getHistoricalRevenueData(accountId)
      
      // Get account context
      const account = await db.company.findUnique({
        where: { id: accountId },
        include: {
          opportunities: true,
          contacts: true,
          accountSignals: true
        }
      })

      if (!account) throw new Error('Account not found')

      // Use AI to generate forecast
      const forecastPrompt = `
        Generate a revenue forecast for Getty Images account: ${account.name}
        
        Historical Revenue Data: ${JSON.stringify(historicalData)}
        Account Context: ${JSON.stringify({
          industry: account.subIndustry,
          priority: account.priorityLevel,
          opportunities: account.opportunities.length,
          contacts: account.contacts.length,
          recentSignals: account.accountSignals.length
        })}
        
        Provide:
        1. Current revenue baseline
        2. Projected revenue for next 30, 90 days, 6 months, and 1 year
        3. Confidence level (1-10)
        4. Key revenue drivers
        5. Potential risks
        6. Growth opportunities
        
        Focus on Getty Images-specific factors like:
        - Visual content consumption trends
        - Brand strategy evolution
        - Competitive landscape changes
        - Account expansion potential
      `

      const response = await openAIService.chat(forecastPrompt)
      return this.parseForecastResponse(response.answer, historicalData)
    } catch (error) {
      console.error('Error generating revenue forecast:', error)
      throw new Error('Failed to generate revenue forecast')
    }
  }

  async generateRevenueOptimization(accountId: string): Promise<RevenueOptimization> {
    try {
      const account = await db.company.findUnique({
        where: { id: accountId },
        include: {
          opportunities: true,
          contacts: true,
          accountSignals: true
        }
      })

      if (!account) throw new Error('Account not found')

      const currentRevenue = await this.getCurrentRevenue(accountId)
      const gettyAccount = await this.getGettyAccountData(accountId)

      const optimizationPrompt = `
        Generate revenue optimization strategies for Getty Images account: ${account.name}
        
        Current Revenue: $${currentRevenue}
        Getty Account Tier: ${gettyAccount?.tier || 'Unknown'}
        Industry: ${account.subIndustry}
        Recent Activity: ${account.accountSignals.length} signals
        
        Provide optimization strategies focusing on:
        1. Account expansion opportunities
        2. New department penetration
        3. Visual content strategy enhancement
        4. Competitive displacement
        5. Revenue growth acceleration
        
        For each strategy, include:
        - Expected revenue impact
        - Implementation effort
        - Timeline
        - Success metrics
        - Getty Images-specific recommendations
      `

      const response = await openAIService.chat(optimizationPrompt)
      return this.parseOptimizationResponse(response.answer, currentRevenue)
    } catch (error) {
      console.error('Error generating revenue optimization:', error)
      throw new Error('Failed to generate revenue optimization')
    }
  }

  async getRevenueDashboard(accountId: string): Promise<{
    currentRevenue: number
    growthRate: number
    forecast: RevenueForecast
    optimization: RevenueOptimization
    trends: RevenueTrend[]
    insights: string[]
  }> {
    try {
      const currentRevenue = await this.getCurrentRevenue(accountId)
      const growthRate = await this.calculateGrowthRate(accountId)
      const forecast = await this.generateRevenueForecast(accountId)
      const optimization = await this.generateRevenueOptimization(accountId)
      const trends = await this.getRevenueTrends(accountId)
      const insights = await this.generateRevenueInsights(accountId)

      return {
        currentRevenue,
        growthRate,
        forecast,
        optimization,
        trends,
        insights
      }
    } catch (error) {
      console.error('Error generating revenue dashboard:', error)
      throw new Error('Failed to generate revenue dashboard')
    }
  }

  private async getHistoricalRevenueData(accountId: string): Promise<HistoricalRevenueData[]> {
    // This would fetch historical revenue data from the database
    // For now, returning mock data
    return [
      { month: '2024-01', revenue: 15000 },
      { month: '2024-02', revenue: 18000 },
      { month: '2024-03', revenue: 22000 },
      { month: '2024-04', revenue: 19000 },
      { month: '2024-05', revenue: 25000 },
      { month: '2024-06', revenue: 28000 }
    ]
  }

  private async getCurrentRevenue(accountId: string): Promise<number> {
    // This would calculate current revenue from the database
    // For now, returning mock data
    return 28000
  }

  private async calculateGrowthRate(accountId: string): Promise<number> {
    // This would calculate growth rate from historical data
    // For now, returning mock data
    return 0.15 // 15% growth
  }

  private async getRevenueTrends(accountId: string): Promise<RevenueTrend[]> {
    // This would fetch revenue trends from the database
    // For now, returning mock data with required fields
    const now = new Date()
    return [
      { id: 'trend-q1-2024', userId: 'system', period: 'Q1 2024', revenue: 55000, growth: 0.12, factors: [], createdAt: now, updatedAt: now },
      { id: 'trend-q2-2024', userId: 'system', period: 'Q2 2024', revenue: 72000, growth: 0.31, factors: [], createdAt: now, updatedAt: now },
      { id: 'trend-q3-2024', userId: 'system', period: 'Q3 2024', revenue: 85000, growth: 0.18, factors: [], createdAt: now, updatedAt: now }
    ]
  }

  private async generateRevenueInsights(accountId: string): Promise<string[]> {
    try {
      const insightsPrompt = `
        Generate revenue insights for Getty Images account: ${accountId}
        
        Focus on:
        1. Revenue growth opportunities
        2. Account health indicators
        3. Competitive positioning
        4. Visual content trends
        5. Strategic recommendations
        
        Provide 5-7 actionable insights that can drive revenue growth.
      `

      const response = await openAIService.chat(insightsPrompt)
      return this.parseInsightsResponse(response.answer)
    } catch (error) {
      console.error('Error generating revenue insights:', error)
      return []
    }
  }

  private async updateAccountRevenue(accountId: string, revenue: number): Promise<void> {
    // This would update the account's revenue tracking in the database
    // Implementation would depend on the database schema
  }

  private async getGettyAccountData(accountId: string): Promise<GettyAccountData> {
    // This would fetch Getty Images-specific account data
    // For now, returning mock data
    return {
      tier: 1,
      industry: 'Energy',
      growthPotential: 'High'
    }
  }

  private parseForecastResponse(response: string, historicalData: HistoricalRevenueData[]): RevenueForecast {
    // This would parse the AI response and structure it properly
    return {
      accountId: '',
      currentRevenue: 28000,
      projectedRevenue: {
        next30Days: 32000,
        next90Days: 38000,
        next6Months: 45000,
        nextYear: 65000
      },
      confidence: 8,
      keyDrivers: ['Visual content strategy expansion', 'New department penetration'],
      risks: ['Competitive pressure', 'Budget constraints'],
      opportunities: ['ESG content needs', 'Brand refresh projects']
    }
  }

  private parseOptimizationResponse(response: string, currentRevenue: number): RevenueOptimization {
    // This would parse the AI response and structure it properly
    return {
      accountId: '',
      currentRevenue,
      potentialRevenue: currentRevenue * 1.5,
      optimizationStrategies: [
        {
          strategy: 'Expand to Marketing Department',
          description: 'Penetrate marketing team with visual content strategy',
          expectedRevenue: 15000,
          effort: 'medium',
          timeline: '60 days',
          successMetrics: ['Meeting scheduled', 'Proposal sent', 'Contract signed']
        }
      ],
      priority: 'high',
      expectedImpact: 0.5,
      timeline: '90 days'
    }
  }

  private parseInsightsResponse(response: string): string[] {
    // This would parse the AI response and return insights
    return [
      'Account shows strong growth potential in visual content strategy',
      'Marketing department represents untapped revenue opportunity',
      'ESG content needs align with Getty Images sustainability offerings',
      'Competitive displacement opportunity with current Shutterstock usage',
      'Brand refresh projects could drive significant revenue growth'
    ]
  }
}

export interface RevenueIntelligence {
  currentRevenue: number
  growthRate: number
  forecast: RevenueForecast
  optimization: RevenueOptimization
  trends: RevenueTrend[]
  insights: string[]
}

export const revenueIntelligenceService = new RevenueIntelligenceService()
