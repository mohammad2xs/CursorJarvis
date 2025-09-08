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

    // Mock coaching goals
    const goals = [
      {
        id: 'goal-1',
        userId,
        title: 'Improve Discovery Call Skills',
        description: 'Enhance ability to conduct effective discovery calls and uncover customer pain points',
        category: 'SALES_SKILLS',
        priority: 'HIGH',
        currentLevel: 6,
        targetLevel: 8,
        progress: 45,
        estimatedTimeToComplete: 30,
        skills: ['Discovery Questions', 'Active Listening', 'Pain Point Identification'],
        resources: [
          {
            id: 'res-1',
            title: 'The Art of Discovery Calls',
            type: 'COURSE',
            duration: 120,
            difficulty: 'INTERMEDIATE',
            description: 'Comprehensive course on conducting effective discovery calls',
            tags: ['Sales', 'Discovery', 'Communication'],
            rating: 4.5,
            completionStatus: 'IN_PROGRESS'
          }
        ],
        milestones: [
          {
            id: 'milestone-1',
            title: 'Complete Discovery Call Course',
            description: 'Finish the comprehensive discovery call training',
            targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            metrics: [
              {
                name: 'Course Progress',
                currentValue: 60,
                targetValue: 100,
                unit: '%'
              }
            ]
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({ goals })
  } catch (error) {
    console.error('Error fetching coaching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coaching goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, goal } = body

    if (!userId || !goal) {
      return NextResponse.json(
        { error: 'User ID and goal data are required' },
        { status: 400 }
      )
    }

    // Create new goal
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ goal: newGoal })
  } catch (error) {
    console.error('Error creating coaching goal:', error)
    return NextResponse.json(
      { error: 'Failed to create coaching goal' },
      { status: 500 }
    )
  }
}
