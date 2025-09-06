import { voiceAnalysisService, CallRecording, CallAnalysis } from './voice-analysis'
import { revenueIntelligenceService, RevenueAttribution, RevenueForecast } from './revenue-intelligence'
import { conversationIntelligenceService, ConversationContext, RealTimeCoaching } from './conversation-intelligence'
import { visualContentAIService, VisualContentStrategy } from './visual-content-ai'
import { proactiveInsightsService, ProactiveInsight, CustomerSatisfactionInsight } from './proactive-insights'
import { getAccountByName } from './getty-accounts'
import { BaseService, CompanyContext } from './base-service'
import { executeParallel } from './utils'

export interface EnhancedCursorJarvisDashboard {
  accountId: string
  accountName: string
  tier: 1 | 2 | 3
  currentRevenue: number
  growthRate: number
  voiceInsights: {
    recentCalls: CallAnalysis[]
    performanceMetrics: any
    coachingRecommendations: string[]
  }
  revenueIntelligence: {
    forecast: RevenueForecast
    optimization: any
    trends: any[]
  }
  conversationIntelligence: {
    realTimeCoaching: RealTimeCoaching
    performanceInsights: any
  }
  visualContentStrategy: VisualContentStrategy
  proactiveInsights: ProactiveInsight[]
  customerSatisfaction: CustomerSatisfactionInsight
  nextActions: NextAction[]
}

export interface NextAction {
  id: string
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'follow_up'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  dueDate: Date
  expectedOutcome: string
  gettyImagesSpecific: boolean
  revenueImpact: number
}

export interface CallRecordingRequest {
  accountId: string
  contactId?: string
  opportunityId?: string
  recordingUrl: string
  transcript: string
  duration: number
  participants: string[]
}

export interface RealTimeCoachingRequest {
  accountId: string
  transcript: string
  context: ConversationContext
}

export class EnhancedCursorJarvisService extends BaseService {
  async processCallRecording(request: CallRecordingRequest): Promise<{
    analysis: CallAnalysis
    insights: string[]
    nextActions: NextAction[]
    revenueOpportunities: string[]
  }> {
    try {
      const gettyAccount = getAccountByName(request.accountId)
      if (!gettyAccount) throw new Error('Account not found')

      // Analyze the call
      const callRecording: CallRecording = {
        id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        accountId: request.accountId,
        contactId: request.contactId,
        opportunityId: request.opportunityId,
        recordingUrl: request.recordingUrl,
        transcript: request.transcript,
        duration: request.duration,
        participants: request.participants,
        timestamp: new Date()
      }

      const analysis = await voiceAnalysisService.analyzeCall(callRecording)
      
      // Generate insights
      const insights = await this.generateCallInsights(analysis, gettyAccount)
      
      // Generate next actions
      const nextActions = await this.generateNextActions(analysis, gettyAccount)
      
      // Identify revenue opportunities
      const revenueOpportunities = await this.identifyRevenueOpportunities(analysis, gettyAccount)

      return {
        analysis,
        insights,
        nextActions,
        revenueOpportunities
      }
    } catch (error) {
      console.error('Error processing call recording:', error)
      throw new Error('Failed to process call recording')
    }
  }

  async getRealTimeCoaching(request: RealTimeCoachingRequest): Promise<RealTimeCoaching> {
    try {
      return await conversationIntelligenceService.generateRealTimeCoaching(
        request.transcript,
        request.context
      )
    } catch (error) {
      console.error('Error getting real-time coaching:', error)
      throw new Error('Failed to get real-time coaching')
    }
  }

  async generateEnhancedDashboard(accountId: string): Promise<EnhancedCursorJarvisDashboard> {
    return this.executeWithTimeout(async () => {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      // Get all insights and data in parallel for better performance
      const [
        voiceInsights,
        revenueIntelligence,
        conversationIntelligence,
        visualContentStrategy,
        proactiveInsights,
        customerSatisfaction
      ] = await this.executeParallel([
        () => this.getVoiceInsights(accountId),
        () => this.getRevenueIntelligence(accountId),
        () => this.getConversationIntelligence(accountId),
        () => visualContentAIService.generateVisualContentStrategy(accountId),
        () => proactiveInsightsService.generateProactiveInsights(accountId),
        () => proactiveInsightsService.analyzeCustomerSatisfaction(accountId)
      ])

      // Generate next actions
      const nextActions = await this.generateNextActionsFromInsights(
        proactiveInsights,
        visualContentStrategy,
        gettyAccount
      )

      return {
        accountId,
        accountName: gettyAccount.name,
        tier: gettyAccount.tier,
        currentRevenue: gettyAccount.currentRevenue || 0,
        growthRate: 0.15, // This would be calculated from historical data
        voiceInsights,
        revenueIntelligence,
        conversationIntelligence,
        visualContentStrategy,
        proactiveInsights,
        customerSatisfaction,
        nextActions
      }
    }, 30000) // 30 second timeout
  }

  async trackRevenueAttribution(attribution: Omit<RevenueAttribution, 'id' | 'timestamp'>): Promise<RevenueAttribution> {
    try {
      const revenueAttribution = await revenueIntelligenceService.trackRevenueAttribution(attribution)
      
      // Generate insights based on the revenue attribution
      await this.generateRevenueInsights(attribution.accountId)
      
      return revenueAttribution
    } catch (error) {
      console.error('Error tracking revenue attribution:', error)
      throw new Error('Failed to track revenue attribution')
    }
  }

