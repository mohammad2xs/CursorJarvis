import { openAIService } from './openai'
import { GETTY_ACCOUNTS, getAccountByName, GettyAccount } from './getty-accounts'

export interface VisualContentStrategy {
  accountId: string
  industry: string
  currentNeeds: string[]
  recommendedSolutions: VisualContentSolution[]
  competitivePosition: CompetitiveAnalysis
  expansionOpportunities: ExpansionOpportunity[]
  implementationPlan: ImplementationStep[]
  expectedROI: number
  timeline: string
}

export interface VisualContentSolution {
  solution: string
  description: string
  gettyImagesProduct: string
  useCase: string
  targetDepartment: string
  expectedValue: number
  implementationEffort: 'low' | 'medium' | 'high'
  timeline: string
  successMetrics: string[]
}

export interface CompetitiveAnalysis {
  currentProvider: string
  strengths: string[]
  weaknesses: string[]
  displacementStrategy: string[]
  valueProposition: string[]
  migrationPlan: string[]
}

export interface ExpansionOpportunity {
  department: string
  useCase: string
  currentSpend: number
  potentialSpend: number
  growthPotential: number
  approach: string
  timeline: string
  keyStakeholders: string[]
}

export interface ImplementationStep {
  step: string
  description: string
  timeline: string
  responsible: string
  dependencies: string[]
  successCriteria: string[]
}

export interface VisualContentTrends {
  industry: string
  trends: VisualContentTrend[]
  opportunities: string[]
  threats: string[]
  recommendations: string[]
}

export interface VisualContentTrend {
  trend: string
  description: string
  impact: 'high' | 'medium' | 'low'
  timeline: string
  gettyImagesRelevance: number
  actionItems: string[]
}

export interface BrandAlignmentAnalysis {
  accountId: string
  brandValues: string[]
  visualStyle: string
  targetAudience: string
  contentGaps: string[]
  recommendations: string[]
  gettyImagesAlignment: number
}

export class VisualContentAIService {
  async generateVisualContentStrategy(accountId: string): Promise<VisualContentStrategy> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const strategyPrompt = `
        Generate a comprehensive visual content strategy for Getty Images account: ${gettyAccount.name}
        
        Account Details:
        - Tier: ${gettyAccount.tier}
        - Industry: ${gettyAccount.industry}
        - Current Revenue: ${gettyAccount.currentRevenue || 0}
        - Growth Potential: ${gettyAccount.growthPotential}
        - Visual Content Needs: ${gettyAccount.visualContentNeeds.join(', ')}
        - Competitive Threats: ${gettyAccount.competitiveThreats.join(', ')}
        
        Create a strategy that includes:
        1. Current visual content needs assessment
        2. Recommended Getty Images solutions
        3. Competitive displacement strategy
        4. Account expansion opportunities
        5. Implementation plan with timeline
        6. Expected ROI and success metrics
        
        Focus on:
        - Revenue growth opportunities
        - Department penetration strategies
        - Visual content trend alignment
        - Brand consistency improvements
        - Competitive advantage creation
      `

