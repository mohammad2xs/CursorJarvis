import { NextRequest, NextResponse } from 'next/server'
import { behavioralLearningService } from '@/lib/behavioral-learning'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, timeRange } = body

    if (!userId || !timeRange) {
      return NextResponse.json(
        { error: 'User ID and time range are required' },
        { status: 400 }
      )
    }

    const patterns = await behavioralLearningService.analyzeBehaviorPatterns(
      userId,
      timeRange
    )

    return NextResponse.json({ patterns })
  } catch (error) {
    console.error('Error analyzing behavior patterns:', error)
    return NextResponse.json(
      { error: 'Failed to analyze behavior patterns' },
      { status: 500 }
    )
  }
}
