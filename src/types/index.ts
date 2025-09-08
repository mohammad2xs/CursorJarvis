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

export interface RiskFactor {
  id: string
  opportunityId: string
  type: 'TECHNICAL' | 'FINANCIAL' | 'COMPETITIVE' | 'TIMING' | 'STAKEHOLDER' | 'RESOURCE'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  impact: string
  mitigation: string
  probability: number
  createdAt: Date
  updatedAt: Date
}

export interface RiskAnalysis {
  opportunity: OpportunityWithRelations
  riskScore: number
  riskFactors: string[]
  daysSinceUpdate: number
  daysToClose: number
}

export interface MutualActionPlan {
  id: string
  opportunityId: string
  title: string
  description: string
  owner: 'US' | 'THEM' | 'BOTH'
  dueDate: Date
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: Date
  updatedAt: Date
}

export interface DealStage {
  stage: string
  actions: string[]
}

export interface DealPlaybook {
  opportunity: OpportunityWithRelations
  playbook: Record<string, unknown>
  currentStage: DealStage | undefined
  nextActions: string[]
  timeline: number
  successMetrics: string[]
}

export interface VoiceCall {
  id: string
  userId: string
  contactId: string
  duration: number
  timestamp: Date
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  topics: string[]
  actionItems: string[]
  quality: number
  createdAt: Date
  updatedAt: Date
}

export interface VoiceMetrics {
  totalCalls: number
  averageDuration: number
  sentimentScore: number
  qualityScore: number
  topTopics: Array<{ topic: string; count: number }>
  improvementAreas: string[]
}

export interface RevenueForecast {
  id: string
  userId: string
  period: string
  forecastedRevenue: number
  confidence: number
  factors: string[]
  createdAt: Date
  updatedAt: Date
}

export interface RevenueOptimization {
  id: string
  userId: string
  opportunity: string
  currentValue: number
  optimizedValue: number
  recommendations: string[]
  impact: number
  createdAt: Date
  updatedAt: Date
}

export interface RevenueTrend {
  id: string
  userId: string
  period: string
  revenue: number
  growth: number
  factors: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ConversationCoaching {
  id: string
  userId: string
  sessionId: string
  recommendations: string[]
  realTimeTips: string[]
  performanceScore: number
  improvementAreas: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ConversationInsights {
  id: string
  userId: string
  sessionId: string
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  topics: string[]
  engagement: number
  outcomes: string[]
  createdAt: Date
  updatedAt: Date
}

export interface VisualContentStrategy {
  id: string
  userId: string
  campaignId: string
  visualElements: string[]
  colorScheme: string[]
  typography: string[]
  layout: string
  performance: number
  createdAt: Date
  updatedAt: Date
}

export interface ProactiveInsight {
  id: string
  userId: string
  type: 'OPPORTUNITY' | 'RISK' | 'TREND' | 'RECOMMENDATION'
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  actionRequired: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CustomerSatisfaction {
  id: string
  userId: string
  contactId: string
  score: number
  feedback: string
  factors: string[]
  improvementAreas: string[]
  createdAt: Date
  updatedAt: Date
}

export interface NextAction {
  id: string
  userId: string
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'FOLLOW_UP'
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: Date
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  createdAt: Date
  updatedAt: Date
}
