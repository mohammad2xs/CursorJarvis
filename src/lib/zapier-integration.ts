import { BaseService } from './base-service'

export interface ZapierTrigger {
  id: string
  name: string
  description: string
  app: string
  category: 'crm' | 'email' | 'calendar' | 'communication' | 'productivity' | 'analytics' | 'marketing'
  triggerType: 'webhook' | 'polling' | 'instant'
  fields: ZapierField[]
  sampleData: Record<string, unknown>
  isActive: boolean
  lastTriggered?: Date
  triggerCount: number
}

export interface ZapierAction {
  id: string
  name: string
  description: string
  app: string
  category: 'crm' | 'email' | 'calendar' | 'communication' | 'productivity' | 'analytics' | 'marketing'
  actionType: 'create' | 'update' | 'delete' | 'search' | 'send'
  fields: ZapierField[]
  sampleData: Record<string, unknown>
  isActive: boolean
  lastExecuted?: Date
  executionCount: number
}

export interface ZapierField {
  id: string
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'datetime' | 'select' | 'multiselect' | 'text' | 'file'
  required: boolean
  description?: string
  choices?: Array<{ value: string; label: string }>
  defaultValue?: unknown
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: string
  }
}

export interface ZapierZap {
  id: string
  name: string
  description: string
  trigger: ZapierTrigger
  actions: ZapierAction[]
  isActive: boolean
  isEnabled: boolean
  lastRun?: Date
  runCount: number
  successCount: number
  errorCount: number
  createdAt: Date
  updatedAt: Date
  nextRun?: Date
  status: 'active' | 'paused' | 'error' | 'disabled'
  errorMessage?: string
}

export interface ZapierWebhook {
  id: string
  name: string
  url: string
  secret: string
  events: string[]
  isActive: boolean
  lastReceived?: Date
  receivedCount: number
  headers: Record<string, string>
  filters?: ZapierWebhookFilter[]
}

export interface ZapierWebhookFilter {
  field: string
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex' | 'in' | 'not_in'
  value: string | string[]
}

export interface ZapierExecution {
  id: string
  zapId: string
  status: 'success' | 'error' | 'skipped' | 'running'
  startedAt: Date
  completedAt?: Date
  duration?: number
  triggerData: Record<string, unknown>
  actionResults: Array<{
    actionId: string
    status: 'success' | 'error' | 'skipped'
    data?: Record<string, unknown>
    error?: string
  }>
  errorMessage?: string
  retryCount: number
  nextRetry?: Date
}

export interface ZapierApp {
  id: string
  name: string
  description: string
  logo: string
  category: string
  isConnected: boolean
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'expired'
  lastSync?: Date
  triggers: ZapierTrigger[]
  actions: ZapierAction[]
  credentials?: Record<string, string>
}

export interface ZapierWorkflow {
  id: string
  name: string
  description: string
  steps: Array<{
    id: string
    type: 'trigger' | 'action' | 'filter' | 'delay' | 'conditional'
    app?: string
    name: string
    config: Record<string, unknown>
    position: { x: number; y: number }
  }>
  isActive: boolean
  isEnabled: boolean
  createdAt: Date
  updatedAt: Date
  lastRun?: Date
  runCount: number
  successCount: number
  errorCount: number
}

export class ZapierIntegrationService extends BaseService {
  private apps: Map<string, ZapierApp> = new Map()
  private zaps: Map<string, ZapierZap> = new Map()
  private webhooks: Map<string, ZapierWebhook> = new Map()
  private executions: Map<string, ZapierExecution> = new Map()
  private workflows: Map<string, ZapierWorkflow> = new Map()

  constructor() {
    super('ZapierIntegrationService')
    this.initializeApps()
    this.initializeZaps()
  }

