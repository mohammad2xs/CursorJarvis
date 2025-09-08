import { NextRequest, NextResponse } from 'next/server'
import { getPredictiveAnalyticsService } from '@/lib/predictive-analytics'

export async function POST(request: NextRequest) {
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
    const result = await analyticsService.retrainModels(userId)

    return NextResponse.json({
      success: result.success,
      message: result.message
    })

  } catch (error) {
    console.error('Model retraining error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrain models'
    }, { status: 500 })
  }
}
