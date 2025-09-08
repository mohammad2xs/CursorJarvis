import { NextRequest, NextResponse } from 'next/server'
import { getMeetingIntelligenceService } from '@/lib/meeting-intelligence'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const meetingId = searchParams.get('meetingId')
    const userId = searchParams.get('userId')

    if (!meetingId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Meeting ID and User ID are required'
      }, { status: 400 })
    }

    const meetingIntelligenceService = getMeetingIntelligenceService()
    const insights = await meetingIntelligenceService.getInsights(meetingId, userId)

    return NextResponse.json({
      success: true,
      insights
    })

  } catch (error) {
    console.error('Get insights error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get insights'
    }, { status: 500 })
  }
}
