import { openAIService } from './openai'

export interface CallRecording {
  id: string
  accountId: string
  contactId?: string
  opportunityId?: string
  recordingUrl: string
  transcript: string
  duration: number
  participants: string[]
  timestamp: Date
  analysis?: CallAnalysis
}

export interface CallAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative'
  engagement: 'high' | 'medium' | 'low'
  keyTopics: string[]
  objections: string[]
  opportunities: string[]
  nextSteps: string[]
  revenuePotential: number
  riskFactors: string[]
  coachingPoints: string[]
  followUpActions: FollowUpAction[]
}

export interface FollowUpAction {
  action: string
  priority: 'high' | 'medium' | 'low'
  dueDate: Date
  description: string
  expectedOutcome: string
}

export interface VoiceInsights {
  callTrends: {
    averageSentiment: number
    engagementTrend: 'improving' | 'stable' | 'declining'
    commonObjections: string[]
    successfulPatterns: string[]
  }
  accountHealth: {
    relationshipStrength: number
    revenueRisk: 'low' | 'medium' | 'high'
    expansionOpportunities: string[]
    competitiveThreats: string[]
  }
  personalPerformance: {
    objectionHandling: number
    rapportBuilding: number
    closingEffectiveness: number
    followUpConsistency: number
  }
}

export class VoiceAnalysisService {
  async analyzeCall(recording: CallRecording): Promise<CallAnalysis> {
    try {
      // Use OpenAI to analyze the transcript
      const analysisPrompt = `
        Analyze this sales call transcript for a Getty Images Strategic Account Executive.
        
        Transcript: ${recording.transcript}
        
        Provide analysis in the following areas:
        1. Sentiment analysis (positive/neutral/negative)
        2. Engagement level (high/medium/low)
        3. Key topics discussed
        4. Objections raised by the client
        5. Revenue opportunities identified
        6. Recommended next steps
        7. Revenue potential (1-10 scale)
        8. Risk factors
        9. Coaching points for the sales executive
        10. Specific follow-up actions with priorities and due dates
        
        Focus on Getty Images-specific opportunities like:
        - Visual content needs
        - Brand strategy alignment
        - Competitive displacement opportunities
        - Account expansion possibilities
        - Revenue growth potential
      `

      const response = await openAIService.chat(analysisPrompt)
      
      // Parse the AI response and structure it
      return this.parseAnalysisResponse(response.answer)
    } catch (error) {
      console.error('Error analyzing call:', error)
      throw new Error('Failed to analyze call recording')
    }
  }

  async generateVoiceInsights(recordings: CallRecording[]): Promise<VoiceInsights> {
    try {
      const insightsPrompt = `
        Analyze these sales call recordings to provide strategic insights for a Getty Images Strategic Account Executive.
        
        Call Data: ${JSON.stringify(recordings.map(r => ({
          transcript: r.transcript,
          timestamp: r.timestamp,
          accountId: r.accountId
        })))}
        
        Provide insights on:
        1. Call trends and patterns
        2. Account health indicators
        3. Personal performance metrics
        4. Revenue optimization opportunities
        5. Getty Images-specific recommendations
        
        Focus on actionable insights that can drive revenue growth and account expansion.
      `

      const response = await openAIService.chat(insightsPrompt)
      return this.parseInsightsResponse(response.answer)
    } catch (error) {
      console.error('Error generating voice insights:', error)
      throw new Error('Failed to generate voice insights')
    }
  }

  async generateRealTimeCoaching(transcript: string, context: Record<string, unknown>): Promise<string[]> {
    try {
      const coachingPrompt = `
        Provide real-time sales coaching for this ongoing call transcript.
        
        Current Transcript: ${transcript}
        Context: ${JSON.stringify(context)}
        
        Provide 3-5 specific coaching suggestions for:
        1. Objection handling
        2. Rapport building
        3. Revenue opportunity identification
        4. Getty Images solution positioning
        5. Next steps optimization
        
        Keep suggestions concise and actionable for immediate use.
      `

      const response = await openAIService.chat(coachingPrompt)
      return this.parseCoachingResponse(response.answer)
    } catch (error) {
      console.error('Error generating real-time coaching:', error)
      return []
    }
  }

  private parseAnalysisResponse(response: string): CallAnalysis {
    // This would parse the AI response and structure it properly
    // For now, returning a mock structure
    return {
      sentiment: 'positive',
      engagement: 'high',
      keyTopics: ['visual content strategy', 'brand alignment'],
      objections: ['budget constraints'],
      opportunities: ['account expansion', 'new department penetration'],
      nextSteps: ['schedule follow-up meeting', 'send visual content proposal'],
      revenuePotential: 8,
      riskFactors: ['competitive pressure'],
      coachingPoints: ['improve objection handling', 'strengthen value proposition'],
      followUpActions: [
        {
          action: 'Send visual content strategy proposal',
          priority: 'high',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          description: 'Prepare comprehensive visual content strategy for client review',
          expectedOutcome: 'Schedule follow-up meeting to discuss proposal'
        }
      ]
    }
  }

  private parseInsightsResponse(response: string): VoiceInsights {
    // This would parse the AI response and structure it properly
    return {
      callTrends: {
        averageSentiment: 7.5,
        engagementTrend: 'improving',
        commonObjections: ['budget', 'timing', 'competition'],
        successfulPatterns: ['visual storytelling', 'brand alignment', 'ROI focus']
      },
      accountHealth: {
        relationshipStrength: 8,
        revenueRisk: 'low',
        expansionOpportunities: ['new departments', 'additional use cases'],
        competitiveThreats: ['Shutterstock', 'Adobe Stock']
      },
      personalPerformance: {
        objectionHandling: 7,
        rapportBuilding: 9,
        closingEffectiveness: 6,
        followUpConsistency: 8
      }
    }
  }

  private parseCoachingResponse(response: string): string[] {
    // This would parse the AI response and return coaching suggestions
    return [
      "Address budget concerns by focusing on ROI and cost savings",
      "Ask about their current visual content challenges",
      "Position Getty Images as the premium solution for brand consistency",
      "Schedule a follow-up to discuss specific visual content needs"
    ]
  }
}

export const voiceAnalysisService = new VoiceAnalysisService()
