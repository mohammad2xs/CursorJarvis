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

    // Mock social selling insights data
    const insights = {
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
        },
        {
          type: 'POST',
          content: 'AI-powered sales automation: The future of revenue operations',
          engagement: 32,
          date: '2024-01-12T14:30:00Z'
        },
        {
          type: 'POST',
          content: '5 key metrics every sales leader should track in 2024',
          engagement: 28,
          date: '2024-01-10T11:15:00Z'
        }
      ],
      bestPostingTimes: ['09:00', '13:00', '17:00'],
      recommendedActions: [
        'Increase posting frequency to 3x per week',
        'Engage with industry leaders\' content',
        'Share case studies and success stories',
        'Join relevant LinkedIn groups',
        'Use more video content in posts',
        'Tag relevant connections in posts',
        'Share behind-the-scenes content'
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
          },
          {
            name: 'HubSpot',
            engagement: 0.15,
            followers: 300000,
            contentStrategy: 'Educational content and industry insights'
          },
          {
            name: 'Pipedrive',
            engagement: 0.08,
            followers: 150000,
            contentStrategy: 'Product-focused and customer success stories'
          }
        ],
        marketOpportunities: [
          'AI-powered sales automation',
          'Revenue operations optimization',
          'Sales team productivity tools',
          'Predictive analytics for sales',
          'Social selling automation'
        ],
        contentGaps: [
          'Video content',
          'Interactive posts',
          'Industry-specific case studies',
          'Live streaming',
          'User-generated content'
        ]
      }
    }

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error fetching social selling insights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social selling insights' },
      { status: 500 }
    )
  }
}
