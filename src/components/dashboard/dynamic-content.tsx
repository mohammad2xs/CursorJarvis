import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Input not used
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Wand2, Target, TrendingUp, Lightbulb, Copy, Download, Share2, Edit, Pause, Play, RefreshCw, Plus, Eye, MessageSquare, Mail, Linkedin, Presentation, Calendar, CheckCircle, X } from 'lucide-react'
import {
  ContentTemplate,
  GeneratedContent,
  ContentCampaign,
  ContentAnalytics,
  ContentGenerationRequest
} from '@/lib/dynamic-content'

interface DynamicContentProps {
  userId: string
}

export function DynamicContent({ userId }: DynamicContentProps) {
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [campaigns, setCampaigns] = useState<ContentCampaign[]>([])
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGenerator, setShowGenerator] = useState(false)
  const [_selectedTemplate, _setSelectedTemplate] = useState<string | null>(null)
  const [generationRequest, setGenerationRequest] = useState<Partial<ContentGenerationRequest>>({
    userId,
    category: 'EMAIL',
    personalizationLevel: 'ADVANCED',
    tone: 'PROFESSIONAL',
    length: 'MEDIUM',
    includeCallToAction: true
  })

  const loadContentData = React.useCallback(async () => {
    try {
      setLoading(true)
      
      const [templatesRes, contentRes, campaignsRes, analyticsRes] = await Promise.all([
        fetch(`/api/dynamic-content/templates?userId=${userId}`),
        fetch(`/api/dynamic-content/generated?userId=${userId}`),
        fetch(`/api/dynamic-content/campaigns?userId=${userId}`),
        fetch(`/api/dynamic-content/analytics?userId=${userId}&period=WEEKLY`)
      ])
      
      const [templatesData, contentData, campaignsData, analyticsData] = await Promise.all([
        templatesRes.json(),
        contentRes.json(),
        campaignsRes.json(),
        analyticsRes.json()
      ])
      
      setTemplates(templatesData.templates || [])
      setGeneratedContent(contentData.content || [])
      setCampaigns(campaignsData.campaigns || [])
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading content data:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadContentData()
  }, [loadContentData])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EMAIL': return <Mail className="w-4 h-4" />
      case 'LINKEDIN': return <Linkedin className="w-4 h-4" />
      case 'PROPOSAL': return <FileText className="w-4 h-4" />
      case 'PRESENTATION': return <Presentation className="w-4 h-4" />
      case 'FOLLOW_UP': return <MessageSquare className="w-4 h-4" />
      case 'MEETING_INVITE': return <Calendar className="w-4 h-4" />
      case 'THANK_YOU': return <CheckCircle className="w-4 h-4" />
      case 'OBJECTION_HANDLING': return <Target className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TEMPLATE': return 'bg-blue-100 text-blue-800'
      case 'DYNAMIC': return 'bg-green-100 text-green-800'
      case 'ADAPTIVE': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      case 'PAUSED': return 'bg-orange-100 text-orange-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleGenerateContent = async () => {
    try {
      const response = await fetch('/api/dynamic-content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationRequest)
      })
      
      const data = await response.json()
      
      if (data.content) {
        setGeneratedContent(prev => [data.content, ...prev])
        setShowGenerator(false)
      }
    } catch (error) {
      console.error('Error generating content:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dynamic Content Generation</h2>
          <p className="text-gray-600">AI-powered personalized messaging and content creation</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadContentData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowGenerator(true)} size="sm">
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Content
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                <p className="text-xs text-gray-500">available</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Generated</p>
                <p className="text-2xl font-bold text-gray-900">{generatedContent.length}</p>
                <p className="text-xs text-gray-500">this week</p>
              </div>
              <Wand2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                <p className="text-xs text-gray-500">active</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics ? Math.round(analytics.metrics.avgEngagement * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">this week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generated">Generated</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Content Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Templates</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(template.category)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                      {template.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Usage</span>
                      <span>{template.performance.usageCount} times</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Success Rate</span>
                      <span>{Math.round(template.performance.successRate * 100)}%</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Variables</span>
                      <span>{template.variables.length}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Generated Content */}
        <TabsContent value="generated" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <Button onClick={() => setShowGenerator(true)} size="sm">
              <Wand2 className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>
          
          <div className="space-y-4">
            {generatedContent.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{content.subject || 'Generated Content'}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{content.preview}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">
                        {Math.round(content.performance.estimatedEngagement * 100)}% engagement
                      </Badge>
                      <Badge variant="outline">
                        {content.metadata.wordCount} words
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{content.content}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tone:</span>
                        <p className="font-medium">{content.personalizationApplied.tone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Length:</span>
                        <p className="font-medium">{content.personalizationApplied.length}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Reading Time:</span>
                        <p className="font-medium">{content.metadata.readingTime} min</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sentiment:</span>
                        <p className="font-medium">{content.metadata.sentiment}</p>
                      </div>
                    </div>

                    {content.performance.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Suggestions:</h4>
                        <ul className="space-y-1">
                          {content.performance.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <Lightbulb className="w-3 h-3 mr-2 text-yellow-500" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(content.content)}>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Campaigns */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Campaigns</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline">
                        {campaign.templates.length} templates
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Sent:</span>
                        <p className="font-medium">{campaign.performance.totalSent}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Open Rate:</span>
                        <p className="font-medium">{Math.round(campaign.performance.openRate * 100)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Response Rate:</span>
                        <p className="font-medium">{Math.round(campaign.performance.responseRate * 100)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Conversion:</span>
                        <p className="font-medium">{Math.round(campaign.performance.conversionRate * 100)}%</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      {campaign.status === 'ACTIVE' ? (
                        <Button size="sm" variant="outline">
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Generated</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.metrics.totalGenerated}</p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Templates Used</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.metrics.templatesUsed}</p>
                      </div>
                      <Target className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(analytics.metrics.avgEngagement * 100)}%
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.metrics.topPerformingTemplates.map((template, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{template.name}</p>
                            <p className="text-sm text-gray-600">{template.usageCount} uses</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{Math.round(template.successRate * 100)}%</p>
                            <p className="text-sm text-gray-600">success rate</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.metrics.categoryBreakdown.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{category.category}</p>
                            <p className="text-sm text-gray-600">{category.count} generated</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{Math.round(category.avgPerformance * 100)}%</p>
                            <p className="text-sm text-gray-600">avg performance</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analytics.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            <p className="text-sm text-blue-600 mt-2">{rec.action}</p>
                          </div>
                          <Badge className={getStatusColor(rec.impact)}>
                            {rec.impact} IMPACT
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Content Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generate Content</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowGenerator(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select value={generationRequest.category} onValueChange={(value) => setGenerationRequest(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                      <SelectItem value="FOLLOW_UP">Follow-up</SelectItem>
                      <SelectItem value="PROPOSAL">Proposal</SelectItem>
                      <SelectItem value="PRESENTATION">Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                  <Select value={generationRequest.tone} onValueChange={(value) => setGenerationRequest(prev => ({ ...prev, tone: value as 'PROFESSIONAL' | 'FRIENDLY' | 'URGENT' | 'CONVERSATIONAL' | 'FORMAL' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="FRIENDLY">Friendly</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                      <SelectItem value="CONVERSATIONAL">Conversational</SelectItem>
                      <SelectItem value="FORMAL">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                  <Select value={generationRequest.length} onValueChange={(value) => setGenerationRequest(prev => ({ ...prev, length: value as 'SHORT' | 'MEDIUM' | 'LONG' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT">Short</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LONG">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personalization</label>
                  <Select value={generationRequest.personalizationLevel} onValueChange={(value) => setGenerationRequest(prev => ({ ...prev, personalizationLevel: value as 'BASIC' | 'ADVANCED' | 'MAXIMUM' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                      <SelectItem value="MAXIMUM">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Context (Optional)</label>
                <Textarea
                  placeholder="Describe the context, recipient, or specific requirements..."
                  value={generationRequest.context?.recipient?.name ?? ''}
                  onChange={(e) => setGenerationRequest(prev => ({
                    ...prev,
                    context: {
                      ...prev.context,
                      recipient: { 
                        name: e.target.value,
                        company: prev.context?.recipient?.company ?? '',
                        role: prev.context?.recipient?.role ?? '',
                        industry: prev.context?.recipient?.industry ?? '',
                        previousInteractions: prev.context?.recipient?.previousInteractions ?? 0
                      }
                    }
                  }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeCTA"
                  checked={generationRequest.includeCallToAction}
                  onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeCallToAction: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="includeCTA" className="text-sm text-gray-700">
                  Include call-to-action
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowGenerator(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateContent}>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
