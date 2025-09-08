import { NextRequest, NextResponse } from 'next/server'
import { getPredictiveAnalyticsService } from '@/lib/predictive-analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const analyticsService = getPredictiveAnalyticsService()
    const predictions = await analyticsService.predictDealClosure(userId)

    return NextResponse.json({
      success: true,
      predictions
    })

  } catch (error) {
    console.error('Deal closure prediction error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to predict deal closure'
    }, { status: 500 })
  }
}
