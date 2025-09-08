export interface Competitor {
  id: string
  name: string
  website: string
  description: string
  industry: string
  marketPosition: 'LEADER' | 'CHALLENGER' | 'FOLLOWER' | 'NICHER'
  strengths: string[]
  weaknesses: string[]
  pricing: {
    model: 'SUBSCRIPTION' | 'ONE_TIME' | 'FREEMIUM' | 'ENTERPRISE'
    range: {
      min: number
      max: number
      currency: string
    }
    lastUpdated: Date
  }
  features: {
    name: string
    description: string
    category: string
    isUnique: boolean
  }[]
  recentNews: CompetitorNews[]
  socialPresence: {
    linkedin: string
    twitter: string
    facebook: string
    youtube: string
    followers: {
      linkedin: number
      twitter: number
      facebook: number
      youtube: number
    }
  }
  lastAnalyzed: Date
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  winRate: number // percentage of deals won against this competitor
}

export interface CompetitorNews {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: Date
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  tags: string[]
  relevance: number // 0-1 score
}

export interface MarketTrend {
  id: string
  title: string
  description: string
  category: 'TECHNOLOGY' | 'REGULATORY' | 'ECONOMIC' | 'SOCIAL' | 'ENVIRONMENTAL'
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  magnitude: 'LOW' | 'MEDIUM' | 'HIGH'
  timeframe: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'
  affectedIndustries: string[]
  keyInsights: string[]
  opportunities: string[]
  threats: string[]
  sources: {
    name: string
    url: string
    credibility: number
  }[]
  lastUpdated: Date
  confidence: number // 0-1 score
}

