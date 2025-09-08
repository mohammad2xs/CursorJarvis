import { BaseService } from './base-service'

export interface MeetingTranscript {
  id: string
  meetingId: string
  userId: string
  speaker: string
  text: string
  timestamp: number
  confidence: number
  isFinal: boolean
  language: string
  sentiment: 'positive' | 'negative' | 'neutral'
  keywords: string[]
  entities: MeetingEntity[]
  createdAt: Date
}

export interface MeetingEntity {
  text: string
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'product' | 'technology' | 'competitor'
  confidence: number
  startTime: number
  endTime: number
}

export interface MeetingInsight {
  id: string
  meetingId: string
  userId: string
  type: MeetingInsightType
  title: string
  description: string
  confidence: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'action_item' | 'decision' | 'next_steps' | 'concern' | 'opportunity' | 'risk' | 'follow_up'
  timestamp: number
  speaker: string
  relatedEntities: MeetingEntity[]
  suggestedActions: string[]
  isProcessed: boolean
  createdAt: Date
}

export type MeetingInsightType = 
  | 'action_item'
  | 'decision_made'
  | 'next_steps'
  | 'concern_raised'
  | 'opportunity_identified'
  | 'risk_identified'
  | 'follow_up_required'
  | 'budget_discussion'
  | 'timeline_change'
  | 'stakeholder_mentioned'
  | 'competitor_mentioned'
  | 'technical_requirement'
  | 'compliance_issue'
  | 'partnership_opportunity'

export interface MeetingSummary {
  id: string
  meetingId: string
  userId: string
  title: string
  summary: string
  keyPoints: string[]
  actionItems: ActionItem[]
  decisions: Decision[]
  nextSteps: NextStep[]
  participants: Participant[]
  duration: number
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
  confidence: number
  topics: Topic[]
  createdAt: Date
  updatedAt: Date
}

export interface ActionItem {
  id: string
  text: string
  assignee: string
  dueDate?: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface Decision {
  id: string
  text: string
  decisionMaker: string
  rationale: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
}

export interface NextStep {
  id: string
  text: string
  owner: string
  timeline: string
  dependencies: string[]
  createdAt: Date
}

export interface Participant {
  name: string
  role: string
  organization: string
  email?: string
  speakingTime: number
  contribution: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'negative' | 'neutral'
}

export interface Topic {
  name: string
  duration: number
  importance: 'low' | 'medium' | 'high' | 'critical'
  sentiment: 'positive' | 'negative' | 'neutral'
  keywords: string[]
}

export interface MeetingAnalytics {
  meetingId: string
  userId: string
  totalDuration: number
  speakingTime: Record<string, number>
  sentimentTrend: Array<{
    timestamp: number
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number
  }>
  topicDistribution: Array<{
    topic: string
    duration: number
    percentage: number
  }>
  keyMoments: Array<{
    timestamp: number
    type: 'insight' | 'decision' | 'action_item' | 'concern'
    description: string
    importance: number
  }>
  engagementScore: number
  productivityScore: number
  followUpRequired: boolean
  createdAt: Date
}

export interface RealTimeTranscriptionConfig {
  language: string
  model: 'nova-2' | 'nova' | 'enhanced'
  punctuate: boolean
  profanity_filter: boolean
  redact: string[]
  diarize: boolean
  smart_format: boolean
  interim_results: boolean
  endpointing: number
  vad_events: boolean
  encoding: string
  sample_rate: number
  channels: number
}

export class MeetingIntelligenceService extends BaseService {
  private transcripts: Map<string, MeetingTranscript[]> = new Map()
  private insights: Map<string, MeetingInsight[]> = new Map()
  private summaries: Map<string, MeetingSummary> = new Map()
  private analytics: Map<string, MeetingAnalytics> = new Map()
  private activeMeetings: Map<string, {
    meetingId: string
    userId: string
    startTime: Date
    participants: string[]
    config: RealTimeTranscriptionConfig
  }> = new Map()

  constructor() {
    super('MeetingIntelligenceService')
  }

