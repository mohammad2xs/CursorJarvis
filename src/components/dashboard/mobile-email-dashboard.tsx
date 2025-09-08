'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Edit,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react'
import { EmailMessage, EmailAction, EmailTemplate, EmailAnalytics } from '@/lib/email-integration'

interface MobileEmailDashboardProps {
  userId: string
}

export function MobileEmailDashboard({ userId: _userId }: MobileEmailDashboardProps) {
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
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails || [])
      }
    } catch (err) {
      console.error('Error loading emails:', err)
      setError('Failed to load emails')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/email/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (err) {
      console.error('Error loading templates:', err)
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/email/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (err) {
      console.error('Error loading analytics:', err)
    }
  }, [])

  useEffect(() => {
    loadEmails()
    loadTemplates()
    loadAnalytics()
  }, [loadEmails, loadTemplates, loadAnalytics])

  const handleGenerateResponse = async (emailId: string) => {
    try {
      const response = await fetch(`/api/email/${emailId}/generate-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousEmails: [],
          contactInfo: {},
          opportunityInfo: {},
          meetingInfo: {}
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestedResponse(data)
      }
    } catch (err) {
      console.error('Error generating response:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Dashboard</h1>
          <p className="text-sm text-gray-600">Manage your email communications</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadEmails}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'inbox', label: 'Inbox', icon: Inbox },
          { id: 'compose', label: 'Compose', icon: Send },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'inbox' && (
        <div className="space-y-3">
          {/* Search and Filter */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Email List */}
          {emails.map((email) => (
            <EmailCard 
              key={email.id} 
              email={email} 
              onClick={() => setSelectedEmail(email)}
              onGenerateResponse={() => handleGenerateResponse(email.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compose Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Email Templates</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
          
          <div className="grid gap-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.usageCount} uses
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Email Analytics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{analytics.totalEmails}</div>
                <div className="text-sm text-gray-600">Total Emails</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{analytics.sentEmails}</div>
                <div className="text-sm text-gray-600">Sent</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{analytics.receivedEmails}</div>
                <div className="text-sm text-gray-600">Received</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{analytics.responseRate}%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedEmail.subject}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(null)}>
                  ×
                </Button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>From: {selectedEmail.from.name} ({selectedEmail.from.email})</p>
                <p>To: {selectedEmail.to.join(', ')}</p>
                <p>Date: {selectedEmail.receivedAt.toLocaleString()}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody || selectedEmail.body }} />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Button onClick={() => handleGenerateResponse(selectedEmail.id)}>
                  <Brain className="h-4 w-4 mr-2" />
                  AI Response
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Forward
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Response Modal */}
      {suggestedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Suggested Response</h3>
                <Button variant="ghost" size="sm" onClick={() => setSuggestedResponse(null)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={suggestedResponse.suggestedSubject}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={8}
                  value={suggestedResponse.suggestedBody}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  readOnly
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{suggestedResponse.tone}</Badge>
                  <Badge variant="outline">{suggestedResponse.confidence}% confidence</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setSuggestedResponse(null)}>
                    Cancel
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Email Card Component
function EmailCard({ 
  email, 
  onClick, 
  onGenerateResponse 
}: { 
  email: EmailMessage
  onClick: () => void
  onGenerateResponse: () => void
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm truncate">{email.subject}</h3>
              {email.isImportant && <Star className="h-4 w-4 text-yellow-500" />}
            </div>
            <p className="text-sm text-gray-600 truncate">{email.from.name} ({email.from.email})</p>
            <p className="text-xs text-gray-500 mt-1">
              {email.receivedAt.toLocaleString()}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              {email.priority === 'HIGH' && (
                <Badge variant="destructive" className="text-xs">High Priority</Badge>
              )}
              {email.labels.map((label) => (
                <Badge key={label} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onGenerateResponse()
              }}
              className="p-1"
            >
              <Brain className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
