'use client'

import { useState, useEffect, useCallback } from 'react'
import { VoiceProfile, VoiceSynthesisOptions } from '@/lib/elevenlabs-voice'

interface UseElevenLabsVoiceOptions {
  autoPlay?: boolean
  defaultVoice?: string
  context?: string
}

export function useElevenLabsVoice(options: UseElevenLabsVoiceOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voices, setVoices] = useState<VoiceProfile[]>([])
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | null>(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/voice/elevenlabs/voices')
        if (response.ok) {
          const data = await response.json()
          setVoices(data.voices)
          
          // Set default voice
          if (options.defaultVoice) {
            const defaultVoice = data.voices.find((v: VoiceProfile) => v.id === options.defaultVoice)
            if (defaultVoice) {
              setSelectedVoice(defaultVoice)
            }
          } else {
            setSelectedVoice(data.voices[0])
          }
        } else {
          throw new Error('Failed to load voices')
        }
      } catch (err) {
        console.error('Error loading voices:', err)
        setError('Failed to load voice profiles')
      } finally {
        setIsLoading(false)
      }
    }

    loadVoices()
  }, [options.defaultVoice])

  const synthesizeSpeech = useCallback(async (text: string, voiceId?: string, settings?: Partial<VoiceSynthesisOptions>) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/voice/elevenlabs/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          voiceId: voiceId || selectedVoice?.voiceId,
          context: options.context,
          settings
        })
      })

      if (!response.ok) {
        throw new Error('Failed to synthesize speech')
      }

      const data = await response.json()
      
      if (options.autoPlay) {
        await playAudio(data.audioData)
      }

      return data.audioData
    } catch (err) {
      console.error('Speech synthesis error:', err)
      setError('Failed to synthesize speech')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [selectedVoice, options.context, options.autoPlay])

  const playAudio = useCallback(async (base64Audio: string) => {
    try {
      setIsPlaying(true)
      
      // Convert base64 to blob
      const binaryString = atob(base64Audio)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      const blob = new Blob([bytes], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      
      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          setIsPlaying(false)
          resolve()
        }
        
        audio.onerror = (err) => {
          URL.revokeObjectURL(audioUrl)
          setIsPlaying(false)
          reject(err)
        }
        
        audio.play().catch(reject)
      })
    } catch (err) {
      setIsPlaying(false)
      throw err
    }
  }, [])

  const speak = useCallback(async (text: string, voiceId?: string, settings?: Partial<VoiceSynthesisOptions>) => {
    const audioData = await synthesizeSpeech(text, voiceId, settings)
    await playAudio(audioData)
  }, [synthesizeSpeech, playAudio])

  const generateMeetingBrief = useCallback(async (meetingDetails: {
    title: string
    participants: string[]
    agenda: string[]
    duration: number
  }) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/voice/elevenlabs/meeting-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meetingDetails,
          voiceId: selectedVoice?.voiceId,
          context: 'meetings'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate meeting brief')
      }

      const data = await response.json()
      
      if (options.autoPlay) {
        await playAudio(data.audioData)
      }

      return data.audioData
    } catch (err) {
      console.error('Meeting brief generation error:', err)
      setError('Failed to generate meeting brief')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [selectedVoice, options.autoPlay, playAudio])

  const generateNBANotification = useCallback(async (nba: {
    title: string
    description: string
    priority: number
    dueTime?: string
  }) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/voice/elevenlabs/nba-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nba,
          voiceId: selectedVoice?.voiceId,
          context: 'notifications'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate NBA notification')
      }

      const data = await response.json()
      
      if (options.autoPlay) {
        await playAudio(data.audioData)
      }

      return data.audioData
    } catch (err) {
      console.error('NBA notification generation error:', err)
      setError('Failed to generate NBA notification')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [selectedVoice, options.autoPlay, playAudio])

  const generateDailyPlanningSummary = useCallback(async (plan: {
    date: string
    priorities: string[]
    meetings: string[]
    tasks: string[]
  }) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/voice/elevenlabs/daily-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan,
          voiceId: selectedVoice?.voiceId,
          context: 'notifications'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate daily planning summary')
      }

      const data = await response.json()
      
      if (options.autoPlay) {
        await playAudio(data.audioData)
      }

      return data.audioData
    } catch (err) {
      console.error('Daily planning generation error:', err)
      setError('Failed to generate daily planning summary')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [selectedVoice, options.autoPlay, playAudio])

  const cloneVoice = useCallback(async (options: {
    name: string
    description: string
    files: File[]
    category?: string
    gender?: string
    age?: string
    accent?: string
  }) => {
    try {
      setIsLoading(true)
      setError(null)

      // Convert files to base64
      const filePromises = options.files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        return {
          name: file.name,
          data: base64
        }
      })

      const files = await Promise.all(filePromises)

      const response = await fetch('/api/voice/elevenlabs/voices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...options,
          files
        })
      })

      if (!response.ok) {
        throw new Error('Failed to clone voice')
      }

      const data = await response.json()
      
      // Add new voice to the list
      setVoices(prev => [...prev, data.voiceProfile])
      
      return data.voiceProfile
    } catch (err) {
      console.error('Voice cloning error:', err)
      setError('Failed to clone voice')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    isLoading,
    isPlaying,
    error,
    voices,
    selectedVoice,
    
    // Actions
    synthesizeSpeech,
    playAudio,
    speak,
    generateMeetingBrief,
    generateNBANotification,
    generateDailyPlanningSummary,
    cloneVoice,
    setSelectedVoice,
    clearError
  }
}
