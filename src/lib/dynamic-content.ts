export interface ContentTemplate {
  id: string
  userId: string
  name: string
  description: string
  category: 'EMAIL' | 'LINKEDIN' | 'PROPOSAL' | 'PRESENTATION' | 'FOLLOW_UP' | 'MEETING_INVITE' | 'THANK_YOU' | 'OBJECTION_HANDLING'
  type: 'TEMPLATE' | 'DYNAMIC' | 'ADAPTIVE'
  content: string
  variables: ContentVariable[]
  personalizationRules: PersonalizationRule[]
  performance: {
    usageCount: number
    successRate: number
    avgResponseTime: number
    lastUsed: Date
  }
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ContentVariable {
  id: string
  name: string
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT' | 'DYNAMIC'
  description: string
  defaultValue?: string
  options?: string[] // For SELECT type
  required: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  dynamicSource?: {
    type: 'CRM_FIELD' | 'BEHAVIORAL_DATA' | 'PERFORMANCE_METRIC' | 'CONTEXT_DATA'
    field: string
    fallback?: string
  }
}

export interface PersonalizationRule {
  id: string
  name: string
  condition: {
    field: string
    operator: 'EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN'
    value: string | number | string[]
  }
  action: {
    type: 'REPLACE_TEXT' | 'ADD_SECTION' | 'REMOVE_SECTION' | 'MODIFY_TONE' | 'ADD_CALL_TO_ACTION'
    content: string
    position?: number
  }
  priority: number
  isActive: boolean
}

export interface ContentGenerationRequest {
  userId: string
  templateId?: string
  category: string
  context: {
    recipient?: {
      name: string
      company: string
      role: string
      industry: string
      previousInteractions?: number
    }
    deal?: {
      stage: string
      value: number
      closeDate?: Date
      competitors?: string[]
    }
    meeting?: {
      type: string
      duration: number
      participants: string[]
      agenda?: string[]
    }
    campaign?: {
      name: string
      objective: string
      targetAudience: string
    }
  }
  personalizationLevel: 'BASIC' | 'ADVANCED' | 'MAXIMUM'
  tone: 'PROFESSIONAL' | 'FRIENDLY' | 'URGENT' | 'CONVERSATIONAL' | 'FORMAL'
  length: 'SHORT' | 'MEDIUM' | 'LONG'
  includeCallToAction: boolean
  customVariables?: Record<string, string>
}

export interface GeneratedContent {
  id: string
  content: string
  subject?: string
  preview: string
  personalizationApplied: {
    rules: string[]
    variables: Record<string, string>
    tone: string
    length: string
  }
  performance: {
    estimatedEngagement: number
    confidence: number
    suggestions: string[]
  }
  alternatives: {
    id: string
    content: string
    variation: string
    confidence: number
  }[]
  metadata: {
    wordCount: number
    readingTime: number
    complexity: 'LOW' | 'MEDIUM' | 'HIGH'
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  }
  createdAt: Date
}

export interface ContentCampaign {
  id: string
  userId: string
  name: string
  description: string
  type: 'EMAIL_SEQUENCE' | 'LINKEDIN_OUTREACH' | 'FOLLOW_UP_SERIES' | 'PROPOSAL_SEQUENCE'
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'
  templates: {
    templateId: string
    order: number
    delay: number // hours
    conditions?: PersonalizationRule[]
  }[]
  performance: {
    totalSent: number
    openRate: number
    responseRate: number
    conversionRate: number
    avgResponseTime: number
  }
  schedule: {
    startDate: Date
    endDate?: Date
    timezone: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
  }
  targetAudience: {
    criteria: Record<string, unknown>
    size: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface ContentAnalytics {
  userId: string
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'
  metrics: {
    totalGenerated: number
    templatesUsed: number
    avgEngagement: number
    topPerformingTemplates: {
      templateId: string
      name: string
      usageCount: number
      successRate: number
    }[]
    categoryBreakdown: {
      category: string
      count: number
      avgPerformance: number
    }[]
    personalizationImpact: {
      basic: number
      advanced: number
      maximum: number
    }
    tonePerformance: {
      tone: string
      avgEngagement: number
      usageCount: number
    }[]
  }
  trends: {
    generationTrend: 'INCREASING' | 'STABLE' | 'DECREASING'
    performanceTrend: 'IMPROVING' | 'STABLE' | 'DECLINING'
    popularCategories: string[]
    emergingPatterns: string[]
  }
  recommendations: {
    type: 'TEMPLATE_OPTIMIZATION' | 'PERSONALIZATION_IMPROVEMENT' | 'TONE_ADJUSTMENT' | 'CONTENT_STRATEGY'
    title: string
    description: string
    impact: 'LOW' | 'MEDIUM' | 'HIGH'
    action: string
  }[]
}

export class DynamicContentService {
  private templates: Map<string, ContentTemplate[]> = new Map()
  private generatedContent: Map<string, GeneratedContent[]> = new Map()
  private campaigns: Map<string, ContentCampaign[]> = new Map()
  private analytics: Map<string, ContentAnalytics> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const userId = 'user-1'
    
    // Mock content templates
    this.templates.set(userId, [
      {
        id: 'template-1',
        userId,
        name: 'Discovery Call Follow-up',
        description: 'Professional follow-up after discovery call with next steps',
        category: 'FOLLOW_UP',
        type: 'DYNAMIC',
        content: `Hi {{recipient_name}},

Thank you for taking the time to speak with me about {{company_name}}'s {{pain_point}} challenges. I found our conversation about {{discussion_topic}} particularly insightful.

Based on what we discussed, I believe our {{solution_name}} could help {{company_name}} {{expected_outcome}}. Here are the next steps I'd recommend:

1. {{next_step_1}}
2. {{next_step_2}}
3. {{next_step_3}}

I'd love to schedule a {{meeting_type}} to dive deeper into how we can help {{company_name}} achieve {{goal}}. Would {{preferred_time}} work for you?

Best regards,
{{sender_name}}`,
        variables: [
          {
            id: 'var-1',
            name: 'recipient_name',
            type: 'TEXT',
            description: 'Recipient\'s first name',
            required: true,
            dynamicSource: {
              type: 'CRM_FIELD',
              field: 'contact.firstName',
              fallback: 'there'
            }
          },
          {
            id: 'var-2',
            name: 'company_name',
            type: 'TEXT',
            description: 'Company name',
            required: true,
            dynamicSource: {
              type: 'CRM_FIELD',
              field: 'account.name',
              fallback: 'your company'
            }
          },
          {
            id: 'var-3',
            name: 'pain_point',
            type: 'TEXT',
            description: 'Identified pain point',
            required: true,
            dynamicSource: {
              type: 'CONTEXT_DATA',
              field: 'meeting.insights.painPoints[0]',
              fallback: 'current challenges'
            }
          }
        ],
        personalizationRules: [
          {
            id: 'rule-1',
            name: 'Add urgency for high-value deals',
            condition: {
              field: 'deal.value',
              operator: 'GREATER_THAN',
              value: 50000
            },
            action: {
              type: 'ADD_SECTION',
              content: '\n\nGiven the significant impact this could have on your business, I\'d recommend moving quickly to capitalize on this opportunity.',
              position: 3
            },
            priority: 1,
            isActive: true
          }
        ],
        performance: {
          usageCount: 45,
          successRate: 0.78,
          avgResponseTime: 2.5,
          lastUsed: new Date()
        },
        tags: ['discovery', 'follow-up', 'professional'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    // Mock generated content
    this.generatedContent.set(userId, [
      {
        id: 'gen-1',
        content: `Hi Sarah,

Thank you for taking the time to speak with me about Acme Corp's lead generation challenges. I found our conversation about your current marketing automation setup particularly insightful.

Based on what we discussed, I believe our AI-powered lead scoring system could help Acme Corp increase qualified leads by 40%. Here are the next steps I'd recommend:

1. Technical assessment of your current system
2. Custom integration planning
3. Pilot program with 100 leads

I'd love to schedule a technical demo to dive deeper into how we can help Acme Corp achieve your Q4 revenue goals. Would next Tuesday at 2 PM work for you?

Best regards,
John`,
        subject: 'Follow-up: Acme Corp Lead Generation Discussion',
        preview: 'Thank you for taking the time to speak with me about Acme Corp\'s lead generation challenges...',
        personalizationApplied: {
          rules: ['Add urgency for high-value deals'],
          variables: {
            recipient_name: 'Sarah',
            company_name: 'Acme Corp',
            pain_point: 'lead generation challenges'
          },
          tone: 'PROFESSIONAL',
          length: 'MEDIUM'
        },
        performance: {
          estimatedEngagement: 0.85,
          confidence: 0.92,
          suggestions: [
            'Consider adding a specific ROI example',
            'Include a case study link',
            'Add a calendar booking link'
          ]
        },
        alternatives: [
          {
            id: 'alt-1',
            content: 'Shorter, more direct version...',
            variation: 'CONCISE',
            confidence: 0.88
          }
        ],
        metadata: {
          wordCount: 156,
          readingTime: 1.2,
          complexity: 'MEDIUM',
          sentiment: 'POSITIVE'
        },
        createdAt: new Date()
      }
    ])
  }

  /**
   * Generate personalized content based on request
   */
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    // Mock AI-powered content generation
    const template = this.templates.get(request.userId)?.find(t => t.id === request.templateId) || 
                    this.templates.get(request.userId)?.find(t => t.category === request.category)
    
    if (!template) {
      throw new Error('Template not found')
    }

    // Apply personalization rules
    let content = template.content
    const appliedRules: string[] = []
    const appliedVariables: Record<string, string> = {}

    // Replace variables
    for (const variable of template.variables) {
      let value = request.customVariables?.[variable.name]
      
      if (!value && variable.dynamicSource) {
        value = this.getDynamicValue(variable.dynamicSource, request.context) || variable.defaultValue
      }
      
      if (value) {
        content = content.replace(new RegExp(`{{${variable.name}}}`, 'g'), value)
        appliedVariables[variable.name] = value
      }
    }

    // Apply personalization rules
    for (const rule of template.personalizationRules) {
      if (this.evaluateCondition(rule.condition, request.context)) {
        content = this.applyAction(rule.action, content)
        appliedRules.push(rule.name)
      }
    }

    // Generate alternatives
    const alternatives = this.generateAlternatives(content, request)

    const generatedContent: GeneratedContent = {
      id: `gen-${Date.now()}`,
      content,
      subject: this.generateSubject(content, request),
      preview: content.substring(0, 150) + '...',
      personalizationApplied: {
        rules: appliedRules,
        variables: appliedVariables,
        tone: request.tone,
        length: request.length
      },
      performance: {
        estimatedEngagement: this.calculateEngagementScore(content, request),
        confidence: 0.85,
        suggestions: this.generateSuggestions(content, request)
      },
      alternatives,
      metadata: {
        wordCount: content.split(' ').length,
        readingTime: Math.ceil(content.split(' ').length / 200),
        complexity: this.calculateComplexity(content),
        sentiment: this.analyzeSentiment(content)
      },
      createdAt: new Date()
    }

    // Store generated content
    const userContent = this.generatedContent.get(request.userId) || []
    userContent.push(generatedContent)
    this.generatedContent.set(request.userId, userContent)

    return generatedContent
  }

  /**
   * Get content templates for a user
   */
  async getTemplates(userId: string, category?: string): Promise<ContentTemplate[]> {
    const templates = this.templates.get(userId) || []
    return category ? templates.filter(t => t.category === category) : templates
  }

  /**
   * Create a new content template
   */
  async createTemplate(userId: string, template: Omit<ContentTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'performance'>): Promise<ContentTemplate> {
    const newTemplate: ContentTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      userId,
      performance: {
        usageCount: 0,
        successRate: 0,
        avgResponseTime: 0,
        lastUsed: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const templates = this.templates.get(userId) || []
    templates.push(newTemplate)
    this.templates.set(userId, templates)

    return newTemplate
  }

  /**
   * Get generated content history
   */
  async getGeneratedContent(userId: string, limit?: number): Promise<GeneratedContent[]> {
    const content = this.generatedContent.get(userId) || []
    return limit ? content.slice(-limit) : content
  }

  /**
   * Create a content campaign
   */
  async createCampaign(userId: string, campaign: Omit<ContentCampaign, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'performance'>): Promise<ContentCampaign> {
    const newCampaign: ContentCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      userId,
      performance: {
        totalSent: 0,
        openRate: 0,
        responseRate: 0,
        conversionRate: 0,
        avgResponseTime: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const campaigns = this.campaigns.get(userId) || []
    campaigns.push(newCampaign)
    this.campaigns.set(userId, campaigns)

    return newCampaign
  }

  /**
   * Get content analytics
   */
  async getContentAnalytics(userId: string, period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'): Promise<ContentAnalytics> {
    // Mock analytics data
    const analytics: ContentAnalytics = {
      userId,
      period,
      metrics: {
        totalGenerated: 156,
        templatesUsed: 12,
        avgEngagement: 0.78,
        topPerformingTemplates: [
          {
            templateId: 'template-1',
            name: 'Discovery Call Follow-up',
            usageCount: 45,
            successRate: 0.78
          }
        ],
        categoryBreakdown: [
          { category: 'FOLLOW_UP', count: 45, avgPerformance: 0.78 },
          { category: 'EMAIL', count: 32, avgPerformance: 0.72 },
          { category: 'LINKEDIN', count: 28, avgPerformance: 0.65 }
        ],
        personalizationImpact: {
          basic: 0.65,
          advanced: 0.78,
          maximum: 0.85
        },
        tonePerformance: [
          { tone: 'PROFESSIONAL', avgEngagement: 0.78, usageCount: 45 },
          { tone: 'FRIENDLY', avgEngagement: 0.72, usageCount: 32 }
        ]
      },
      trends: {
        generationTrend: 'INCREASING',
        performanceTrend: 'IMPROVING',
        popularCategories: ['FOLLOW_UP', 'EMAIL', 'LINKEDIN'],
        emergingPatterns: ['Shorter content performs better', 'Personalization increases engagement']
      },
      recommendations: [
        {
          type: 'TEMPLATE_OPTIMIZATION',
          title: 'Optimize Discovery Follow-up Template',
          description: 'Your discovery follow-up template has high usage but could benefit from more personalization',
          impact: 'HIGH',
          action: 'Add 2-3 more dynamic variables based on meeting insights'
        }
      ]
    }

    this.analytics.set(userId, analytics)
    return analytics
  }

  private getDynamicValue(source: ContentVariable['dynamicSource'], context: ContentGenerationRequest['context']): string | undefined {
    if (!source) return undefined

    switch (source.type) {
      case 'CRM_FIELD':
        // Mock CRM field lookup
        return 'Mock Value'
      case 'BEHAVIORAL_DATA':
        // Mock behavioral data lookup
        return 'Behavioral Insight'
      case 'PERFORMANCE_METRIC':
        // Mock performance metric lookup
        return '85%'
      case 'CONTEXT_DATA':
        // Extract from context
        return this.extractFromContext(source.field, context)
      default:
        return source.fallback
    }
  }

  private extractFromContext(field: string, context: ContentGenerationRequest['context']): string | undefined {
    const parts = field.split('.')
    let current: unknown = context

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }

    return current?.toString()
  }

  private evaluateCondition(condition: PersonalizationRule['condition'], context: ContentGenerationRequest['context']): boolean {
    const value = this.extractFromContext(condition.field, context)
    if (value === undefined) return false

    switch (condition.operator) {
      case 'EQUALS':
        return value === condition.value
      case 'CONTAINS':
        return value.includes(condition.value as string)
      case 'GREATER_THAN':
        return Number(value) > Number(condition.value)
      case 'LESS_THAN':
        return Number(value) < Number(condition.value)
      case 'IN':
        return (condition.value as string[]).includes(value)
      case 'NOT_IN':
        return !(condition.value as string[]).includes(value)
      default:
        return false
    }
  }

  private applyAction(action: PersonalizationRule['action'], content: string): string {
    switch (action.type) {
      case 'REPLACE_TEXT':
        return content.replace(action.content, action.content)
      case 'ADD_SECTION':
        return action.position ? 
          content.slice(0, action.position) + action.content + content.slice(action.position) :
          content + action.content
      case 'REMOVE_SECTION':
        return content.replace(action.content, '')
      case 'MODIFY_TONE':
        // Mock tone modification
        return content
      case 'ADD_CALL_TO_ACTION':
        return content + '\n\n' + action.content
      default:
        return content
    }
  }

  private generateAlternatives(content: string, request: ContentGenerationRequest): GeneratedContent['alternatives'] {
    return [
      {
        id: 'alt-1',
        content: this.createConciseVersion(content),
        variation: 'CONCISE',
        confidence: 0.88
      },
      {
        id: 'alt-2',
        content: this.createDetailedVersion(content),
        variation: 'DETAILED',
        confidence: 0.82
      }
    ]
  }

  private createConciseVersion(content: string): string {
    // Mock concise version generation
    return content.split('\n').slice(0, 3).join('\n') + '\n\n[Concise version - see full content above]'
  }

  private createDetailedVersion(content: string): string {
    // Mock detailed version generation
    return content + '\n\n[Additional details and context would be added here]'
  }

  private generateSubject(content: string, request: ContentGenerationRequest): string {
    // Mock subject generation
    const firstLine = content.split('\n')[0]
    return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine
  }

  private calculateEngagementScore(content: string, request: ContentGenerationRequest): number {
    // Mock engagement score calculation
    let score = 0.5
    
    // Personalization bonus
    if (request.personalizationLevel === 'ADVANCED') score += 0.1
    if (request.personalizationLevel === 'MAXIMUM') score += 0.2
    
    // Length bonus
    if (request.length === 'MEDIUM') score += 0.05
    if (request.length === 'LONG') score += 0.1
    
    // Call to action bonus
    if (request.includeCallToAction) score += 0.1
    
    return Math.min(1, score)
  }

  private generateSuggestions(content: string, request: ContentGenerationRequest): string[] {
    const suggestions: string[] = []
    
    if (content.length < 100) {
      suggestions.push('Consider adding more context to increase engagement')
    }
    
    if (!content.includes('?')) {
      suggestions.push('Add a question to encourage response')
    }
    
    if (!content.includes('http')) {
      suggestions.push('Include relevant links or resources')
    }
    
    return suggestions
  }

  private calculateComplexity(content: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const wordCount = content.split(' ').length
    const avgWordLength = content.split(' ').reduce((sum, word) => sum + word.length, 0) / wordCount
    
    if (wordCount < 100 && avgWordLength < 5) return 'LOW'
    if (wordCount < 200 && avgWordLength < 6) return 'MEDIUM'
    return 'HIGH'
  }

  private analyzeSentiment(content: string): 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' {
    // Mock sentiment analysis
    const positiveWords = ['thank', 'great', 'excellent', 'help', 'success', 'achieve']
    const negativeWords = ['problem', 'issue', 'challenge', 'difficult', 'struggle']
    
    const positiveCount = positiveWords.filter(word => content.toLowerCase().includes(word)).length
    const negativeCount = negativeWords.filter(word => content.toLowerCase().includes(word)).length
    
    if (positiveCount > negativeCount) return 'POSITIVE'
    if (negativeCount > positiveCount) return 'NEGATIVE'
    return 'NEUTRAL'
  }
}

export const dynamicContentService = new DynamicContentService()
