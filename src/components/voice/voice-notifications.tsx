'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Download,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Loader2
} from 'lucide-react'
import { useElevenLabsVoice } from '@/hooks/use-elevenlabs-voice'

export interface VoiceNotification {
  id: string
  type: 'meeting' | 'nba' | 'planning' | 'email' | 'general'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  timestamp: Date
  audioData?: string
  isPlayed?: boolean
}

interface VoiceNotificationsProps {
  notifications?: VoiceNotification[]
  onNotificationPlayed?: (notificationId: string) => void
  onNotificationDismissed?: (notificationId: string) => void
  className?: string
}

export function VoiceNotifications({
  notifications = [],
  onNotificationPlayed,
  onNotificationDismissed,
  className = ''
}: VoiceNotificationsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set())

  const {
    isLoading,
    isPlaying,
    error,
    voices,
    selectedVoice,
    speak,
    synthesizeSpeech,
    generateMeetingBrief,
    generateNBANotification,
    generateDailyPlanningSummary,
    setSelectedVoice
  } = useElevenLabsVoice({
    autoPlay: false,
    context: 'notifications'
  })

  // Generate audio for notifications
  useEffect(() => {
    const generateNotificationAudio = async () => {
      for (const notification of notifications) {
        if (notification.audioData || dismissedNotifications.has(notification.id)) continue

        try {
          let audioData: string

          switch (notification.type) {
            case 'meeting':
              audioData = await generateMeetingBrief({
                title: notification.title,
                participants: [],
                agenda: [notification.message],
                duration: 30
              })
              break
            case 'nba':
              audioData = await generateNBANotification({
                title: notification.title,
                description: notification.message,
                priority: notification.priority === 'urgent' ? 5 : notification.priority === 'high' ? 4 : 3,
                dueTime: undefined
              })
              break
            case 'planning':
              audioData = await generateDailyPlanningSummary({
                date: new Date().toLocaleDateString(),
                priorities: [notification.title],
                meetings: [],
                tasks: [notification.message]
              })
              break
            default:
              audioData = await synthesizeSpeech(notification.message)
              break
          }

          // Update notification with audio data
          notification.audioData = audioData
        } catch (err) {
          console.error('Failed to generate audio for notification:', err)
        }
      }
    }

    if (notifications.length > 0 && voices.length > 0) {
      generateNotificationAudio()
    }
  }, [notifications, voices, generateMeetingBrief, generateNBANotification, generateDailyPlanningSummary, speak, dismissedNotifications])

  const playNotification = useCallback(async (notification: VoiceNotification) => {
    if (isMuted || !notification.audioData) return

    try {
      setCurrentlyPlaying(notification.id)
      
      // Convert base64 to audio and play
      const binaryString = atob(notification.audioData)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      const blob = new Blob([bytes], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        setCurrentlyPlaying(null)
        onNotificationPlayed?.(notification.id)
      }
      
      audio.play()
    } catch (err) {
      console.error('Failed to play notification:', err)
      setCurrentlyPlaying(null)
    }
  }, [isMuted, onNotificationPlayed])

  const dismissNotification = useCallback((notificationId: string) => {
    setDismissedNotifications(prev => new Set([...prev, notificationId]))
    onNotificationDismissed?.(notificationId)
  }, [onNotificationDismissed])

  const downloadNotification = useCallback((notification: VoiceNotification) => {
    if (!notification.audioData) return

    try {
      const binaryString = atob(notification.audioData)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      const blob = new Blob([bytes], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `notification-${notification.id}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download notification:', err)
    }
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Bell className="h-4 w-4" />
      case 'nba': return <CheckCircle className="h-4 w-4" />
      case 'planning': return <Info className="h-4 w-4" />
      case 'email': return <AlertCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const visibleNotifications = notifications.filter(n => !dismissedNotifications.has(n.id))

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Voice Controls */}
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Voice Notifications</span>
          {selectedVoice && (
            <Badge variant="outline" className="text-xs">
              {selectedVoice.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="sm"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {visibleNotifications.map((notification) => (
        <Card key={notification.id} className={`border-l-4 ${getPriorityColor(notification.priority)}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {getTypeIcon(notification.type)}
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {notification.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                {notification.audioData && (
                  <Button
                    onClick={() => playNotification(notification)}
                    variant="ghost"
                    size="sm"
                    disabled={isMuted || currentlyPlaying === notification.id || isPlaying}
                  >
                    {currentlyPlaying === notification.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={() => downloadNotification(notification)}
                  variant="ghost"
                  size="sm"
                  disabled={!notification.audioData}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => dismissNotification(notification.id)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Voice Error</span>
            </div>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
