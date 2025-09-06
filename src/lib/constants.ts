// API Endpoints
export const API_ENDPOINTS = {
  // Enhanced Jarvis
  ENHANCED_JARVIS: {
    DASHBOARD: '/api/enhanced-jarvis/dashboard',
    REVENUE_TRACKING: '/api/enhanced-jarvis/revenue-tracking',
    REAL_TIME_COACHING: '/api/enhanced-jarvis/real-time-coaching',
    CALL_RECORDING: '/api/enhanced-jarvis/call-recording',
    ANALYZE_PAGE: '/api/enhanced-jarvis/analyze-page',
    GENERATE_INSIGHTS: '/api/enhanced-jarvis/generate-insights',
    VISUAL_CONTENT_STRATEGY: '/api/enhanced-jarvis/visual-content-strategy',
    SYNC_DATA: '/api/enhanced-jarvis/sync-data'
  },
  
  // NBA Management
  NBAS: {
    BASE: '/api/nbas',
    BY_ID: (id: string) => `/api/nbas/${id}`,
    UPDATE: (id: string) => `/api/nbas/${id}`
  },
  
  // Leads Management
  LEADS: {
    IMPORT: '/api/leads/import',
    EXPORT: '/api/leads/export',
    PROCESS: (id: string) => `/api/leads/${id}/process`
  },
  
  // Meetings
  MEETINGS: {
    BY_ID: (id: string) => `/api/meetings/${id}`,
    BRIEF: '/api/meetings/brief',
    RECAP: '/api/meetings/recap'
  },
  
  // Rules Management
  RULES: {
    PROMOTE: '/api/rules/promote',
    RETIRE: '/api/rules/retire'
  },
  
  // Other Services
  PERPLEXITY: '/api/perplexity',
  DIGEST: {
    GENERATE: '/api/digest/generate'
  },
  AUTO_SUBAGENTS: '/api/auto-subagents',
  SUBAGENTS: {
    LIST: '/api/subagents',
    INVOKE: (agent: string) => `/api/subagents/${agent}`
  }
} as const

// Sub Industries
export const SUB_INDUSTRIES = [
  'Aerospace & Defense',
  'Oil & Gas/Energy',
  'Healthcare/MedSys',
  'Consumer/CPG',
  'Tech/SaaS'
] as const

export type SubIndustry = typeof SUB_INDUSTRIES[number]

// Deal Types
export const DEAL_TYPES = [
  'NEW_LOGO',
  'RENEWAL',
  'UPSELL',
  'STRATEGIC'
] as const

export type DealType = typeof DEAL_TYPES[number]

// NBA Play Types
export const PLAY_TYPES = [
  'NEW_LEAD',
  'PRE_MEETING',
  'POST_MEETING',
  'VPCMO_NO_TOUCH',
  'OPP_IDLE',
  'ENGAGEMENT_DETECTED',
  'PERPLEXITY_NEWS',
  'PERPLEXITY_HIRE'
] as const

export type PlayType = typeof PLAY_TYPES[number]

// NBA Status
export const NBA_STATUS = [
  'PENDING',
  'APPROVED',
  'SNOOZED',
  'DECLINED',
  'COMPLETED'
] as const

export type NBAStatus = typeof NBA_STATUS[number]

// Opportunity Stages
export const OPPORTUNITY_STAGES = [
  'DISCOVER',
  'EVALUATE',
  'PROPOSE',
  'NEGOTIATE',
  'CLOSE_WON',
  'CLOSE_LOST'
] as const

export type OpportunityStage = typeof OPPORTUNITY_STAGES[number]

// Meeting Status
export const MEETING_STATUS = [
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'RESCHEDULED'
] as const

export type MeetingStatus = typeof MEETING_STATUS[number]

// Activity Types
export const ACTIVITY_TYPES = [
  'CALL',
  'EMAIL',
  'MEETING',
  'OUTREACH',
  'TASK',
  'NOTE'
] as const

export type ActivityType = typeof ACTIVITY_TYPES[number]

// Priority Levels
export const PRIORITY_LEVELS = [
  'low',
  'medium',
  'high'
] as const

