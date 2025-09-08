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

    // Mock performance alerts data
    const alerts = [
      {
        id: 'alert-1',
        userId,
        type: 'GOAL_AT_RISK',
        severity: 'MEDIUM',
        title: 'Email Response Time Goal At Risk',
        description: 'Current response time of 2.5 hours exceeds target of 2 hours',
        metric: 'email_response_time',
        currentValue: 2.5,
        expectedValue: 2.0,
        threshold: 2.0,
        impact: 'NEGATIVE',
        recommendations: [
          'Set up email templates for common responses',
          'Use voice commands for quick replies',
          'Block time for email responses'
        ],
        actions: ['Review email templates', 'Enable voice commands', 'Schedule email blocks'],
        isRead: false,
        isResolved: false,
        createdAt: '2024-01-14T00:00:00.000Z',
        updatedAt: '2024-01-14T00:00:00.000Z'
      },
      {
        id: 'alert-2',
        userId,
        type: 'EXCEPTIONAL_PERFORMANCE',
        severity: 'LOW',
        title: 'Outstanding Client Satisfaction Score',
        description: 'Client satisfaction score of 4.6 exceeds team average of 4.2',
        metric: 'client_satisfaction',
        currentValue: 4.6,
        expectedValue: 4.2,
        threshold: 4.0,
        impact: 'POSITIVE',
        recommendations: [
          'Share best practices with team',
          'Document successful strategies',
          'Mentor junior team members'
        ],
        actions: ['Schedule team knowledge sharing', 'Update best practices doc'],
        isRead: true,
        isResolved: false,
        createdAt: '2024-01-13T00:00:00.000Z',
        updatedAt: '2024-01-13T00:00:00.000Z'
      },
      {
        id: 'alert-3',
        userId,
        type: 'PERFORMANCE_DROP',
        severity: 'HIGH',
        title: 'Focus Time Decreased Significantly',
        description: 'Focus time dropped from 22 hours to 18.5 hours this week',
        metric: 'focus_time',
        currentValue: 18.5,
        expectedValue: 22.0,
        threshold: 20.0,
        impact: 'NEGATIVE',
        recommendations: [
          'Review calendar for unnecessary meetings',
          'Block focus time in calendar',
          'Use do-not-disturb mode during focus blocks'
        ],
        actions: ['Audit calendar', 'Set up focus time blocks', 'Enable DND mode'],
        isRead: false,
        isResolved: false,
        createdAt: '2024-01-14T00:00:00.000Z',
        updatedAt: '2024-01-14T00:00:00.000Z'
      },
      {
        id: 'alert-4',
        userId,
        type: 'MILESTONE_MISSED',
        severity: 'MEDIUM',
        title: 'Social Media Engagement Milestone Missed',
        description: 'Failed to achieve 12% engagement rate milestone',
        metric: 'social_engagement_rate',
        currentValue: 0.10,
        expectedValue: 0.12,
        threshold: 0.12,
        impact: 'NEGATIVE',
        recommendations: [
          'Post more engaging content',
          'Use relevant hashtags',
          'Engage with others\' content more actively'
        ],
        actions: ['Review content strategy', 'Update hashtag strategy', 'Increase engagement'],
        isRead: true,
        isResolved: false,
        createdAt: '2024-01-12T00:00:00.000Z',
        updatedAt: '2024-01-12T00:00:00.000Z'
      },
      {
        id: 'alert-5',
        userId,
        type: 'SYSTEM_ISSUE',
        severity: 'LOW',
        title: 'Voice Commands Usage Below Expected',
        description: 'Voice commands usage is 23 this week, below expected 30',
        metric: 'voice_commands_used',
        currentValue: 23,
        expectedValue: 30,
        threshold: 25,
        impact: 'NEUTRAL',
        recommendations: [
          'Enable voice commands for common tasks',
          'Use voice for quick responses',
          'Set up voice shortcuts'
        ],
        actions: ['Enable voice commands', 'Set up shortcuts', 'Practice voice usage'],
        isRead: false,
        isResolved: false,
        createdAt: '2024-01-14T00:00:00.000Z',
        updatedAt: '2024-01-14T00:00:00.000Z'
      }
    ]

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching performance alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance alerts' },
      { status: 500 }
    )
  }
}
