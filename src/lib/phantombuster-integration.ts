export interface PhantomBusterConfig {
  apiKey: string
  baseUrl: string
  timeout: number
}

export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  fullName: string
  headline: string
  summary: string
  location: string
  industry: string
  currentPosition: {
    title: string
    company: string
    companySize: string
    companyIndustry: string
    startDate: string
  }
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    year: string
  }>
  skills: string[]
  connections: number
  profileUrl: string
  profileImage: string
  lastActivity: string
  mutualConnections: number
  isPremium: boolean
  isVerified: boolean
  contactInfo: {
    email?: string
    phone?: string
    website?: string
  }
  socialMedia: {
    twitter?: string
    facebook?: string
    instagram?: string
  }
  interests: string[]
  recentActivity: Array<{
    type: 'POST' | 'COMMENT' | 'LIKE' | 'SHARE'
    content: string
    date: string
    engagement: number
  }>
  salesNavigatorData: {
    isInSalesNavigator: boolean
    savedSearches: string[]
    savedLists: string[]
    notes: string
    tags: string[]
    lastViewed: string
  }
}

export interface LinkedInSearchCriteria {
  keywords: string[]
  location: string[]
  industry: string[]
  companySize: string[]
  jobTitle: string[]
  seniority: string[]
  company: string[]
  school: string[]
  skills: string[]
  yearsOfExperience: {
    min: number
    max: number
  }
  mutualConnections: {
    min: number
    max: number
  }
  lastActivity: string
  premiumOnly: boolean
  verifiedOnly: boolean
}

