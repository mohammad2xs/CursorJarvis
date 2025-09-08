export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  title: string
  industry: string
  location: {
    city: string
    state: string
    country: string
  }
  avatar?: string
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'LEAD' | 'CUSTOMER' | 'CHURNED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  tags: string[]
  notes: string
  lastContact: Date
  nextFollowUp?: Date
  assignedTo: string
  source: 'WEBSITE' | 'REFERRAL' | 'LINKEDIN' | 'COLD_CALL' | 'EMAIL' | 'EVENT' | 'OTHER'
  dealValue?: number
  dealStage?: 'PROSPECTING' | 'QUALIFYING' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
  communicationPreferences: {
    preferredChannel: 'EMAIL' | 'PHONE' | 'SMS' | 'LINKEDIN' | 'WHATSAPP'
    bestTimeToContact: string
    timezone: string
    language: string
  }
  socialProfiles: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationChannel {
  id: string
  name: string
  type: 'EMAIL' | 'PHONE' | 'SMS' | 'LINKEDIN' | 'WHATSAPP' | 'SLACK' | 'TEAMS' | 'ZOOM'
  icon: string
  color: string
  isActive: boolean
  settings: {
    autoSync: boolean
    notifications: boolean
    archiveAfter: number // days
  }
}

export interface Communication {
  id: string
  clientId: string
  channel: string
  type: 'INBOUND' | 'OUTBOUND'
  direction: 'SENT' | 'RECEIVED'
  subject?: string
  content: string
  status: 'SENT' | 'DELIVERED' | 'READ' | 'REPLIED' | 'FAILED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  tags: string[]
  attachments: {
    id: string
    name: string
    type: string
    size: number
    url: string
  }[]
  metadata: {
    messageId?: string
    threadId?: string
    replyTo?: string
    cc?: string[]
    bcc?: string[]
    sentAt: Date
    readAt?: Date
    repliedAt?: Date
  }
  aiInsights: {
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
    intent: 'INQUIRY' | 'COMPLAINT' | 'PRAISE' | 'REQUEST' | 'FOLLOW_UP'
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    suggestedResponse?: string
    suggestedActions: string[]
    confidence: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationThread {
  id: string
  clientId: string
  subject: string
  channel: string
  status: 'ACTIVE' | 'RESOLVED' | 'ARCHIVED'
  participants: string[]
  communications: Communication[]
  summary: string
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationTemplate {
  id: string
  name: string
  description: string
  category: 'GREETING' | 'FOLLOW_UP' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSING' | 'SUPPORT' | 'CUSTOM'
  channel: string
  subject: string
  content: string
  variables: {
    name: string
    type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN'
    required: boolean
    defaultValue?: string
  }[]
  isActive: boolean
  usageCount: number
  successRate: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationCampaign {
  id: string
  name: string
  description: string
  type: 'EMAIL' | 'SMS' | 'LINKEDIN' | 'MULTI_CHANNEL'
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  targetAudience: {
    criteria: {
      industry?: string[]
      companySize?: string[]
      location?: string[]
      tags?: string[]
      lastContact?: {
        before?: Date
        after?: Date
      }
    }
    clientIds: string[]
  }
  content: {
    subject: string
    message: string
    templateId?: string
  }
  schedule: {
    startDate: Date
    endDate?: Date
    timezone: string
    frequency: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  }
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    replied: number
    unsubscribed: number
    bounceRate: number
    openRate: number
    clickRate: number
    replyRate: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationHub {
  clients: Client[]
  communications: Communication[]
  threads: CommunicationThread[]
  templates: CommunicationTemplate[]
  campaigns: CommunicationCampaign[]
  channels: CommunicationChannel[]
  summary: {
    totalClients: number
    activeClients: number
    totalCommunications: number
    unreadCommunications: number
    pendingFollowUps: number
    activeCampaigns: number
    responseRate: number
    averageResponseTime: number
  }
}

export class ClientCommunicationService {
  private clients: Map<string, Client[]> = new Map()
  private communications: Map<string, Communication[]> = new Map()
  private threads: Map<string, CommunicationThread[]> = new Map()
  private templates: Map<string, CommunicationTemplate[]> = new Map()
  private campaigns: Map<string, CommunicationCampaign[]> = new Map()
  private channels: CommunicationChannel[] = []

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const userId = 'user-1'
    
    // Mock communication channels
    this.channels = [
      {
        id: 'email',
        name: 'Email',
        type: 'EMAIL',
        icon: 'Mail',
        color: '#3B82F6',
        isActive: true,
        settings: {
          autoSync: true,
          notifications: true,
          archiveAfter: 365
        }
      },
      {
        id: 'phone',
        name: 'Phone',
        type: 'PHONE',
        icon: 'Phone',
        color: '#10B981',
        isActive: true,
        settings: {
          autoSync: false,
          notifications: true,
          archiveAfter: 90
        }
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        type: 'LINKEDIN',
        icon: 'Linkedin',
        color: '#0077B5',
        isActive: true,
        settings: {
          autoSync: true,
          notifications: true,
          archiveAfter: 180
        }
      },
      {
        id: 'sms',
        name: 'SMS',
        type: 'SMS',
        icon: 'MessageSquare',
        color: '#8B5CF6',
        isActive: true,
        settings: {
          autoSync: true,
          notifications: true,
          archiveAfter: 30
        }
      }
    ]

    // Mock clients
    this.clients.set(userId, [
      {
        id: 'client-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@acmecorp.com',
        phone: '+1-555-0123',
        company: 'Acme Corp',
        title: 'VP of Sales',
        industry: 'Technology',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        status: 'CUSTOMER',
        priority: 'HIGH',
        tags: ['enterprise', 'decision-maker', 'hot-lead'],
        notes: 'Interested in enterprise solution. Budget approved for Q4.',
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextFollowUp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedTo: userId,
        source: 'LINKEDIN',
        dealValue: 150000,
        dealStage: 'NEGOTIATION',
        communicationPreferences: {
          preferredChannel: 'EMAIL',
          bestTimeToContact: '10:00-16:00',
          timezone: 'America/Los_Angeles',
          language: 'en'
        },
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          twitter: 'https://twitter.com/sarahjohnson'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'client-2',
        name: 'Mike Chen',
        email: 'mike.chen@techstartup.io',
        phone: '+1-555-0456',
        company: 'TechStartup Inc',
        title: 'CTO',
        industry: 'Technology',
        location: {
          city: 'Austin',
          state: 'TX',
          country: 'USA'
        },
        status: 'LEAD',
        priority: 'MEDIUM',
        tags: ['startup', 'technical', 'budget-conscious'],
        notes: 'Technical evaluation in progress. Needs to see ROI data.',
        lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: userId,
        source: 'WEBSITE',
        dealValue: 75000,
        dealStage: 'PROPOSAL',
        communicationPreferences: {
          preferredChannel: 'PHONE',
          bestTimeToContact: '14:00-18:00',
          timezone: 'America/Chicago',
          language: 'en'
        },
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/mikechen'
        },
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date()
      }
    ])

    // Mock communications
    this.communications.set(userId, [
      {
        id: 'comm-1',
        clientId: 'client-1',
        channel: 'email',
        type: 'OUTBOUND',
        direction: 'SENT',
        subject: 'Follow-up on Enterprise Proposal',
        content: 'Hi Sarah,\n\nThank you for the productive meeting yesterday. I\'ve attached the detailed proposal for the enterprise solution we discussed.\n\nKey highlights:\n- 30% increase in sales efficiency\n- ROI within 6 months\n- 24/7 support included\n\nI\'d love to schedule a follow-up call to discuss any questions you might have.\n\nBest regards,\nJohn',
        status: 'READ',
        priority: 'HIGH',
        tags: ['proposal', 'follow-up', 'enterprise'],
        attachments: [
          {
            id: 'att-1',
            name: 'Enterprise_Proposal_Q4_2024.pdf',
            type: 'application/pdf',
            size: 2048576,
            url: '/attachments/enterprise-proposal.pdf'
          }
        ],
        metadata: {
          messageId: 'msg-123456',
          threadId: 'thread-789',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        aiInsights: {
          sentiment: 'POSITIVE',
          intent: 'FOLLOW_UP',
          urgency: 'MEDIUM',
          suggestedResponse: 'Thank you for the proposal. I\'ll review it and get back to you by Friday.',
          suggestedActions: [
            'Schedule follow-up call',
            'Send additional case studies',
            'Prepare ROI calculator'
          ],
          confidence: 0.85
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'comm-2',
        clientId: 'client-1',
        channel: 'email',
        type: 'INBOUND',
        direction: 'RECEIVED',
        subject: 'Re: Follow-up on Enterprise Proposal',
        content: 'Hi John,\n\nThanks for the detailed proposal. I\'ve shared it with our team and we\'re very interested.\n\nA few questions:\n1. Can we customize the reporting dashboard?\n2. What\'s the implementation timeline?\n3. Do you offer training for our team?\n\nLet\'s schedule a call for Friday at 2 PM to discuss these points.\n\nBest,\nSarah',
        status: 'REPLIED',
        priority: 'HIGH',
        tags: ['response', 'questions', 'meeting-request'],
        attachments: [],
        metadata: {
          messageId: 'msg-123457',
          threadId: 'thread-789',
          replyTo: 'msg-123456',
          sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          repliedAt: new Date()
        },
        aiInsights: {
          sentiment: 'POSITIVE',
          intent: 'INQUIRY',
          urgency: 'HIGH',
          suggestedResponse: 'Great questions! I\'ll prepare detailed answers and send you a calendar invite for Friday at 2 PM.',
          suggestedActions: [
            'Prepare customization options',
            'Create implementation timeline',
            'Schedule meeting for Friday 2 PM',
            'Prepare training materials'
          ],
          confidence: 0.92
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ])

    // Mock templates
    this.templates.set(userId, [
      {
        id: 'template-1',
        name: 'Initial Outreach',
        description: 'Professional first contact email',
        category: 'GREETING',
        channel: 'email',
        subject: 'Introduction from {{company_name}}',
        content: 'Hi {{client_name}},\n\nI hope this email finds you well. I\'m {{sender_name}} from {{company_name}}, and I wanted to reach out because I noticed {{company_name}} is in the {{industry}} space.\n\nWe\'ve helped similar companies like {{similar_company}} achieve {{benefit}}.\n\nWould you be interested in a brief 15-minute call to discuss how we might be able to help {{company_name}}?\n\nBest regards,\n{{sender_name}}',
        variables: [
          { name: 'client_name', type: 'TEXT', required: true },
          { name: 'company_name', type: 'TEXT', required: true },
          { name: 'sender_name', type: 'TEXT', required: true },
          { name: 'industry', type: 'TEXT', required: true },
          { name: 'similar_company', type: 'TEXT', required: false },
          { name: 'benefit', type: 'TEXT', required: true }
        ],
        isActive: true,
        usageCount: 45,
        successRate: 0.78,
        createdBy: userId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ])

    // Mock campaigns
    this.campaigns.set(userId, [
      {
        id: 'campaign-1',
        name: 'Q4 Enterprise Outreach',
        description: 'Targeted outreach to enterprise prospects for Q4',
        type: 'EMAIL',
        status: 'RUNNING',
        targetAudience: {
          criteria: {
            industry: ['Technology', 'Finance'],
            companySize: ['Enterprise'],
            tags: ['enterprise', 'decision-maker']
          },
          clientIds: ['client-1']
        },
        content: {
          subject: 'Transform Your Sales Process with AI',
          message: 'Hi {{client_name}},\n\nI wanted to share how {{company_name}} can help you achieve 30% higher sales efficiency...',
          templateId: 'template-1'
        },
        schedule: {
          startDate: new Date('2024-10-01'),
          endDate: new Date('2024-12-31'),
          timezone: 'America/New_York',
          frequency: 'WEEKLY'
        },
        metrics: {
          sent: 150,
          delivered: 147,
          opened: 89,
          clicked: 23,
          replied: 12,
          unsubscribed: 2,
          bounceRate: 0.02,
          openRate: 0.61,
          clickRate: 0.16,
          replyRate: 0.08
        },
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date()
      }
    ])
  }

  /**
   * Get communication hub data
   */
  async getCommunicationHub(userId: string): Promise<CommunicationHub> {
    const clients = this.clients.get(userId) || []
    const communications = this.communications.get(userId) || []
    const threads = this.threads.get(userId) || []
    const templates = this.templates.get(userId) || []
    const campaigns = this.campaigns.get(userId) || []

    const activeClients = clients.filter(c => c.status === 'ACTIVE' || c.status === 'CUSTOMER').length
    const unreadCommunications = communications.filter(c => c.status === 'SENT' && !c.metadata.readAt).length
    const pendingFollowUps = clients.filter(c => c.nextFollowUp && c.nextFollowUp <= new Date()).length
    const activeCampaigns = campaigns.filter(c => c.status === 'RUNNING').length

    const totalReplies = communications.filter(c => c.status === 'REPLIED').length
    const totalSent = communications.filter(c => c.direction === 'SENT').length
    const responseRate = totalSent > 0 ? totalReplies / totalSent : 0

    const avgResponseTime = this.calculateAverageResponseTime(communications)

    return {
      clients,
      communications,
      threads,
      templates,
      campaigns,
      channels: this.channels,
      summary: {
        totalClients: clients.length,
        activeClients,
        totalCommunications: communications.length,
        unreadCommunications,
        pendingFollowUps,
        activeCampaigns,
        responseRate,
        averageResponseTime: avgResponseTime
      }
    }
  }

  /**
   * Get clients
   */
  async getClients(userId: string, filters?: {
    status?: string[]
    priority?: string[]
    tags?: string[]
    assignedTo?: string
  }): Promise<Client[]> {
    let clients = this.clients.get(userId) || []

    if (filters) {
      if (filters.status) {
        clients = clients.filter(c => filters.status!.includes(c.status))
      }
      if (filters.priority) {
        clients = clients.filter(c => filters.priority!.includes(c.priority))
      }
      if (filters.tags) {
        clients = clients.filter(c => filters.tags!.some(tag => c.tags.includes(tag)))
      }
      if (filters.assignedTo) {
        clients = clients.filter(c => c.assignedTo === filters.assignedTo)
      }
    }

    return clients
  }

  /**
   * Get communications for a client
   */
  async getClientCommunications(userId: string, clientId: string): Promise<Communication[]> {
    const communications = this.communications.get(userId) || []
    return communications.filter(c => c.clientId === clientId)
  }

  /**
   * Send communication
   */
  async sendCommunication(
    userId: string,
    communication: Omit<Communication, 'id' | 'createdAt' | 'updatedAt' | 'aiInsights'>
  ): Promise<Communication> {
    const newCommunication: Communication = {
      ...communication,
      id: `comm-${Date.now()}`,
      aiInsights: await this.generateAIInsights(communication.content),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const communications = this.communications.get(userId) || []
    communications.push(newCommunication)
    this.communications.set(userId, communications)

    return newCommunication
  }

  /**
   * Generate AI insights for communication
   */
  private async generateAIInsights(content: string): Promise<Communication['aiInsights']> {
    // Mock AI analysis
    const sentiment = content.toLowerCase().includes('thank') || content.toLowerCase().includes('great') 
      ? 'POSITIVE' : content.toLowerCase().includes('problem') || content.toLowerCase().includes('issue')
      ? 'NEGATIVE' : 'NEUTRAL'
    
    const intent = content.toLowerCase().includes('question') ? 'INQUIRY' :
      content.toLowerCase().includes('complaint') ? 'COMPLAINT' :
      content.toLowerCase().includes('thank') ? 'PRAISE' :
      content.toLowerCase().includes('follow') ? 'FOLLOW_UP' : 'REQUEST'

    const urgency = content.toLowerCase().includes('urgent') || content.toLowerCase().includes('asap') ? 'CRITICAL' :
      content.toLowerCase().includes('soon') || content.toLowerCase().includes('quickly') ? 'HIGH' :
      content.toLowerCase().includes('whenever') || content.toLowerCase().includes('no rush') ? 'LOW' : 'MEDIUM'

    return {
      sentiment,
      intent,
      urgency,
      suggestedResponse: 'Thank you for your message. I\'ll get back to you shortly.',
      suggestedActions: [
        'Schedule follow-up',
        'Prepare response',
        'Update CRM'
      ],
      confidence: 0.85
    }
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(communications: Communication[]): number {
    const threads = new Map<string, Communication[]>()
    
    communications.forEach(comm => {
      const threadId = comm.metadata.threadId || comm.id
      if (!threads.has(threadId)) {
        threads.set(threadId, [])
      }
      threads.get(threadId)!.push(comm)
    })

    let totalResponseTime = 0
    let responseCount = 0

    threads.forEach(threadComms => {
      const sortedComms = threadComms.sort((a, b) => 
        new Date(a.metadata.sentAt).getTime() - new Date(b.metadata.sentAt).getTime()
      )

      for (let i = 0; i < sortedComms.length - 1; i++) {
        const current = sortedComms[i]
        const next = sortedComms[i + 1]

        if (current.direction === 'SENT' && next.direction === 'RECEIVED') {
          const responseTime = new Date(next.metadata.sentAt).getTime() - new Date(current.metadata.sentAt).getTime()
          totalResponseTime += responseTime
          responseCount++
        }
      }
    })

    return responseCount > 0 ? totalResponseTime / responseCount / (1000 * 60 * 60) : 0 // hours
  }

  /**
   * Create communication template
   */
  async createTemplate(
    userId: string,
    template: Omit<CommunicationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'successRate'>
  ): Promise<CommunicationTemplate> {
    const newTemplate: CommunicationTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const templates = this.templates.get(userId) || []
    templates.push(newTemplate)
    this.templates.set(userId, templates)

    return newTemplate
  }

  /**
   * Create communication campaign
   */
  async createCampaign(
    userId: string,
    campaign: Omit<CommunicationCampaign, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>
  ): Promise<CommunicationCampaign> {
    const newCampaign: CommunicationCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        unsubscribed: 0,
        bounceRate: 0,
        openRate: 0,
        clickRate: 0,
        replyRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const campaigns = this.campaigns.get(userId) || []
    campaigns.push(newCampaign)
    this.campaigns.set(userId, campaigns)

    return newCampaign
  }
}

export const clientCommunicationService = new ClientCommunicationService()