  private initializeApps(): void {
    const apps: ZapierApp[] = [
      {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Connect with Salesforce CRM',
        logo: '/logos/salesforce.png',
        category: 'crm',
        isConnected: false,
        connectionStatus: 'disconnected',
        triggers: [
          {
            id: 'sf-new-lead',
            name: 'New Lead',
            description: 'Triggered when a new lead is created in Salesforce',
            app: 'salesforce',
            category: 'crm',
            triggerType: 'webhook',
            fields: [
              {
                id: 'lead-id',
                key: 'lead_id',
                label: 'Lead ID',
                type: 'string',
                required: true,
                description: 'Unique identifier for the lead'
              },
              {
                id: 'lead-name',
                key: 'lead_name',
                label: 'Lead Name',
                type: 'string',
                required: true,
                description: 'Name of the lead'
              },
              {
                id: 'lead-email',
                key: 'lead_email',
                label: 'Lead Email',
                type: 'string',
                required: true,
                description: 'Email address of the lead'
              },
              {
                id: 'lead-company',
                key: 'lead_company',
                label: 'Company',
                type: 'string',
                required: false,
                description: 'Company name'
              }
            ],
            sampleData: {
              lead_id: '00Q000000000000',
              lead_name: 'John Doe',
              lead_email: 'john.doe@example.com',
              lead_company: 'Acme Corp'
            },
            isActive: false,
            triggerCount: 0
          },
          {
            id: 'sf-opportunity-updated',
            name: 'Opportunity Updated',
            description: 'Triggered when an opportunity is updated in Salesforce',
            app: 'salesforce',
            category: 'crm',
            triggerType: 'webhook',
            fields: [
              {
                id: 'opp-id',
                key: 'opportunity_id',
                label: 'Opportunity ID',
                type: 'string',
                required: true
              },
              {
                id: 'opp-name',
                key: 'opportunity_name',
                label: 'Opportunity Name',
                type: 'string',
                required: true
              },
              {
                id: 'opp-stage',
                key: 'stage',
                label: 'Stage',
                type: 'select',
                required: true,
                choices: [
                  { value: 'Prospecting', label: 'Prospecting' },
                  { value: 'Qualification', label: 'Qualification' },
                  { value: 'Proposal', label: 'Proposal' },
                  { value: 'Negotiation', label: 'Negotiation' },
                  { value: 'Closed Won', label: 'Closed Won' },
                  { value: 'Closed Lost', label: 'Closed Lost' }
                ]
              },
              {
                id: 'opp-amount',
                key: 'amount',
                label: 'Amount',
                type: 'number',
                required: false
              }
            ],
            sampleData: {
              opportunity_id: '006000000000000',
              opportunity_name: 'Enterprise Software License',
              stage: 'Proposal',
              amount: 250000
            },
            isActive: false,
            triggerCount: 0
          }
        ],
        actions: [
          {
            id: 'sf-create-lead',
            name: 'Create Lead',
            description: 'Create a new lead in Salesforce',
            app: 'salesforce',
            category: 'crm',
            actionType: 'create',
            fields: [
              {
                id: 'first-name',
                key: 'first_name',
                label: 'First Name',
                type: 'string',
                required: true
              },
              {
                id: 'last-name',
                key: 'last_name',
                label: 'Last Name',
                type: 'string',
                required: true
              },
              {
                id: 'email',
                key: 'email',
                label: 'Email',
                type: 'string',
                required: true
              },
              {
                id: 'company',
                key: 'company',
                label: 'Company',
                type: 'string',
                required: false
              },
              {
                id: 'lead-source',
                key: 'lead_source',
                label: 'Lead Source',
                type: 'select',
                required: false,
                choices: [
                  { value: 'Web', label: 'Web' },
                  { value: 'Phone', label: 'Phone' },
                  { value: 'Email', label: 'Email' },
                  { value: 'Referral', label: 'Referral' },
                  { value: 'Other', label: 'Other' }
                ]
              }
            ],
            sampleData: {
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@example.com',
              company: 'Acme Corp',
              lead_source: 'Web'
            },
            isActive: false,
            executionCount: 0
          }
        ]
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Connect with HubSpot CRM',
        logo: '/logos/hubspot.png',
        category: 'crm',
        isConnected: false,
        connectionStatus: 'disconnected',
        triggers: [
          {
            id: 'hs-new-contact',
            name: 'New Contact',
            description: 'Triggered when a new contact is created in HubSpot',
            app: 'hubspot',
            category: 'crm',
            triggerType: 'webhook',
            fields: [
              {
                id: 'contact-id',
                key: 'contact_id',
                label: 'Contact ID',
                type: 'string',
                required: true
              },
              {
                id: 'email',
                key: 'email',
                label: 'Email',
                type: 'string',
                required: true
              },
              {
                id: 'first-name',
                key: 'first_name',
                label: 'First Name',
                type: 'string',
                required: false
              },
              {
                id: 'last-name',
                key: 'last_name',
                label: 'Last Name',
                type: 'string',
                required: false
              }
            ],
            sampleData: {
              contact_id: '12345',
              email: 'jane.smith@example.com',
              first_name: 'Jane',
              last_name: 'Smith'
            },
            isActive: false,
            triggerCount: 0
          }
        ],
        actions: [
          {
            id: 'hs-create-contact',
            name: 'Create Contact',
            description: 'Create a new contact in HubSpot',
            app: 'hubspot',
            category: 'crm',
            actionType: 'create',
            fields: [
              {
                id: 'email',
                key: 'email',
                label: 'Email',
                type: 'string',
                required: true
              },
              {
                id: 'first-name',
                key: 'first_name',
                label: 'First Name',
                type: 'string',
                required: false
              },
              {
                id: 'last-name',
                key: 'last_name',
                label: 'Last Name',
                type: 'string',
                required: false
              },
              {
                id: 'company',
                key: 'company',
                label: 'Company',
                type: 'string',
                required: false
              }
            ],
            sampleData: {
              email: 'jane.smith@example.com',
              first_name: 'Jane',
              last_name: 'Smith',
              company: 'TechStart Inc'
            },
            isActive: false,
            executionCount: 0
          }
        ]
      },
      {
        id: 'gmail',
        name: 'Gmail',
        description: 'Connect with Gmail',
        logo: '/logos/gmail.png',
        category: 'email',
        isConnected: false,
        connectionStatus: 'disconnected',
        triggers: [
          {
            id: 'gmail-new-email',
            name: 'New Email',
            description: 'Triggered when a new email is received in Gmail',
            app: 'gmail',
            category: 'email',
            triggerType: 'polling',
            fields: [
              {
                id: 'from',
                key: 'from',
                label: 'From',
                type: 'string',
                required: true
              },
              {
                id: 'subject',
                key: 'subject',
                label: 'Subject',
                type: 'string',
                required: true
              },
              {
                id: 'body',
                key: 'body',
                label: 'Body',
                type: 'text',
                required: true
              },
              {
                id: 'thread-id',
                key: 'thread_id',
                label: 'Thread ID',
                type: 'string',
                required: true
              }
            ],
            sampleData: {
              from: 'prospect@example.com',
              subject: 'Interested in your product',
              body: 'Hi, I am interested in learning more about your product...',
              thread_id: 'thread123'
            },
            isActive: false,
            triggerCount: 0
          }
        ],
        actions: [
          {
            id: 'gmail-send-email',
            name: 'Send Email',
            description: 'Send an email via Gmail',
            app: 'gmail',
            category: 'email',
            actionType: 'send',
            fields: [
              {
                id: 'to',
                key: 'to',
                label: 'To',
                type: 'string',
                required: true
              },
              {
                id: 'subject',
                key: 'subject',
                label: 'Subject',
                type: 'string',
                required: true
              },
              {
                id: 'body',
                key: 'body',
                label: 'Body',
                type: 'text',
                required: true
              },
              {
                id: 'cc',
                key: 'cc',
                label: 'CC',
                type: 'string',
                required: false
              },
              {
                id: 'bcc',
                key: 'bcc',
                label: 'BCC',
                type: 'string',
                required: false
              }
            ],
            sampleData: {
              to: 'prospect@example.com',
              subject: 'Follow up on your inquiry',
              body: 'Thank you for your interest in our product...',
              cc: '',
              bcc: ''
            },
            isActive: false,
            executionCount: 0
          }
        ]
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Connect with Slack for team communication',
        logo: '/logos/slack.png',
        category: 'communication',
        isConnected: false,
        connectionStatus: 'disconnected',
        triggers: [
          {
            id: 'slack-new-message',
            name: 'New Message',
            description: 'Triggered when a new message is posted in Slack',
            app: 'slack',
            category: 'communication',
            triggerType: 'webhook',
            fields: [
              {
                id: 'channel',
                key: 'channel',
                label: 'Channel',
                type: 'string',
                required: true
              },
              {
                id: 'user',
                key: 'user',
                label: 'User',
                type: 'string',
                required: true
              },
              {
                id: 'text',
                key: 'text',
                label: 'Message Text',
                type: 'text',
                required: true
              },
              {
                id: 'timestamp',
                key: 'timestamp',
                label: 'Timestamp',
                type: 'datetime',
                required: true
              }
            ],
            sampleData: {
              channel: '#sales',
              user: 'john.doe',
              text: 'New lead came in from the website',
              timestamp: '2024-01-15T10:30:00Z'
            },
            isActive: false,
            triggerCount: 0
          }
        ],
        actions: [
          {
            id: 'slack-send-message',
            name: 'Send Message',
            description: 'Send a message to a Slack channel',
            app: 'slack',
            category: 'communication',
            actionType: 'send',
            fields: [
              {
                id: 'channel',
                key: 'channel',
                label: 'Channel',
                type: 'string',
                required: true
              },
              {
                id: 'text',
                key: 'text',
                label: 'Message Text',
                type: 'text',
                required: true
              },
              {
                id: 'username',
                key: 'username',
                label: 'Username',
                type: 'string',
                required: false
              },
              {
                id: 'icon-emoji',
                key: 'icon_emoji',
                label: 'Icon Emoji',
                type: 'string',
                required: false
              }
            ],
            sampleData: {
              channel: '#sales',
              text: 'New deal closed: $250,000 Enterprise Software License',
              username: 'Jarvis CRM',
              icon_emoji: ':robot_face:'
            },
            isActive: false,
            executionCount: 0
          }
        ]
      },
      {
        id: 'calendly',
        name: 'Calendly',
        description: 'Connect with Calendly for meeting scheduling',
        logo: '/logos/calendly.png',
        category: 'calendar',
        isConnected: false,
        connectionStatus: 'disconnected',
        triggers: [
          {
            id: 'cal-new-booking',
            name: 'New Booking',
            description: 'Triggered when a new meeting is booked in Calendly',
            app: 'calendly',
            category: 'calendar',
            triggerType: 'webhook',
            fields: [
              {
                id: 'event-id',
                key: 'event_id',
                label: 'Event ID',
                type: 'string',
                required: true
              },
              {
                id: 'invitee-name',
                key: 'invitee_name',
                label: 'Invitee Name',
                type: 'string',
                required: true
              },
              {
                id: 'invitee-email',
                key: 'invitee_email',
                label: 'Invitee Email',
                type: 'string',
                required: true
              },
              {
                id: 'event-start',
                key: 'event_start',
                label: 'Event Start',
                type: 'datetime',
                required: true
              },
              {
                id: 'event-end',
                key: 'event_end',
                label: 'Event End',
                type: 'datetime',
                required: true
              }
            ],
            sampleData: {
              event_id: 'event123',
              invitee_name: 'John Doe',
              invitee_email: 'john.doe@example.com',
              event_start: '2024-01-20T14:00:00Z',
              event_end: '2024-01-20T15:00:00Z'
            },
            isActive: false,
            triggerCount: 0
          }
        ],
        actions: [
          {
            id: 'cal-create-event',
            name: 'Create Event',
            description: 'Create a new event in Calendly',
            app: 'calendly',
            category: 'calendar',
            actionType: 'create',
            fields: [
              {
                id: 'title',
                key: 'title',
                label: 'Event Title',
                type: 'string',
                required: true
              },
              {
                id: 'start-time',
                key: 'start_time',
                label: 'Start Time',
                type: 'datetime',
                required: true
              },
              {
                id: 'end-time',
                key: 'end_time',
                label: 'End Time',
                type: 'datetime',
                required: true
              },
              {
                id: 'attendees',
                key: 'attendees',
                label: 'Attendees',
                type: 'text',
                required: true
              },
              {
                id: 'description',
                key: 'description',
                label: 'Description',
                type: 'text',
                required: false
              }
            ],
            sampleData: {
              title: 'Sales Meeting with John Doe',
              start_time: '2024-01-20T14:00:00Z',
              end_time: '2024-01-20T15:00:00Z',
              attendees: 'john.doe@example.com',
              description: 'Discussion about our enterprise software solution'
            },
            isActive: false,
            executionCount: 0
          }
        ]
      }
    ]

    apps.forEach(app => {
      this.apps.set(app.id, app)
    })
  }

