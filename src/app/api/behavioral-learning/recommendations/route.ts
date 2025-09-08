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

    const recommendations = await behavioralLearningService.getPersonalizedRecommendations(userId)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
