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

    // Mock PhantomBuster phantoms data
    const phantoms = [
      {
        id: 'phantom-1',
        name: 'LinkedIn Profile Scraper',
        description: 'Scrapes LinkedIn profiles based on search criteria using Sales Navigator',
        category: 'LINKEDIN',
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        frequency: 'DAILY',
        isEnabled: true,
        parameters: {
          searchQuery: 'VP Sales Technology',
          maxResults: 100,
          includeContactInfo: true,
          useSalesNavigator: true
        },
        results: {
          totalRuns: 45,
          successfulRuns: 42,
          failedRuns: 3,
          lastResultCount: 87,
          averageResultCount: 92
        },
        createdAt: '2024-08-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'phantom-2',
        name: 'LinkedIn Connection Sender',
        description: 'Automatically sends connection requests with personalized messages',
        category: 'LINKEDIN',
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
        frequency: 'DAILY',
        isEnabled: true,
        parameters: {
          messageTemplate: 'Hi {{firstName}}, I\'d love to connect!',
          maxConnectionsPerDay: 50,
          delayBetweenActions: 120,
          usePersonalizedMessages: true
        },
        results: {
          totalRuns: 30,
          successfulRuns: 28,
          failedRuns: 2,
          lastResultCount: 45,
          averageResultCount: 48
        },
        createdAt: '2024-08-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'phantom-3',
        name: 'LinkedIn Message Sender',
        description: 'Sends personalized follow-up messages to connections',
        category: 'LINKEDIN',
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
        frequency: 'DAILY',
        isEnabled: true,
        parameters: {
          messageTemplate: 'Hi {{firstName}}, I hope you\'re doing well! I wanted to share some insights about AI-powered sales automation that might be relevant to your work at {{currentPosition.company}}.',
          maxMessagesPerDay: 25,
          delayBetweenActions: 180,
          targetNewConnections: true
        },
        results: {
          totalRuns: 25,
          successfulRuns: 23,
          failedRuns: 2,
          lastResultCount: 20,
          averageResultCount: 22
        },
        createdAt: '2024-09-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'phantom-4',
        name: 'LinkedIn Post Scheduler',
        description: 'Automatically schedules and posts content to LinkedIn',
        category: 'SOCIAL_MEDIA',
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        frequency: 'DAILY',
        isEnabled: true,
        parameters: {
          contentTemplate: 'Excited to share our latest insights on {{topic}}!',
          postingSchedule: ['09:00', '13:00', '17:00'],
          maxPostsPerDay: 3,
          includeHashtags: true
        },
        results: {
          totalRuns: 60,
          successfulRuns: 58,
          failedRuns: 2,
          lastResultCount: 3,
          averageResultCount: 3
        },
        createdAt: '2024-07-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'phantom-5',
        name: 'LinkedIn Engagement Bot',
        description: 'Automatically likes, comments, and shares relevant content',
        category: 'SOCIAL_MEDIA',
        status: 'INACTIVE',
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        nextRun: null,
        frequency: 'DAILY',
        isEnabled: false,
        parameters: {
          engagementTypes: ['like', 'comment', 'share'],
          maxEngagementsPerDay: 50,
          targetKeywords: ['sales', 'revenue', 'B2B'],
          delayBetweenActions: 60
        },
        results: {
          totalRuns: 40,
          successfulRuns: 35,
          failedRuns: 5,
          lastResultCount: 45,
          averageResultCount: 42
        },
        createdAt: '2024-06-20T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'phantom-6',
        name: 'Company Research Scraper',
        description: 'Scrapes company information and employee data for lead research',
        category: 'LEAD_GENERATION',
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        nextRun: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        frequency: 'WEEKLY',
        isEnabled: true,
        parameters: {
          targetCompanies: ['Acme Corp', 'TechStartup Inc', 'GrowthCorp'],
          includeEmployeeData: true,
          maxEmployeesPerCompany: 50,
          includeContactInfo: true
        },
        results: {
          totalRuns: 15,
          successfulRuns: 14,
          failedRuns: 1,
          lastResultCount: 150,
          averageResultCount: 145
        },
        createdAt: '2024-09-10T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json(phantoms)
  } catch (error) {
    console.error('Error fetching PhantomBuster phantoms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PhantomBuster phantoms' },
      { status: 500 }
    )
  }
}