  private initializeZaps(): void {
    const zaps: ZapierZap[] = [
      {
        id: 'zap-1',
        name: 'New Lead to CRM',
        description: 'Automatically create a lead in Salesforce when a new lead is added to Jarvis CRM',
        trigger: this.apps.get('jarvis-crm')?.triggers[0] || {} as ZapierTrigger,
        actions: [this.apps.get('salesforce')?.actions[0] || {} as ZapierAction],
        isActive: true,
        isEnabled: true,
        runCount: 0,
        successCount: 0,
        errorCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      },
      {
        id: 'zap-2',
        name: 'Deal Closed to Slack',
        description: 'Send a notification to Slack when a deal is closed in Jarvis CRM',
        trigger: this.apps.get('jarvis-crm')?.triggers[1] || {} as ZapierTrigger,
        actions: [this.apps.get('slack')?.actions[0] || {} as ZapierAction],
        isActive: true,
        isEnabled: true,
        runCount: 0,
        successCount: 0,
        errorCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      },
      {
        id: 'zap-3',
        name: 'New Meeting to Calendar',
        description: 'Create a calendar event when a new meeting is scheduled in Jarvis CRM',
        trigger: this.apps.get('jarvis-crm')?.triggers[2] || {} as ZapierTrigger,
        actions: [this.apps.get('calendly')?.actions[0] || {} as ZapierAction],
        isActive: false,
        isEnabled: false,
        runCount: 0,
        successCount: 0,
        errorCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'paused'
      }
    ]

    zaps.forEach(zap => {
      this.zaps.set(zap.id, zap)
    })
  }

