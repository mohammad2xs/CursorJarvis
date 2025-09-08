import { openAIService } from './openai'
import { db } from './db'
import { getAccountByName, GettyAccount } from './getty-accounts'

export interface ProactiveInsight {
  id: string
  accountId: string
  type: 'revenue_opportunity' | 'risk_alert' | 'competitive_threat' | 'expansion_opportunity' | 'customer_satisfaction'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action: string
  expectedImpact: string
  timeline: string
  confidence: number
  source: string
  createdAt: Date
  status: 'new' | 'in_progress' | 'completed' | 'dismissed'
}

export interface CustomerSatisfactionInsight {
  accountId: string
  satisfactionScore: number
  trends: {
    direction: 'improving' | 'stable' | 'declining'
    change: number
  }
  keyDrivers: string[]
  risks: string[]
  opportunities: string[]
  recommendations: string[]
}

export interface RevenueOptimizationInsight {
  accountId: string
  currentRevenue: number
  potentialRevenue: number
  growthOpportunities: GrowthOpportunity[]
  riskFactors: RiskFactor[]
  optimizationStrategies: OptimizationStrategy[]
  expectedImpact: number
}

export interface GrowthOpportunity {
  opportunity: string
  description: string
  potentialRevenue: number
  effort: 'low' | 'medium' | 'high'
  timeline: string
  probability: number
  keyStakeholders: string[]
}

export interface RiskFactor {
  risk: string
  description: string
  impact: 'low' | 'medium' | 'high'
  probability: number
  mitigation: string[]
  timeline: string
}

export interface OptimizationStrategy {
  strategy: string
  description: string
  expectedRevenue: number
  implementation: string[]
  timeline: string
  successMetrics: string[]
}

export class ProactiveInsightsService {
  async generateProactiveInsights(accountId: string): Promise<ProactiveInsight[]> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      // Get account context
      const account = await db.company.findUnique({
        where: { id: accountId },
        include: {
          contacts: true,
          opportunities: true,
          accountSignals: true,
          activities: true
        }
      })

      if (!account) throw new Error('Account not found')

      const insightsPrompt = `
        Generate proactive insights for Getty Images Strategic Account Executive managing ${gettyAccount.name}.
        
        Account Context:
        - Tier: ${gettyAccount.tier}
        - Industry: ${gettyAccount.industry}
        - Current Revenue: ${gettyAccount.currentRevenue || 0}
        - Growth Potential: ${gettyAccount.growthPotential}
        - Visual Content Needs: ${gettyAccount.visualContentNeeds.join(', ')}
        - Competitive Threats: ${gettyAccount.competitiveThreats.join(', ')}
        
        Account Data:
        - Contacts: ${account.contacts.length}
        - Opportunities: ${account.opportunities.length}
        - Recent Signals: ${account.accountSignals.length}
        - Activities: ${account.activities.length}
        
        Generate insights for:
        1. Revenue opportunities
        2. Risk alerts
        3. Competitive threats
        4. Account expansion opportunities
        5. Customer satisfaction improvements
        
        Each insight should include:
        - Clear title and description
        - Specific action to take
        - Expected impact
        - Timeline
        - Confidence level
        - Priority level
        
        Focus on actionable insights that can drive revenue growth and account expansion.
      `

