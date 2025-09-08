'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Loader2,
  X
} from 'lucide-react'
import { useVoiceCommands } from '@/hooks/use-voice-commands'

interface VoiceFloatingButtonProps {
  onNavigate?: (tab: string) => void
  onRefresh?: () => void
  onSearch?: (query: string) => void
  onComposeEmail?: () => void
  onGenerateAgenda?: () => void
  onCompleteTask?: (taskId?: string) => void
  onAddTask?: (description: string) => void
  className?: string
}

export function VoiceFloatingButton({
  onNavigate,
  onRefresh,
  onSearch,
  onComposeEmail,
  onGenerateAgenda,
  onCompleteTask,
  onAddTask,
  className = ''
}: VoiceFloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const {
    isListening,
    isSupported,
    isProcessing,
    lastResult,
    error,
    toggleListening,
    clearError
  } = useVoiceCommands({
    onNavigate,
    onRefresh,
    onSearch,
    onComposeEmail,
    onGenerateAgenda,
    onCompleteTask,
    onAddTask
  })

  // Auto-collapse after 5 seconds of inactivity
  useEffect(() => {
    if (isExpanded && !isListening && !isProcessing) {
      const timer = setTimeout(() => {
        setIsExpanded(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, isListening, isProcessing])

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  if (!isSupported) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Main Voice Button */}
      <div className="relative">
        <Button
          onClick={toggleListening}
          size="lg"
          className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        {/* Status Badge */}
        {isListening && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 animate-pulse"
          >
            Listening
          </Badge>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <Badge 
            variant="default" 
            className="absolute -top-2 -right-2"
          >
            Processing
          </Badge>
        )}
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Voice Commands</h3>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Display */}
          {lastResult && (
            <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Last Command:</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(lastResult.confidence * 100)}%
                </Badge>
              </div>
              <p className="text-gray-600">&quot;{lastResult.transcript}&quot;</p>
              {lastResult.command && (
                <div className="mt-1 text-xs text-green-600">
                  ✓ {lastResult.command.description}
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Quick Commands */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              onClick={() => onNavigate?.('daily-planning')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Daily Planning
            </Button>
            <Button
              onClick={() => onNavigate?.('email-dashboard')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Email
            </Button>
            <Button
              onClick={() => onNavigate?.('my-work')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              My Work
            </Button>
            <Button
              onClick={() => onRefresh?.()}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Refresh
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              size="sm"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setShowHelp(!showHelp)}
              variant="outline"
              size="sm"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              size="sm"
            >
              {isListening ? 'Stop' : 'Start'}
            </Button>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {showHelp && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Available Commands</h3>
            <Button
              onClick={() => setShowHelp(false)}
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Navigation</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• &quot;Go to daily planning&quot;</li>
                <li>• &quot;Open email&quot;</li>
                <li>• &quot;Show my work&quot;</li>
                <li>• &quot;Show analytics&quot;</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Communication</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• &quot;Compose email&quot;</li>
                <li>• &quot;Send email&quot;</li>
                <li>• &quot;Reply to email&quot;</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Planning</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• &quot;Generate daily agenda&quot;</li>
                <li>• &quot;Complete task&quot;</li>
                <li>• &quot;Add task [description]&quot;</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-1">General</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• &quot;Refresh data&quot;</li>
                <li>• &quot;Search for [query]&quot;</li>
                <li>• &quot;Help&quot;</li>
                <li>• &quot;Stop listening&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Expand Button */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full p-0"
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
