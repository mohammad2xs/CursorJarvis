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

    // Mock performance goals data
    const goals = [
      {
        id: 'goal-1',
        userId,
        title: 'Q1 Revenue Target',
        description: 'Achieve $500K in revenue for Q1 2024',
        category: 'SALES',
        type: 'REVENUE',
        target: 500000,
        current: 375000,
        unit: 'USD',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-03-31T00:00:00.000Z',
        status: 'ON_TRACK',
        priority: 'HIGH',
        progress: 0.75,
        milestones: [
          {
            id: 'milestone-1',
            title: 'January Target',
            target: 150000,
            current: 150000,
            completed: true,
            dueDate: '2024-01-31T00:00:00.000Z'
          },
          {
            id: 'milestone-2',
            title: 'February Target',
            target: 150000,
            current: 125000,
            completed: false,
            dueDate: '2024-02-29T00:00:00.000Z'
          }
        ],
        dependencies: [],
        assignedBy: 'manager-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-14T00:00:00.000Z'
      },
      {
        id: 'goal-2',
        userId,
        title: 'Improve Email Response Time',
        description: 'Reduce average email response time to under 2 hours',
        category: 'COMMUNICATION',
        type: 'EFFICIENCY',
        target: 2,
        current: 2.5,
        unit: 'hours',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-02-29T00:00:00.000Z',
        status: 'AT_RISK',
        priority: 'MEDIUM',
        progress: 0.6,
        milestones: [
          {
            id: 'milestone-3',
            title: 'Week 1-2: 2.3 hours',
            target: 2.3,
            current: 2.5,
            completed: false,
            dueDate: '2024-01-14T00:00:00.000Z'
          }
        ],
        dependencies: [],
        assignedBy: 'user-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-14T00:00:00.000Z'
      },
      {
        id: 'goal-3',
        userId,
        title: 'Increase Social Media Engagement',
        description: 'Achieve 15% engagement rate on LinkedIn posts',
        category: 'COMMUNICATION',
        type: 'ENGAGEMENT',
        target: 0.15,
        current: 0.12,
        unit: 'percentage',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-03-31T00:00:00.000Z',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        progress: 0.8,
        milestones: [
          {
            id: 'milestone-4',
            title: 'Week 1-4: 10% engagement',
            target: 0.10,
            current: 0.10,
            completed: true,
            dueDate: '2024-01-28T00:00:00.000Z'
          },
          {
            id: 'milestone-5',
            title: 'Week 5-8: 12% engagement',
            target: 0.12,
            current: 0.12,
            completed: true,
            dueDate: '2024-02-25T00:00:00.000Z'
          }
        ],
        dependencies: [],
        assignedBy: 'user-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-14T00:00:00.000Z'
      },
      {
        id: 'goal-4',
        userId,
        title: 'Complete AI Training Program',
        description: 'Finish the advanced AI tools certification course',
        category: 'LEARNING',
        type: 'SKILL',
        target: 1,
        current: 0.6,
        unit: 'certification',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-02-15T00:00:00.000Z',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 0.6,
        milestones: [
          {
            id: 'milestone-6',
            title: 'Module 1-3 Complete',
            target: 0.5,
            current: 0.5,
            completed: true,
            dueDate: '2024-01-15T00:00:00.000Z'
          },
          {
            id: 'milestone-7',
            title: 'Module 4-6 Complete',
            target: 1,
            current: 0.6,
            completed: false,
            dueDate: '2024-02-15T00:00:00.000Z'
          }
        ],
        dependencies: [],
        assignedBy: 'manager-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-14T00:00:00.000Z'
      }
    ]

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching performance goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance goals' },
      { status: 500 }
    )
  }
}
