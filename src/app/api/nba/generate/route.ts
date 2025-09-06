import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { companyIds } = await request.json()
    
    if (!companyIds || !Array.isArray(companyIds)) {
      return NextResponse.json(
        { error: 'companyIds array is required' },
        { status: 400 }
      )
    }

    // Generate mock NBAs since database is not configured
    const mockNBAs = [
      {
        id: 'nba-1',
        playType: 'PRE_MEETING',
        title: 'Prepare Discovery Call Brief',
        description: 'Generate comprehensive meeting brief for upcoming discovery call with key stakeholders',
        rationale: 'High priority due to upcoming meeting in 2 hours. Brief will include company research, discovery questions, and value propositions.',
        source: 'Meeting Calendar + Company Priority',
        status: 'PENDING',
        priority: 5,
        companyId: companyIds[0] || 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-2',
        playType: 'VP_CMO_NO_TOUCH',
        title: 'Executive Engagement Campaign',
        description: 'Reach out to C-level executives with personalized value proposition and industry insights',
        rationale: 'No touch for 14+ days. Executive engagement critical for strategic deals.',
        source: 'Account Health Monitor',
        status: 'PENDING',
        priority: 4,
        companyId: companyIds[1] || 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-3',
        playType: 'ENGAGEMENT_DETECTED',
        title: 'Follow Up on Recent Activity',
        description: 'Respond to recent website visits and content engagement with personalized outreach',
        rationale: 'High engagement detected in last 24 hours. Strike while interest is hot.',
        source: 'Website Analytics + Marketing Automation',
        status: 'PENDING',
        priority: 4,
        companyId: companyIds[2] || 'comp_3',
        contactId: 'contact_3',
        opportunityId: 'opp_3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-4',
        playType: 'PERPLEXITY_NEWS',
        title: 'News-Driven Outreach',
        description: 'Leverage recent company news and industry developments for timely outreach',
        rationale: 'Recent funding announcement creates perfect timing for solution discussion.',
        source: 'Perplexity News Monitor',
        status: 'PENDING',
        priority: 3,
        companyId: companyIds[0] || 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-5',
        playType: 'OPP_IDLE',
        title: 'Re-engage Stalled Opportunity',
        description: 'Re-ignite stalled deal with new value proposition and competitive intelligence',
        rationale: 'Deal stalled for 21+ days. Need fresh approach to re-engage decision makers.',
        source: 'Pipeline Health Monitor',
        status: 'PENDING',
        priority: 3,
        companyId: companyIds[1] || 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Sort by priority
    const sortedNBAs = mockNBAs.sort((a, b) => b.priority - a.priority)

    return NextResponse.json({ nbas: sortedNBAs })
  } catch (error) {
    console.error('Error generating NBAs:', error)
    return NextResponse.json(
      { error: 'Failed to generate NBAs' },
      { status: 500 }
    )
  }
}
