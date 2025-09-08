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
    const insights = await analyticsService.getAnalyticsInsights(userId)

    return NextResponse.json({
      success: true,
      insights
    })

  } catch (error) {
    console.error('Analytics insights error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate analytics insights'
    }, { status: 500 })
  }
}
