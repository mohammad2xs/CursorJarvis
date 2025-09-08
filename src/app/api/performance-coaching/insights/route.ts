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

    // Mock performance insights
    const insights = [
      {
        id: 'insight-1',
        userId,
        insightType: 'STRENGTH',
        title: 'Strong Closing Skills',
        description: 'Your closing rate has improved by 15% over the last quarter, indicating strong closing abilities',
        category: 'Sales Performance',
        confidence: 0.85,
        impact: 'HIGH',
        actionable: true,
        recommendations: [
          'Leverage this strength in team training sessions',
          'Document your closing techniques for knowledge sharing',
          'Consider mentoring junior team members'
        ],
        dataPoints: [
          {
            metric: 'Closing Rate',
            value: 0.68,
            trend: 'IMPROVING',
            benchmark: 0.55
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'insight-2',
        userId,
        insightType: 'OPPORTUNITY',
        title: 'Discovery Call Improvement Opportunity',
        description: 'Discovery calls are taking 20% longer than industry average, suggesting room for efficiency improvement',
        category: 'Sales Efficiency',
        confidence: 0.78,
        impact: 'MEDIUM',
        actionable: true,
        recommendations: [
          'Practice time-boxing discovery questions',
          'Use structured discovery frameworks',
          'Record and review discovery calls for improvement'
        ],
        dataPoints: [
          {
            metric: 'Average Discovery Call Duration',
            value: 45,
            trend: 'STABLE',
            benchmark: 35
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'insight-3',
        userId,
        insightType: 'TREND',
        title: 'Increasing Email Response Time',
        description: 'Email response times have increased by 30% over the past month, potentially impacting customer satisfaction',
        category: 'Communication',
        confidence: 0.72,
        impact: 'MEDIUM',
        actionable: true,
        recommendations: [
          'Implement email templates for common responses',
          'Set up auto-responses for routine inquiries',
          'Use voice commands for quick responses'
        ],
        dataPoints: [
          {
            metric: 'Average Email Response Time',
            value: 2.5,
            trend: 'DECLINING',
            benchmark: 1.5
          }
        ],
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error fetching performance insights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance insights' },
      { status: 500 }
    )
  }
}