export interface CompetitiveAnalysis {
  id: string
  competitorId: string
  analysisType: 'FEATURE_COMPARISON' | 'PRICING_ANALYSIS' | 'MARKET_POSITION' | 'STRATEGIC_INSIGHTS'
  title: string
  summary: string
  keyFindings: string[]
  recommendations: string[]
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  metrics: {
    marketShare: number
    growthRate: number
    customerSatisfaction: number
    brandAwareness: number
    pricingCompetitiveness: number
  }
  dataPoints: {
    metric: string
    ourValue: number
    competitorValue: number
    difference: number
    unit: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface MarketIntelligence {
  id: string
  title: string
  description: string
  category: 'MARKET_SIZE' | 'GROWTH_RATE' | 'CUSTOMER_BEHAVIOR' | 'TECHNOLOGY_TRENDS' | 'REGULATORY_CHANGES'
  insights: string[]
  data: {
    metric: string
    value: number
    unit: string
    period: string
    trend: 'INCREASING' | 'STABLE' | 'DECREASING'
  }[]
  implications: string[]
  recommendations: string[]
  sources: string[]
  confidence: number
  lastUpdated: Date
}

export interface CompetitiveAlert {
  id: string
  type: 'PRICING_CHANGE' | 'NEW_FEATURE' | 'PARTNERSHIP' | 'FUNDING' | 'ACQUISITION' | 'PRODUCT_LAUNCH' | 'MARKET_ENTRY'
  title: string
  description: string
  competitorId?: string
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  source: string
  url?: string
  publishedAt: Date
  isRead: boolean
  isArchived: boolean
  tags: string[]
  recommendedActions: string[]
}

export interface CompetitiveDashboard {
  competitors: Competitor[]
  recentNews: CompetitorNews[]
  marketTrends: MarketTrend[]
  competitiveAlerts: CompetitiveAlert[]
  marketIntelligence: MarketIntelligence[]
  summary: {
    totalCompetitors: number
    highThreatCompetitors: number
    recentAlerts: number
    marketTrends: number
    winRate: number
    marketPosition: string
  }
}

export class CompetitiveIntelligenceService {
  private competitors: Map<string, Competitor[]> = new Map()
  private marketTrends: Map<string, MarketTrend[]> = new Map()
  private competitiveAlerts: Map<string, CompetitiveAlert[]> = new Map()
  private marketIntelligence: Map<string, MarketIntelligence[]> = new Map()
  private competitiveAnalyses: Map<string, CompetitiveAnalysis[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const userId = 'user-1'
    
    // Mock competitors
    this.competitors.set(userId, [
      {
        id: 'comp-1',
        name: 'SalesForce',
        website: 'https://salesforce.com',
        description: 'Leading CRM platform with comprehensive sales, marketing, and service solutions',
        industry: 'CRM',
        marketPosition: 'LEADER',
        strengths: [
          'Market leader with strong brand recognition',
          'Comprehensive feature set',
          'Large ecosystem of integrations',
          'Strong enterprise presence'
        ],
        weaknesses: [
          'Complex pricing structure',
          'Steep learning curve',
          'High cost for small businesses',
          'Limited customization for specific industries'
        ],
        pricing: {
          model: 'SUBSCRIPTION',
          range: {
            min: 25,
            max: 300,
            currency: 'USD'
          },
          lastUpdated: new Date()
        },
        features: [
          {
            name: 'Lead Management',
            description: 'Comprehensive lead tracking and management',
            category: 'Sales',
            isUnique: false
          },
          {
            name: 'Einstein AI',
            description: 'AI-powered insights and predictions',
            category: 'AI',
            isUnique: true
          }
        ],
        recentNews: [
          {
            id: 'news-1',
            title: 'Salesforce Announces New AI Features',
            summary: 'Salesforce introduces new AI-powered automation features for sales teams',
            url: 'https://example.com/news1',
            source: 'TechCrunch',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            sentiment: 'POSITIVE',
            impact: 'HIGH',
            tags: ['AI', 'Automation', 'Sales'],
            relevance: 0.9
          }
        ],
        socialPresence: {
          linkedin: 'https://linkedin.com/company/salesforce',
          twitter: 'https://twitter.com/salesforce',
          facebook: 'https://facebook.com/salesforce',
          youtube: 'https://youtube.com/salesforce',
          followers: {
            linkedin: 5000000,
            twitter: 2000000,
            facebook: 1500000,
            youtube: 800000
          }
        },
        lastAnalyzed: new Date(),
        threatLevel: 'HIGH',
        winRate: 0.35
      },
      {
        id: 'comp-2',
        name: 'HubSpot',
        website: 'https://hubspot.com',
        description: 'Inbound marketing and sales platform with free CRM',
        industry: 'Marketing Automation',
        marketPosition: 'CHALLENGER',
        strengths: [
          'Free CRM offering',
          'Strong inbound marketing focus',
          'User-friendly interface',
          'Good for small to medium businesses'
        ],
        weaknesses: [
          'Limited advanced features in free tier',
          'Less enterprise-focused',
          'Limited customization options',
          'Smaller ecosystem compared to Salesforce'
        ],
        pricing: {
          model: 'FREEMIUM',
          range: {
            min: 0,
            max: 1200,
            currency: 'USD'
          },
          lastUpdated: new Date()
        },
        features: [
          {
            name: 'Free CRM',
            description: 'Basic CRM functionality at no cost',
            category: 'CRM',
            isUnique: true
          },
          {
            name: 'Marketing Automation',
            description: 'Email marketing and lead nurturing tools',
            category: 'Marketing',
            isUnique: false
          }
        ],
        recentNews: [],
        socialPresence: {
          linkedin: 'https://linkedin.com/company/hubspot',
          twitter: 'https://twitter.com/hubspot',
          facebook: 'https://facebook.com/hubspot',
          youtube: 'https://youtube.com/hubspot',
          followers: {
            linkedin: 2000000,
            twitter: 1000000,
            facebook: 800000,
            youtube: 500000
          }
        },
        lastAnalyzed: new Date(),
        threatLevel: 'MEDIUM',
        winRate: 0.65
      }
    ])

    // Mock market trends
    this.marketTrends.set(userId, [
      {
        id: 'trend-1',
        title: 'AI Integration in CRM Platforms',
        description: 'Increasing demand for AI-powered features in CRM solutions',
        category: 'TECHNOLOGY',
        impact: 'POSITIVE',
        magnitude: 'HIGH',
        timeframe: 'MEDIUM_TERM',
        affectedIndustries: ['CRM', 'Sales', 'Marketing'],
        keyInsights: [
          '80% of businesses plan to integrate AI into their CRM within 2 years',
          'AI-powered lead scoring increases conversion rates by 30%',
          'Automated follow-up sequences improve response rates by 45%'
        ],
        opportunities: [
          'Develop AI-powered features to stay competitive',
          'Focus on automation capabilities in marketing',
          'Invest in machine learning for predictive analytics'
        ],
        threats: [
          'Competitors with advanced AI capabilities may gain market share',
          'Customer expectations for AI features are increasing rapidly',
          'Need for significant R&D investment to keep pace'
        ],
        sources: [
          {
            name: 'Gartner Research',
            url: 'https://gartner.com/ai-crm-trends',
            credibility: 0.95
          }
        ],
        lastUpdated: new Date(),
        confidence: 0.88
      }
    ])

    // Mock competitive alerts
    this.competitiveAlerts.set(userId, [
      {
        id: 'alert-1',
        type: 'PRICING_CHANGE',
        title: 'Salesforce Announces Price Increase',
        description: 'Salesforce is increasing prices by 15% across all plans starting next quarter',
        competitorId: 'comp-1',
        impact: 'MEDIUM',
        urgency: 'HIGH',
        source: 'Salesforce Blog',
        url: 'https://salesforce.com/blog/pricing-update',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRead: false,
        isArchived: false,
        tags: ['pricing', 'salesforce', 'competitive'],
        recommendedActions: [
          'Review our pricing strategy for competitive advantage',
          'Prepare messaging about our value proposition',
          'Consider targeted campaigns to Salesforce customers'
        ]
      }
    ])

    // Mock market intelligence
    this.marketIntelligence.set(userId, [
      {
        id: 'intel-1',
        title: 'CRM Market Growth Analysis',
        description: 'Comprehensive analysis of CRM market growth and opportunities',
        category: 'MARKET_SIZE',
        insights: [
          'Global CRM market is expected to reach $96.4 billion by 2027',
          'SMB segment showing fastest growth at 12% annually',
          'Cloud-based solutions dominate with 85% market share'
        ],
        data: [
          {
            metric: 'Market Size',
            value: 96.4,
            unit: 'Billion USD',
            period: '2027',
            trend: 'INCREASING'
          },
          {
            metric: 'Growth Rate',
            value: 12,
            unit: '%',
            period: 'Annual',
            trend: 'INCREASING'
          }
        ],
        implications: [
          'Significant growth opportunity in SMB segment',
          'Cloud-first approach is essential',
          'Focus on user experience and ease of use'
        ],
        recommendations: [
          'Develop SMB-specific features and pricing',
          'Invest in cloud infrastructure and security',
          'Prioritize user experience and onboarding'
        ],
        sources: ['Gartner', 'Forrester', 'IDC'],
        confidence: 0.92,
        lastUpdated: new Date()
      }
    ])
  }

  /**
   * Get competitive dashboard data
   */
  async getCompetitiveDashboard(userId: string): Promise<CompetitiveDashboard> {
    const competitors = this.competitors.get(userId) || []
    const marketTrends = this.marketTrends.get(userId) || []
    const competitiveAlerts = this.competitiveAlerts.get(userId) || []
    const marketIntelligence = this.marketIntelligence.get(userId) || []

    const highThreatCompetitors = competitors.filter(c => c.threatLevel === 'HIGH' || c.threatLevel === 'CRITICAL').length
    const recentAlerts = competitiveAlerts.filter(a => !a.isRead && !a.isArchived).length
    const avgWinRate = competitors.length > 0 ? 
      competitors.reduce((sum, c) => sum + c.winRate, 0) / competitors.length : 0

    return {
      competitors,
      recentNews: competitors.flatMap(c => c.recentNews),
      marketTrends,
      competitiveAlerts,
      marketIntelligence,
      summary: {
        totalCompetitors: competitors.length,
        highThreatCompetitors,
        recentAlerts,
        marketTrends: marketTrends.length,
        winRate: avgWinRate,
        marketPosition: 'CHALLENGER'
      }
    }
  }

  /**
   * Get competitors for a user
   */
  async getCompetitors(userId: string): Promise<Competitor[]> {
    return this.competitors.get(userId) || []
  }

  /**
   * Add a new competitor
   */
  async addCompetitor(userId: string, competitor: Omit<Competitor, 'id' | 'lastAnalyzed' | 'winRate'>): Promise<Competitor> {
    const newCompetitor: Competitor = {
      ...competitor,
      id: `comp-${Date.now()}`,
      lastAnalyzed: new Date(),
      winRate: 0.5 // Default win rate
    }

    const competitors = this.competitors.get(userId) || []
    competitors.push(newCompetitor)
    this.competitors.set(userId, competitors)

    return newCompetitor
  }

  /**
   * Get market trends
   */
  async getMarketTrends(userId: string): Promise<MarketTrend[]> {
    return this.marketTrends.get(userId) || []
  }

  /**
   * Get competitive alerts
   */
  async getCompetitiveAlerts(userId: string, unreadOnly: boolean = false): Promise<CompetitiveAlert[]> {
    const alerts = this.competitiveAlerts.get(userId) || []
    return unreadOnly ? alerts.filter(a => !a.isRead) : alerts
  }

  /**
   * Mark alert as read
   */
  async markAlertAsRead(userId: string, alertId: string): Promise<void> {
    const alerts = this.competitiveAlerts.get(userId) || []
    const alert = alerts.find(a => a.id === alertId)
    if (alert) {
      alert.isRead = true
    }
  }

  /**
   * Get market intelligence
   */
  async getMarketIntelligence(userId: string): Promise<MarketIntelligence[]> {
    return this.marketIntelligence.get(userId) || []
  }

  /**
   * Create competitive analysis
   */
  async createCompetitiveAnalysis(userId: string, analysis: Omit<CompetitiveAnalysis, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompetitiveAnalysis> {
    const newAnalysis: CompetitiveAnalysis = {
      ...analysis,
      id: `analysis-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const analyses = this.competitiveAnalyses.get(userId) || []
    analyses.push(newAnalysis)
    this.competitiveAnalyses.set(userId, analyses)

    return newAnalysis
  }

  /**
   * Get competitive analyses
   */
  async getCompetitiveAnalyses(userId: string): Promise<CompetitiveAnalysis[]> {
    return this.competitiveAnalyses.get(userId) || []
  }

  /**
   * Analyze competitor threat level
   */
  async analyzeCompetitorThreat(competitor: Competitor): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> {
    // Mock threat analysis based on various factors
    let threatScore = 0

    // Market position factor
    switch (competitor.marketPosition) {
      case 'LEADER': threatScore += 3; break
      case 'CHALLENGER': threatScore += 2; break
      case 'FOLLOWER': threatScore += 1; break
      case 'NICHER': threatScore += 0; break
    }

    // Recent news sentiment
    const positiveNews = competitor.recentNews.filter(n => n.sentiment === 'POSITIVE').length
    const totalNews = competitor.recentNews.length
    if (totalNews > 0) {
      threatScore += (positiveNews / totalNews) * 2
    }

    // Social presence factor
    const totalFollowers = Object.values(competitor.socialPresence.followers).reduce((sum, count) => sum + count, 0)
    if (totalFollowers > 10000000) threatScore += 2
    else if (totalFollowers > 1000000) threatScore += 1

    // Determine threat level
    if (threatScore >= 6) return 'CRITICAL'
    if (threatScore >= 4) return 'HIGH'
    if (threatScore >= 2) return 'MEDIUM'
    return 'LOW'
  }

  /**
   * Generate competitive insights
   */
  async generateCompetitiveInsights(userId: string): Promise<{
    opportunities: string[]
    threats: string[]
    recommendations: string[]
  }> {
    const competitors = await this.getCompetitors(userId)
    const marketTrends = await this.getMarketTrends(userId)
    const alerts = await this.getCompetitiveAlerts(userId)

    const opportunities: string[] = []
    const threats: string[] = []
    const recommendations: string[] = []

    // Analyze pricing opportunities
    const avgCompetitorPrice = competitors.reduce((sum, c) => sum + c.pricing.range.min, 0) / competitors.length
    if (avgCompetitorPrice > 50) {
      opportunities.push('Pricing advantage - competitors have higher entry costs')
      recommendations.push('Consider competitive pricing strategy to capture market share')
    }

    // Analyze feature gaps
    const uniqueFeatures = competitors.flatMap(c => c.features.filter(f => f.isUnique))
    if (uniqueFeatures.length > 0) {
      opportunities.push('Feature differentiation opportunities identified')
      recommendations.push('Develop unique features to differentiate from competitors')
    }

    // Analyze market trends
    const positiveTrends = marketTrends.filter(t => t.impact === 'POSITIVE')
    if (positiveTrends.length > 0) {
      opportunities.push('Positive market trends support growth')
      recommendations.push('Align product roadmap with emerging market trends')
    }

    // Analyze threats
    const highThreatCompetitors = competitors.filter(c => c.threatLevel === 'HIGH' || c.threatLevel === 'CRITICAL')
    if (highThreatCompetitors.length > 0) {
      threats.push(`${highThreatCompetitors.length} high-threat competitors identified`)
      recommendations.push('Monitor high-threat competitors closely and develop counter-strategies')
    }

    const criticalAlerts = alerts.filter(a => a.impact === 'CRITICAL' && !a.isRead)
    if (criticalAlerts.length > 0) {
      threats.push(`${criticalAlerts.length} critical competitive alerts require immediate attention`)
      recommendations.push('Review and respond to critical competitive alerts')
    }

    return { opportunities, threats, recommendations }
  }
}

export const competitiveIntelligenceService = new CompetitiveIntelligenceService()