  async generateAccountExpansionPlan(accountId: string): Promise<{
    strategy: VisualContentStrategy
    expansionOpportunities: any[]
    implementationPlan: any[]
    expectedROI: number
  }> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const [
        strategy,
        expansionOpportunities
      ] = await Promise.all([
        visualContentAIService.generateVisualContentStrategy(accountId),
        visualContentAIService.generateAccountExpansionPlan(accountId)
      ])

      const implementationPlan = strategy.implementationPlan
      const expectedROI = strategy.expectedROI

      return {
        strategy,
        expansionOpportunities,
        implementationPlan,
        expectedROI
      }
    } catch (error) {
      console.error('Error generating account expansion plan:', error)
      throw new Error('Failed to generate account expansion plan')
    }
  }

  private async generateCallInsights(analysis: CallAnalysis, gettyAccount: any): Promise<string[]> {
    const insights = []
    
    if (analysis.sentiment === 'positive') {
      insights.push(`Positive call sentiment indicates strong relationship with ${gettyAccount.name}`)
    }
    
    if (analysis.engagement === 'high') {
      insights.push('High engagement suggests client is interested in Getty Images solutions')
    }
    
    if (analysis.revenuePotential >= 8) {
      insights.push('High revenue potential identified - prioritize this opportunity')
    }
    
    if (analysis.objections.length > 0) {
      insights.push(`Address objections: ${analysis.objections.join(', ')}`)
    }
    
    return insights
  }

  private async generateNextActions(analysis: CallAnalysis, gettyAccount: any): Promise<NextAction[]> {
    const nextActions: NextAction[] = []
    
    // Generate next actions based on call analysis
    if (analysis.nextSteps.length > 0) {
      analysis.nextSteps.forEach((step, index) => {
        nextActions.push({
          id: `action_${Date.now()}_${index}`,
          type: 'follow_up',
          priority: 'high',
          title: step,
          description: `Follow up on: ${step}`,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          expectedOutcome: 'Move opportunity forward',
          gettyImagesSpecific: true,
          revenueImpact: analysis.revenuePotential * 1000
        })
      })
    }
    
    return nextActions
  }

  private async identifyRevenueOpportunities(analysis: CallAnalysis, gettyAccount: any): Promise<string[]> {
    const opportunities = []
    
    if (analysis.opportunities.includes('account expansion')) {
      opportunities.push('Account expansion opportunity identified')
    }
    
    if (analysis.opportunities.includes('new department penetration')) {
      opportunities.push('New department penetration opportunity')
    }
    
    if (analysis.revenuePotential >= 8) {
      opportunities.push('High-value revenue opportunity')
    }
    
    return opportunities
  }

  private async getVoiceInsights(accountId: string): Promise<any> {
    // This would fetch voice insights from the database
    return {
      recentCalls: [],
      performanceMetrics: {
        averageSentiment: 7.5,
        engagementTrend: 'improving',
        objectionHandling: 8
      },
      coachingRecommendations: [
        'Improve objection handling techniques',
        'Strengthen value proposition delivery'
      ]
    }
  }

  private async getRevenueIntelligence(accountId: string): Promise<any> {
    try {
      return await revenueIntelligenceService.getRevenueDashboard(accountId)
    } catch (error) {
      console.error('Error getting revenue intelligence:', error)
      return {
        forecast: null,
        optimization: null,
        trends: []
      }
    }
  }

  private async getConversationIntelligence(accountId: string): Promise<any> {
    // This would fetch conversation intelligence data
    return {
      realTimeCoaching: {
        suggestions: [],
        sentiment: 'positive',
        engagement: 'high',
        riskLevel: 'low',
        opportunityScore: 8,
        nextAction: 'Continue current approach'
      },
      performanceInsights: {
        strengths: ['Rapport building', 'Industry knowledge'],
        improvementAreas: ['Objection handling', 'Closing techniques']
      }
    }
  }

  private async generateNextActionsFromInsights(
    proactiveInsights: ProactiveInsight[],
    visualContentStrategy: VisualContentStrategy,
    gettyAccount: any
  ): Promise<NextAction[]> {
    const nextActions: NextAction[] = []
    
    // Convert proactive insights to next actions
    proactiveInsights.forEach(insight => {
      nextActions.push({
        id: `action_${insight.id}`,
        type: this.mapInsightTypeToActionType(insight.type),
        priority: insight.priority,
        title: insight.title,
        description: insight.description,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        expectedOutcome: insight.expectedImpact,
        gettyImagesSpecific: true,
        revenueImpact: this.calculateRevenueImpact(insight)
      })
    })
    
    return nextActions
  }

  private mapInsightTypeToActionType(insightType: string): NextAction['type'] {
    switch (insightType) {
      case 'revenue_opportunity':
        return 'meeting'
      case 'risk_alert':
        return 'call'
      case 'competitive_threat':
        return 'meeting'
      case 'expansion_opportunity':
        return 'proposal'
      case 'customer_satisfaction':
        return 'follow_up'
      default:
        return 'follow_up'
    }
  }

  private calculateRevenueImpact(insight: ProactiveInsight): number {
    // This would calculate revenue impact based on insight type and priority
    const baseImpact = insight.priority === 'high' ? 50000 : insight.priority === 'medium' ? 25000 : 10000
    return baseImpact * (insight.confidence / 10)
  }

  private async generateRevenueInsights(accountId: string): Promise<void> {
    try {
      await revenueIntelligenceService.generateRevenueOptimization(accountId)
    } catch (error) {
      console.error('Error generating revenue insights:', error)
    }
  }
}

export const enhancedCursorJarvisService = new EnhancedCursorJarvisService()