  /**
   * Start real-time transcription for a meeting
   */
  async startTranscription(meetingId: string, userId: string, config?: Partial<RealTimeTranscriptionConfig>): Promise<{
    success: boolean
    sessionId: string
    websocketUrl: string
  }> {
    try {
      console.log(`[${this.serviceName}] Starting transcription for meeting: ${meetingId}`)
      
      const defaultConfig: RealTimeTranscriptionConfig = {
        language: 'en-US',
        model: 'nova-2',
        punctuate: true,
        profanity_filter: true,
        redact: ['ssn', 'credit_card'],
        diarize: true,
        smart_format: true,
        interim_results: true,
        endpointing: 300,
        vad_events: true,
        encoding: 'linear16',
        sample_rate: 16000,
        channels: 1,
        ...config
      }

      const sessionId = `session-${meetingId}-${Date.now()}`
      
      // Store active meeting
      this.activeMeetings.set(sessionId, {
        meetingId,
        userId,
        startTime: new Date(),
        participants: [],
        config: defaultConfig
      })

      // Initialize transcript array
      this.transcripts.set(meetingId, [])
      this.insights.set(meetingId, [])

      // Mock WebSocket URL - in production, this would be the actual Deepgram WebSocket URL
      const websocketUrl = `wss://api.deepgram.com/v1/listen?model=${defaultConfig.model}&language=${defaultConfig.language}&punctuate=${defaultConfig.punctuate}&diarize=${defaultConfig.diarize}&smart_format=${defaultConfig.smart_format}`

      console.log(`[${this.serviceName}] Transcription started for meeting: ${meetingId}`)
      
      return {
        success: true,
        sessionId,
        websocketUrl
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error starting transcription:`, error)
      throw this.handleError('startTranscription', error)
    }
  }

  /**
   * Process real-time transcript data
   */
  async processTranscript(meetingId: string, transcriptData: {
    speaker: string
    text: string
    timestamp: number
    confidence: number
    isFinal: boolean
  }): Promise<MeetingTranscript> {
    try {
      console.log(`[${this.serviceName}] Processing transcript for meeting: ${meetingId}`)
      
      const transcript: MeetingTranscript = {
        id: `transcript-${meetingId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        meetingId,
        userId: 'user-1', // This would come from the active meeting
        speaker: transcriptData.speaker,
        text: transcriptData.text,
        timestamp: transcriptData.timestamp,
        confidence: transcriptData.confidence,
        isFinal: transcriptData.isFinal,
        language: 'en-US',
        sentiment: this.analyzeSentiment(transcriptData.text),
        keywords: this.extractKeywords(transcriptData.text),
        entities: this.extractEntities(transcriptData.text, transcriptData.timestamp),
        createdAt: new Date()
      }

      // Store transcript
      const existingTranscripts = this.transcripts.get(meetingId) || []
      existingTranscripts.push(transcript)
      this.transcripts.set(meetingId, existingTranscripts)

      // Generate insights if this is a final transcript
      if (transcriptData.isFinal) {
        await this.generateInsights(meetingId, transcript)
      }

      console.log(`[${this.serviceName}] Transcript processed: ${transcript.id}`)
      return transcript

    } catch (error) {
      console.error(`[${this.serviceName}] Error processing transcript:`, error)
      throw this.handleError('processTranscript', error)
    }
  }

  /**
   * Generate AI-powered insights from transcript
   */
  private async generateInsights(meetingId: string, transcript: MeetingTranscript): Promise<void> {
    try {
      const insights: MeetingInsight[] = []

      // Analyze for action items
      const actionItems = this.extractActionItems(transcript)
      insights.push(...actionItems)

      // Analyze for decisions
      const decisions = this.extractDecisions(transcript)
      insights.push(...decisions)

      // Analyze for concerns
      const concerns = this.extractConcerns(transcript)
      insights.push(...concerns)

      // Analyze for opportunities
      const opportunities = this.extractOpportunities(transcript)
      insights.push(...opportunities)

      // Store insights
      const existingInsights = this.insights.get(meetingId) || []
      existingInsights.push(...insights)
      this.insights.set(meetingId, existingInsights)

      console.log(`[${this.serviceName}] Generated ${insights.length} insights for meeting: ${meetingId}`)

    } catch (error) {
      console.error(`[${this.serviceName}] Error generating insights:`, error)
    }
  }

  /**
   * Analyze sentiment of text
   */
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['great', 'excellent', 'good', 'amazing', 'fantastic', 'wonderful', 'perfect', 'love', 'like', 'happy', 'excited', 'pleased']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'concerned', 'worried', 'problem']
    
