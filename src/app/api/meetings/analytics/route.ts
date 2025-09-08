import { NextRequest, NextResponse } from 'next/server'
import { getMeetingIntelligenceService } from '@/lib/meeting-intelligence'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { meetingId, userId } = body

    if (!meetingId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Meeting ID and User ID are required'
      }, { status: 400 })
    }

    const meetingIntelligenceService = getMeetingIntelligenceService()
    const analytics = await meetingIntelligenceService.generateAnalytics(meetingId, userId)

    return NextResponse.json({
      success: true,
      analytics
    })

  } catch (error) {
    console.error('Generate analytics error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate analytics'
    }, { status: 500 })
  }
}
