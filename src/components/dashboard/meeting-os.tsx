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
  TrendingUp
} from 'lucide-react'
import { Meeting, MeetingWithRelations } from '@/types'
import { formatDateTime, getRelativeTime, getStageColor } from '@/lib/utils'

interface MeetingOSProps {
  meetings: MeetingWithRelations[]
  onUpdateMeeting: (meetingId: string, updates: Partial<Meeting>) => void
  onGenerateBrief: (meetingId: string) => void
  onGenerateRecap: (meetingId: string, notes: string) => void
}

export function MeetingOS({ meetings, onUpdateMeeting, onGenerateBrief, onGenerateRecap }: MeetingOSProps) {
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingWithRelations[]>([])
  const [recentMeetings, setRecentMeetings] = useState<MeetingWithRelations[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithRelations | null>(null)
  const [meetingNotes, setMeetingNotes] = useState('')
  const [briefContent, setBriefContent] = useState('')
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false)
  const [briefError, setBriefError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

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
        onUpdateMeeting(meeting.id, {
          notes: recap.content,
          status: 'COMPLETED'
        })
        setMeetingNotes('')
      }
    } catch (error) {
      console.error('Error generating recap:', error)
    }
  }

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'DISCOVERY':
        return 'text-blue-600 bg-blue-50'
      case 'DEMO':
        return 'text-green-600 bg-green-50'
      case 'PROPOSAL':
        return 'text-purple-600 bg-purple-50'
      case 'NEGOTIATION':
        return 'text-orange-600 bg-orange-50'
      case 'FOLLOW_UP':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meeting OS</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-600">
            <Calendar className="w-3 h-3 mr-1" />
            {upcomingMeetings.length} Upcoming
          </Badge>
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            {recentMeetings.length} Recent
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="brief">Meeting Brief</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription>
                Meetings scheduled for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {briefError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800">{briefError}</p>
                  </div>
                </div>
              )}
              {debugInfo && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
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
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getMeetingTypeColor(meeting.type)}>
                        {meeting.type}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">
                          {meeting.contact?.firstName} {meeting.contact?.lastName} • {meeting.company.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {formatDateTime(meeting.scheduledAt)}
                            </span>
                          </div>
                          {meeting.duration && (
                            <span className="text-sm text-gray-500">
                              {meeting.duration} minutes
                            </span>
                          )}
                          {meeting.meetingUrl && (
                            <a 
                              href={meeting.meetingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Join Meeting
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleGenerateBrief(meeting)}
                      disabled={isGeneratingBrief}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Brain className="w-4 h-4 mr-1" />
                      {isGeneratingBrief ? 'Generating...' : 'Generate Brief'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDebugBrief(meeting)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Debug
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming meetings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Recent Meetings
              </CardTitle>
              <CardDescription>
                Meetings completed in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getMeetingTypeColor(meeting.type)}>
                        {meeting.type}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">
                          {meeting.contact?.firstName} {meeting.contact?.lastName} • {meeting.company.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            Completed {getRelativeTime(meeting.createdAt)}
                          </span>
                          {meeting.outcome && (
                            <span className="text-sm text-gray-500">
                              Outcome: {meeting.outcome}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View Notes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateRecap(meeting)}
                    >
                      <Target className="w-4 h-4 mr-1" />
                      Generate Recap
                    </Button>
                  </div>
                </div>
              ))}
              {recentMeetings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent meetings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brief" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Meeting Brief Generator
              </CardTitle>
              <CardDescription>
                AI-generated meeting briefs with Perplexity insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMeeting ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                      Brief for: {selectedMeeting.title}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {selectedMeeting.contact?.firstName} {selectedMeeting.contact?.lastName} • {selectedMeeting.company.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {formatDateTime(selectedMeeting.scheduledAt)}
                    </p>
                  </div>
                  
                  {briefContent ? (
                    <div className="prose max-w-none">
                      <div 
                        className="whitespace-pre-wrap p-4 bg-gray-50 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: briefContent }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Generate Brief" to create AI-powered meeting preparation</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a meeting to generate a brief</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meeting Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Meeting Notes
              </CardTitle>
              <CardDescription>
                Capture key points and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter meeting notes..."
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => selectedMeeting && handleGenerateRecap(selectedMeeting)}
                  disabled={!meetingNotes.trim() || !selectedMeeting}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Recap
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
