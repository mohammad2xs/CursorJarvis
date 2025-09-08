'use client'

import React, { useState, useEffect } from 'react'

// Speech Recognition API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Settings, 
  Mic, 
  Volume2, 
  Clock, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface VoiceSettingsProps {
  onSettingsChange?: (settings: VoiceSettings) => void
  className?: string
}

interface VoiceSettings {
  enabled: boolean
  autoStart: boolean
  sensitivity: number
  timeout: number
  language: string
  wakeWord: string
  feedback: boolean
  commands: {
    navigation: boolean
    communication: boolean
    planning: boolean
    data: boolean
    general: boolean
  }
}

export function VoiceSettings({ onSettingsChange, className = '' }: VoiceSettingsProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    autoStart: false,
    sensitivity: 0.7,
    timeout: 5000,
    language: 'en-US',
    wakeWord: 'jarvis',
    feedback: true,
    commands: {
      navigation: true,
      communication: true,
      planning: true,
      data: true,
      general: true
    }
  })

  const [isSupported, setIsSupported] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const handleSettingChange = (key: keyof VoiceSettings, value: unknown) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const handleCommandToggle = (category: keyof VoiceSettings['commands']) => {
    const newCommands = { ...settings.commands, [category]: !settings.commands[category] }
    const newSettings = { ...settings, commands: newCommands }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const testVoiceRecognition = async () => {
    setIsTesting(true)
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = settings.language
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        console.log('Test recognition result:', transcript)
        setIsTesting(false)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Test recognition error:', event.error)
        setIsTesting(false)
      }

      recognition.start()
    } catch (error) {
      console.error('Error testing voice recognition:', error)
      setIsTesting(false)
    }
  }

  const resetSettings = () => {
    const defaultSettings: VoiceSettings = {
      enabled: true,
      autoStart: false,
      sensitivity: 0.7,
      timeout: 5000,
      language: 'en-US',
      wakeWord: 'jarvis',
      feedback: true,
      commands: {
        navigation: true,
        communication: true,
        planning: true,
        data: true,
        general: true
      }
    }
    setSettings(defaultSettings)
    onSettingsChange?.(defaultSettings)
  }

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Voice Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Voice Recognition Not Supported</p>
              <p className="text-sm text-yellow-600">
                Your browser doesn&apos;t support speech recognition. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Voice Settings</span>
          <Badge variant="secondary">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-700">Basic Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Enable Voice Commands</label>
              <p className="text-xs text-gray-500">Allow voice control of the application</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Auto-start Listening</label>
              <p className="text-xs text-gray-500">Start listening when the app loads</p>
            </div>
            <Switch
              checked={settings.autoStart}
              onCheckedChange={(checked) => handleSettingChange('autoStart', checked)}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Audio Feedback</label>
              <p className="text-xs text-gray-500">Play sounds for voice command feedback</p>
            </div>
            <Switch
              checked={settings.feedback}
              onCheckedChange={(checked) => handleSettingChange('feedback', checked)}
              disabled={!settings.enabled}
            />
          </div>
        </div>

        {/* Recognition Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-700">Recognition Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sensitivity</label>
            <div className="px-3">
              <Slider
                value={[settings.sensitivity]}
                onValueChange={([value]) => handleSettingChange('sensitivity', value)}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
                disabled={!settings.enabled}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Timeout (seconds)</label>
            <div className="px-3">
              <Slider
                value={[settings.timeout / 1000]}
                onValueChange={([value]) => handleSettingChange('timeout', value * 1000)}
                max={30}
                min={1}
                step={1}
                className="w-full"
                disabled={!settings.enabled}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1s</span>
                <span>30s</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!settings.enabled}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </select>
          </div>
        </div>

        {/* Command Categories */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-700">Command Categories</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(settings.commands).map(([category, enabled]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium capitalize">{category}</span>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleCommandToggle(category as keyof VoiceSettings['commands'])}
                  disabled={!settings.enabled}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Test & Actions */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-700">Test & Actions</h3>
          
          <div className="flex space-x-2">
            <Button
              onClick={testVoiceRecognition}
              variant="outline"
              size="sm"
              disabled={!settings.enabled || isTesting}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Test Recognition
                </>
              )}
            </Button>
            
            <Button
              onClick={resetSettings}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Reset Settings
            </Button>
          </div>

          <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Voice Command Tips:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Use natural language (e.g., &quot;Go to daily planning&quot;)</li>
                <li>• Say &quot;Help&quot; to see available commands</li>
                <li>• Adjust sensitivity if commands aren&apos;t recognized</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
