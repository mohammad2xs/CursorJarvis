import { NextRequest, NextResponse } from 'next/server'
import { getMeetingIntelligenceService } from '@/lib/meeting-intelligence'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, config } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const meetingIntelligenceService = getMeetingIntelligenceService()
    const result = await meetingIntelligenceService.startTranscription(
      `meeting-${Date.now()}`,
      userId,
      config
    )

    return NextResponse.json({
      success: true,
      meetingId: result.sessionId,
      sessionId: result.sessionId,
      websocketUrl: result.websocketUrl
    })

  } catch (error) {
    console.error('Start transcription error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to start transcription'
    }, { status: 500 })
  }
}
