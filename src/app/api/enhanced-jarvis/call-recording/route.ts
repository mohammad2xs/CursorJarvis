import { NextRequest, NextResponse } from 'next/server'
import { enhancedCursorJarvisService } from '@/lib/enhanced-cursor-jarvis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, contactId, opportunityId, recordingUrl, transcript, duration, participants } = body

    if (!accountId || !transcript) {
      return NextResponse.json(
        { error: 'Account ID and transcript are required' },
        { status: 400 }
      )
    }

    const result = await enhancedCursorJarvisService.processCallRecording({
      accountId,
      contactId,
      opportunityId,
      recordingUrl,
      transcript,
      duration: duration || 0,
      participants: participants || []
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing call recording:', error)
    return NextResponse.json(
      { error: 'Failed to process call recording' },
      { status: 500 }
    )
  }
}
