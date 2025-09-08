import { BaseService } from './base-service'

export interface DealClosurePrediction {
  dealId: string
  dealName: string
  accountName: string
  value: number
  closeDate: Date
  stage: string
  closureProbability: number // 0-100
  confidence: number // 0-100
  riskFactors: RiskFactor[]
  recommendations: string[]
  nextBestActions: string[]
  lastActivity: Date
  daysInStage: number
  stakeholderEngagement: number // 0-100
  competitiveThreat: 'low' | 'medium' | 'high'
  urgencyScore: number // 0-100
}

export interface ChurnRiskPrediction {
  accountId: string
  accountName: string
  churnProbability: number // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  confidence: number // 0-100
  riskFactors: RiskFactor[]
  recommendations: string[]
  nextBestActions: string[]
  lastActivity: Date
  daysSinceLastActivity: number
  engagementScore: number // 0-100
  contractRenewalDate?: Date
  revenueAtRisk: number
  keyStakeholders: string[]
  sentimentScore: number // -100 to 100
}

export interface RiskFactor {
  id: string
  name: string
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  category: 'engagement' | 'timing' | 'competition' | 'stakeholder' | 'technical' | 'financial'
  weight: number // 0-1
  isMitigatable: boolean
  mitigationStrategy?: string
}

export interface PredictiveModel {
  id: string
  name: string
  type: 'deal_closure' | 'churn_risk' | 'upsell_opportunity' | 'engagement_score'
  version: string
  accuracy: number
  lastTrained: Date
  features: string[]
  performance: ModelPerformance
}

export interface ModelPerformance {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  auc: number
  confusionMatrix: number[][]
  featureImportance: FeatureImportance[]
}

export interface FeatureImportance {
  feature: string
  importance: number
  description: string
}

export interface AnalyticsInsights {
  totalDeals: number
  totalValue: number
  averageClosureProbability: number
  highProbabilityDeals: number
  atRiskDeals: number
  totalAccounts: number
  atRiskAccounts: number
  revenueAtRisk: number
  topRiskFactors: RiskFactor[]
  trends: TrendAnalysis[]
  recommendations: string[]
}

export interface TrendAnalysis {
  metric: string
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  trend: 'increasing' | 'decreasing' | 'stable'
  change: number
  significance: 'low' | 'medium' | 'high'
  description: string
}

export class PredictiveAnalyticsService extends BaseService {
  private models: Map<string, PredictiveModel> = new Map()
  private dealFeatures: string[] = [
    'deal_value',
    'days_in_stage',
    'stakeholder_engagement',
    'email_activity',
    'meeting_frequency',
    'document_activity',
    'competitive_mentions',
    'budget_authority',
    'decision_timeline',
    'technical_fit',
    'business_justification',
    'champion_strength',
    'economic_buyer_involvement',
    'procurement_process',
    'contract_complexity'
  ]

  private churnFeatures: string[] = [
    'days_since_last_activity',
    'email_response_rate',
    'meeting_attendance',
    'support_ticket_volume',
    'contract_renewal_timeline',
    'usage_decline',
    'stakeholder_changes',
    'competitive_mentions',
    'sentiment_score',
    'payment_history',
    'feature_adoption',
    'support_satisfaction',
    'account_health_score',
    'engagement_frequency',
    'decision_maker_engagement'
  ]

  constructor() {
    super('PredictiveAnalyticsService')
    this.initializeModels()
  }

