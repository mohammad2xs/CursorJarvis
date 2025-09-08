'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Brain,
  Target,
  TrendingUp,
  Sparkles,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react'
import { Meeting, MeetingWithRelations } from '@/types'
import { formatDateTime, getRelativeTime, getStageColor } from '@/lib/utils'

interface MeetingOSProps {
  meetings: MeetingWithRelations[]
  onUpdateMeeting: (meetingId: string, updates: Partial<Meeting>) => void
  onGenerateRecap: (meetingId: string, notes: string) => void
}

export function MeetingOS({ meetings, onUpdateMeeting, onGenerateRecap }: MeetingOSProps) {
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingWithRelations[]>([])
  const [recentMeetings, setRecentMeetings] = useState<MeetingWithRelations[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithRelations | null>(null)
  const [meetingNotes, setMeetingNotes] = useState('')
  const [briefContent, setBriefContent] = useState('')
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false)
  const [briefError, setBriefError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const now = new Date()
    const upcoming = meetings.filter(m => 
      m.status === 'SCHEDULED' && new Date(m.scheduledAt) > now
    ).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    
    const recent = meetings.filter(m => 
      m.status === 'COMPLETED' && 
      new Date(m.createdAt) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setUpcomingMeetings(upcoming)
    setRecentMeetings(recent)
  }, [meetings])

  const handleGenerateBrief = async (meeting: MeetingWithRelations) => {
    setIsGeneratingBrief(true)
    setBriefError(null)
    
    try {
      console.log('Generating brief for meeting:', meeting.id)
      
      // Try main API first
      let response = await fetch('/api/meetings/brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: meeting.id,
          companyId: meeting.companyId,
          contactId: meeting.contactId,
          opportunityId: meeting.opportunityId
        }),
      })

      console.log('Brief API response status:', response.status)

      // If main API fails, try fallback
      if (!response.ok) {
        console.log('Main API failed, trying fallback...')
        response = await fetch('/api/meetings/brief-fallback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meetingId: meeting.id,
            companyId: meeting.companyId,
            contactId: meeting.contactId,
            opportunityId: meeting.opportunityId
          }),
        })
        console.log('Fallback API response status:', response.status)
        
        // If fallback also fails, try mock API
        if (!response.ok) {
          console.log('Fallback API failed, trying mock...')
          response = await fetch('/api/meetings/brief-mock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              meetingId: meeting.id,
              companyId: meeting.companyId,
              contactId: meeting.contactId,
              opportunityId: meeting.opportunityId
            }),
          })
          console.log('Mock API response status:', response.status)
        }
      }

      if (response.ok) {
        const brief = await response.json()
        console.log('Brief generated successfully:', brief)
        setBriefContent(brief.content)
        setSelectedMeeting(meeting)
        setBriefError(null)
      } else {
        const errorData = await response.json()
        console.error('Brief API error:', errorData)
        setBriefError(errorData.error || 'Failed to generate brief')
      }
    } catch (error) {
      console.error('Error generating brief:', error)
      setBriefError('Network error: Failed to generate brief')
    } finally {
      setIsGeneratingBrief(false)
    }
  }

  const handleDebugBrief = async (meeting: MeetingWithRelations) => {
    try {
      const response = await fetch('/api/debug/meeting-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: meeting.id
        }),
      })

      const debug = await response.json()
      setDebugInfo(debug)
      console.log('Debug info:', debug)
    } catch (error) {
      console.error('Debug error:', error)
      setDebugInfo({ error: 'Debug failed' })
    }
  }

  const handleGenerateRecap = async (meeting: MeetingWithRelations) => {
    try {
      const response = await fetch('/api/meetings/recap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: meeting.id,
          notes: meetingNotes,
          companyId: meeting.companyId,
          contactId: meeting.contactId,
          opportunityId: meeting.opportunityId
        }),
      })

      if (response.ok) {
        const recap = await response.json()
        console.log('Recap generated successfully:', recap)
        // Handle recap display
      }
    } catch (error) {
      console.error('Error generating recap:', error)
    }
  }

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'DISCOVERY': return 'bg-blue-100 text-blue-800'
      case 'DEMO': return 'bg-green-100 text-green-800'
      case 'FOLLOW_UP': return 'bg-purple-100 text-purple-800'
      case 'PROPOSAL': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'DISCOVERY': return <Target className="w-3 h-3" />
      case 'DEMO': return <Users className="w-3 h-3" />
      case 'FOLLOW_UP': return <TrendingUp className="w-3 h-3" />
      case 'PROPOSAL': return <FileText className="w-3 h-3" />
      default: return <Calendar className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meeting OS</h1>
          <p className="text-gray-600">AI-powered meeting preparation and follow-up</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Enhanced
          </Badge>
        </div>
      </div>

      {/* Error Display */}
      {briefError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{briefError}</p>
          </div>
        </div>
      )}

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-yellow-800">Debug Information</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDebugInfo(null)}
              className="text-yellow-800"
            >
              Close
            </Button>
          </div>
          <pre className="mt-2 text-sm text-yellow-700 bg-yellow-100 p-2 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings List */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Upcoming ({upcomingMeetings.length})</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Recent ({recentMeetings.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="group">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => setSelectedMeeting(meeting)}>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-full ${getMeetingTypeColor(meeting.type)}`}>
                          {getMeetingTypeIcon(meeting.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {meeting.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {meeting.contact?.firstName} {meeting.contact?.lastName} • {meeting.company.name}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDateTime(meeting.scheduledAt)}
                            </span>
                            <span>{meeting.duration} min</span>
                            {meeting.meetingUrl && (
                              <a
                                href={meeting.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Join
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGenerateBrief(meeting)
                        }}
                        disabled={isGeneratingBrief}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                        title="Generate AI Brief"
                      >
                        {isGeneratingBrief ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMeeting(meeting)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No upcoming meetings</p>
                  <p className="text-sm">Your next meetings will appear here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-3">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="group">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => setSelectedMeeting(meeting)}>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-full ${getMeetingTypeColor(meeting.type)}`}>
                          {getMeetingTypeIcon(meeting.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {meeting.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {meeting.contact?.firstName} {meeting.contact?.lastName} • {meeting.company.name}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {getRelativeTime(meeting.createdAt)}
                            </span>
                            <span>{meeting.duration} min</span>
                            {meeting.outcome && (
                              <span className="text-green-600 font-medium">
                                {meeting.outcome}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGenerateRecap(meeting)
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Generate Recap"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMeeting(meeting)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {recentMeetings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No recent meetings</p>
                  <p className="text-sm">Completed meetings will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Meeting Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedMeeting ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedMeeting.title}</CardTitle>
                  <button
                    onClick={() => setSelectedMeeting(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <CardDescription>
                  {selectedMeeting.contact?.firstName} {selectedMeeting.contact?.lastName} • {selectedMeeting.company.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium">{formatDateTime(selectedMeeting.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{selectedMeeting.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <Badge className={getMeetingTypeColor(selectedMeeting.type)}>
                      {selectedMeeting.type}
                    </Badge>
                  </div>
                </div>

                {briefContent && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">AI Brief</h4>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">{briefContent}</pre>
                    </div>
                  </div>
                )}

                {selectedMeeting.meetingUrl && (
                  <Button
                    onClick={() => window.open(selectedMeeting.meetingUrl || '', '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Meeting</h3>
                <p className="text-gray-600 text-sm">Choose a meeting to view details and generate AI briefs</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