      const response = await openAIService.chat(strategyPrompt)
      return this.parseStrategyResponse(response.answer, gettyAccount)
    } catch (error) {
      console.error('Error generating visual content strategy:', error)
      throw new Error('Failed to generate visual content strategy')
    }
  }

  async analyzeVisualContentTrends(industry: string): Promise<VisualContentTrends> {
    try {
      const trendsPrompt = `
        Analyze visual content trends for the ${industry} industry and their relevance to Getty Images.
        
        Focus on:
        1. Current visual content trends
        2. Emerging opportunities
        3. Competitive threats
        4. Getty Images-specific recommendations
        5. Revenue growth potential
        
        Consider trends like:
        - Sustainability and ESG content
        - Diversity and inclusion imagery
        - AI-generated content
        - Video content growth
        - Mobile-first visual content
        - Brand authenticity
      `

      const response = await openAIService.chat(trendsPrompt)
      return this.parseTrendsResponse(response.answer, industry)
    } catch (error) {
      console.error('Error analyzing visual content trends:', error)
      throw new Error('Failed to analyze visual content trends')
    }
  }

  async generateBrandAlignmentAnalysis(accountId: string): Promise<BrandAlignmentAnalysis> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const analysisPrompt = `
        Analyze brand alignment between ${gettyAccount.name} and Getty Images visual content.
        
        Account Context:
        - Industry: ${gettyAccount.industry}
        - Visual Content Needs: ${gettyAccount.visualContentNeeds.join(', ')}
        - Growth Potential: ${gettyAccount.growthPotential}
        
        Analyze:
        1. Brand values alignment
        2. Visual style compatibility
        3. Target audience alignment
        4. Content gaps identification
        5. Getty Images-specific recommendations
        6. Revenue opportunity assessment
        
        Focus on how Getty Images can enhance their brand consistency and visual storytelling.
      `

      const response = await openAIService.chat(analysisPrompt)
      return this.parseBrandAnalysisResponse(response.answer, gettyAccount)
    } catch (error) {
      console.error('Error generating brand alignment analysis:', error)
      throw new Error('Failed to generate brand alignment analysis')
    }
  }

  async generateCompetitiveDisplacementStrategy(
    accountId: string, 
    competitor: string
  ): Promise<CompetitiveAnalysis> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const displacementPrompt = `
        Create a competitive displacement strategy to replace ${competitor} with Getty Images for ${gettyAccount.name}.
        
        Account Context:
        - Industry: ${gettyAccount.industry}
        - Current Revenue: ${gettyAccount.currentRevenue || 0}
        - Visual Content Needs: ${gettyAccount.visualContentNeeds.join(', ')}
        
        Develop a strategy that includes:
        1. Analysis of current competitor strengths/weaknesses
        2. Getty Images value proposition
        3. Displacement approach
        4. Migration plan
        5. Success metrics
        6. Timeline and milestones
        
        Focus on:
        - Quality and exclusivity advantages
        - Brand consistency benefits
        - Cost-effectiveness
        - Comprehensive licensing
        - Creative support services
      `

      const response = await openAIService.chat(displacementPrompt)
      return this.parseDisplacementResponse(response.answer, competitor)
    } catch (error) {
      console.error('Error generating competitive displacement strategy:', error)
      throw new Error('Failed to generate competitive displacement strategy')
    }
  }

  async generateAccountExpansionPlan(accountId: string): Promise<ExpansionOpportunity[]> {
    try {
      const gettyAccount = getAccountByName(accountId)
      if (!gettyAccount) throw new Error('Account not found')

      const expansionPrompt = `
        Generate account expansion opportunities for Getty Images account: ${gettyAccount.name}
        
        Account Details:
        - Tier: ${gettyAccount.tier}
        - Industry: ${gettyAccount.industry}
        - Key Departments: ${gettyAccount.keyDepartments.join(', ')}
        - Current Revenue: ${gettyAccount.currentRevenue || 0}
        - Growth Potential: ${gettyAccount.growthPotential}
        
        Identify expansion opportunities in:
        1. New departments not currently using Getty Images
        2. Additional use cases within existing departments
        3. New visual content categories
        4. Geographic expansion
        5. Vertical market penetration
        
        For each opportunity, include:
        - Department and use case
        - Current vs potential spend
        - Growth potential assessment
        - Approach and timeline
        - Key stakeholders
        - Success metrics
      `

      const response = await openAIService.chat(expansionPrompt)
      return this.parseExpansionResponse(response.answer)
    } catch (error) {
      console.error('Error generating account expansion plan:', error)
      throw new Error('Failed to generate account expansion plan')
    }
  }

  private parseStrategyResponse(response: string, gettyAccount: GettyAccount): VisualContentStrategy {
    // This would parse the AI response and structure it properly
    return {
      accountId: gettyAccount.name,
      industry: gettyAccount.industry,
      currentNeeds: gettyAccount.visualContentNeeds,
      recommendedSolutions: [
        {
          solution: 'Premium Visual Content Package',
          description: 'Comprehensive visual content solution for brand consistency',
          gettyImagesProduct: 'Getty Images Premium',
          useCase: 'Brand marketing campaigns',
          targetDepartment: 'Marketing',
          expectedValue: 50000,
          implementationEffort: 'medium',
          timeline: '30 days',
          successMetrics: ['Content usage', 'Brand consistency score', 'ROI']
        }
      ],
      competitivePosition: {
        currentProvider: 'Shutterstock',
        strengths: ['Lower cost', 'Familiar interface'],
        weaknesses: ['Limited exclusivity', 'Quality concerns'],
        displacementStrategy: ['Quality focus', 'Exclusivity benefits'],
        valueProposition: ['Premium quality', 'Brand consistency'],
        migrationPlan: ['Pilot program', 'Gradual transition']
      },
      expansionOpportunities: [
        {
          department: 'Communications',
          useCase: 'Internal communications',
          currentSpend: 0,
          potentialSpend: 25000,
          growthPotential: 0.5,
          approach: 'Pilot program with communications team',
          timeline: '60 days',
          keyStakeholders: ['Head of Communications', 'Internal Comms Manager']
        }
      ],
      implementationPlan: [
        {
          step: 'Stakeholder alignment',
          description: 'Meet with key stakeholders to align on strategy',
          timeline: 'Week 1',
          responsible: 'Account Executive',
          dependencies: [],
          successCriteria: ['Stakeholder buy-in', 'Budget approval']
        }
      ],
      expectedROI: 2.5,
      timeline: '90 days'
    }
  }

  private parseTrendsResponse(response: string, industry: string): VisualContentTrends {
    // This would parse the AI response and structure it properly
    return {
      industry,
      trends: [
        {
          trend: 'Sustainability Content',
          description: 'Growing demand for ESG and sustainability-focused imagery',
          impact: 'high',
          timeline: '6 months',
          gettyImagesRelevance: 9,
          actionItems: ['Curate sustainability content', 'Develop ESG packages']
        }
      ],
      opportunities: ['ESG content packages', 'Diversity imagery', 'AI-generated content'],
      threats: ['Free stock photo sites', 'AI content generation'],
      recommendations: ['Focus on premium quality', 'Emphasize exclusivity', 'Develop AI tools']
    }
  }

  private parseBrandAnalysisResponse(response: string, gettyAccount: GettyAccount): BrandAlignmentAnalysis {
    // This would parse the AI response and structure it properly
    return {
      accountId: gettyAccount.name,
      brandValues: ['Innovation', 'Quality', 'Sustainability'],
      visualStyle: 'Professional, modern, clean',
      targetAudience: 'B2B professionals, industry leaders',
      contentGaps: ['Diversity imagery', 'Sustainability content'],
      recommendations: ['Develop custom content packages', 'Focus on brand consistency'],
      gettyImagesAlignment: 8
    }
  }

  private parseDisplacementResponse(response: string, competitor: string): CompetitiveAnalysis {
    // This would parse the AI response and structure it properly
    return {
      currentProvider: competitor,
      strengths: ['Lower cost', 'Familiar interface'],
      weaknesses: ['Limited exclusivity', 'Quality concerns'],
      displacementStrategy: ['Quality focus', 'Exclusivity benefits', 'Brand consistency'],
      valueProposition: ['Premium quality', 'Comprehensive licensing', 'Creative support'],
      migrationPlan: ['Pilot program', 'Gradual transition', 'Training support']
    }
  }

  private parseExpansionResponse(response: string): ExpansionOpportunity[] {
    // This would parse the AI response and structure it properly
    return [
      {
        department: 'Communications',
        useCase: 'Internal communications',
        currentSpend: 0,
        potentialSpend: 25000,
        growthPotential: 0.5,
        approach: 'Pilot program with communications team',
        timeline: '60 days',
        keyStakeholders: ['Head of Communications', 'Internal Comms Manager']
      }
    ]
  }
}

export const visualContentAIService = new VisualContentAIService()