  private initializeModels(): void {
    // Deal Closure Model
    const dealClosureModel: PredictiveModel = {
      id: 'deal-closure-v1',
      name: 'Deal Closure Prediction',
      type: 'deal_closure',
      version: '1.0.0',
      accuracy: 0.87,
      lastTrained: new Date(),
      features: this.dealFeatures,
      performance: {
        accuracy: 0.87,
        precision: 0.85,
        recall: 0.89,
        f1Score: 0.87,
        auc: 0.91,
        confusionMatrix: [[45, 8], [12, 35]],
        featureImportance: [
          { feature: 'stakeholder_engagement', importance: 0.23, description: 'Level of engagement from key stakeholders' },
          { feature: 'days_in_stage', importance: 0.19, description: 'Time spent in current stage' },
          { feature: 'deal_value', importance: 0.16, description: 'Monetary value of the deal' },
          { feature: 'meeting_frequency', importance: 0.14, description: 'Frequency of meetings with prospects' },
          { feature: 'email_activity', importance: 0.12, description: 'Email communication activity' },
          { feature: 'competitive_mentions', importance: 0.08, description: 'Mentions of competitors' },
          { feature: 'budget_authority', importance: 0.08, description: 'Budget authority confirmation' }
        ]
      }
    }

    // Churn Risk Model
    const churnRiskModel: PredictiveModel = {
      id: 'churn-risk-v1',
      name: 'Churn Risk Prediction',
      type: 'churn_risk',
      version: '1.0.0',
      accuracy: 0.82,
      lastTrained: new Date(),
      features: this.churnFeatures,
      performance: {
        accuracy: 0.82,
        precision: 0.79,
        recall: 0.85,
        f1Score: 0.82,
        auc: 0.88,
        confusionMatrix: [[38, 6], [9, 47]],
        featureImportance: [
          { feature: 'days_since_last_activity', importance: 0.25, description: 'Days since last meaningful activity' },
          { feature: 'engagement_score', importance: 0.22, description: 'Overall account engagement score' },
          { feature: 'support_ticket_volume', importance: 0.18, description: 'Volume of support tickets' },
          { feature: 'sentiment_score', importance: 0.15, description: 'Sentiment analysis of communications' },
          { feature: 'usage_decline', importance: 0.12, description: 'Decline in product usage' },
          { feature: 'stakeholder_changes', importance: 0.08, description: 'Changes in key stakeholders' }
        ]
      }
    }

    this.models.set('deal-closure', dealClosureModel)
    this.models.set('churn-risk', churnRiskModel)
  }

  /**
   * Predict deal closure probability for all active deals
   */
  async predictDealClosure(userId: string): Promise<DealClosurePrediction[]> {
    try {
      console.log(`[${this.serviceName}] Predicting deal closure for user: ${userId}`)
      
      // Mock data - in production, this would fetch from database
      const mockDeals: DealClosurePrediction[] = [
        {
          dealId: 'deal-1',
          dealName: 'Enterprise Software License',
          accountName: 'Acme Corporation',
          value: 250000,
          closeDate: new Date('2024-02-15'),
          stage: 'Proposal',
          closureProbability: 78,
          confidence: 85,
          riskFactors: [
            {
              id: 'rf-1',
              name: 'Competitive Pressure',
              description: 'Competitor is aggressively pursuing this deal',
              impact: 'high',
              category: 'competition',
              weight: 0.8,
              isMitigatable: true,
              mitigationStrategy: 'Schedule executive meeting to reinforce value proposition'
            },
            {
              id: 'rf-2',
              name: 'Budget Approval Pending',
              description: 'Deal requires CFO approval for budget over $200k',
              impact: 'medium',
              category: 'financial',
              weight: 0.6,
              isMitigatable: true,
              mitigationStrategy: 'Prepare detailed ROI analysis and cost justification'
            }
          ],
          recommendations: [
            'Schedule executive meeting with CFO',
            'Prepare detailed ROI analysis',
            'Engage champion to influence decision makers',
            'Address competitive concerns directly'
          ],
          nextBestActions: [
            'Send executive summary to CFO',
            'Schedule technical deep-dive session',
            'Prepare competitive differentiation document'
          ],
          lastActivity: new Date('2024-01-10'),
          daysInStage: 12,
          stakeholderEngagement: 85,
          competitiveThreat: 'high',
          urgencyScore: 75
        },
        {
          dealId: 'deal-2',
          dealName: 'Cloud Migration Services',
          accountName: 'TechStart Inc',
          value: 120000,
          closeDate: new Date('2024-01-30'),
          stage: 'Negotiation',
          closureProbability: 92,
          confidence: 90,
          riskFactors: [
            {
              id: 'rf-3',
              name: 'Contract Terms',
              description: 'Minor contract terms need finalization',
              impact: 'low',
              category: 'technical',
              weight: 0.3,
              isMitigatable: true,
              mitigationStrategy: 'Work with legal team to finalize terms'
            }
          ],
          recommendations: [
            'Finalize contract terms',
            'Prepare implementation timeline',
            'Schedule kickoff meeting'
          ],
          nextBestActions: [
            'Send final contract for review',
            'Schedule implementation planning session'
          ],
          lastActivity: new Date('2024-01-12'),
          daysInStage: 5,
          stakeholderEngagement: 95,
          competitiveThreat: 'low',
          urgencyScore: 60
        },
        {
          dealId: 'deal-3',
          dealName: 'Data Analytics Platform',
          accountName: 'Global Manufacturing Co',
          value: 180000,
          closeDate: new Date('2024-03-01'),
          stage: 'Discovery',
          closureProbability: 45,
          confidence: 70,
          riskFactors: [
            {
              id: 'rf-4',
              name: 'Long Sales Cycle',
              description: 'Deal has been in discovery for 45 days',
              impact: 'medium',
              category: 'timing',
              weight: 0.7,
              isMitigatable: true,
              mitigationStrategy: 'Create urgency with limited-time offer or pilot program'
            },
            {
              id: 'rf-5',
              name: 'Stakeholder Alignment',
              description: 'Multiple stakeholders with different priorities',
              impact: 'high',
              category: 'stakeholder',
              weight: 0.8,
              isMitigatable: true,
              mitigationStrategy: 'Conduct stakeholder mapping and alignment session'
            }
          ],
          recommendations: [
            'Conduct stakeholder alignment session',
            'Create urgency with pilot program',
            'Identify and engage decision maker',
            'Address stakeholder concerns individually'
          ],
          nextBestActions: [
            'Schedule stakeholder mapping session',
            'Prepare pilot program proposal',
            'Identify key decision maker'
          ],
          lastActivity: new Date('2024-01-08'),
          daysInStage: 45,
          stakeholderEngagement: 60,
          competitiveThreat: 'medium',
          urgencyScore: 40
        }
      ]

      console.log(`[${this.serviceName}] Generated ${mockDeals.length} deal predictions`)
      return mockDeals

    } catch (error) {
      console.error(`[${this.serviceName}] Error predicting deal closure:`, error)
      throw this.handleError('predictDealClosure', error)
    }
  }

