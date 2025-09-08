'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Inbox, 
  Star, 
  AlertCircle, 
  Clock, 
  Plus,
  RefreshCw,
  TrendingUp,
  FileText,
  Zap,
  Brain,
  Edit
} from 'lucide-react'
import { EmailMessage, EmailAction, EmailTemplate, EmailAnalytics } from '@/lib/email-integration'

interface EmailDashboardProps {
  userId: string
}

export function EmailDashboard({ userId: _userId }: EmailDashboardProps) {
  const [emails, setEmails] = useState<EmailMessage[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [emailActions, setEmailActions] = useState<EmailAction[]>([])
  const [suggestedResponse, setSuggestedResponse] = useState<{
    suggestedSubject: string
    suggestedBody: string
    tone: string
    confidence: number
    alternativeOptions?: Array<{
      tone: string
      reasoning: string
      subject: string
      body: string
    }>
  } | null>(null)

  const loadEmails = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/email/inbox')
      if (!response.ok) throw new Error('Failed to load emails')
      const data = await response.json()
      setEmails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/email/templates')
      if (!response.ok) throw new Error('Failed to load templates')
      const data = await response.json()
      setTemplates(data)
    } catch (err) {
      console.error('Error loading templates:', err)
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/email/analytics')
      if (!response.ok) throw new Error('Failed to load analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      console.error('Error loading analytics:', err)
    }
  }, [])

  useEffect(() => {
    loadEmails()
    loadTemplates()
    loadAnalytics()
  }, [loadEmails, loadTemplates, loadAnalytics])

  const handleEmailSelect = async (email: EmailMessage) => {
    setSelectedEmail(email)
    
    // Load email actions
    try {
      const response = await fetch(`/api/email/${email.id}/actions`)
      if (response.ok) {
        const actions = await response.json()
        setEmailActions(actions)
      }
    } catch (err) {
      console.error('Error loading email actions:', err)
    }
  }

  const handleGenerateResponse = async (email: EmailMessage) => {
    try {
      const response = await fetch(`/api/email/${email.id}/generate-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousEmails: [email],
          contactInfo: email.from,
          opportunityInfo: null,
          meetingInfo: null
        })
      })
      
      if (response.ok) {
        const suggestedResponse = await response.json()
        setSuggestedResponse(suggestedResponse)
      }
    } catch (err) {
      console.error('Error generating response:', err)
    }
  }

  const handleSendEmail = async (to: string, subject: string, body: string) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [{ email: to, name: '', isInternal: false }],
          subject,
          body,
          priority: 'NORMAL'
        })
      })
      
      if (response.ok) {
        // Refresh emails
        loadEmails()
        setSuggestedResponse(null)
      }
    } catch (err) {
      console.error('Error sending email:', err)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'SALES': 'bg-blue-100 text-blue-800',
      'FOLLOW_UP': 'bg-green-100 text-green-800',
      'MEETING': 'bg-purple-100 text-purple-800',
      'PROPOSAL': 'bg-orange-100 text-orange-800',
      'ADMIN': 'bg-gray-100 text-gray-800',
      'OTHER': 'bg-yellow-100 text-yellow-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      'HIGH': 'bg-red-100 text-red-800',
      'NORMAL': 'bg-blue-100 text-blue-800',
      'LOW': 'bg-gray-100 text-gray-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      'POSITIVE': 'bg-green-100 text-green-800',
      'NEUTRAL': 'bg-gray-100 text-gray-800',
      'NEGATIVE': 'bg-red-100 text-red-800'
    }
    return colors[sentiment as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading emails...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadEmails} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Dashboard</h1>
          <p className="text-gray-600">Manage your email communications and AI-powered responses</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={loadEmails} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Inbox className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Emails</p>
                  <p className="text-xl font-bold">{analytics.totalEmails}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p4">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-xl font-bold">{Math.round(analytics.responseRate * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-xl font-bold">{analytics.averageResponseTime}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Action Completion</p>
                  <p className="text-xl font-bold">{Math.round(analytics.actionCompletionRate * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="important">Important</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Inbox className="w-5 h-5 mr-2" />
                    Inbox ({emails.filter(e => !e.isRead).length} unread)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {emails.map((email) => (
                    <EmailItem
                      key={email.id}
                      email={email}
                      onClick={() => handleEmailSelect(email)}
                      onGenerateResponse={() => handleGenerateResponse(email)}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Email Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {templates.map((template) => (
                    <TemplateItem key={template.id} template={template} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Email Details & Actions */}
        <div className="space-y-6">
          {selectedEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Email Details</span>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateResponse(selectedEmail)}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    AI Response
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedEmail.subject}</h4>
                  <p className="text-sm text-gray-600">
                    From: {selectedEmail.from.name} ({selectedEmail.from.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedEmail.receivedAt?.toLocaleString() || selectedEmail.sentAt?.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={getCategoryColor(selectedEmail.category)}>
                    {selectedEmail.category}
                  </Badge>
                  <Badge className={getPriorityColor(selectedEmail.priority)}>
                    {selectedEmail.priority}
                  </Badge>
                  <Badge className={getSentimentColor(selectedEmail.sentiment)}>
                    {selectedEmail.sentiment}
                  </Badge>
                  {selectedEmail.actionRequired && (
                    <Badge className="bg-red-100 text-red-800">
                      Action Required
                    </Badge>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Response Suggestions */}
          {suggestedResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Response Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Suggested Response</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Confidence: {Math.round(suggestedResponse.confidence * 100)}%
                  </p>
                  <div className="border rounded p-3 bg-gray-50">
                    <p className="text-sm font-medium mb-1">Subject: {suggestedResponse.suggestedSubject}</p>
                    <p className="text-sm whitespace-pre-wrap">{suggestedResponse.suggestedBody}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleSendEmail(
                    selectedEmail?.from.email || '',
                    suggestedResponse.suggestedSubject,
                    suggestedResponse.suggestedBody
                  )}>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                {suggestedResponse.alternativeOptions && suggestedResponse.alternativeOptions.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Alternative Options</h5>
                    <div className="space-y-2">
                      {suggestedResponse.alternativeOptions?.map((option: { tone: string; reasoning: string; subject: string; body: string }, index: number) => (
                        <div key={index} className="border rounded p-2 text-sm">
                          <p className="font-medium">{option.tone} - {option.reasoning}</p>
                          <p className="text-gray-600">{option.subject}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Email Actions */}
          {emailActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Suggested Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {emailActions.map((action) => (
                  <ActionItem key={action.id} action={action} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Sub-components
function EmailItem({ 
  email, 
  onClick, 
  onGenerateResponse 
}: { 
  email: EmailMessage
  onClick: () => void
  onGenerateResponse: () => void
}) {
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
        !email.isRead ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {!email.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
            <h4 className="font-medium">{email.subject}</h4>
            {email.isImportant && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {email.from.name} ({email.from.email})
          </p>
          <p className="text-sm text-gray-500 line-clamp-2">{email.body}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className={getCategoryColor(email.category)}>
              {email.category}
            </Badge>
            {email.actionRequired && (
              <Badge className="bg-red-100 text-red-800">
                Action Required
              </Badge>
            )}
          </div>
        </div>
        <div className="ml-4">
          <Button size="sm" variant="outline" onClick={(e) => {
            e.stopPropagation()
            onGenerateResponse()
          }}>
            <Brain className="w-4 h-4 mr-1" />
            AI
          </Button>
        </div>
      </div>
    </div>
  )
}

function TemplateItem({ template }: { template: EmailTemplate }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium">{template.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{template.category}</p>
          <p className="text-sm text-gray-500 mb-2">{template.subject}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Used {template.usageCount} times</span>
            <span>Success: {Math.round(template.successRate * 100)}%</span>
          </div>
        </div>
        <Button size="sm" variant="outline">
          Use Template
        </Button>
      </div>
    </div>
  )
}

function ActionItem({ action }: { action: EmailAction }) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium">{action.title}</h5>
          <p className="text-sm text-gray-600 mb-2">{action.description}</p>
          <p className="text-xs text-gray-500">
            Confidence: {Math.round(action.confidence * 100)}%
          </p>
        </div>
        <Button size="sm" variant="outline">
          Execute
        </Button>
      </div>
    </div>
  )
}

// Helper functions
function getCategoryColor(category: string) {
  const colors = {
    'SALES': 'bg-blue-100 text-blue-800',
    'FOLLOW_UP': 'bg-green-100 text-green-800',
    'MEETING': 'bg-purple-100 text-purple-800',
    'PROPOSAL': 'bg-orange-100 text-orange-800',
    'ADMIN': 'bg-gray-100 text-gray-800',
    'OTHER': 'bg-yellow-100 text-yellow-800'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}