export interface LinkedInCampaign {
  id: string
  name: string
  description: string
  type: 'CONNECTION' | 'MESSAGE' | 'FOLLOW' | 'LIKE' | 'COMMENT' | 'SHARE' | 'ENDORSE'
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  targetAudience: LinkedInSearchCriteria
  content: {
    message: string
    subject?: string
    imageUrl?: string
    linkUrl?: string
  }
  schedule: {
    startDate: Date
    endDate?: Date
    timezone: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
    maxActionsPerDay: number
    workingHours: {
      start: string
      end: string
    }
  }
  settings: {
    delayBetweenActions: number // minutes
    randomizeDelay: boolean
    skipWeekends: boolean
    skipHolidays: boolean
    maxConnectionsPerDay: number
    maxMessagesPerDay: number
    maxFollowsPerDay: number
  }
  metrics: {
    totalTargets: number
    actionsCompleted: number
    connectionsSent: number
    connectionsAccepted: number
    messagesSent: number
    messagesReplied: number
    followsCompleted: number
    likesCompleted: number
    commentsCompleted: number
    sharesCompleted: number
    endorsementsCompleted: number
    successRate: number
    responseRate: number
    conversionRate: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface PhantomBusterPhantom {
  id: string
  name: string
  description: string
  category: 'LINKEDIN' | 'SALES_NAVIGATOR' | 'LEAD_GENERATION' | 'SOCIAL_MEDIA' | 'EMAIL' | 'WEB_SCRAPING'
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR'
  lastRun: Date
  nextRun?: Date
  frequency: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  isEnabled: boolean
  parameters: Record<string, unknown>
  results: {
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    lastResultCount: number
    averageResultCount: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface SocialSellingInsights {
  profileViews: number
  connectionRequests: number
  connectionAccepts: number
  messagesSent: number
  messagesReplied: number
  postsCreated: number
  postsEngagement: number
  commentsReceived: number
  likesReceived: number
  sharesReceived: number
  endorsementsReceived: number
  profileCompleteness: number
  networkGrowth: number
  engagementRate: number
  responseRate: number
  conversionRate: number
  topPerformingContent: Array<{
    type: 'POST' | 'COMMENT' | 'MESSAGE'
    content: string
    engagement: number
    date: string
  }>
  bestPostingTimes: string[]
  recommendedActions: string[]
  networkAnalysis: {
    totalConnections: number
    newConnections: number
    industryDistribution: Record<string, number>
    locationDistribution: Record<string, number>
    seniorityDistribution: Record<string, number>
    companySizeDistribution: Record<string, number>
  }
  competitorAnalysis: {
    competitors: Array<{
      name: string
      engagement: number
      followers: number
      contentStrategy: string
    }>
    marketOpportunities: string[]
    contentGaps: string[]
  }
}

export class PhantomBusterService {
  private config: PhantomBusterConfig
  private profiles: Map<string, LinkedInProfile[]> = new Map()
  private campaigns: Map<string, LinkedInCampaign[]> = new Map()
  private phantoms: Map<string, PhantomBusterPhantom[]> = new Map()
  private insights: Map<string, SocialSellingInsights> = new Map()

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.phantombuster.com/api/v2',
      timeout: 30000
    }
    this.initializeMockData()
  }

  private initializeMockData() {
    const userId = 'user-1'
    
    // Mock LinkedIn profiles
    this.profiles.set(userId, [
      {
        id: 'profile-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        fullName: 'Sarah Johnson',
        headline: 'VP of Sales at Acme Corp | B2B Sales Expert | Revenue Growth Specialist',
        summary: 'Experienced sales leader with 10+ years in B2B sales, specializing in enterprise software solutions. Passionate about building high-performing sales teams and driving revenue growth.',
        location: 'San Francisco, CA',
        industry: 'Technology',
        currentPosition: {
          title: 'VP of Sales',
          company: 'Acme Corp',
          companySize: '201-500',
          companyIndustry: 'Software',
          startDate: '2022-01-01'
        },
        experience: [
          {
            title: 'VP of Sales',
            company: 'Acme Corp',
            duration: '2 years',
            description: 'Leading sales team of 25+ reps, driving $50M+ annual revenue'
          },
          {
            title: 'Sales Director',
            company: 'TechStart Inc',
            duration: '3 years',
            description: 'Managed enterprise sales team, achieved 150% quota attainment'
          }
        ],
        education: [
          {
            school: 'Stanford University',
            degree: 'MBA',
            field: 'Business Administration',
            year: '2015'
          }
        ],
        skills: ['Sales Management', 'B2B Sales', 'Enterprise Software', 'Revenue Growth', 'Team Leadership'],
        connections: 2500,
        profileUrl: 'https://linkedin.com/in/sarahjohnson',
        profileImage: 'https://via.placeholder.com/150',
        lastActivity: '2024-01-15T10:30:00Z',
        mutualConnections: 15,
        isPremium: true,
        isVerified: true,
        contactInfo: {
          email: 'sarah.johnson@acmecorp.com',
          website: 'https://acmecorp.com'
        },
        socialMedia: {
          twitter: 'https://twitter.com/sarahjohnson'
        },
        interests: ['Sales Technology', 'Leadership', 'B2B Marketing', 'Revenue Operations'],
        recentActivity: [
          {
            type: 'POST',
            content: 'Excited to share our Q4 results - 150% of quota achieved!',
            date: '2024-01-15T09:00:00Z',
            engagement: 45
          }
        ],
        salesNavigatorData: {
          isInSalesNavigator: true,
          savedSearches: ['Enterprise Software VPs', 'B2B Sales Leaders'],
          savedLists: ['Hot Prospects Q4', 'Enterprise Decision Makers'],
          notes: 'High-value prospect, interested in AI solutions',
          tags: ['enterprise', 'decision-maker', 'hot-lead'],
          lastViewed: '2024-01-15T10:30:00Z'
        }
      }
    ])

    // Mock campaigns
    this.campaigns.set(userId, [
      {
        id: 'campaign-1',
        name: 'Q4 Enterprise Outreach',
        description: 'Targeted outreach to enterprise VPs and decision makers',
        type: 'CONNECTION',
        status: 'ACTIVE',
        targetAudience: {
          keywords: ['VP Sales', 'Sales Director', 'Revenue Leader'],
          location: ['San Francisco', 'New York', 'Austin'],
          industry: ['Technology', 'Software', 'SaaS'],
          companySize: ['201-500', '501-1000', '1001-5000'],
          jobTitle: ['VP of Sales', 'Sales Director', 'Revenue Operations'],
          seniority: ['Senior', 'Executive'],
          company: [],
          school: [],
          skills: ['Sales Management', 'B2B Sales', 'Revenue Growth'],
          yearsOfExperience: { min: 5, max: 15 },
          mutualConnections: { min: 1, max: 50 },
          lastActivity: '30 days',
          premiumOnly: false,
          verifiedOnly: false
        },
        content: {
          message: 'Hi {{firstName}}, I noticed your experience in {{currentPosition.title}} at {{currentPosition.company}}. I\'d love to connect and share insights about AI-powered sales automation that has helped similar companies increase revenue by 30%.',
          subject: 'Connection Request - AI Sales Automation'
        },
        schedule: {
          startDate: new Date('2024-10-01'),
          endDate: new Date('2024-12-31'),
          timezone: 'America/New_York',
          frequency: 'DAILY',
          maxActionsPerDay: 50,
          workingHours: {
            start: '09:00',
            end: '17:00'
          }
        },
        settings: {
          delayBetweenActions: 2,
          randomizeDelay: true,
          skipWeekends: true,
          skipHolidays: true,
          maxConnectionsPerDay: 50,
          maxMessagesPerDay: 25,
          maxFollowsPerDay: 100
        },
        metrics: {
          totalTargets: 1000,
          actionsCompleted: 250,
          connectionsSent: 200,
          connectionsAccepted: 45,
          messagesSent: 45,
          messagesReplied: 12,
          followsCompleted: 0,
          likesCompleted: 0,
          commentsCompleted: 0,
          sharesCompleted: 0,
          endorsementsCompleted: 0,
          successRate: 0.225,
          responseRate: 0.267,
          conversionRate: 0.054
        },
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date()
      }
    ])

    // Mock phantoms
    this.phantoms.set(userId, [
      {
        id: 'phantom-1',
        name: 'LinkedIn Profile Scraper',
        description: 'Scrapes LinkedIn profiles based on search criteria',
        category: 'LINKEDIN',
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
        frequency: 'DAILY',
        isEnabled: true,
        parameters: {
          searchQuery: 'VP Sales Technology',
          maxResults: 100,
          includeContactInfo: true
        },
        results: {
          totalRuns: 45,
          successfulRuns: 42,
          failedRuns: 3,
          lastResultCount: 87,
          averageResultCount: 92
        },
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date()
      },
      {
        id: 'phantom-2',
        name: 'LinkedIn Connection Sender',
        description: 'Automatically sends connection requests with personalized messages',
        category: 'LINKEDIN',
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 1 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 23 * 60 * 60 * 1000),
        frequency: 'DAILY',
        isEnabled: true,
        parameters: {
          messageTemplate: 'Hi {{firstName}}, I\'d love to connect!',
          maxConnectionsPerDay: 50,
          delayBetweenActions: 120
        },
        results: {
          totalRuns: 30,
          successfulRuns: 28,
          failedRuns: 2,
          lastResultCount: 45,
          averageResultCount: 48
        },
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date()
      }
    ])

    // Mock insights
    this.insights.set(userId, {
      profileViews: 1250,
      connectionRequests: 200,
      connectionAccepts: 45,
      messagesSent: 45,
      messagesReplied: 12,
      postsCreated: 8,
      postsEngagement: 156,
      commentsReceived: 23,
      likesReceived: 89,
      sharesReceived: 12,
      endorsementsReceived: 5,
      profileCompleteness: 0.85,
      networkGrowth: 0.12,
      engagementRate: 0.08,
      responseRate: 0.267,
      conversionRate: 0.054,
      topPerformingContent: [
        {
          type: 'POST',
          content: 'Excited to share our Q4 results - 150% of quota achieved!',
          engagement: 45,
          date: '2024-01-15T09:00:00Z'
        }
      ],
      bestPostingTimes: ['09:00', '13:00', '17:00'],
      recommendedActions: [
        'Increase posting frequency to 3x per week',
        'Engage with industry leaders\' content',
        'Share case studies and success stories',
        'Join relevant LinkedIn groups'
      ],
      networkAnalysis: {
        totalConnections: 2500,
        newConnections: 45,
        industryDistribution: {
          'Technology': 0.35,
          'Finance': 0.20,
          'Healthcare': 0.15,
          'Manufacturing': 0.10,
          'Other': 0.20
        },
        locationDistribution: {
          'San Francisco': 0.25,
          'New York': 0.20,
          'Austin': 0.15,
          'Chicago': 0.10,
          'Other': 0.30
        },
        seniorityDistribution: {
          'Senior': 0.40,
          'Executive': 0.25,
          'Manager': 0.20,
          'Individual': 0.15
        },
        companySizeDistribution: {
          '201-500': 0.30,
          '501-1000': 0.25,
          '1001-5000': 0.20,
          '5000+': 0.15,
          '1-200': 0.10
        }
      },
      competitorAnalysis: {
        competitors: [
          {
            name: 'Salesforce',
            engagement: 0.12,
            followers: 500000,
            contentStrategy: 'Thought leadership and product updates'
          }
        ],
        marketOpportunities: [
          'AI-powered sales automation',
          'Revenue operations optimization',
          'Sales team productivity tools'
        ],
        contentGaps: [
          'Video content',
          'Interactive posts',
          'Industry-specific case studies'
        ]
      }
    })
  }

  /**
   * Get LinkedIn profiles
   */
  async getLinkedInProfiles(userId: string, filters?: {
    industry?: string[]
    location?: string[]
    companySize?: string[]
    seniority?: string[]
  }): Promise<LinkedInProfile[]> {
    let profiles = this.profiles.get(userId) || []

    if (filters) {
      if (filters.industry) {
        profiles = profiles.filter(p => filters.industry!.includes(p.industry))
      }
      if (filters.location) {
        profiles = profiles.filter(p => 
          filters.location!.some(loc => p.location.includes(loc))
        )
      }
      if (filters.companySize) {
        profiles = profiles.filter(p => 
          filters.companySize!.includes(p.currentPosition.companySize)
        )
      }
      if (filters.seniority) {
        profiles = profiles.filter(p => 
          filters.seniority!.some(seniority => 
            p.currentPosition.title.toLowerCase().includes(seniority.toLowerCase())
          )
        )
      }
    }

    return profiles
  }

  /**
   * Get LinkedIn campaigns
   */
  async getLinkedInCampaigns(userId: string): Promise<LinkedInCampaign[]> {
    return this.campaigns.get(userId) || []
  }

  /**
   * Create LinkedIn campaign
   */
  async createLinkedInCampaign(
    userId: string,
    campaign: Omit<LinkedInCampaign, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>
  ): Promise<LinkedInCampaign> {
    const newCampaign: LinkedInCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      metrics: {
        totalTargets: 0,
        actionsCompleted: 0,
        connectionsSent: 0,
        connectionsAccepted: 0,
        messagesSent: 0,
        messagesReplied: 0,
        followsCompleted: 0,
        likesCompleted: 0,
        commentsCompleted: 0,
        sharesCompleted: 0,
        endorsementsCompleted: 0,
        successRate: 0,
        responseRate: 0,
        conversionRate: 0
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
   * Get PhantomBuster phantoms
   */
  async getPhantoms(userId: string): Promise<PhantomBusterPhantom[]> {
    return this.phantoms.get(userId) || []
  }

  /**
   * Execute phantom
   */
  async executePhantom(userId: string, phantomId: string): Promise<{
    success: boolean
    resultId: string
    message: string
  }> {
    // Mock execution
    return {
      success: true,
      resultId: `result-${Date.now()}`,
      message: 'Phantom executed successfully'
    }
  }

  /**
   * Get social selling insights
   */
  async getSocialSellingInsights(userId: string): Promise<SocialSellingInsights> {
    return this.insights.get(userId) || {
      profileViews: 0,
      connectionRequests: 0,
      connectionAccepts: 0,
      messagesSent: 0,
      messagesReplied: 0,
      postsCreated: 0,
      postsEngagement: 0,
      commentsReceived: 0,
      likesReceived: 0,
      sharesReceived: 0,
      endorsementsReceived: 0,
      profileCompleteness: 0,
      networkGrowth: 0,
      engagementRate: 0,
      responseRate: 0,
      conversionRate: 0,
      topPerformingContent: [],
      bestPostingTimes: [],
      recommendedActions: [],
      networkAnalysis: {
        totalConnections: 0,
        newConnections: 0,
        industryDistribution: {},
        locationDistribution: {},
        seniorityDistribution: {},
        companySizeDistribution: {}
      },
      competitorAnalysis: {
        competitors: [],
        marketOpportunities: [],
        contentGaps: []
      }
    }
  }

  /**
   * Search LinkedIn profiles using PhantomBuster
   */
  async searchLinkedInProfiles(
    userId: string,
    criteria: LinkedInSearchCriteria
  ): Promise<LinkedInProfile[]> {
    // Mock search - in real implementation, this would call PhantomBuster API
    const profiles = this.profiles.get(userId) || []
    
    // Filter based on criteria
    return profiles.filter(profile => {
      const matchesKeywords = criteria.keywords.length === 0 || 
        criteria.keywords.some(keyword => 
          profile.headline.toLowerCase().includes(keyword.toLowerCase()) ||
          profile.summary.toLowerCase().includes(keyword.toLowerCase())
        )
      
      const matchesLocation = criteria.location.length === 0 ||
        criteria.location.some(loc => profile.location.includes(loc))
      
      const matchesIndustry = criteria.industry.length === 0 ||
        criteria.industry.includes(profile.industry)
      
      const matchesCompanySize = criteria.companySize.length === 0 ||
        criteria.companySize.includes(profile.currentPosition.companySize)
      
      return matchesKeywords && matchesLocation && matchesIndustry && matchesCompanySize
    })
  }

  /**
   * Generate personalized message for LinkedIn outreach
   */
  async generatePersonalizedMessage(
    profile: LinkedInProfile,
    messageTemplate: string
  ): Promise<string> {
    // Replace template variables with profile data
    const message = messageTemplate
      .replace(/\{\{firstName\}\}/g, profile.firstName)
      .replace(/\{\{lastName\}\}/g, profile.lastName)
      .replace(/\{\{fullName\}\}/g, profile.fullName)
      .replace(/\{\{headline\}\}/g, profile.headline)
      .replace(/\{\{currentPosition\.title\}\}/g, profile.currentPosition.title)
      .replace(/\{\{currentPosition\.company\}\}/g, profile.currentPosition.company)
      .replace(/\{\{location\}\}/g, profile.location)
      .replace(/\{\{industry\}\}/g, profile.industry)
    
    return message
  }

  /**
   * Get campaign performance metrics
   */
  async getCampaignMetrics(userId: string, campaignId: string): Promise<LinkedInCampaign['metrics']> {
    const campaigns = this.campaigns.get(userId) || []
    const campaign = campaigns.find(c => c.id === campaignId)
    
    if (!campaign) {
      throw new Error('Campaign not found')
    }
    
    return campaign.metrics
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(
    userId: string,
    campaignId: string,
    status: LinkedInCampaign['status']
  ): Promise<void> {
    const campaigns = this.campaigns.get(userId) || []
    const campaign = campaigns.find(c => c.id === campaignId)
    
    if (campaign) {
      campaign.status = status
      campaign.updatedAt = new Date()
    }
  }
}

export const phantomBusterService = new PhantomBusterService('vYgas700EQ6QjGL3Zxoxqmc67w90D5qRjuTBGSBltLg')