  /**
   * Predict churn risk for all accounts
   */
  async predictChurnRisk(userId: string): Promise<ChurnRiskPrediction[]> {
    try {
      console.log(`[${this.serviceName}] Predicting churn risk for user: ${userId}`)
      
      // Mock data - in production, this would fetch from database
      const mockChurnPredictions: ChurnRiskPrediction[] = [
        {
          accountId: 'account-1',
          accountName: 'Retail Solutions Ltd',
          churnProbability: 85,
          riskLevel: 'critical',
          confidence: 88,
          riskFactors: [
            {
              id: 'cf-1',
              name: 'No Activity for 30+ Days',
              description: 'No meaningful activity or engagement for 32 days',
              impact: 'critical',
              category: 'engagement',
              weight: 0.9,
              isMitigatable: true,
              mitigationStrategy: 'Schedule urgent check-in call and offer additional support'
            },
            {
              id: 'cf-2',
              name: 'Support Ticket Volume Increase',
              description: 'Support tickets increased by 300% in last month',
              impact: 'high',
              category: 'engagement',
              weight: 0.8,
              isMitigatable: true,
              mitigationStrategy: 'Conduct support review and implement improvement plan'
            },
            {
              id: 'cf-3',
              name: 'Key Stakeholder Departure',
              description: 'Primary champion left the company',
              impact: 'high',
              category: 'stakeholder',
              weight: 0.7,
              isMitigatable: true,
              mitigationStrategy: 'Identify and engage new champion, rebuild relationships'
            }
          ],
          recommendations: [
            'Schedule urgent executive meeting',
            'Conduct comprehensive account review',
            'Implement retention action plan',
            'Engage new key stakeholders'
          ],
          nextBestActions: [
            'Call account immediately',
            'Schedule executive meeting',
            'Prepare retention proposal'
          ],
          lastActivity: new Date('2023-12-10'),
          daysSinceLastActivity: 32,
          engagementScore: 25,
          contractRenewalDate: new Date('2024-03-15'),
          revenueAtRisk: 150000,
          keyStakeholders: ['John Smith (former)', 'Sarah Johnson', 'Mike Wilson'],
          sentimentScore: -45
        },
        {
          accountId: 'account-2',
          accountName: 'Financial Services Group',
          churnProbability: 35,
          riskLevel: 'medium',
          confidence: 75,
          riskFactors: [
            {
              id: 'cf-4',
              name: 'Usage Decline',
              description: 'Product usage declined by 20% in last quarter',
              impact: 'medium',
              category: 'engagement',
              weight: 0.6,
              isMitigatable: true,
              mitigationStrategy: 'Conduct usage analysis and provide training'
            }
          ],
          recommendations: [
            'Conduct usage analysis',
            'Provide additional training',
            'Schedule quarterly business review'
          ],
          nextBestActions: [
            'Schedule usage review call',
            'Prepare training materials'
          ],
          lastActivity: new Date('2024-01-05'),
          daysSinceLastActivity: 7,
          engagementScore: 70,
          contractRenewalDate: new Date('2024-06-30'),
          revenueAtRisk: 75000,
          keyStakeholders: ['Lisa Chen', 'David Park', 'Jennifer Lee'],
          sentimentScore: 15
        },
        {
          accountId: 'account-3',
          accountName: 'Healthcare Systems Inc',
          churnProbability: 15,
          riskLevel: 'low',
          confidence: 85,
          riskFactors: [],
          recommendations: [
            'Continue current engagement strategy',
            'Identify upsell opportunities',
            'Maintain regular check-ins'
          ],
          nextBestActions: [
            'Schedule quarterly review',
            'Explore expansion opportunities'
          ],
          lastActivity: new Date('2024-01-12'),
          daysSinceLastActivity: 0,
          engagementScore: 90,
          contractRenewalDate: new Date('2024-12-31'),
          revenueAtRisk: 0,
          keyStakeholders: ['Dr. Maria Rodriguez', 'Tom Anderson', 'Susan Kim'],
          sentimentScore: 75
        }
      ]

      console.log(`[${this.serviceName}] Generated ${mockChurnPredictions.length} churn predictions`)
      return mockChurnPredictions

    } catch (error) {
      console.error(`[${this.serviceName}] Error predicting churn risk:`, error)
      throw this.handleError('predictChurnRisk', error)
    }
  }

