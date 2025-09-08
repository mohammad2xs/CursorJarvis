import { NextRequest, NextResponse } from 'next/server'
import { behavioralLearningService } from '@/lib/behavioral-learning'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const insights = await behavioralLearningService.generateLearningInsights(userId)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating learning insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate learning insights' },
      { status: 500 }
    )
  }
}
