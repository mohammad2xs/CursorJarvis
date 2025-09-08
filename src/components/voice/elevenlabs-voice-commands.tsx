'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Play,
  Pause,
  Download,
  Upload,
  Zap,
  Brain,
  MessageSquare,
  Calendar,
  Target,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { VoiceProfile, VoiceSynthesisOptions, ElevenLabsVoiceService } from '@/lib/elevenlabs-voice'

interface ElevenLabsVoiceCommandsProps {
  onCommand?: (command: string, audioData?: ArrayBuffer) => void
  onNavigate?: (tab: string) => void
  onRefresh?: () => void
  onSearch?: (query: string) => void
  onComposeEmail?: () => void
  onGenerateAgenda?: () => void
  onCompleteTask?: (taskId?: string) => void
  onAddTask?: (description: string) => void
  className?: string
}

export function ElevenLabsVoiceCommands({
  onCommand,
  onNavigate,
  onRefresh,
  onSearch,
  onComposeEmail,
  onGenerateAgenda,
  onCompleteTask,
  onAddTask,
  className = ''
}: ElevenLabsVoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [voiceService, setVoiceService] = useState<ElevenLabsVoiceService | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | null>(null)
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCommand, setLastCommand] = useState<string>('')
  const [voiceSettings, setVoiceSettings] = useState({
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.0,
    useSpeakerBoost: true
  })

  // Initialize voice service
  useEffect(() => {
    const initializeVoiceService = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/voice/elevenlabs/init')
        if (response.ok) {
          const service = new ElevenLabsVoiceService('mock-api-key') // Will be replaced with real key
          setVoiceService(service)
          setVoiceProfiles(service.getVoiceProfiles())
          setSelectedVoice(service.getVoiceProfiles()[0])
        } else {
          throw new Error('Failed to initialize voice service')
        }
      } catch (err) {
        console.error('Voice service initialization error:', err)
        setError('Failed to initialize voice service')
      } finally {
        setIsLoading(false)
      }
    }

    initializeVoiceService()
  }, [])

  const speakText = useCallback(async (text: string, context?: string) => {
    if (!voiceService || isMuted) return

    try {
      setIsSpeaking(true)
      const voiceProfile = selectedVoice || voiceService.getVoiceProfiles()[0]
      
      const options: VoiceSynthesisOptions = {
        text,
        voiceProfile,
        ...voiceSettings
      }

      // Optimize voice settings based on context
      if (context) {
        const optimizedSettings = voiceService.getOptimizedVoiceSettings(context)
        Object.assign(options, optimizedSettings)
      }

      await voiceService.speak(options)
    } catch (err) {
      console.error('Speech synthesis error:', err)
      setError('Failed to synthesize speech')
    } finally {
      setIsSpeaking(false)
    }
  }, [voiceService, selectedVoice, voiceSettings, isMuted])

  const handleVoiceCommand = useCallback(async (command: string) => {
    setLastCommand(command)
    onCommand?.(command)

    // Speak the command back for confirmation
    await speakText(`Executing: ${command}`, 'notifications')

    // Execute the command
    if (command.includes('daily planning') || command.includes('agenda')) {
      onNavigate?.('daily-planning')
      await speakText('Opening daily planning dashboard', 'meetings')
    } else if (command.includes('email') || command.includes('inbox')) {
      onNavigate?.('email-dashboard')
      await speakText('Opening email dashboard', 'calls')
    } else if (command.includes('my work') || command.includes('tasks')) {
      onNavigate?.('my-work')
      await speakText('Opening my work dashboard', 'notifications')
    } else if (command.includes('analytics') || command.includes('stats')) {
      onNavigate?.('analytics')
      await speakText('Opening analytics dashboard', 'presentations')
    } else if (command.includes('refresh')) {
      onRefresh?.()
      await speakText('Refreshing data', 'notifications')
    } else if (command.includes('compose email')) {
      onComposeEmail?.()
      await speakText('Opening email composer', 'calls')
    } else if (command.includes('generate agenda')) {
      onGenerateAgenda?.()
      await speakText('Generating daily agenda', 'meetings')
    } else if (command.includes('complete task')) {
      onCompleteTask?.()
      await speakText('Task completed', 'notifications')
    } else if (command.includes('add task')) {
      const taskDescription = command.replace(/add task|create task|new task/gi, '').trim()
      onAddTask?.(taskDescription)
      await speakText(`Added task: ${taskDescription}`, 'notifications')
    } else if (command.includes('help')) {
      await speakText('Available commands: Navigate to daily planning, email, my work, or analytics. Compose email, generate agenda, complete tasks, or refresh data.', 'general')
    }
  }, [onCommand, onNavigate, onRefresh, onComposeEmail, onGenerateAgenda, onCompleteTask, onAddTask, speakText])

  const startListening = () => {
    setIsListening(true)
    speakText('Listening for your command', 'notifications')
  }

  const stopListening = () => {
    setIsListening(false)
    speakText('Stopped listening', 'notifications')
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      speakText('Audio muted', 'notifications')
    }
  }

  const testVoice = async () => {
    if (!selectedVoice) return
    
    const testText = `Hello! This is ${selectedVoice.name}. I'm your AI voice assistant for Jarvis CRM. How can I help you today?`
    await speakText(testText, 'general')
  }

  const downloadVoiceSample = async () => {
    if (!voiceService || !selectedVoice) return

    try {
      const testText = `This is a sample of ${selectedVoice.name} voice. I can help you with your sales tasks, meetings, and daily planning.`
      const audioData = await voiceService.synthesizeSpeech({
        text: testText,
        voiceProfile: selectedVoice
      })
      
      const blob = voiceService.createAudioBlob(audioData)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedVoice.name}-sample.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download voice sample')
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Initializing ElevenLabs voice service...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Voice Service Error</span>
          </div>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>ElevenLabs AI Voice Commands</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Voice</label>
            <div className="grid grid-cols-2 gap-2">
              {voiceProfiles.slice(0, 4).map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedVoice(profile)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedVoice?.id === profile.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{profile.name}</div>
                  <div className="text-xs text-gray-600">{profile.description}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {profile.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {profile.gender}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="flex-1"
              disabled={isSpeaking}
            >
              {isSpeaking ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-5 w-5 mr-2" />
              ) : (
                <Mic className="h-5 w-5 mr-2" />
              )}
              {isSpeaking ? 'Speaking...' : isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>
            
            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <Button
              onClick={testVoice}
              variant="outline"
              size="lg"
              disabled={!selectedVoice || isSpeaking}
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>

          {/* Voice Settings */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Voice Settings</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stability</span>
                <span className="text-xs text-gray-500">{Math.round(voiceSettings.stability * 100)}%</span>
              </div>
              <Slider
                value={[voiceSettings.stability]}
                onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, stability: value }))}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Similarity Boost</span>
                <span className="text-xs text-gray-500">{Math.round(voiceSettings.similarityBoost * 100)}%</span>
              </div>
              <Slider
                value={[voiceSettings.similarityBoost]}
                onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, similarityBoost: value }))}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Style</span>
                <span className="text-xs text-gray-500">{Math.round(voiceSettings.style * 100)}%</span>
              </div>
              <Slider
                value={[voiceSettings.style]}
                onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, style: value }))}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <Button
              onClick={() => handleVoiceCommand('Go to daily planning')}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Daily Planning
            </Button>
            <Button
              onClick={() => handleVoiceCommand('Open email')}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              onClick={() => handleVoiceCommand('Show my work')}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Target className="h-4 w-4 mr-2" />
              My Work
            </Button>
            <Button
              onClick={() => handleVoiceCommand('Refresh data')}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Zap className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Last Command */}
          {lastCommand && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Last Command:</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">&quot;{lastCommand}&quot;</p>
            </div>
          )}

          {/* Voice Sample Download */}
          {selectedVoice && (
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-800">Voice Sample</p>
                <p className="text-xs text-purple-600">Download {selectedVoice.name} sample</p>
              </div>
              <Button
                onClick={downloadVoiceSample}
                variant="outline"
                size="sm"
                disabled={isSpeaking}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Features Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ElevenLabs Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Natural, human-like voice synthesis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Multiple voice profiles for different contexts</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Real-time voice cloning capabilities</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Optimized for business communications</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>High-quality audio output (192kbps MP3)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