      const response = await openAIService.chat(insightsPrompt)
      return this.parseInsightsResponse(response.answer, accountId)
    } catch (error) {
      console.error('Error generating proactive insights:', error)
      throw new Error('Failed to generate proactive insights')
    }
  }

  async analyzeCustomerSatisfaction(accountId: string): Promise<CustomerSatisfactionInsight> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const satisfactionPrompt = `
        Analyze customer satisfaction for Getty Images account: ${gettyAccount.name}
        
        Account Details:
        - Tier: ${gettyAccount.tier}
        - Industry: ${gettyAccount.industry}
        - Growth Potential: ${gettyAccount.growthPotential}
        - Last Engagement: ${gettyAccount.lastEngagement || 'Unknown'}
        
        Analyze:
        1. Overall satisfaction score (1-10)
        2. Satisfaction trends
        3. Key satisfaction drivers
        4. Risk factors
        5. Improvement opportunities
        6. Specific recommendations
        
        Focus on:
        - Visual content quality
        - Service delivery
        - Account management
        - Value realization
        - Relationship strength
      `

      const response = await openAIService.chat(satisfactionPrompt)
      return this.parseSatisfactionResponse(response.answer, accountId)
    } catch (error) {
      console.error('Error analyzing customer satisfaction:', error)
      throw new Error('Failed to analyze customer satisfaction')
    }
  }

  async generateRevenueOptimizationInsights(accountId: string): Promise<RevenueOptimizationInsight> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const optimizationPrompt = `
        Generate revenue optimization insights for Getty Images account: ${gettyAccount.name}
        
        Account Context:
        - Tier: ${gettyAccount.tier}
        - Industry: ${gettyAccount.industry}
        - Current Revenue: ${gettyAccount.currentRevenue || 0}
        - Growth Potential: ${gettyAccount.growthPotential}
        - Visual Content Needs: ${gettyAccount.visualContentNeeds.join(', ')}
        
        Provide insights on:
        1. Current revenue analysis
        2. Growth opportunities
        3. Risk factors
        4. Optimization strategies
        5. Expected impact
        
        Focus on:
        - Account expansion opportunities
        - New department penetration
        - Visual content strategy enhancement
        - Competitive displacement
        - Revenue acceleration
      `

      const response = await openAIService.chat(optimizationPrompt)
      return this.parseOptimizationResponse(response.answer, gettyAccount)
    } catch (error) {
      console.error('Error generating revenue optimization insights:', error)
      throw new Error('Failed to generate revenue optimization insights')
    }
  }

  async generateCompetitiveIntelligence(accountId: string): Promise<ProactiveInsight[]> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const competitivePrompt = `
        Generate competitive intelligence insights for Getty Images account: ${gettyAccount.name}
        
        Account Context:
        - Industry: ${gettyAccount.industry}
        - Competitive Threats: ${gettyAccount.competitiveThreats.join(', ')}
        - Growth Potential: ${gettyAccount.growthPotential}
        
        Analyze:
        1. Competitive threats and opportunities
        2. Market positioning
        3. Displacement opportunities
        4. Defensive strategies
        5. Proactive recommendations
        
        Focus on:
        - Shutterstock displacement
        - Adobe Stock competition
        - Free stock photo threats
        - Getty Images advantages
        - Market trends
      `

      const response = await openAIService.chat(competitivePrompt)
      return this.parseCompetitiveResponse(response.answer, accountId)
    } catch (error) {
      console.error('Error generating competitive intelligence:', error)
      throw new Error('Failed to generate competitive intelligence')
    }
  }

  async generateAccountExpansionInsights(accountId: string): Promise<ProactiveInsight[]> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const expansionPrompt = `
        Generate account expansion insights for Getty Images account: ${gettyAccount.name}
        
        Account Details:
        - Tier: ${gettyAccount.tier}
        - Industry: ${gettyAccount.industry}
        - Key Departments: ${gettyAccount.keyDepartments.join(', ')}
        - Growth Potential: ${gettyAccount.growthPotential}
        
        Identify expansion opportunities in:
        1. New departments
        2. Additional use cases
        3. New visual content categories
        4. Geographic expansion
        5. Vertical market penetration
        
        Focus on:
        - Revenue growth potential
        - Implementation feasibility
        - Key stakeholders
        - Success metrics
        - Timeline and milestones
      `

      const response = await openAIService.chat(expansionPrompt)
      return this.parseExpansionResponse(response.answer, accountId)
    } catch (error) {
      console.error('Error generating account expansion insights:', error)
      throw new Error('Failed to generate account expansion insights')
    }
  }

  private parseInsightsResponse(response: string, accountId: string): ProactiveInsight[] {
    // This would parse the AI response and structure it properly
    return [
      {
        id: `insight_${Date.now()}_1`,
        accountId,
        type: 'revenue_opportunity',
        priority: 'high',
        title: 'Marketing Department Expansion Opportunity',
        description: 'Marketing team shows interest in premium visual content solutions',
        action: 'Schedule meeting with Marketing Director to discuss Getty Images Premium',
        expectedImpact: 'Potential $50K additional revenue',
        timeline: '30 days',
        confidence: 8,
        source: 'AI Analysis',
        createdAt: new Date(),
        status: 'new'
      }
    ]
  }

  private parseSatisfactionResponse(response: string, accountId: string): CustomerSatisfactionInsight {
    // This would parse the AI response and structure it properly
    return {
      accountId,
      satisfactionScore: 8,
      trends: {
        direction: 'improving',
        change: 0.2
      },
      keyDrivers: ['Visual content quality', 'Account management', 'Support responsiveness'],
      risks: ['Competitive pressure', 'Budget constraints'],
      opportunities: ['Account expansion', 'New use cases'],
      recommendations: ['Increase touchpoints', 'Provide more value-added services']
    }
  }

  private parseOptimizationResponse(response: string, gettyAccount: GettyAccount): RevenueOptimizationInsight {
    // This would parse the AI response and structure it properly
    return {
      accountId: gettyAccount.name,
      currentRevenue: gettyAccount.currentRevenue || 0,
      potentialRevenue: (gettyAccount.currentRevenue || 0) * 1.5,
      growthOpportunities: [
        {
          opportunity: 'Marketing Department Expansion',
          description: 'Penetrate marketing team with visual content strategy',
          potentialRevenue: 50000,
          effort: 'medium',
          timeline: '60 days',
          probability: 0.8,
          keyStakeholders: ['Marketing Director', 'Creative Director']
        }
      ],
      riskFactors: [
        {
          risk: 'Competitive Displacement',
          description: 'Shutterstock trying to displace Getty Images',
          impact: 'high',
          probability: 0.6,
          mitigation: ['Strengthen relationship', 'Provide better value'],
          timeline: '90 days'
        }
      ],
      optimizationStrategies: [
        {
          strategy: 'Account Expansion',
          description: 'Expand to new departments and use cases',
          expectedRevenue: 75000,
          implementation: ['Stakeholder mapping', 'Pilot programs', 'Full rollout'],
          timeline: '120 days',
          successMetrics: ['New department adoption', 'Revenue growth', 'Usage increase']
        }
      ],
      expectedImpact: 1.5
    }
  }

  private parseCompetitiveResponse(response: string, accountId: string): ProactiveInsight[] {
    // This would parse the AI response and structure it properly
    return [
      {
        id: `insight_${Date.now()}_2`,
        accountId,
        type: 'competitive_threat',
        priority: 'high',
        title: 'Shutterstock Competitive Threat',
        description: 'Shutterstock is aggressively targeting this account',
        action: 'Schedule competitive displacement meeting with key stakeholders',
        expectedImpact: 'Prevent revenue loss and strengthen position',
        timeline: '14 days',
        confidence: 9,
        source: 'Competitive Intelligence',
        createdAt: new Date(),
        status: 'new'
      }
    ]
  }

  private parseExpansionResponse(response: string, accountId: string): ProactiveInsight[] {
    // This would parse the AI response and structure it properly
    return [
      {
        id: `insight_${Date.now()}_3`,
        accountId,
        type: 'expansion_opportunity',
        priority: 'medium',
        title: 'Communications Department Opportunity',
        description: 'Communications team needs visual content for internal communications',
        action: 'Pilot program with Communications team',
        expectedImpact: 'Potential $25K additional revenue',
        timeline: '45 days',
        confidence: 7,
        source: 'Account Analysis',
        createdAt: new Date(),
        status: 'new'
      }
    ]
  }
}

export const proactiveInsightsService = new ProactiveInsightsService()
