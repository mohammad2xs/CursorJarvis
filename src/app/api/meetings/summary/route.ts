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
    const summary = await meetingIntelligenceService.generateSummary(meetingId, userId)

    return NextResponse.json({
      success: true,
      summary
    })

  } catch (error) {
    console.error('Generate summary error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate summary'
    }, { status: 500 })
  }
}

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
    const summary = await meetingIntelligenceService.getSummary(meetingId, userId)

    return NextResponse.json({
      success: true,
      summary
    })

  } catch (error) {
    console.error('Get summary error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get summary'
    }, { status: 500 })
  }
}
