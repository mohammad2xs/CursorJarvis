import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsVoiceService } from '@/lib/elevenlabs-voice'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan } = body

    if (!plan) {
      return NextResponse.json({
        success: false,
        error: 'Daily plan details are required'
      }, { status: 400 })
    }

    const voiceService = new ElevenLabsVoiceService(process.env.ELEVENLABS_API_KEY || '')
    
    // Generate daily planning summary audio
    const audioData = await voiceService.generateDailyPlanningSummary(plan)

    // Convert ArrayBuffer to base64 for transmission
    const buffer = Buffer.from(audioData)
    const base64Audio = buffer.toString('base64')

    return NextResponse.json({
      success: true,
      audioData: base64Audio,
      plan
    })

  } catch (error) {
    console.error('Daily planning generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate daily planning summary'
    }, { status: 500 })
  }
}
