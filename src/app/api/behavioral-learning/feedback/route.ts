import { NextRequest, NextResponse } from 'next/server'
import { behavioralLearningService } from '@/lib/behavioral-learning'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, recommendationId, rating } = body

    if (!userId || !recommendationId || rating === undefined) {
      return NextResponse.json(
        { error: 'User ID, recommendation ID, and rating are required' },
        { status: 400 }
      )
    }

    // Update behavior patterns based on feedback
    await behavioralLearningService.updateBehaviorPatterns(userId, {
      patternId: recommendationId,
      accuracy: Math.abs(rating) === 1 ? 0.8 : 0.5, // Higher accuracy for positive feedback
      userSatisfaction: rating === 1 ? 0.9 : rating === -1 ? 0.1 : 0.5,
      implementationSuccess: rating === 1
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
