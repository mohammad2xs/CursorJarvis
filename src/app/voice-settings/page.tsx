'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Key, Download, Upload, CheckCircle, AlertCircle, Info, Brain, Zap } from 'lucide-react'
import { ElevenLabsVoiceCommands } from '@/components/voice/elevenlabs-voice-commands'

export default function VoiceSettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      // In a real app, this would be saved securely
      localStorage.setItem('elevenlabs_api_key', apiKey)
      setIsConfigured(true)
      setTestResult('API key saved successfully!')
    }
  }

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult('Please enter an API key first')
      return
    }

    setIsTesting(true)
    try {
      // Test the API key by making a simple request
      const response = await fetch('/api/voice/elevenlabs/voices', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })

      if (response.ok) {
        setTestResult('✅ Connection successful! ElevenLabs API is working.')
        setIsConfigured(true)
      } else {
        setTestResult('❌ Connection failed. Please check your API key.')
      }
  } catch {
      setTestResult('❌ Connection failed. Please check your API key and internet connection.')
    } finally {
      setIsTesting(false)
    }
  }

  const handleUploadVoice = async (files: FileList) => {
    // Handle voice file upload for cloning
    console.log('Uploading voice files:', files)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voice Settings</h1>
            <p className="text-gray-600 mt-2">
              Configure ElevenLabs AI voice technology for your Jarvis CRM
            </p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Brain className="h-4 w-4 mr-1" />
            Premium Feature
          </Badge>
        </div>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>ElevenLabs API Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="max-w-md"
              />
              <p className="text-sm text-gray-500">
                Get your API key from{' '}
                <a 
                  href="https://elevenlabs.io/app/settings/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ElevenLabs Dashboard
                </a>
              </p>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
                Save API Key
              </Button>
              <Button 
                onClick={handleTestConnection} 
                variant="outline"
                disabled={!apiKey.trim() || isTesting}
              >
                {isTesting ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg ${
                testResult.includes('✅') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  {testResult.includes('✅') ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{testResult}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Commands */}
        {isConfigured && (
          <ElevenLabsVoiceCommands
            onNavigate={(tab) => console.log('Navigate to:', tab)}
            onRefresh={() => console.log('Refresh')}
            onSearch={(query) => console.log('Search:', query)}
            onComposeEmail={() => console.log('Compose email')}
            onGenerateAgenda={() => console.log('Generate agenda')}
            onCompleteTask={(taskId) => console.log('Complete task:', taskId)}
            onAddTask={(description) => console.log('Add task:', description)}
          />
        )}

        {/* Voice Cloning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Voice Cloning</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-name">Voice Name</Label>
              <Input
                id="voice-name"
                placeholder="Enter a name for your custom voice"
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-description">Description</Label>
              <Textarea
                id="voice-description"
                placeholder="Describe your custom voice (e.g., 'Professional female voice for client calls')"
                className="max-w-md"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Audio Samples</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload 3-5 audio samples (MP3, WAV, or M4A)
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Each sample should be 10-30 seconds of clear speech
                </p>
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={(e) => e.target.files && handleUploadVoice(e.target.files)}
                  className="hidden"
                  id="voice-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="voice-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button disabled={!isConfigured}>
                <Brain className="h-4 w-4 mr-2" />
                Clone Voice
              </Button>
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>ElevenLabs Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900">Voice Synthesis</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Natural, human-like voice generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Multiple voice profiles for different contexts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Real-time voice cloning capabilities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>High-quality audio output (192kbps MP3)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900">CRM Integration</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Meeting brief voice generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>NBA notification voice alerts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Daily planning voice summaries</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Email response voice previews</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Usage Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Voice Selection</p>
                  <p>Choose different voices for different contexts - professional voices for client calls, friendly voices for internal communications.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Voice Settings</p>
                  <p>Adjust stability and similarity boost to fine-tune voice characteristics. Higher stability = more consistent, higher similarity = more expressive.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Voice Cloning</p>
                  <p>Upload high-quality audio samples of the voice you want to clone. Ensure samples are clear, without background noise, and contain natural speech.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
