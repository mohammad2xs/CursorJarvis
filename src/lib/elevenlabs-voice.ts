import { ElevenLabs } from '@elevenlabs/elevenlabs-js'

export interface VoiceSettings {
  stability: number
  similarityBoost: number
  style?: number
  useSpeakerBoost?: boolean
}

export interface VoiceProfile {
  id: string
  name: string
  description: string
  category: 'professional' | 'friendly' | 'authoritative' | 'conversational' | 'custom'
  gender: 'male' | 'female' | 'neutral'
  age: 'young' | 'adult' | 'mature'
  accent: 'american' | 'british' | 'australian' | 'neutral'
  useCase: 'meetings' | 'presentations' | 'calls' | 'notifications' | 'general'
  isCustom: boolean
  voiceId?: string
}

export interface VoiceSynthesisOptions {
  text: string
  voiceId?: string
  voiceProfile?: VoiceProfile
  stability?: number
  similarityBoost?: number
  style?: number
  useSpeakerBoost?: boolean
  modelId?: string
  outputFormat?: 'mp3_44100_128' | 'mp3_44100_192' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100'
}

export interface VoiceCloningOptions {
  name: string
  description: string
  files: File[]
  category?: string
  gender?: string
  age?: string
  accent?: string
}

export interface VoiceAnalysis {
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'calm' | 'confident'
  energy: number // 0-100
  clarity: number // 0-100
  pace: number // words per minute
  pitch: number // Hz
  confidence: number // 0-100
}

