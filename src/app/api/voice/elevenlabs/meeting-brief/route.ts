import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsVoiceService } from '@/lib/elevenlabs-voice'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { meetingDetails } = body

    if (!meetingDetails) {
      return NextResponse.json({
        success: false,
        error: 'Meeting details are required'
      }, { status: 400 })
    }

    const voiceService = new ElevenLabsVoiceService(process.env.ELEVENLABS_API_KEY || '')
    
    // Generate meeting brief audio
    const audioData = await voiceService.generateMeetingBrief(meetingDetails)

    // Convert ArrayBuffer to base64 for transmission
    const buffer = Buffer.from(audioData)
    const base64Audio = buffer.toString('base64')

    return NextResponse.json({
      success: true,
      audioData: base64Audio,
      meetingDetails
    })

  } catch (error) {
    console.error('Meeting brief generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate meeting brief'
    }, { status: 500 })
  }
}
