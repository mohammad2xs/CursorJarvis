'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mic, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  RefreshCw,
  Settings,
  MoreHorizontal,
  Star,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react'
import { 
  MeetingTranscript, 
  MeetingInsight, 
  MeetingSummary, 
  MeetingAnalytics,
  RealTimeTranscriptionConfig
} from '@/lib/meeting-intelligence'

interface MeetingIntelligenceProps {
  userId: string
  className?: string
}

export function MeetingIntelligence({ userId, className = '' }: MeetingIntelligenceProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcripts, setTranscripts] = useState<MeetingTranscript[]>([])
  const [insights, setInsights] = useState<MeetingInsight[]>([])
  const [summary, setSummary] = useState<MeetingSummary | null>(null)
  const [analytics, setAnalytics] = useState<MeetingAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('transcript')
  const [selectedInsight, setSelectedInsight] = useState<MeetingInsight | null>(null)
  const [config, setConfig] = useState<RealTimeTranscriptionConfig>({
    language: 'en-US',
    model: 'nova-2',
    punctuate: true,
    profanity_filter: true,
    redact: ['ssn', 'credit_card'],
    diarize: true,
    smart_format: true,
    interim_results: true,
    endpointing: 300,
    vad_events: true,
    encoding: 'linear16',
    sample_rate: 16000,
    channels: 1
  })
  const [currentMeetingId, setCurrentMeetingId] = useState<string | null>(null)

  useEffect(() => {
    loadMeetingData()
  }, [userId])

  const loadMeetingData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock data loading - in production, this would fetch from API
      const mockTranscripts: MeetingTranscript[] = [
        {
          id: 'transcript-1',
          meetingId: 'meeting-1',
          userId,
          speaker: 'John Doe',
          text: 'Welcome everyone to our quarterly review meeting. Let\'s start by discussing our Q3 performance.',
          timestamp: Date.now() - 300000,
          confidence: 0.95,
          isFinal: true,
          language: 'en-US',
          sentiment: 'positive',
          keywords: ['welcome', 'quarterly', 'review', 'meeting', 'performance'],
          entities: [],
          createdAt: new Date()
        },
        {
          id: 'transcript-2',
          meetingId: 'meeting-1',
          userId,
          speaker: 'Jane Smith',
          text: 'Our revenue has increased by 15% compared to last quarter, which is excellent news.',
          timestamp: Date.now() - 280000,
          confidence: 0.92,
          isFinal: true,
          language: 'en-US',
          sentiment: 'positive',
          keywords: ['revenue', 'increased', 'quarter', 'excellent'],
          entities: [],
          createdAt: new Date()
        },
        {
          id: 'transcript-3',
          meetingId: 'meeting-1',
          userId,
          speaker: 'Mike Johnson',
          text: 'However, we need to address the customer churn rate which has increased to 8%.',
          timestamp: Date.now() - 260000,
          confidence: 0.88,
          isFinal: true,
          language: 'en-US',
          sentiment: 'negative',
          keywords: ['customer', 'churn', 'rate', 'increased'],
          entities: [],
          createdAt: new Date()
        }
      ]

      const mockInsights: MeetingInsight[] = [
        {
          id: 'insight-1',
          meetingId: 'meeting-1',
          userId,
          type: 'action_item',
          title: 'Action Item Identified',
          description: 'Address customer churn rate which has increased to 8%',
          confidence: 0.88,
          priority: 'high',
          category: 'action_item',
          timestamp: Date.now() - 260000,
          speaker: 'Mike Johnson',
          relatedEntities: [],
          suggestedActions: ['Investigate churn causes', 'Implement retention strategy', 'Schedule follow-up meeting'],
          isProcessed: false,
          createdAt: new Date()
        },
        {
          id: 'insight-2',
          meetingId: 'meeting-1',
          userId,
          type: 'decision_made',
          title: 'Decision Made',
          description: 'Approved budget increase for customer success team',
          confidence: 0.92,
          priority: 'high',
          category: 'decision',
          timestamp: Date.now() - 240000,
          speaker: 'John Doe',
          relatedEntities: [],
          suggestedActions: ['Update budget allocation', 'Notify HR team', 'Schedule team expansion'],
          isProcessed: false,
          createdAt: new Date()
        }
      ]

      setTranscripts(mockTranscripts)
      setInsights(mockInsights)

    } catch (err) {
      console.error('Error loading meeting data:', err)
      setError('Failed to load meeting data')
    } finally {
      setLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/meetings/transcription/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          config
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start transcription')
      }

      const data = await response.json()
      setCurrentMeetingId(data.meetingId)
      setIsRecording(true)
      setIsPaused(false)

      // Start mock transcription simulation
      simulateTranscription(data.meetingId)

    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording')
    } finally {
      setLoading(false)
    }
  }

  const stopRecording = async () => {
    try {
      setLoading(true)

      if (currentMeetingId) {
        const response = await fetch('/api/meetings/transcription/stop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            meetingId: currentMeetingId,
            userId
          })
        })

        if (response.ok) {
          // Generate summary and analytics
          await generateSummary()
          await generateAnalytics()
        }
      }

      setIsRecording(false)
      setIsPaused(false)
      setCurrentMeetingId(null)

    } catch (err) {
      console.error('Error stopping recording:', err)
      setError('Failed to stop recording')
    } finally {
      setLoading(false)
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const simulateTranscription = (meetingId: string) => {
    // Mock transcription simulation
    const mockTexts = [
      'Let\'s discuss the project timeline for the next quarter.',
      'I think we should prioritize the mobile app development.',
      'What about the budget allocation for marketing?',
      'We need to schedule a follow-up meeting next week.',
      'The client seems very interested in our proposal.'
    ]

    let index = 0
    const interval = setInterval(() => {
      if (!isRecording || isPaused) {
        clearInterval(interval)
        return
      }

      const mockTranscript: MeetingTranscript = {
        id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        meetingId,
        userId,
        speaker: index % 2 === 0 ? 'John Doe' : 'Jane Smith',
        text: mockTexts[index % mockTexts.length],
        timestamp: Date.now(),
        confidence: 0.85 + Math.random() * 0.1,
        isFinal: true,
        language: 'en-US',
        sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
        keywords: mockTexts[index % mockTexts.length].split(' ').slice(0, 3),
        entities: [],
        createdAt: new Date()
      }

      setTranscripts(prev => [...prev, mockTranscript])
      index++

      if (index >= 10) {
        clearInterval(interval)
      }
    }, 5000)
  }

  const generateSummary = async () => {
    try {
      const response = await fetch('/api/meetings/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meetingId: currentMeetingId,
          userId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSummary(data.summary)
      }
    } catch (err) {
      console.error('Error generating summary:', err)
    }
  }

  const generateAnalytics = async () => {
    try {
      const response = await fetch('/api/meetings/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meetingId: currentMeetingId,
          userId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (err) {
      console.error('Error generating analytics:', err)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      case 'neutral': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'action_item': return <Target className="h-4 w-4" />
      case 'decision_made': return <CheckCircle className="h-4 w-4" />
      case 'concern_raised': return <AlertTriangle className="h-4 w-4" />
      case 'opportunity_identified': return <Lightbulb className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  if (loading && !isRecording) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading meeting intelligence...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Meeting Intelligence</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadMeetingData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Intelligence</h2>
          <p className="text-gray-600">Real-time transcription and AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadMeetingData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Recording Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Not Recording'}
                </span>
              </div>
              {currentMeetingId && (
                <Badge variant="outline">
                  Meeting ID: {currentMeetingId}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {!isRecording ? (
                <Button onClick={startRecording} disabled={loading}>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button onClick={togglePause} variant="outline">
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button onClick={stopRecording} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Transcript Tab */}
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Live Transcript</span>
                <Badge variant="outline">{transcripts.length} segments</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transcripts.map((transcript) => (
                  <div key={transcript.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {transcript.speaker.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{transcript.speaker}</span>
                        <Badge variant="outline" className={getSentimentColor(transcript.sentiment)}>
                          {transcript.sentiment}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.round(transcript.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{transcript.text}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(transcript.timestamp).toLocaleTimeString()}
                        </span>
                        {transcript.keywords.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">Keywords:</span>
                            {transcript.keywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {transcripts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No transcript available. Start recording to see live transcription.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>AI Insights</span>
                <Badge variant="outline">{insights.length} insights</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">{insight.title}</h3>
                          <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(insight.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                        
                        {insight.suggestedActions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-600 mb-2">Suggested Actions:</p>
                            <div className="flex flex-wrap gap-2">
                              {insight.suggestedActions.map((action, index) => (
                                <Button key={index} variant="outline" size="sm" className="text-xs">
                                  {action}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Speaker: {insight.speaker}</span>
                          <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedInsight(insight)}
                        variant="outline"
                        size="sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {insights.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No insights available. Start recording to generate AI insights.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          {summary ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Meeting Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{summary.title}</h3>
                      <p className="text-gray-700">{summary.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Action Items</h4>
                        <p className="text-2xl font-bold text-blue-600">{summary.actionItems.length}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Decisions</h4>
                        <p className="text-2xl font-bold text-green-600">{summary.decisions.length}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Next Steps</h4>
                        <p className="text-2xl font-bold text-purple-600">{summary.nextSteps.length}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Points</h4>
                        <ul className="space-y-1">
                          {summary.keyPoints.map((point, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Participants</h4>
                        <div className="space-y-2">
                          {summary.participants.map((participant, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="font-medium">{participant.name}</span>
                              <Badge variant="outline">{participant.contribution}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Summary Available</h3>
                <p className="text-gray-600">Complete a meeting recording to generate a summary.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Duration</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(analytics.totalDuration / 60000)}m
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Engagement</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(analytics.engagementScore)}%
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Productivity</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(analytics.productivityScore)}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Key Moments</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.keyMoments.length}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Speaking Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(analytics.speakingTime).map(([speaker, time]) => (
                        <div key={speaker} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{speaker}</span>
                          <span className="text-sm text-gray-600">{time}s</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Topic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.topicDistribution.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{topic.topic}</span>
                          <span className="text-sm text-gray-600">{Math.round(topic.percentage)}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Available</h3>
                <p className="text-gray-600">Complete a meeting recording to generate analytics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transcription Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <select
                      value={config.language}
                      onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish</option>
                      <option value="fr-FR">French</option>
                      <option value="de-DE">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Model</label>
                    <select
                      value={config.model}
                      onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value as 'nova-2' | 'nova' | 'enhanced' }))}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="nova-2">Nova 2 (Latest)</option>
                      <option value="nova">Nova</option>
                      <option value="enhanced">Enhanced</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.punctuate}
                      onChange={(e) => setConfig(prev => ({ ...prev, punctuate: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Auto-punctuation</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.profanity_filter}
                      onChange={(e) => setConfig(prev => ({ ...prev, profanity_filter: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Profanity filter</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.diarize}
                      onChange={(e) => setConfig(prev => ({ ...prev, diarize: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Speaker diarization</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.smart_format}
                      onChange={(e) => setConfig(prev => ({ ...prev, smart_format: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Smart formatting</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insight Details Modal */}
      {selectedInsight && (
        <Card className="fixed inset-0 z-50 bg-white shadow-2xl max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getInsightIcon(selectedInsight.type)}
              <span>{selectedInsight.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">{selectedInsight.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <span className="ml-2">{selectedInsight.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Priority:</span>
                  <span className="ml-2">{selectedInsight.priority}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Speaker:</span>
                  <span className="ml-2">{selectedInsight.speaker}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Confidence:</span>
                  <span className="ml-2">{Math.round(selectedInsight.confidence * 100)}%</span>
                </div>
              </div>

              {selectedInsight.suggestedActions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suggested Actions</h4>
                  <div className="space-y-2">
                    {selectedInsight.suggestedActions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-blue-500">•</span>
                        <span className="text-sm text-gray-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button
                  onClick={() => setSelectedInsight(null)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button>
                  Take Action
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
