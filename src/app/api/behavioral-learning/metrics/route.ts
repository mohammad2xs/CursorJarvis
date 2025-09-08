import { NextRequest, NextResponse } from 'next/server'
import { behavioralLearningService } from '@/lib/behavioral-learning'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') as 'DAILY' | 'WEEKLY' | 'MONTHLY' || 'WEEKLY'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const metrics = await behavioralLearningService.trackBehaviorMetrics(userId, period)

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error tracking behavior metrics:', error)
    return NextResponse.json(
      { error: 'Failed to track behavior metrics' },
      { status: 500 }
    )
  }
}