export class ElevenLabsVoiceService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private api: any
  private apiKey: string
  private defaultVoiceId: string
  private voiceProfiles: VoiceProfile[] = []

  constructor(apiKey: string) {
    this.apiKey = apiKey
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.api = (ElevenLabs as any)({
      apiKey: this.apiKey
    })
    this.defaultVoiceId = 'pNInz6obpgDQGcFmaJgB' // Adam - Professional male voice
    this.initializeVoiceProfiles()
  }

  private initializeVoiceProfiles(): void {
    this.voiceProfiles = [
      // Professional Voices
      {
        id: 'professional-male-1',
        name: 'Adam Professional',
        description: 'Confident, authoritative male voice perfect for business meetings and presentations',
        category: 'professional',
        gender: 'male',
        age: 'adult',
        accent: 'american',
        useCase: 'meetings',
        isCustom: false,
        voiceId: 'pNInz6obpgDQGcFmaJgB'
      },
      {
        id: 'professional-female-1',
        name: 'Sarah Executive',
        description: 'Clear, professional female voice ideal for client calls and executive communications',
        category: 'professional',
        gender: 'female',
        age: 'adult',
        accent: 'american',
        useCase: 'presentations',
        isCustom: false,
        voiceId: 'EXAVITQu4vr4xnSDxMaL'
      },
      {
        id: 'professional-male-2',
        name: 'James British',
        description: 'Sophisticated British male voice for international business communications',
        category: 'professional',
        gender: 'male',
        age: 'mature',
        accent: 'british',
        useCase: 'calls',
        isCustom: false,
        voiceId: 'VR6AewLTigWG4xSOukaG'
      },

      // Friendly Voices
      {
        id: 'friendly-female-1',
        name: 'Emma Friendly',
        description: 'Warm, approachable female voice perfect for customer interactions and onboarding',
        category: 'friendly',
        gender: 'female',
        age: 'young',
        accent: 'american',
        useCase: 'calls',
        isCustom: false,
        voiceId: 'MF3mGyEYCl7XYWbV9V6O'
      },
      {
        id: 'friendly-male-1',
        name: 'Alex Conversational',
        description: 'Casual, friendly male voice great for internal communications and team updates',
        category: 'friendly',
        gender: 'male',
        age: 'adult',
        accent: 'american',
        useCase: 'notifications',
        isCustom: false,
        voiceId: 'VR6AewLTigWG4xSOukaG'
      },

      // Authoritative Voices
      {
        id: 'authoritative-male-1',
        name: 'Marcus Executive',
        description: 'Deep, commanding male voice for leadership communications and important announcements',
        category: 'authoritative',
        gender: 'male',
        age: 'mature',
        accent: 'american',
        useCase: 'presentations',
        isCustom: false,
        voiceId: 'pNInz6obpgDQGcFmaJgB'
      },

      // Conversational Voices
      {
        id: 'conversational-female-1',
        name: 'Luna Natural',
        description: 'Natural, conversational female voice that sounds human and engaging',
        category: 'conversational',
        gender: 'female',
        age: 'adult',
        accent: 'american',
        useCase: 'general',
        isCustom: false,
        voiceId: 'EXAVITQu4vr4xnSDxMaL'
      }
    ]
  }

  /**
   * Get all available voice profiles
   */
  getVoiceProfiles(): VoiceProfile[] {
    return this.voiceProfiles
  }

  /**
   * Get voice profiles by category
   */
  getVoiceProfilesByCategory(category: string): VoiceProfile[] {
    return this.voiceProfiles.filter(profile => profile.category === category)
  }

  /**
   * Get voice profiles by use case
   */
  getVoiceProfilesByUseCase(useCase: string): VoiceProfile[] {
    return this.voiceProfiles.filter(profile => profile.useCase === useCase)
  }

  /**
   * Get the best voice profile for a specific context
   */
  getBestVoiceForContext(context: {
    useCase: string
    audience: 'internal' | 'external' | 'executive' | 'customer'
    tone: 'professional' | 'friendly' | 'authoritative' | 'conversational'
    gender?: 'male' | 'female' | 'neutral'
  }): VoiceProfile {
    let candidates = this.voiceProfiles.filter(profile => 
      profile.useCase === context.useCase || profile.useCase === 'general'
    )

    // Filter by tone/category
    candidates = candidates.filter(profile => 
      profile.category === context.tone || 
      (context.tone === 'professional' && profile.category === 'authoritative')
    )

    // Filter by gender if specified
    if (context.gender && context.gender !== 'neutral') {
      candidates = candidates.filter(profile => profile.gender === context.gender)
    }

    // Filter by audience
    if (context.audience === 'executive') {
      candidates = candidates.filter(profile => 
        profile.category === 'professional' || profile.category === 'authoritative'
      )
    } else if (context.audience === 'customer') {
      candidates = candidates.filter(profile => 
        profile.category === 'friendly' || profile.category === 'conversational'
      )
    }

    // Return the first match, or default if none found
    return candidates[0] || this.voiceProfiles[0]
  }

  /**
   * Synthesize speech from text using ElevenLabs
   */
  async synthesizeSpeech(options: VoiceSynthesisOptions): Promise<ArrayBuffer> {
    try {
      const voiceId = options.voiceId || options.voiceProfile?.voiceId || this.defaultVoiceId
      
      const voiceSettings: VoiceSettings = {
        stability: options.stability ?? 0.5,
        similarityBoost: options.similarityBoost ?? 0.75,
        style: options.style ?? 0.0,
        useSpeakerBoost: options.useSpeakerBoost ?? true
      }

      const response = await this.api.textToSpeech.convertAsStream({
        voiceId,
        text: options.text,
        modelId: options.modelId || 'eleven_multilingual_v2',
        voiceSettings,
        outputFormat: options.outputFormat || 'mp3_44100_192'
      })

      // Convert stream to ArrayBuffer
      const chunks: Uint8Array[] = []
      const reader = response.getReader()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0
      
      for (const chunk of chunks) {
        result.set(chunk, offset)
        offset += chunk.length
      }

      return result.buffer
    } catch (error) {
      console.error('ElevenLabs synthesis error:', error)
      throw new Error(`Failed to synthesize speech: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create audio blob from ArrayBuffer
   */
  createAudioBlob(audioData: ArrayBuffer, format: string = 'audio/mpeg'): Blob {
    return new Blob([audioData], { type: format })
  }

  /**
   * Play audio from ArrayBuffer
   */
  async playAudio(audioData: ArrayBuffer, format: string = 'audio/mpeg'): Promise<void> {
    return new Promise((resolve, reject) => {
      const blob = this.createAudioBlob(audioData, format)
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        reject(error)
      }
      
      audio.play().catch(reject)
    })
  }

  /**
   * Synthesize and play speech in one call
   */
  async speak(options: VoiceSynthesisOptions): Promise<void> {
    const audioData = await this.synthesizeSpeech(options)
    await this.playAudio(audioData)
  }

  /**
   * Clone a voice from audio samples
   */
  async cloneVoice(options: VoiceCloningOptions): Promise<VoiceProfile> {
    try {
      // Upload audio files
      const fileIds: string[] = []
      for (const file of options.files) {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey
          },
          body: formData
        })
        
        if (!response.ok) {
          throw new Error(`Failed to upload file: ${response.statusText}`)
        }
        
        const result = await response.json()
        fileIds.push(result.voice_id)
      }

      // Create voice profile
      const voiceProfile: VoiceProfile = {
        id: `custom-${Date.now()}`,
        name: options.name,
        description: options.description,
        category: 'custom',
        gender: (options.gender || 'neutral') as 'male' | 'female' | 'neutral',
        age: (options.age || 'adult') as 'young' | 'adult' | 'mature',
        accent: (options.accent || 'neutral') as 'american' | 'british' | 'australian' | 'neutral',
        useCase: 'general',
        isCustom: true,
        voiceId: fileIds[0] // Use first uploaded voice
      }

      this.voiceProfiles.push(voiceProfile)
      return voiceProfile
    } catch (error) {
      console.error('Voice cloning error:', error)
      throw new Error(`Failed to clone voice: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Analyze voice characteristics from audio
   */
  async analyzeVoice(audioFile: File): Promise<VoiceAnalysis> {
    try {
      // This would typically involve sending audio to a voice analysis service
      // For now, return mock analysis
      return {
        emotion: 'neutral',
        energy: 75,
        clarity: 85,
        pace: 150,
        pitch: 200,
        confidence: 90
      }
    } catch (error) {
      console.error('Voice analysis error:', error)
      throw new Error(`Failed to analyze voice: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate voice for specific CRM use cases
   */
  async generateMeetingBrief(meetingDetails: {
    title: string
    participants: string[]
    agenda: string[]
    duration: number
  }): Promise<ArrayBuffer> {
    const text = `
      Meeting Brief: ${meetingDetails.title}
      
      Participants: ${meetingDetails.participants.join(', ')}
      Duration: ${meetingDetails.duration} minutes
      
      Agenda:
      ${meetingDetails.agenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}
      
      Please prepare your talking points and any necessary materials before the meeting.
    `

    return this.synthesizeSpeech({
      text,
      voiceProfile: this.getBestVoiceForContext({
        useCase: 'meetings',
        audience: 'internal',
        tone: 'professional'
      })
    })
  }

  /**
   * Generate voice for NBA notifications
   */
  async generateNBANotification(nba: {
    title: string
    description: string
    priority: number
    dueTime?: string
  }): Promise<ArrayBuffer> {
    const urgency = nba.priority >= 4 ? 'urgent' : nba.priority >= 3 ? 'important' : 'routine'
    const text = `
      ${urgency === 'urgent' ? 'Urgent' : urgency === 'important' ? 'Important' : 'Routine'} task: ${nba.title}
      
      ${nba.description}
      
      ${nba.dueTime ? `Due: ${nba.dueTime}` : 'No specific deadline'}
    `

    return this.synthesizeSpeech({
      text,
      voiceProfile: this.getBestVoiceForContext({
        useCase: 'notifications',
        audience: 'internal',
        tone: urgency === 'urgent' ? 'authoritative' : 'friendly'
      })
    })
  }

  /**
   * Generate voice for email responses
   */
  async generateEmailResponse(response: {
    subject: string
    body: string
    recipient: string
    tone: 'professional' | 'friendly' | 'formal'
  }): Promise<ArrayBuffer> {
    const text = `
      Email response for ${response.recipient}
      
      Subject: ${response.subject}
      
      ${response.body}
    `

    return this.synthesizeSpeech({
      text,
      voiceProfile: this.getBestVoiceForContext({
        useCase: 'calls',
        audience: 'external',
        tone: response.tone === 'formal' ? 'professional' : response.tone
      })
    })
  }

  /**
   * Generate voice for daily planning
   */
  async generateDailyPlanningSummary(plan: {
    date: string
    priorities: string[]
    meetings: string[]
    tasks: string[]
  }): Promise<ArrayBuffer> {
    const text = `
      Daily Planning Summary for ${plan.date}
      
      Your top priorities today:
      ${plan.priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}
      
      Meetings scheduled:
      ${plan.meetings.map((m, i) => `${i + 1}. ${m}`).join('\n')}
      
      Key tasks:
      ${plan.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}
      
      Have a productive day!
    `

    return this.synthesizeSpeech({
      text,
      voiceProfile: this.getBestVoiceForContext({
        useCase: 'notifications',
        audience: 'internal',
        tone: 'friendly'
      })
    })
  }

  /**
   * Get voice settings optimized for different use cases
   */
  getOptimizedVoiceSettings(useCase: string): VoiceSettings {
    const settings: Record<string, VoiceSettings> = {
      meetings: {
        stability: 0.6,
        similarityBoost: 0.8,
        style: 0.2,
        useSpeakerBoost: true
      },
      presentations: {
        stability: 0.7,
        similarityBoost: 0.9,
        style: 0.3,
        useSpeakerBoost: true
      },
      calls: {
        stability: 0.5,
        similarityBoost: 0.7,
        style: 0.1,
        useSpeakerBoost: true
      },
      notifications: {
        stability: 0.4,
        similarityBoost: 0.6,
        style: 0.0,
        useSpeakerBoost: false
      },
      general: {
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.0,
        useSpeakerBoost: true
      }
    }

    return settings[useCase] || settings.general
  }
}

// Global voice service instance
let voiceService: ElevenLabsVoiceService | null = null

export const getVoiceService = (): ElevenLabsVoiceService => {
  if (!voiceService) {
    const apiKey = process.env.ELEVENLABS_API_KEY || ''
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY environment variable is required')
    }
    voiceService = new ElevenLabsVoiceService(apiKey)
  }
  return voiceService
}

export const destroyVoiceService = (): void => {
  voiceService = null
}
