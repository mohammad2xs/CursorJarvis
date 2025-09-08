import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsVoiceService } from '@/lib/elevenlabs-voice'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nba } = body

    if (!nba) {
      return NextResponse.json({
        success: false,
        error: 'NBA details are required'
      }, { status: 400 })
    }

    const voiceService = new ElevenLabsVoiceService(process.env.ELEVENLABS_API_KEY || '')
    
    // Generate NBA notification audio
    const audioData = await voiceService.generateNBANotification(nba)

    // Convert ArrayBuffer to base64 for transmission
    const buffer = Buffer.from(audioData)
    const base64Audio = buffer.toString('base64')

    return NextResponse.json({
      success: true,
      audioData: base64Audio,
      nba
    })

  } catch (error) {
    console.error('NBA notification generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate NBA notification'
    }, { status: 500 })
  }
}
