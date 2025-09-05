import { openAIService } from './openai'

export interface ConversationContext {
  accountId: string
  contactId?: string
  opportunityId?: string
  accountTier: 1 | 2 | 3
  industry: string
  contactRole: string
  previousMeetings: number
  lastInteraction: Date
  currentRevenue: number
  growthPotential: 'High' | 'Medium' | 'Low'
  competitiveThreats: string[]
  visualContentNeeds: string[]
}

export interface RealTimeCoaching {
  suggestions: CoachingSuggestion[]
  sentiment: 'positive' | 'neutral' | 'negative'
  engagement: 'high' | 'medium' | 'low'
  riskLevel: 'low' | 'medium' | 'high'
  opportunityScore: number
  nextAction: string
}

export interface CoachingSuggestion {
  type: 'objection_handling' | 'rapport_building' | 'value_proposition' | 'closing' | 'follow_up'
  priority: 'high' | 'medium' | 'low'
  suggestion: string
  context: string
  expectedOutcome: string
  gettyImagesSpecific: boolean
}

export interface ConversationAnalysis {
  keyTopics: string[]
  sentiment: number
  engagement: number
  objections: string[]
  opportunities: string[]
  nextSteps: string[]
  revenuePotential: number
  riskFactors: string[]
  coachingPoints: string[]
}

export interface SalesCoachingInsights {
  strengths: string[]
  improvementAreas: string[]
  bestPractices: string[]
  objectionHandling: {
    score: number
    commonObjections: string[]
    suggestedResponses: Record<string, string>
  }
  closingEffectiveness: {
    score: number
    successfulPatterns: string[]
    improvementSuggestions: string[]
  }
  rapportBuilding: {
    score: number
    techniques: string[]
    relationshipHealth: number
  }
}

export class ConversationIntelligenceService {
  async analyzeConversation(
    transcript: string, 
    context: ConversationContext
  ): Promise<ConversationAnalysis> {
    try {
      const analysisPrompt = `
        Analyze this sales conversation for a Getty Images Strategic Account Executive.
        
        Transcript: ${transcript}
        Context: ${JSON.stringify(context)}
        
        Provide detailed analysis including:
        1. Key topics discussed (focus on visual content, brand strategy, etc.)
        2. Overall sentiment (1-10 scale)
        3. Client engagement level (1-10 scale)
        4. Objections raised by the client
        5. Revenue opportunities identified
        6. Recommended next steps
        7. Revenue potential assessment (1-10 scale)
        8. Risk factors identified
        9. Specific coaching points for the sales executive
        
        Focus on Getty Images-specific opportunities and challenges.
      `

      const response = await openAIService.chat(analysisPrompt)
      return this.parseAnalysisResponse(response.answer)
    } catch (error) {
      console.error('Error analyzing conversation:', error)
      throw new Error('Failed to analyze conversation')
    }
  }

  async generateRealTimeCoaching(
    transcript: string, 
    context: ConversationContext
  ): Promise<RealTimeCoaching> {
    try {
      const coachingPrompt = `
        Provide real-time sales coaching for this ongoing conversation.
        
        Current Transcript: ${transcript}
        Context: ${JSON.stringify(context)}
        
        Generate coaching suggestions for:
        1. Objection handling (if objections are present)
        2. Rapport building techniques
        3. Value proposition positioning
        4. Closing opportunities
        5. Follow-up strategies
        
        Each suggestion should be:
        - Specific and actionable
        - Getty Images-focused when relevant
        - Prioritized by importance
        - Include expected outcomes
        
        Also assess:
        - Current sentiment
        - Engagement level
        - Risk level
        - Opportunity score (1-10)
        - Recommended next action
      `

      const response = await openAIService.chat(coachingPrompt)
      return this.parseCoachingResponse(response.answer)
    } catch (error) {
      console.error('Error generating real-time coaching:', error)
      throw new Error('Failed to generate real-time coaching')
    }
  }

  async generateSalesCoachingInsights(
    conversations: Array<{ transcript: string; context: ConversationContext; outcome: string }>
  ): Promise<SalesCoachingInsights> {
    try {
      const insightsPrompt = `
        Analyze these sales conversations to provide coaching insights for a Getty Images Strategic Account Executive.
        
        Conversations: ${JSON.stringify(conversations)}
        
        Provide insights on:
        1. Sales executive strengths
        2. Areas for improvement
        3. Best practices identified
        4. Objection handling effectiveness
        5. Closing effectiveness
        6. Rapport building skills
        
        Focus on actionable insights that can improve sales performance and revenue generation.
      `

      const response = await openAIService.chat(insightsPrompt)
      return this.parseInsightsResponse(response.answer)
    } catch (error) {
      console.error('Error generating sales coaching insights:', error)
      throw new Error('Failed to generate sales coaching insights')
    }
  }

