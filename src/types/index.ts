import type {
  Company,
  Contact,
  Opportunity,
  Activity,
  Task,
  Meeting,
  Note,
  AccountSignal,
  NBA,
  PerplexityCache,
  GoldenPlay,
  PriorityLevel,
  DealType,
  OpportunityStage,
  ActivityType,
  TaskType,
  TaskStatus,
  MeetingType,
  MeetingStatus,
  NoteType,
  PlayType,
  NBAStatus,
} from '@prisma/client'

export {
  Company,
  Contact,
  Opportunity,
  Activity,
  Task,
  Meeting,
  Note,
  AccountSignal,
  NBA,
  PerplexityCache,
  GoldenPlay,
  PriorityLevel,
  DealType,
  OpportunityStage,
  ActivityType,
  TaskType,
  TaskStatus,
  MeetingType,
  MeetingStatus,
  NoteType,
  PlayType,
  NBAStatus,
}

export interface CompanyWithRelations extends Company {
  contacts: Contact[]
  opportunities: Opportunity[]
  accountSignals: AccountSignal[]
  activities: Activity[]
}

export interface ContactWithRelations extends Contact {
  company: Company
  activities: Activity[]
  meetings: Meeting[]
  tasks: Task[]
}

export interface OpportunityWithRelations extends Opportunity {
  company: Company
  activities: Activity[]
  meetings: Meeting[]
  tasks: Task[]
}

export interface NBAWithRelations extends NBA {
  company: Company
  contact?: Contact | null
  opportunity?: Opportunity | null
}

export interface MeetingWithRelations extends Meeting {
  company: Company
  contact?: Contact | null
  opportunity?: Opportunity | null
}

export interface AccountSignalWithRelations extends AccountSignal {
  company: Company
}

export interface PerplexityQuery {
  query: string
  companyId?: string
  ttl?: number // hours
}

export interface PerplexityResponse {
  answer: string
  sources: Array<{
    title: string
    url: string
    snippet: string
  }>
}

export interface NBAContext {
  company: Company
  contact?: Contact | null
  opportunity?: Opportunity | null
  recentSignals: AccountSignal[]
  recentActivities: Activity[]
}

export interface NBAScore {
  recency: number
  engagement: number
  potential: number
  momentum: number
  triggers: number
  total: number
}

export interface WeeklyDigest {
  topPlays: Array<{
    playType: PlayType
    count: number
    successRate: number
  }>
  stalls: Array<{
    type: string
    count: number
    description: string
  }>
  pillarPerformance: Array<{
    subIndustry: string
    meetings: number
    opportunities: number
    revenue: number
  }>
  ruleChanges: {
    promote: Array<{
      playType: PlayType
      segment: string
      reason: string
    }>
    retire: Array<{
      playType: PlayType
      segment: string
      reason: string
    }>
  }
  nextWeekFocus: Array<{
    subIndustry: string
    priority: string
    actions: string[]
  }>
  perplexityWins: Array<{
    signal: string
    action: string
    outcome: string
  }>
}

export interface BrandStudioContent {
  valueFraming: {
    efficiency: string[]
    reducedRisk: string[]
    elevatedCreativity: string[]
  }
  approvedFigures: {
    customers: string[]
    assets: string[]
    partners: string[]
  }
  operatingPrinciples: string[]
}

export interface CSVImportResult {
  success: boolean
  imported: number
  duplicates: number
  errors: Array<{
    row: number
    error: string
  }>
}

export interface CalendlyWebhookData {
  event: 'invitee.created' | 'invitee.canceled'
  payload: {
    event_type: {
      name: string
      slug: string
    }
    event: {
      name: string
      start_time: string
      end_time: string
      location: string
    }
    invitee: {
      name: string
      email: string
      questions_and_answers: Array<{
        question: string
        answer: string
      }>
    }
  }
}

export interface PhantomBusterWebhookData {
  jobId: string
  status: 'success' | 'error'
  data: Array<{
    name: string
    title: string
    company: string
    location: string
    linkedinUrl: string
    email?: string
  }>
}