export type PriorityLevel = typeof PRIORITY_LEVELS[number]

// Account Tiers
export const ACCOUNT_TIERS = [1, 2, 3] as const
export type AccountTier = typeof ACCOUNT_TIERS[number]

// Getty Images Accounts
export const GETTY_ACCOUNTS = {
  TIER_1: [
    'Boeing',
    'Caterpillar',
    'Chevron'
  ],
  TIER_2: [
    'ExxonMobil',
    'Lockheed Martin',
    'Parker Hannifin'
  ],
  TIER_3: [
    'General Electric',
    'Honeywell',
    'Raytheon Technologies'
  ]
} as const

// NBA Scoring Weights
export const NBA_SCORING_WEIGHTS = {
  RECENCY: 20,
  ENGAGEMENT: 20,
  POTENTIAL: 20,
  MOMENTUM: 20,
  TRIGGERS: 20
} as const

// Time Constants
export const TIME_CONSTANTS = {
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
} as const

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 2 * 60 * 60 * 1000,  // 2 hours
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours
} as const

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_URL: 'Please enter a valid URL'
  },
  AUTH: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    FORBIDDEN: 'Access to this resource is forbidden',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.'
  },
  NOT_FOUND: {
    COMPANY: 'Company not found',
    CONTACT: 'Contact not found',
    OPPORTUNITY: 'Opportunity not found',
    MEETING: 'Meeting not found',
    NBA: 'Next Best Action not found'
  },
  INTERNAL: {
    DATABASE_ERROR: 'A database error occurred',
    EXTERNAL_API_ERROR: 'External API request failed',
    PROCESSING_ERROR: 'Error processing request'
  }
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  SAVED: 'Successfully saved',
  SENT: 'Successfully sent',
  PROCESSED: 'Successfully processed'
} as const

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  MODAL_Z_INDEX: 1000,
  DROPDOWN_Z_INDEX: 999
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_VOICE_ANALYSIS: true,
  ENABLE_REAL_TIME_COACHING: true,
  ENABLE_AUTO_SUBAGENTS: true,
  ENABLE_REVENUE_TRACKING: true,
  ENABLE_VISUAL_CONTENT_AI: true,
  ENABLE_PROACTIVE_INSIGHTS: true
} as const

// Brand Studio Content Categories
export const BRAND_STUDIO_CATEGORIES = {
  VALUE_FRAMING: ['efficiency', 'reducedRisk', 'elevatedCreativity'],
  APPROVED_FIGURES: ['customers', 'assets', 'partners']
} as const

// Perplexity Query Types
export const PERPLEXITY_QUERY_TYPES = [
  'daily-pulse',
  'leadership-changes',
  'industry-trends',
  'pre-meeting-brief',
  'proof-points',
  'competitive-intelligence',
  'procurement-hurdles',
  'roi-language'
] as const

export type PerplexityQueryType = typeof PERPLEXITY_QUERY_TYPES[number]

// Revenue Attribution Sources
export const REVENUE_ATTRIBUTION_SOURCES = [
  'direct_sale',
  'renewal',
  'upsell',
  'cross_sell',
  'referral',
  'incidental'
] as const

export type RevenueAttributionSource = typeof REVENUE_ATTRIBUTION_SOURCES[number]

// Visual Content Types
export const VISUAL_CONTENT_TYPES = [
  'photography',
  'video',
  'illustration',
  'graphic_design',
  'ai_generated',
  'stock_photo',
  'custom_shoot'
] as const

export type VisualContentType = typeof VISUAL_CONTENT_TYPES[number]

// Insight Types
export const INSIGHT_TYPES = [
  'revenue_opportunity',
  'risk_alert',
  'competitive_threat',
  'expansion_opportunity',
  'customer_satisfaction',
  'performance_insight'
] as const

export type InsightType = typeof INSIGHT_TYPES[number]

// Next Action Types
export const NEXT_ACTION_TYPES = [
  'call',
  'email',
  'meeting',
  'proposal',
  'follow_up'
] as const

export type NextActionType = typeof NEXT_ACTION_TYPES[number]
