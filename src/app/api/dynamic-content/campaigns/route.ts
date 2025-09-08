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

    // Mock content campaigns
    const campaigns = [
      {
        id: 'campaign-1',
        userId,
        name: 'Q4 Enterprise Outreach',
        description: 'Multi-touch email sequence for enterprise prospects in Q4',
        type: 'EMAIL_SEQUENCE',
        status: 'ACTIVE',
        templates: [
          {
            templateId: 'template-1',
            order: 1,
            delay: 0,
            conditions: []
          },
          {
            templateId: 'template-2',
            order: 2,
            delay: 72,
            conditions: [
              {
                field: 'response_rate',
                operator: 'LESS_THAN',
                value: 0.1
              }
            ]
          }
        ],
        performance: {
          totalSent: 1250,
          openRate: 0.68,
          responseRate: 0.24,
          conversionRate: 0.08,
          avgResponseTime: 2.3
        },
        schedule: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'America/New_York',
          frequency: 'DAILY'
        },
        targetAudience: {
          criteria: {
            companySize: 'enterprise',
            industry: ['technology', 'manufacturing'],
            stage: 'prospect'
          },
          size: 500
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'campaign-2',
        userId,
        name: 'LinkedIn Connection Campaign',
        description: 'Automated LinkedIn connection requests for warm leads',
        type: 'LINKEDIN_OUTREACH',
        status: 'PAUSED',
        templates: [
          {
            templateId: 'template-2',
            order: 1,
            delay: 0,
            conditions: []
          }
        ],
        performance: {
          totalSent: 450,
          openRate: 0.45,
          responseRate: 0.18,
          conversionRate: 0.06,
          avgResponseTime: 1.8
        },
        schedule: {
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'America/New_York',
          frequency: 'WEEKLY'
        },
        targetAudience: {
          criteria: {
            platform: 'linkedin',
            connectionLevel: '2nd',
            industry: ['technology', 'consulting']
          },
          size: 200
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('Error fetching content campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, campaign } = body

    if (!userId || !campaign) {
      return NextResponse.json(
        { error: 'User ID and campaign data are required' },
        { status: 400 }
      )
    }

    // Create new campaign
    const newCampaign = {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ campaign: newCampaign })
  } catch (error) {
    console.error('Error creating content campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create content campaign' },
      { status: 500 }
    )
  }
}
