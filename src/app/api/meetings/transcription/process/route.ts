import { NextRequest, NextResponse } from 'next/server'
import { getMeetingIntelligenceService } from '@/lib/meeting-intelligence'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { meetingId, transcriptData } = body

    if (!meetingId || !transcriptData) {
      return NextResponse.json({
        success: false,
        error: 'Meeting ID and transcript data are required'
      }, { status: 400 })
    }

    const meetingIntelligenceService = getMeetingIntelligenceService()
    const transcript = await meetingIntelligenceService.processTranscript(meetingId, transcriptData)

    return NextResponse.json({
      success: true,
      transcript
    })

  } catch (error) {
    console.error('Process transcript error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process transcript'
    }, { status: 500 })
  }
}