    const words = text.toLowerCase().split(/\s+/)
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Mock keyword extraction - in production, this would use NLP libraries
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must']
    const words = text.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 10)
    
    return [...new Set(words)]
  }

  /**
   * Extract entities from text
   */
  private extractEntities(text: string, timestamp: number): MeetingEntity[] {
    const entities: MeetingEntity[] = []
    
    // Mock entity extraction - in production, this would use NLP libraries
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
    const moneyRegex = /\$[\d,]+(?:\.\d{2})?/g
    const dateRegex = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/g
    
    // Extract emails
    const emails = text.match(emailRegex)
    if (emails) {
      emails.forEach(email => {
        entities.push({
          text: email,
          type: 'person',
          confidence: 0.9,
          startTime: timestamp,
          endTime: timestamp + 1
        })
      })
    }
    
    // Extract phone numbers
    const phones = text.match(phoneRegex)
    if (phones) {
      phones.forEach(phone => {
        entities.push({
          text: phone,
          type: 'person',
          confidence: 0.8,
          startTime: timestamp,
          endTime: timestamp + 1
        })
      })
    }
    
    // Extract money amounts
    const money = text.match(moneyRegex)
    if (money) {
      money.forEach(amount => {
        entities.push({
          text: amount,
          type: 'money',
          confidence: 0.9,
          startTime: timestamp,
          endTime: timestamp + 1
        })
      })
    }
    
    return entities
  }

  /**
   * Extract action items from transcript
   */
  private extractActionItems(transcript: MeetingTranscript): MeetingInsight[] {
    const actionItemPatterns = [
      /(?:we need to|let's|please|can you|will you|should we|need to)\s+([^.!?]+)/gi,
      /(?:action item|todo|task|follow up|next step)\s*:?\s*([^.!?]+)/gi,
      /(?:assign|delegate|responsible for)\s+([^.!?]+)/gi
    ]
    
    const insights: MeetingInsight[] = []
    
    actionItemPatterns.forEach(pattern => {
      const matches = transcript.text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          insights.push({
            id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            meetingId: transcript.meetingId,
            userId: transcript.userId,
            type: 'action_item',
            title: 'Action Item Identified',
            description: match.trim(),
            confidence: transcript.confidence * 0.8,
            priority: 'medium',
            category: 'action_item',
            timestamp: transcript.timestamp,
            speaker: transcript.speaker,
            relatedEntities: transcript.entities,
            suggestedActions: ['Add to task list', 'Set reminder', 'Assign to team member'],
            isProcessed: false,
            createdAt: new Date()
          })
        })
      }
    })
    
    return insights
  }

  /**
   * Extract decisions from transcript
   */
  private extractDecisions(transcript: MeetingTranscript): MeetingInsight[] {
    const decisionPatterns = [
      /(?:we decided|decision is|agreed to|concluded that|resolved to)\s+([^.!?]+)/gi,
      /(?:let's go with|we'll choose|selected|picked)\s+([^.!?]+)/gi,
      /(?:approved|rejected|accepted|declined)\s+([^.!?]+)/gi
    ]
    
    const insights: MeetingInsight[] = []
    
    decisionPatterns.forEach(pattern => {
      const matches = transcript.text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          insights.push({
            id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            meetingId: transcript.meetingId,
            userId: transcript.userId,
            type: 'decision_made',
            title: 'Decision Made',
            description: match.trim(),
            confidence: transcript.confidence * 0.9,
            priority: 'high',
            category: 'decision',
            timestamp: transcript.timestamp,
            speaker: transcript.speaker,
            relatedEntities: transcript.entities,
            suggestedActions: ['Document decision', 'Update project plan', 'Communicate to stakeholders'],
            isProcessed: false,
            createdAt: new Date()
          })
        })
      }
    })
    
    return insights
  }

  /**
   * Extract concerns from transcript
   */
  private extractConcerns(transcript: MeetingTranscript): MeetingInsight[] {
    const concernPatterns = [
      /(?:concern|worried|issue|problem|challenge|risk|trouble)\s+([^.!?]+)/gi,
      /(?:not sure|uncertain|unclear|confused|stuck)\s+([^.!?]+)/gi,
      /(?:deadline|budget|resource|timeline)\s+(?:issue|problem|concern)\s+([^.!?]+)/gi
    ]
    
    const insights: MeetingInsight[] = []
    
    concernPatterns.forEach(pattern => {
      const matches = transcript.text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          insights.push({
            id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            meetingId: transcript.meetingId,
            userId: transcript.userId,
            type: 'concern_raised',
            title: 'Concern Raised',
            description: match.trim(),
            confidence: transcript.confidence * 0.7,
            priority: 'high',
            category: 'concern',
            timestamp: transcript.timestamp,
            speaker: transcript.speaker,
            relatedEntities: transcript.entities,
            suggestedActions: ['Investigate further', 'Schedule follow-up', 'Escalate to management'],
            isProcessed: false,
            createdAt: new Date()
          })
        })
      }
    })
    
    return insights
  }

  /**
   * Extract opportunities from transcript
   */
  private extractOpportunities(transcript: MeetingTranscript): MeetingInsight[] {
    const opportunityPatterns = [
      /(?:opportunity|potential|possibility|chance|could|might|if we)\s+([^.!?]+)/gi,
      /(?:upsell|cross-sell|expand|grow|scale)\s+([^.!?]+)/gi,
      /(?:partnership|collaboration|joint venture|alliance)\s+([^.!?]+)/gi
    ]
    
    const insights: MeetingInsight[] = []
    
    opportunityPatterns.forEach(pattern => {
      const matches = transcript.text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          insights.push({
            id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            meetingId: transcript.meetingId,
            userId: transcript.userId,
            type: 'opportunity_identified',
            title: 'Opportunity Identified',
            description: match.trim(),
            confidence: transcript.confidence * 0.8,
            priority: 'medium',
            category: 'opportunity',
            timestamp: transcript.timestamp,
            speaker: transcript.speaker,
            relatedEntities: transcript.entities,
            suggestedActions: ['Research opportunity', 'Create proposal', 'Schedule follow-up meeting'],
            isProcessed: false,
            createdAt: new Date()
          })
        })
      }
    })
    
    return insights
  }

  /**
   * Generate meeting summary
   */
  async generateSummary(meetingId: string, userId: string): Promise<MeetingSummary> {
    try {
      console.log(`[${this.serviceName}] Generating summary for meeting: ${meetingId}`)
      
      const transcripts = this.transcripts.get(meetingId) || []
      const insights = this.insights.get(meetingId) || []
      
      if (transcripts.length === 0) {
        throw new Error('No transcripts found for meeting')
      }

      // Calculate duration
      const startTime = Math.min(...transcripts.map(t => t.timestamp))
      const endTime = Math.max(...transcripts.map(t => t.timestamp))
      const duration = endTime - startTime

      // Extract participants
      const participants = this.extractParticipants(transcripts)

      // Generate summary
      const summary: MeetingSummary = {
        id: `summary-${meetingId}-${Date.now()}`,
        meetingId,
        userId,
        title: `Meeting Summary - ${new Date().toLocaleDateString()}`,
        summary: this.generateSummaryText(transcripts, insights),
        keyPoints: this.extractKeyPoints(transcripts, insights),
        actionItems: this.extractActionItemsFromInsights(insights),
        decisions: this.extractDecisionsFromInsights(insights),
        nextSteps: this.extractNextSteps(transcripts, insights),
        participants,
        duration,
        sentiment: this.calculateOverallSentiment(transcripts),
        confidence: this.calculateSummaryConfidence(transcripts, insights),
        topics: this.extractTopics(transcripts),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.summaries.set(meetingId, summary)
      console.log(`[${this.serviceName}] Summary generated for meeting: ${meetingId}`)
      
      return summary

    } catch (error) {
      console.error(`[${this.serviceName}] Error generating summary:`, error)
      throw this.handleError('generateSummary', error)
    }
  }

  /**
   * Extract participants from transcripts
   */
  private extractParticipants(transcripts: MeetingTranscript[]): Participant[] {
    const participantMap = new Map<string, {
      name: string
      speakingTime: number
      contribution: number
      sentiment: number
    }>()

    transcripts.forEach(transcript => {
      const existing = participantMap.get(transcript.speaker) || {
        name: transcript.speaker,
        speakingTime: 0,
        contribution: 0,
        sentiment: 0
      }

      existing.speakingTime += 1 // Mock duration
      existing.contribution += transcript.text.length
      existing.sentiment += transcript.sentiment === 'positive' ? 1 : transcript.sentiment === 'negative' ? -1 : 0

      participantMap.set(transcript.speaker, existing)
    })

    const totalSpeakingTime = Array.from(participantMap.values()).reduce((sum, p) => sum + p.speakingTime, 0)
    const totalContribution = Array.from(participantMap.values()).reduce((sum, p) => sum + p.contribution, 0)

    return Array.from(participantMap.values()).map(p => ({
      name: p.name,
      role: 'Participant', // Mock role
      organization: 'Unknown', // Mock organization
      speakingTime: p.speakingTime,
      contribution: p.contribution > totalContribution / participantMap.size ? 'high' : p.contribution > totalContribution / (participantMap.size * 2) ? 'medium' : 'low',
      sentiment: p.sentiment > 0 ? 'positive' : p.sentiment < 0 ? 'negative' : 'neutral'
    }))
  }

  /**
   * Generate summary text
   */
  private generateSummaryText(transcripts: MeetingTranscript[], insights: MeetingInsight[]): string {
    const actionItems = insights.filter(i => i.type === 'action_item').length
    const decisions = insights.filter(i => i.type === 'decision_made').length
    const concerns = insights.filter(i => i.type === 'concern_raised').length
    const opportunities = insights.filter(i => i.type === 'opportunity_identified').length

    return `Meeting summary: ${transcripts.length} transcript segments analyzed. Identified ${actionItems} action items, ${decisions} decisions, ${concerns} concerns, and ${opportunities} opportunities. Key discussion points included project timeline, budget considerations, and next steps.`
  }

  /**
   * Extract key points
   */
  private extractKeyPoints(transcripts: MeetingTranscript[], insights: MeetingInsight[]): string[] {
    const keyPoints: string[] = []
    
    // Add insights as key points
    insights.forEach(insight => {
      keyPoints.push(insight.description)
    })
    
    // Add high-confidence transcripts as key points
    transcripts
      .filter(t => t.confidence > 0.8)
      .slice(0, 5)
      .forEach(t => {
        keyPoints.push(t.text)
      })
    
    return keyPoints.slice(0, 10) // Limit to 10 key points
  }

  /**
   * Extract action items from insights
   */
  private extractActionItemsFromInsights(insights: MeetingInsight[]): ActionItem[] {
    return insights
      .filter(i => i.type === 'action_item')
      .map(insight => ({
        id: `action-${insight.id}`,
        text: insight.description,
        assignee: insight.speaker,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: insight.priority,
        status: 'pending' as const,
        createdAt: insight.createdAt,
        updatedAt: insight.createdAt
      }))
  }

  /**
   * Extract decisions from insights
   */
  private extractDecisionsFromInsights(insights: MeetingInsight[]): Decision[] {
    return insights
      .filter(i => i.type === 'decision_made')
      .map(insight => ({
        id: `decision-${insight.id}`,
        text: insight.description,
        decisionMaker: insight.speaker,
        rationale: 'Based on meeting discussion',
        impact: insight.priority,
        createdAt: insight.createdAt
      }))
  }

  /**
   * Extract next steps
   */
  private extractNextSteps(transcripts: MeetingTranscript[], insights: MeetingInsight[]): NextStep[] {
    const nextSteps: NextStep[] = []
    
    // Add action items as next steps
    insights
      .filter(i => i.type === 'action_item')
      .forEach(insight => {
        nextSteps.push({
          id: `nextstep-${insight.id}`,
          text: insight.description,
          owner: insight.speaker,
          timeline: '1 week',
          dependencies: [],
          createdAt: insight.createdAt
        })
      })
    
    return nextSteps
  }

  /**
   * Calculate overall sentiment
   */
  private calculateOverallSentiment(transcripts: MeetingTranscript[]): 'positive' | 'negative' | 'neutral' | 'mixed' {
    const sentiments = transcripts.map(t => t.sentiment)
    const positiveCount = sentiments.filter(s => s === 'positive').length
    const negativeCount = sentiments.filter(s => s === 'negative').length
    const neutralCount = sentiments.filter(s => s === 'neutral').length
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) return 'positive'
    if (negativeCount > positiveCount && negativeCount > neutralCount) return 'negative'
    if (neutralCount > positiveCount && neutralCount > negativeCount) return 'neutral'
    return 'mixed'
  }

  /**
   * Calculate summary confidence
   */
  private calculateSummaryConfidence(transcripts: MeetingTranscript[], insights: MeetingInsight[]): number {
    const transcriptConfidence = transcripts.reduce((sum, t) => sum + t.confidence, 0) / transcripts.length
    const insightConfidence = insights.reduce((sum, i) => sum + i.confidence, 0) / Math.max(insights.length, 1)
    
    return (transcriptConfidence + insightConfidence) / 2
  }

  /**
   * Extract topics
   */
  private extractTopics(transcripts: MeetingTranscript[]): Topic[] {
    const topicMap = new Map<string, {
      duration: number
      importance: number
      sentiment: number
      keywords: Set<string>
    }>()

    // Mock topic extraction - in production, this would use topic modeling
    const topics = ['Project Planning', 'Budget Discussion', 'Timeline Review', 'Resource Allocation', 'Risk Assessment']
    
    topics.forEach(topic => {
      topicMap.set(topic, {
        duration: Math.random() * 1000,
        importance: Math.random(),
        sentiment: Math.random() - 0.5,
        keywords: new Set(['project', 'budget', 'timeline', 'resource', 'risk'])
      })
    })

    return Array.from(topicMap.entries()).map(([name, data]) => ({
      name,
      duration: data.duration,
      importance: data.importance > 0.7 ? 'critical' : data.importance > 0.4 ? 'high' : data.importance > 0.2 ? 'medium' : 'low',
      sentiment: data.sentiment > 0.2 ? 'positive' : data.sentiment < -0.2 ? 'negative' : 'neutral',
      keywords: Array.from(data.keywords)
    }))
  }

  /**
   * Get meeting insights
   */
  async getInsights(meetingId: string, userId: string): Promise<MeetingInsight[]> {
    try {
      const insights = this.insights.get(meetingId) || []
      return insights.filter(insight => insight.userId === userId)
    } catch (error) {
      console.error(`[${this.serviceName}] Error getting insights:`, error)
      throw this.handleError('getInsights', error)
    }
  }

  /**
   * Get meeting summary
   */
  async getSummary(meetingId: string, userId: string): Promise<MeetingSummary | null> {
    try {
      const summary = this.summaries.get(meetingId)
      if (!summary || summary.userId !== userId) {
        return null
      }
      return summary
    } catch (error) {
      console.error(`[${this.serviceName}] Error getting summary:`, error)
      throw this.handleError('getSummary', error)
    }
  }

  /**
   * Generate meeting analytics
   */
  async generateAnalytics(meetingId: string, userId: string): Promise<MeetingAnalytics> {
    try {
      console.log(`[${this.serviceName}] Generating analytics for meeting: ${meetingId}`)
      
      const transcripts = this.transcripts.get(meetingId) || []
      const insights = this.insights.get(meetingId) || []
      
      if (transcripts.length === 0) {
        throw new Error('No transcripts found for meeting')
      }

      const startTime = Math.min(...transcripts.map(t => t.timestamp))
      const endTime = Math.max(...transcripts.map(t => t.timestamp))
      const totalDuration = endTime - startTime

      // Calculate speaking time by participant
      const speakingTime: Record<string, number> = {}
      transcripts.forEach(t => {
        speakingTime[t.speaker] = (speakingTime[t.speaker] || 0) + 1
      })

      // Generate sentiment trend
      const sentimentTrend = transcripts.map(t => ({
        timestamp: t.timestamp,
        sentiment: t.sentiment,
        confidence: t.confidence
      }))

      // Calculate topic distribution
      const topics = this.extractTopics(transcripts)
      const topicDistribution = topics.map(topic => ({
        topic: topic.name,
        duration: topic.duration,
        percentage: (topic.duration / totalDuration) * 100
      }))

      // Identify key moments
      const keyMoments = insights.map(insight => ({
        timestamp: insight.timestamp,
        type: insight.type as 'insight' | 'decision' | 'action_item' | 'concern',
        description: insight.description,
        importance: insight.priority === 'critical' ? 1 : insight.priority === 'high' ? 0.8 : insight.priority === 'medium' ? 0.6 : 0.4
      }))

      // Calculate engagement score
      const engagementScore = this.calculateEngagementScore(transcripts, insights)

      // Calculate productivity score
      const productivityScore = this.calculateProductivityScore(insights, totalDuration)

      const analytics: MeetingAnalytics = {
        meetingId,
        userId,
        totalDuration,
        speakingTime,
        sentimentTrend,
        topicDistribution,
        keyMoments,
        engagementScore,
        productivityScore,
        followUpRequired: insights.some(i => i.type === 'follow_up_required'),
        createdAt: new Date()
      }

      this.analytics.set(meetingId, analytics)
      console.log(`[${this.serviceName}] Analytics generated for meeting: ${meetingId}`)
      
      return analytics

    } catch (error) {
      console.error(`[${this.serviceName}] Error generating analytics:`, error)
      throw this.handleError('generateAnalytics', error)
    }
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(transcripts: MeetingTranscript[], insights: MeetingInsight[]): number {
    const totalWords = transcripts.reduce((sum, t) => sum + t.text.split(' ').length, 0)
    const insightCount = insights.length
    const participantCount = new Set(transcripts.map(t => t.speaker)).size
    
    // Mock calculation - in production, this would be more sophisticated
    const wordScore = Math.min(totalWords / 1000, 1) * 0.4
    const insightScore = Math.min(insightCount / 10, 1) * 0.3
    const participantScore = Math.min(participantCount / 5, 1) * 0.3
    
    return (wordScore + insightScore + participantScore) * 100
  }

  /**
   * Calculate productivity score
   */
  private calculateProductivityScore(insights: MeetingInsight[], duration: number): number {
    const actionItems = insights.filter(i => i.type === 'action_item').length
    const decisions = insights.filter(i => i.type === 'decision_made').length
    const concerns = insights.filter(i => i.type === 'concern_raised').length
    
    // Mock calculation - in production, this would be more sophisticated
    const actionScore = Math.min(actionItems / 5, 1) * 0.4
    const decisionScore = Math.min(decisions / 3, 1) * 0.3
    const concernScore = Math.min(concerns / 2, 1) * 0.2
    const durationScore = Math.min(duration / 3600000, 1) * 0.1 // 1 hour = 100%
    
    return (actionScore + decisionScore + concernScore + durationScore) * 100
  }

  /**
   * Stop transcription
   */
  async stopTranscription(sessionId: string): Promise<{ success: boolean }> {
    try {
      console.log(`[${this.serviceName}] Stopping transcription for session: ${sessionId}`)
      
      const activeMeeting = this.activeMeetings.get(sessionId)
      if (!activeMeeting) {
        throw new Error('Active meeting not found')
      }

      this.activeMeetings.delete(sessionId)
      console.log(`[${this.serviceName}] Transcription stopped for session: ${sessionId}`)
      
      return { success: true }

    } catch (error) {
      console.error(`[${this.serviceName}] Error stopping transcription:`, error)
      throw this.handleError('stopTranscription', error)
    }
  }
}

// Global service instance
let meetingIntelligenceService: MeetingIntelligenceService | null = null

export const getMeetingIntelligenceService = (): MeetingIntelligenceService => {
  if (!meetingIntelligenceService) {
    meetingIntelligenceService = new MeetingIntelligenceService()
  }
  return meetingIntelligenceService
}

export const destroyMeetingIntelligenceService = (): void => {
  meetingIntelligenceService = null
}
