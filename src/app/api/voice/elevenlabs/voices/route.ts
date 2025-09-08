import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsVoiceService } from '@/lib/elevenlabs-voice'

export async function GET() {
  try {
    const voiceService = new ElevenLabsVoiceService(process.env.ELEVENLABS_API_KEY || '')
    const voices = voiceService.getVoiceProfiles()

    return NextResponse.json({
      success: true,
      voices
    })

  } catch (error) {
    console.error('ElevenLabs voices error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch voices'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, files, category, gender, age, accent } = body

    if (!name || !files || files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Name and audio files are required for voice cloning'
      }, { status: 400 })
    }

    const voiceService = new ElevenLabsVoiceService(process.env.ELEVENLABS_API_KEY || '')
    
    // Convert base64 files to File objects
    const fileObjects = files.map((fileData: { name: string; data: string }) => {
      const buffer = Buffer.from(fileData.data, 'base64')
      return new File([buffer], fileData.name, { type: 'audio/mpeg' })
    })

    const voiceProfile = await voiceService.cloneVoice({
      name,
      description,
      files: fileObjects,
      category,
      gender,
      age,
      accent
    })

    return NextResponse.json({
      success: true,
      voiceProfile
    })

  } catch (error) {
    console.error('ElevenLabs voice cloning error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clone voice'
    }, { status: 500 })
  }
}
