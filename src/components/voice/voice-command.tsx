'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Zap,
  MessageSquare,
  Calendar,
  BarChart3,
  Target
} from 'lucide-react'
import { VoiceRecognitionService, VoiceRecognitionResult, VoiceCommand } from '@/lib/voice-recognition'

interface VoiceCommandProps {
  onCommand?: (command: VoiceCommand, result: VoiceRecognitionResult) => void
  onNavigate?: (tab: string) => void
  onRefresh?: () => void
  onSearch?: (query: string) => void
  onComposeEmail?: () => void
  onGenerateAgenda?: () => void
  onCompleteTask?: (taskId?: string) => void
  onAddTask?: (description: string) => void
  className?: string
}

export function VoiceCommandComponent({
  onCommand,
  onNavigate,
  onRefresh,
  onSearch,
  onComposeEmail,
  onGenerateAgenda,
  onCompleteTask,
  onAddTask,
  className = ''
}: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [lastResult, setLastResult] = useState<VoiceRecognitionResult | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceService] = useState(() => new VoiceRecognitionService())

  const handleVoiceResult = useCallback((result: VoiceRecognitionResult) => {
    setLastResult(result)
    setIsProcessing(true)

    if (result.command) {
      onCommand?.(result.command, result)
      executeCommand(result.command, result)
    }

    // Auto-stop processing after 2 seconds
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }, [onCommand])

  const executeCommand = (command: VoiceCommand, result: VoiceRecognitionResult) => {
    switch (command.action) {
      case 'navigate':
        handleNavigation(command, result)
        break
      case 'refresh':
        onRefresh?.()
        break
      case 'search':
        handleSearch(result)
        break
      case 'compose_email':
        onComposeEmail?.()
        break
      case 'send_email':
        // Handle send email
        break
      case 'reply_email':
        // Handle reply email
        break
      case 'generate_agenda':
        onGenerateAgenda?.()
        break
      case 'complete_task':
        onCompleteTask?.()
        break
      case 'add_task':
        handleAddTask(result)
        break
      case 'help':
        setShowHelp(true)
        break
      case 'stop':
        stopListening()
        break
    }
  }

  const handleNavigation = (command: VoiceCommand, result: VoiceRecognitionResult) => {
    switch (command.id) {
      case 'nav-daily-planning':
        onNavigate?.('daily-planning')
        break
      case 'nav-email':
        onNavigate?.('email-dashboard')
        break
      case 'nav-my-work':
        onNavigate?.('my-work')
        break
      case 'nav-analytics':
        onNavigate?.('analytics')
        break
    }
  }

  const handleSearch = (result: VoiceRecognitionResult) => {
    const searchQuery = result.transcript.replace(/search for|find|look for/gi, '').trim()
    onSearch?.(searchQuery)
  }

  const handleAddTask = (result: VoiceRecognitionResult) => {
    const taskDescription = result.transcript.replace(/add task|create task|new task/gi, '').trim()
    onAddTask?.(taskDescription)
  }

  const startListening = () => {
    voiceService.startListening()
    setIsListening(true)
  }

  const stopListening = () => {
    voiceService.stopListening()
    setIsListening(false)
    setIsProcessing(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  useEffect(() => {
    voiceService.onResultCallback(handleVoiceResult)
    voiceService.onStartCallback(() => setIsListening(true))
    voiceService.onEndCallback(() => setIsListening(false))
    voiceService.onErrorCallback((error) => {
      console.error('Voice recognition error:', error)
      setIsListening(false)
      setIsProcessing(false)
    })

    return () => {
      voiceService.destroy()
    }
  }, [handleVoiceResult])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Target className="h-4 w-4" />
      case 'communication': return <MessageSquare className="h-4 w-4" />
      case 'planning': return <Calendar className="h-4 w-4" />
      case 'data': return <BarChart3 className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'bg-blue-100 text-blue-800'
      case 'communication': return 'bg-green-100 text-green-800'
      case 'planning': return 'bg-purple-100 text-purple-800'
      case 'data': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>Voice Commands</span>
            {isListening && (
              <Badge variant="secondary" className="animate-pulse">
                Listening...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-5 w-5 mr-2" />
              ) : (
                <Mic className="h-5 w-5 mr-2" />
              )}
              {isProcessing ? 'Processing...' : isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>
            
            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <Button
              onClick={() => setShowHelp(!showHelp)}
              variant="outline"
              size="lg"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* Status Display */}
          {lastResult && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Last Command:</span>
                <Badge variant="outline">
                  {Math.round(lastResult.confidence * 100)}% confidence
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">&quot;{lastResult.transcript}&quot;</p>
              {lastResult.command && (
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(lastResult.command.category)}>
                    {getCategoryIcon(lastResult.command.category)}
                    <span className="ml-1">{lastResult.command.description}</span>
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
            </div>
          )}

          {/* Quick Commands */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onNavigate?.('daily-planning')}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Daily Planning
            </Button>
            <Button
              onClick={() => onNavigate?.('email-dashboard')}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              onClick={() => onNavigate?.('my-work')}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Target className="h-4 w-4 mr-2" />
              My Work
            </Button>
            <Button
              onClick={() => onRefresh?.()}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Panel */}
      {showHelp && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Available Voice Commands</span>
              <Button
                onClick={() => setShowHelp(false)}
                variant="ghost"
                size="sm"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['navigation', 'communication', 'planning', 'data', 'general'].map(category => (
                <div key={category}>
                  <h4 className="font-medium text-sm text-gray-700 mb-2 capitalize">
                    {category} Commands
                  </h4>
                  <div className="grid gap-2">
                    {voiceService.getCommandsByCategory(category).map(command => (
                      <div
                        key={command.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(command.category)}
                          <span className="text-sm font-medium">{command.command}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {command.keywords.slice(0, 2).join(', ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