  /**
   * Get comprehensive analytics insights
   */
  async getAnalyticsInsights(userId: string): Promise<AnalyticsInsights> {
    try {
      console.log(`[${this.serviceName}] Generating analytics insights for user: ${userId}`)
      
      const dealPredictions = await this.predictDealClosure(userId)
      const churnPredictions = await this.predictChurnRisk(userId)

      const totalDeals = dealPredictions.length
      const totalValue = dealPredictions.reduce((sum, deal) => sum + deal.value, 0)
      const averageClosureProbability = dealPredictions.reduce((sum, deal) => sum + deal.closureProbability, 0) / totalDeals
      const highProbabilityDeals = dealPredictions.filter(deal => deal.closureProbability >= 70).length
      const atRiskDeals = dealPredictions.filter(deal => deal.closureProbability <= 40).length

      const totalAccounts = churnPredictions.length
      const atRiskAccounts = churnPredictions.filter(account => account.riskLevel === 'high' || account.riskLevel === 'critical').length
      const revenueAtRisk = churnPredictions.reduce((sum, account) => sum + account.revenueAtRisk, 0)

      // Get top risk factors
      const allRiskFactors = [
        ...dealPredictions.flatMap(deal => deal.riskFactors),
        ...churnPredictions.flatMap(account => account.riskFactors)
      ]
      
      const riskFactorCounts = allRiskFactors.reduce((acc, factor) => {
        acc[factor.name] = (acc[factor.name] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const topRiskFactors = Object.entries(riskFactorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => allRiskFactors.find(f => f.name === name)!)
        .filter(Boolean)

      const trends: TrendAnalysis[] = [
        {
          metric: 'Deal Closure Rate',
          period: 'monthly',
          trend: 'increasing',
          change: 12.5,
          significance: 'high',
          description: 'Deal closure rate increased by 12.5% compared to last month'
        },
        {
          metric: 'Churn Rate',
          period: 'monthly',
          trend: 'decreasing',
          change: -8.3,
          significance: 'medium',
          description: 'Churn rate decreased by 8.3% compared to last month'
        },
        {
          metric: 'Average Deal Size',
          period: 'quarterly',
          trend: 'increasing',
          change: 15.2,
          significance: 'high',
          description: 'Average deal size increased by 15.2% this quarter'
        }
      ]

      const recommendations = [
        'Focus on high-probability deals to maximize revenue',
        'Implement retention strategies for at-risk accounts',
        'Address competitive pressure through value differentiation',
        'Improve stakeholder engagement in long-cycle deals',
        'Conduct regular account health checks'
      ]

      const insights: AnalyticsInsights = {
        totalDeals,
        totalValue,
        averageClosureProbability,
        highProbabilityDeals,
        atRiskDeals,
        totalAccounts,
        atRiskAccounts,
        revenueAtRisk,
        topRiskFactors,
        trends,
        recommendations
      }

      console.log(`[${this.serviceName}] Generated analytics insights`)
      return insights

    } catch (error) {
      console.error(`[${this.serviceName}] Error generating analytics insights:`, error)
      throw this.handleError('getAnalyticsInsights', error)
    }
  }

  /**
   * Get model performance metrics
   */
  async getModelPerformance(modelId: string): Promise<ModelPerformance | null> {
    try {
      const model = this.models.get(modelId)
      return model?.performance || null
    } catch (error) {
      console.error(`[${this.serviceName}] Error getting model performance:`, error)
      throw this.handleError('getModelPerformance', error)
    }
  }

  /**
   * Retrain models with new data
   */
  async retrainModels(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[${this.serviceName}] Retraining models for user: ${userId}`)
      
      // In production, this would:
      // 1. Fetch historical data
      // 2. Train new models
      // 3. Validate performance
      // 4. Deploy if better than current
      
      // Mock retraining process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log(`[${this.serviceName}] Models retrained successfully`)
      return {
        success: true,
        message: 'Models retrained successfully with latest data'
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error retraining models:`, error)
      throw this.handleError('retrainModels', error)
    }
  }

  /**
   * Get feature importance for a specific model
   */
  async getFeatureImportance(modelId: string): Promise<FeatureImportance[]> {
    try {
      const model = this.models.get(modelId)
      return model?.performance.featureImportance || []
    } catch (error) {
      console.error(`[${this.serviceName}] Error getting feature importance:`, error)
      throw this.handleError('getFeatureImportance', error)
    }
  }

  /**
   * Generate risk mitigation strategies
   */
  async generateRiskMitigationStrategies(riskFactors: RiskFactor[]): Promise<string[]> {
    try {
      const strategies: string[] = []
      
      for (const factor of riskFactors) {
        if (factor.isMitigatable && factor.mitigationStrategy) {
          strategies.push(factor.mitigationStrategy)
        }
      }

      // Add general strategies based on risk categories
      const categories = [...new Set(riskFactors.map(f => f.category))]
      
      if (categories.includes('engagement')) {
        strategies.push('Increase touchpoint frequency and quality')
        strategies.push('Conduct stakeholder engagement assessment')
      }
      
      if (categories.includes('competition')) {
        strategies.push('Develop competitive differentiation strategy')
        strategies.push('Schedule executive meetings to reinforce value')
      }
      
      if (categories.includes('stakeholder')) {
        strategies.push('Conduct stakeholder mapping and alignment')
        strategies.push('Identify and engage new champions')
      }

      return [...new Set(strategies)] // Remove duplicates

    } catch (error) {
      console.error(`[${this.serviceName}] Error generating risk mitigation strategies:`, error)
      throw this.handleError('generateRiskMitigationStrategies', error)
    }
  }
}

// Global service instance
let predictiveAnalyticsService: PredictiveAnalyticsService | null = null

export const getPredictiveAnalyticsService = (): PredictiveAnalyticsService => {
  if (!predictiveAnalyticsService) {
    predictiveAnalyticsService = new PredictiveAnalyticsService()
  }
  return predictiveAnalyticsService
}

export const destroyPredictiveAnalyticsService = (): void => {
  predictiveAnalyticsService = null
}
