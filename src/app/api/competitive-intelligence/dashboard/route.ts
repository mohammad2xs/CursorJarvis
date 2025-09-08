import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Mock competitive dashboard data
    const dashboard = {
      competitors: [
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
            lastUpdated: new Date().toISOString()
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
              publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
          lastAnalyzed: new Date().toISOString(),
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
            lastUpdated: new Date().toISOString()
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
          lastAnalyzed: new Date().toISOString(),
          threatLevel: 'MEDIUM',
          winRate: 0.65
        }
      ],
      recentNews: [
        {
          id: 'news-1',
          title: 'Salesforce Announces New AI Features',
          summary: 'Salesforce introduces new AI-powered automation features for sales teams',
          url: 'https://example.com/news1',
          source: 'TechCrunch',
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'POSITIVE',
          impact: 'HIGH',
          tags: ['AI', 'Automation', 'Sales'],
          relevance: 0.9
        }
      ],
      marketTrends: [
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
          lastUpdated: new Date().toISOString(),
          confidence: 0.88
        }
      ],
      competitiveAlerts: [
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
          publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          isArchived: false,
          tags: ['pricing', 'salesforce', 'competitive'],
          recommendedActions: [
            'Review our pricing strategy for competitive advantage',
            'Prepare messaging about our value proposition',
            'Consider targeted campaigns to Salesforce customers'
          ]
        }
      ],
      marketIntelligence: [
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
          lastUpdated: new Date().toISOString()
        }
      ],
      summary: {
        totalCompetitors: 2,
        highThreatCompetitors: 1,
        recentAlerts: 1,
        marketTrends: 1,
        winRate: 0.5,
        marketPosition: 'CHALLENGER'
      }
    }

    return NextResponse.json(dashboard)
  } catch (error) {
    console.error('Error fetching competitive dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitive dashboard' },
      { status: 500 }
    )
  }
}
