'use client'

import { useState, useEffect, useCallback } from 'react'
import { VoiceRecognitionService, VoiceRecognitionResult, VoiceCommand } from '@/lib/voice-recognition'

interface UseVoiceCommandsOptions {
  onNavigate?: (tab: string) => void
  onRefresh?: () => void
  onSearch?: (query: string) => void
  onComposeEmail?: () => void
  onGenerateAgenda?: () => void
  onCompleteTask?: (taskId?: string) => void
  onAddTask?: (description: string) => void
  onSendEmail?: () => void
  onReplyEmail?: () => void
  autoStart?: boolean
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [lastResult, setLastResult] = useState<VoiceRecognitionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const voiceService = new VoiceRecognitionService()

  const handleVoiceResult = useCallback((result: VoiceRecognitionResult) => {
    setLastResult(result)
    setIsProcessing(true)

    if (result.command) {
      executeCommand(result.command, result)
    }

    // Auto-stop processing after 2 seconds
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }, [])

  const executeCommand = useCallback((command: VoiceCommand, result: VoiceRecognitionResult) => {
    switch (command.action) {
      case 'navigate':
        handleNavigation(command, result)
        break
      case 'refresh':
        options.onRefresh?.()
        break
      case 'search':
        handleSearch(result)
        break
      case 'compose_email':
        options.onComposeEmail?.()
        break
      case 'send_email':
        options.onSendEmail?.()
        break
      case 'reply_email':
        options.onReplyEmail?.()
        break
      case 'generate_agenda':
        options.onGenerateAgenda?.()
        break
      case 'complete_task':
        options.onCompleteTask?.()
        break
      case 'add_task':
        handleAddTask(result)
        break
    }
  }, [options])

  const handleNavigation = useCallback((command: VoiceCommand, result: VoiceRecognitionResult) => {
    switch (command.id) {
      case 'nav-daily-planning':
        options.onNavigate?.('daily-planning')
        break
      case 'nav-email':
        options.onNavigate?.('email-dashboard')
        break
      case 'nav-my-work':
        options.onNavigate?.('my-work')
        break
      case 'nav-analytics':
        options.onNavigate?.('analytics')
        break
    }
  }, [options])

  const handleSearch = useCallback((result: VoiceRecognitionResult) => {
    const searchQuery = result.transcript.replace(/search for|find|look for/gi, '').trim()
    options.onSearch?.(searchQuery)
  }, [options])

  const handleAddTask = useCallback((result: VoiceRecognitionResult) => {
    const taskDescription = result.transcript.replace(/add task|create task|new task/gi, '').trim()
    options.onAddTask?.(taskDescription)
  }, [options])

  const startListening = useCallback(() => {
    try {
      voiceService.startListening()
      setIsListening(true)
      setError(null)
    } catch (err) {
      setError('Failed to start voice recognition')
      console.error('Voice recognition error:', err)
    }
  }, [voiceService])

  const stopListening = useCallback(() => {
    voiceService.stopListening()
    setIsListening(false)
    setIsProcessing(false)
  }, [voiceService])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    // Set up voice service callbacks
    voiceService.onResultCallback(handleVoiceResult)
    voiceService.onStartCallback(() => setIsListening(true))
    voiceService.onEndCallback(() => setIsListening(false))
    voiceService.onErrorCallback((error) => {
      setError(error)
      setIsListening(false)
      setIsProcessing(false)
    })

    // Auto-start if enabled
    if (options.autoStart) {
      startListening()
    }

    return () => {
      voiceService.destroy()
    }
  }, [handleVoiceResult, options.autoStart, startListening])

  return {
    isListening,
    isSupported,
    isProcessing,
    lastResult,
    error,
    startListening,
    stopListening,
    toggleListening,
    clearError,
    commands: voiceService.getCommands()
  }
}
