import { NextRequest, NextResponse } from 'next/server'
import { getPredictiveAnalyticsService } from '@/lib/predictive-analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { riskFactors } = body

    if (!riskFactors || !Array.isArray(riskFactors)) {
      return NextResponse.json({
        success: false,
        error: 'Risk factors array is required'
      }, { status: 400 })
    }

    const analyticsService = getPredictiveAnalyticsService()
    const strategies = await analyticsService.generateRiskMitigationStrategies(riskFactors)

    return NextResponse.json({
      success: true,
      strategies
    })

  } catch (error) {
    console.error('Mitigation strategies error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate mitigation strategies'
    }, { status: 500 })
  }
}