  /**
   * Get all available apps
   */
  async getApps(): Promise<ZapierApp[]> {
    try {
      console.log(`[${this.serviceName}] Fetching available apps`)
      return Array.from(this.apps.values())
    } catch (error) {
      console.error(`[${this.serviceName}] Error fetching apps:`, error)
      throw this.handleError('getApps', error)
    }
  }

  /**
   * Connect to an app
   */
  async connectApp(appId: string, credentials: Record<string, string>): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[${this.serviceName}] Connecting to app: ${appId}`)
      
      const app = this.apps.get(appId)
      if (!app) {
        throw new Error(`App ${appId} not found`)
      }

      // Mock connection process
      await new Promise(resolve => setTimeout(resolve, 1000))

      app.isConnected = true
      app.connectionStatus = 'connected'
      app.credentials = credentials
      app.lastSync = new Date()

      console.log(`[${this.serviceName}] Successfully connected to ${app.name}`)
      return {
        success: true,
        message: `Successfully connected to ${app.name}`
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error connecting to app:`, error)
      throw this.handleError('connectApp', error)
    }
  }

  /**
   * Disconnect from an app
   */
  async disconnectApp(appId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[${this.serviceName}] Disconnecting from app: ${appId}`)
      
      const app = this.apps.get(appId)
      if (!app) {
        throw new Error(`App ${appId} not found`)
      }

      app.isConnected = false
      app.connectionStatus = 'disconnected'
      app.credentials = undefined
      app.lastSync = undefined

      console.log(`[${this.serviceName}] Successfully disconnected from ${app.name}`)
      return {
        success: true,
        message: `Successfully disconnected from ${app.name}`
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error disconnecting from app:`, error)
      throw this.handleError('disconnectApp', error)
    }
  }

  /**
   * Get all zaps
   */
  async getZaps(): Promise<ZapierZap[]> {
    try {
      console.log(`[${this.serviceName}] Fetching zaps`)
      return Array.from(this.zaps.values())
    } catch (error) {
      console.error(`[${this.serviceName}] Error fetching zaps:`, error)
      throw this.handleError('getZaps', error)
    }
  }

  /**
   * Create a new zap
   */
  async createZap(zap: Omit<ZapierZap, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'errorCount'>): Promise<ZapierZap> {
    try {
      console.log(`[${this.serviceName}] Creating new zap: ${zap.name}`)
      
      const newZap: ZapierZap = {
        ...zap,
        id: `zap-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        runCount: 0,
        successCount: 0,
        errorCount: 0
      }

      this.zaps.set(newZap.id, newZap)
      console.log(`[${this.serviceName}] Successfully created zap: ${newZap.name}`)
      return newZap

    } catch (error) {
      console.error(`[${this.serviceName}] Error creating zap:`, error)
      throw this.handleError('createZap', error)
    }
  }

  /**
   * Update a zap
   */
  async updateZap(zapId: string, updates: Partial<ZapierZap>): Promise<ZapierZap> {
    try {
      console.log(`[${this.serviceName}] Updating zap: ${zapId}`)
      
      const zap = this.zaps.get(zapId)
      if (!zap) {
        throw new Error(`Zap ${zapId} not found`)
      }

      const updatedZap = {
        ...zap,
        ...updates,
        updatedAt: new Date()
      }

      this.zaps.set(zapId, updatedZap)
      console.log(`[${this.serviceName}] Successfully updated zap: ${zapId}`)
      return updatedZap

    } catch (error) {
      console.error(`[${this.serviceName}] Error updating zap:`, error)
      throw this.handleError('updateZap', error)
    }
  }

  /**
   * Delete a zap
   */
  async deleteZap(zapId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[${this.serviceName}] Deleting zap: ${zapId}`)
      
      const zap = this.zaps.get(zapId)
      if (!zap) {
        throw new Error(`Zap ${zapId} not found`)
      }

      this.zaps.delete(zapId)
      console.log(`[${this.serviceName}] Successfully deleted zap: ${zapId}`)
      return {
        success: true,
        message: `Successfully deleted zap: ${zap.name}`
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error deleting zap:`, error)
      throw this.handleError('deleteZap', error)
    }
  }

  /**
   * Execute a zap
   */
  async executeZap(zapId: string, triggerData: Record<string, unknown>): Promise<ZapierExecution> {
    try {
      console.log(`[${this.serviceName}] Executing zap: ${zapId}`)
      
      const zap = this.zaps.get(zapId)
      if (!zap) {
        throw new Error(`Zap ${zapId} not found`)
      }

      if (!zap.isActive || !zap.isEnabled) {
        throw new Error(`Zap ${zapId} is not active or enabled`)
      }

      const execution: ZapierExecution = {
        id: `exec-${Date.now()}`,
        zapId,
        status: 'running',
        startedAt: new Date(),
        triggerData,
        actionResults: [],
        retryCount: 0
      }

      this.executions.set(execution.id, execution)

      // Mock execution process
      for (const action of zap.actions) {
        try {
          // Simulate action execution
          await new Promise(resolve => setTimeout(resolve, 500))
          
          execution.actionResults.push({
            actionId: action.id,
            status: 'success',
            data: { message: 'Action executed successfully' }
          })
        } catch (error) {
          execution.actionResults.push({
            actionId: action.id,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      execution.status = execution.actionResults.every(r => r.status === 'success') ? 'success' : 'error'
      execution.completedAt = new Date()
      execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime()

      // Update zap statistics
      zap.runCount++
      if (execution.status === 'success') {
        zap.successCount++
      } else {
        zap.errorCount++
      }
      zap.lastRun = execution.startedAt

      console.log(`[${this.serviceName}] Zap execution completed: ${zapId}`)
      return execution

    } catch (error) {
      console.error(`[${this.serviceName}] Error executing zap:`, error)
      throw this.handleError('executeZap', error)
    }
  }

  /**
   * Get execution history
   */
  async getExecutions(zapId?: string): Promise<ZapierExecution[]> {
    try {
      console.log(`[${this.serviceName}] Fetching executions${zapId ? ` for zap: ${zapId}` : ''}`)
      
      let executions = Array.from(this.executions.values())
      
      if (zapId) {
        executions = executions.filter(exec => exec.zapId === zapId)
      }

      return executions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())

    } catch (error) {
      console.error(`[${this.serviceName}] Error fetching executions:`, error)
      throw this.handleError('getExecutions', error)
    }
  }

  /**
   * Create a webhook
   */
  async createWebhook(webhook: Omit<ZapierWebhook, 'id' | 'receivedCount'>): Promise<ZapierWebhook> {
    try {
      console.log(`[${this.serviceName}] Creating webhook: ${webhook.name}`)
      
      const newWebhook: ZapierWebhook = {
        ...webhook,
        id: `webhook-${Date.now()}`,
        receivedCount: 0
      }

      this.webhooks.set(newWebhook.id, newWebhook)
      console.log(`[${this.serviceName}] Successfully created webhook: ${newWebhook.name}`)
      return newWebhook

    } catch (error) {
      console.error(`[${this.serviceName}] Error creating webhook:`, error)
      throw this.handleError('createWebhook', error)
    }
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(): Promise<{
    totalWebhooks: number
    activeWebhooks: number
    totalReceived: number
    recentActivity: Array<{ webhookId: string; name: string; lastReceived: Date; receivedCount: number }>
  }> {
    try {
      console.log(`[${this.serviceName}] Fetching webhook statistics`)
      
      const webhooks = Array.from(this.webhooks.values())
      const totalWebhooks = webhooks.length
      const activeWebhooks = webhooks.filter(w => w.isActive).length
      const totalReceived = webhooks.reduce((sum, w) => sum + w.receivedCount, 0)
      
      const recentActivity = webhooks
        .filter(w => w.lastReceived)
        .sort((a, b) => (b.lastReceived?.getTime() || 0) - (a.lastReceived?.getTime() || 0))
        .slice(0, 10)
        .map(w => ({
          webhookId: w.id,
          name: w.name,
          lastReceived: w.lastReceived!,
          receivedCount: w.receivedCount
        }))

      return {
        totalWebhooks,
        activeWebhooks,
        totalReceived,
        recentActivity
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error fetching webhook statistics:`, error)
      throw this.handleError('getWebhookStats', error)
    }
  }

  /**
   * Test a zap
   */
  async testZap(zapId: string, testData: Record<string, unknown>): Promise<{ success: boolean; message: string; executionId?: string }> {
    try {
      console.log(`[${this.serviceName}] Testing zap: ${zapId}`)
      
      const execution = await this.executeZap(zapId, testData)
      
      return {
        success: execution.status === 'success',
        message: execution.status === 'success' ? 'Zap test successful' : 'Zap test failed',
        executionId: execution.id
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error testing zap:`, error)
      throw this.handleError('testZap', error)
    }
  }
}

// Global service instance
let zapierIntegrationService: ZapierIntegrationService | null = null

export const getZapierIntegrationService = (): ZapierIntegrationService => {
  if (!zapierIntegrationService) {
    zapierIntegrationService = new ZapierIntegrationService()
  }
  return zapierIntegrationService
}

export const destroyZapierIntegrationService = (): void => {
  zapierIntegrationService = null
}
