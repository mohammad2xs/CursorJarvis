import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsVoiceService } from '@/lib/elevenlabs-voice'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, voiceId, context, settings } = body

    if (!text) {
      return NextResponse.json({
        success: false,
        error: 'Text is required for synthesis'
      }, { status: 400 })
    }

    // Initialize voice service
    const voiceService = new ElevenLabsVoiceService(process.env.ELEVENLABS_API_KEY || '')
    
    // Get voice profile
    let voiceProfile
    if (voiceId) {
      voiceProfile = voiceService.getVoiceProfiles().find(v => v.voiceId === voiceId)
    } else if (context) {
      voiceProfile = voiceService.getBestVoiceForContext({
        useCase: context,
        audience: 'internal',
        tone: 'professional'
      })
    } else {
      voiceProfile = voiceService.getVoiceProfiles()[0]
    }

    if (!voiceProfile) {
      return NextResponse.json({
        success: false,
        error: 'Voice profile not found'
      }, { status: 404 })
    }

    // Synthesize speech
    const audioData = await voiceService.synthesizeSpeech({
      text,
      voiceProfile,
      ...settings
    })

    // Convert ArrayBuffer to base64 for transmission
    const buffer = Buffer.from(audioData)
    const base64Audio = buffer.toString('base64')

    return NextResponse.json({
      success: true,
      audioData: base64Audio,
      voiceProfile: {
        id: voiceProfile.id,
        name: voiceProfile.name,
        category: voiceProfile.category
      }
    })

  } catch (error) {
    console.error('ElevenLabs synthesis error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to synthesize speech'
    }, { status: 500 })
  }
}