  async generateObjectionHandlingResponses(
    objection: string, 
    context: ConversationContext
  ): Promise<string[]> {
    try {
      const objectionPrompt = `
        Generate Getty Images-specific responses to this sales objection.
        
        Objection: "${objection}"
        Context: ${JSON.stringify(context)}
        
        Provide 3-5 response options that:
        1. Acknowledge the concern
        2. Provide value-based counterpoints
        3. Include Getty Images-specific benefits
        4. Move the conversation forward
        5. Address the underlying need
        
        Focus on visual content value, brand consistency, and ROI.
      `

      const response = await openAIService.chat(objectionPrompt)
      return this.parseResponsesResponse(response.answer)
    } catch (error) {
      console.error('Error generating objection handling responses:', error)
      return []
    }
  }

  async generateClosingStrategies(
    context: ConversationContext, 
    conversationStage: 'discovery' | 'presentation' | 'negotiation' | 'closing'
  ): Promise<string[]> {
    try {
      const closingPrompt = `
        Generate Getty Images-specific closing strategies for this conversation stage.
        
        Stage: ${conversationStage}
        Context: ${JSON.stringify(context)}
        
        Provide 3-5 closing strategies that:
        1. Are appropriate for the conversation stage
        2. Focus on visual content value
        3. Address specific client needs
        4. Create urgency when appropriate
        5. Move toward revenue generation
        
        Include specific language and approaches for Getty Images solutions.
      `

      const response = await openAIService.chat(closingPrompt)
      return this.parseStrategiesResponse(response.answer)
    } catch (error) {
      console.error('Error generating closing strategies:', error)
      return []
    }
  }

  private parseAnalysisResponse(response: string): ConversationAnalysis {
    // This would parse the AI response and structure it properly
    return {
      keyTopics: ['visual content strategy', 'brand alignment', 'budget planning'],
      sentiment: 7,
      engagement: 8,
      objections: ['budget constraints', 'timing concerns'],
      opportunities: ['account expansion', 'new department penetration'],
      nextSteps: ['schedule follow-up', 'send proposal'],
      revenuePotential: 8,
      riskFactors: ['competitive pressure'],
      coachingPoints: ['improve objection handling', 'strengthen value proposition']
    }
  }

  private parseCoachingResponse(response: string): RealTimeCoaching {
    // This would parse the AI response and structure it properly
    return {
      suggestions: [
        {
          type: 'objection_handling',
          priority: 'high',
          suggestion: 'Address budget concerns by focusing on ROI and cost savings',
          context: 'Client mentioned budget constraints',
          expectedOutcome: 'Client understands value proposition',
          gettyImagesSpecific: true
        }
      ],
      sentiment: 'positive',
      engagement: 'high',
      riskLevel: 'low',
      opportunityScore: 8,
      nextAction: 'Schedule follow-up meeting to discuss proposal'
    }
  }

  private parseInsightsResponse(response: string): SalesCoachingInsights {
    // This would parse the AI response and structure it properly
    return {
      strengths: ['Strong rapport building', 'Good industry knowledge'],
      improvementAreas: ['Objection handling', 'Closing techniques'],
      bestPractices: ['Visual storytelling', 'ROI focus'],
      objectionHandling: {
        score: 7,
        commonObjections: ['budget', 'timing', 'competition'],
        suggestedResponses: {
          'budget': 'Focus on ROI and cost savings with Getty Images',
          'timing': 'Emphasize the importance of brand consistency'
        }
      },
      closingEffectiveness: {
        score: 6,
        successfulPatterns: ['Value-based closing', 'Urgency creation'],
        improvementSuggestions: ['Practice closing techniques', 'Create urgency']
      },
      rapportBuilding: {
        score: 9,
        techniques: ['Active listening', 'Industry knowledge'],
        relationshipHealth: 8
      }
    }
  }

  private parseResponsesResponse(response: string): string[] {
    // This would parse the AI response and return response options
    return [
      'I understand budget is a concern. Let me show you how Getty Images can actually save you money...',
      'What if I could demonstrate a 30% cost reduction while improving your visual content quality?',
      'Many clients find that our comprehensive licensing actually reduces their overall content costs...'
    ]
  }

  private parseStrategiesResponse(response: string): string[] {
    // This would parse the AI response and return closing strategies
    return [
      'Based on your visual content needs, I recommend we start with a pilot program...',
      'Given your brand refresh timeline, we should move forward with the premium package...',
      'To ensure you have the right content for your Q4 campaign, let\'s finalize this agreement...'
    ]
  }
}

export const conversationIntelligenceService = new ConversationIntelligenceService()
