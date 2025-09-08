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

    // Mock LinkedIn campaigns data
    const campaigns = [
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
          startDate: '2024-10-01T00:00:00.000Z',
          endDate: '2024-12-31T00:00:00.000Z',
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
        createdAt: '2024-09-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'campaign-2',
        name: 'Tech Startup Outreach',
        description: 'Targeted outreach to CTOs and technical decision makers at startups',
        type: 'MESSAGE',
        status: 'PAUSED',
        targetAudience: {
          keywords: ['CTO', 'VP Engineering', 'Head of Technology'],
          location: ['San Francisco', 'Austin', 'Seattle'],
          industry: ['Technology', 'Software', 'SaaS'],
          companySize: ['1-50', '51-200'],
          jobTitle: ['CTO', 'VP Engineering', 'Head of Technology'],
          seniority: ['Senior', 'Executive'],
          company: [],
          school: [],
          skills: ['Software Development', 'Technology Leadership', 'AI'],
          yearsOfExperience: { min: 3, max: 10 },
          mutualConnections: { min: 0, max: 20 },
          lastActivity: '14 days',
          premiumOnly: false,
          verifiedOnly: false
        },
        content: {
          message: 'Hi {{firstName}}, I saw your work at {{currentPosition.company}} and was impressed by your {{currentPosition.title}} role. I\'d love to share how our AI-powered sales platform has helped similar tech startups scale their revenue operations.',
          subject: 'AI Sales Platform for Tech Startups'
        },
        schedule: {
          startDate: '2024-11-01T00:00:00.000Z',
          endDate: '2024-12-31T00:00:00.000Z',
          timezone: 'America/New_York',
          frequency: 'WEEKLY',
          maxActionsPerDay: 25,
          workingHours: {
            start: '10:00',
            end: '16:00'
          }
        },
        settings: {
          delayBetweenActions: 5,
          randomizeDelay: true,
          skipWeekends: true,
          skipHolidays: true,
          maxConnectionsPerDay: 25,
          maxMessagesPerDay: 15,
          maxFollowsPerDay: 50
        },
        metrics: {
          totalTargets: 500,
          actionsCompleted: 75,
          connectionsSent: 60,
          connectionsAccepted: 12,
          messagesSent: 12,
          messagesReplied: 3,
          followsCompleted: 0,
          likesCompleted: 0,
          commentsCompleted: 0,
          sharesCompleted: 0,
          endorsementsCompleted: 0,
          successRate: 0.20,
          responseRate: 0.25,
          conversionRate: 0.04
        },
        createdAt: '2024-10-20T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'campaign-3',
        name: 'Revenue Operations Follow-up',
        description: 'Follow-up campaign for existing connections in revenue operations',
        type: 'MESSAGE',
        status: 'DRAFT',
        targetAudience: {
          keywords: ['Revenue Operations', 'Sales Operations', 'RevOps'],
          location: ['San Francisco', 'New York', 'Austin', 'Chicago'],
          industry: ['Technology', 'Software', 'SaaS'],
          companySize: ['201-500', '501-1000', '1001-5000'],
          jobTitle: ['Head of Revenue Operations', 'Revenue Operations Manager', 'Sales Operations Manager'],
          seniority: ['Senior', 'Executive'],
          company: [],
          school: [],
          skills: ['Revenue Operations', 'Sales Analytics', 'CRM Management'],
          yearsOfExperience: { min: 3, max: 12 },
          mutualConnections: { min: 1, max: 100 },
          lastActivity: '7 days',
          premiumOnly: false,
          verifiedOnly: false
        },
        content: {
          message: 'Hi {{firstName}}, I hope you\'re doing well! I wanted to follow up on our previous conversation about revenue operations optimization. I have some new insights about AI-powered sales analytics that might be relevant to your work at {{currentPosition.company}}.',
          subject: 'Follow-up: AI Sales Analytics Insights'
        },
        schedule: {
          startDate: '2024-12-01T00:00:00.000Z',
          endDate: '2024-12-31T00:00:00.000Z',
          timezone: 'America/New_York',
          frequency: 'WEEKLY',
          maxActionsPerDay: 20,
          workingHours: {
            start: '09:00',
            end: '17:00'
          }
        },
        settings: {
          delayBetweenActions: 3,
          randomizeDelay: true,
          skipWeekends: true,
          skipHolidays: true,
          maxConnectionsPerDay: 20,
          maxMessagesPerDay: 15,
          maxFollowsPerDay: 30
        },
        metrics: {
          totalTargets: 200,
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
        createdAt: '2024-11-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Error fetching LinkedIn campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn campaigns' },
      { status: 500 }
    )
  }
}
