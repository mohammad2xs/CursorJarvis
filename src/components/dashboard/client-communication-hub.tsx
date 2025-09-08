import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MessageSquare, Mail, Phone, Send, Search, Plus, RefreshCw, Eye, Edit, FileText, User, Clock } from 'lucide-react'

interface ClientCommunicationHubProps {
  userId: string
}

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  linkedin?: string
  avatar?: string
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'LEAD'
  tags: string[]
  lastContact: Date
  nextFollowUp: Date
  communicationHistory: Communication[]
  preferences: {
    preferredChannel: 'EMAIL' | 'PHONE' | 'LINKEDIN' | 'SMS'
    timezone: string
    language: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  }
  notes: string
  createdAt: Date
  updatedAt: Date
}

interface Communication {
  id: string
  clientId: string
  type: 'EMAIL' | 'PHONE' | 'LINKEDIN' | 'SMS' | 'MEETING' | 'NOTE'
  direction: 'INBOUND' | 'OUTBOUND'
  subject?: string
  content: string
  timestamp: Date
  status: 'SENT' | 'DELIVERED' | 'READ' | 'REPLIED' | 'FAILED'
  attachments?: string[]
  tags: string[]
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  followUpRequired: boolean
  followUpDate?: Date
  assignedTo: string
  createdAt: Date
  updatedAt: Date
}

interface Template {
  id: string
  name: string
  type: 'EMAIL' | 'SMS' | 'LINKEDIN' | 'PHONE_SCRIPT'
  subject?: string
  content: string
  variables: string[]
  category: string
  tags: string[]
  isActive: boolean
  usageCount: number
  successRate: number
  createdAt: Date
  updatedAt: Date
}

interface Campaign {
  id: string
  name: string
  type: 'EMAIL' | 'SMS' | 'LINKEDIN' | 'MULTI_CHANNEL'
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  targetAudience: {
    clientIds: string[]
    criteria: Record<string, unknown>
  }
  content: {
    subject?: string
    body: string
    attachments?: string[]
  }
  schedule: {
    startDate: Date
    endDate?: Date
    timezone: string
    frequency?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  }
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    replied: number
    unsubscribed: number
    bounced: number
  }
  createdAt: Date
  updatedAt: Date
}

export function ClientCommunicationHub({ userId }: ClientCommunicationHubProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('clients')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [, setShowNewClient] = useState(false)
  const [, setShowNewTemplate] = useState(false)
  const [, setShowNewCampaign] = useState(false)

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true)
      
      const [clientsRes, communicationsRes, templatesRes, campaignsRes] = await Promise.all([
        fetch(`/api/client-communication/hub?userId=${userId}`),
        fetch(`/api/client-communication/communications?userId=${userId}`),
        fetch(`/api/client-communication/templates?userId=${userId}`),
        fetch(`/api/client-communication/campaigns?userId=${userId}`)
      ])
      
      const [clientsData, communicationsData, templatesData, campaignsData] = await Promise.all([
        clientsRes.json(),
        communicationsRes.json(),
        templatesRes.json(),
        campaignsRes.json()
      ])
      
      setClients(clientsData.clients || [])
      setCommunications(communicationsData.communications || [])
      setTemplates(templatesData.templates || [])
      setCampaigns(campaignsData.campaigns || [])
    } catch (error) {
      console.error('Error loading client communication data:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      case 'PROSPECT': return 'bg-blue-100 text-blue-800'
      case 'LEAD': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return 'bg-green-100 text-green-800'
      case 'NEUTRAL': return 'bg-gray-100 text-gray-800'
      case 'NEGATIVE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const selectedClientData = selectedClient ? clients.find(c => c.id === selectedClient) : null
  const clientCommunications = selectedClient ? 
    communications.filter(c => c.clientId === selectedClient) : []

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
          <h2 className="text-2xl font-bold text-gray-900">Client Communication Hub</h2>
          <p className="text-gray-600">Manage all client communications and relationships</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowNewClient(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
          <Button onClick={() => setShowNewTemplate(true)} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
          <Button onClick={() => setShowNewCampaign(true)} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Communications</p>
                <p className="text-2xl font-bold text-gray-900">{communications.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'RUNNING').length}</p>
              </div>
              <Send className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PROSPECT">Prospect</option>
              <option value="LEAD">Lead</option>
            </select>
          </div>

          {/* Clients List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <Card 
                key={client.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedClient === client.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedClient(client.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.company}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Last contact: {client.lastContact.toLocaleDateString()}</span>
                    </div>
                    {client.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {client.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {client.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{client.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-4">
          {selectedClientData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Communications with {selectedClientData.name}</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Communication
                </Button>
              </div>
              
              <div className="space-y-3">
                {clientCommunications.map((comm) => (
                  <Card key={comm.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{comm.type}</Badge>
                            <Badge className={getPriorityColor(comm.priority)}>
                              {comm.priority}
                            </Badge>
                            <Badge className={getSentimentColor(comm.sentiment)}>
                              {comm.sentiment}
                            </Badge>
                          </div>
                          {comm.subject && (
                            <h4 className="font-medium text-gray-900 mb-1">{comm.subject}</h4>
                          )}
                          <p className="text-sm text-gray-600 mb-2">{comm.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{comm.timestamp.toLocaleString()}</span>
                            <span>{comm.direction}</span>
                            <span>Status: {comm.status}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a client to view communications</p>
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Communication Templates</h3>
            <Button onClick={() => setShowNewTemplate(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.type}</p>
                    </div>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{template.content.substring(0, 100)}...</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Used {template.usageCount} times</span>
                    <span>{Math.round(template.successRate * 100)}% success</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Communication Campaigns</h3>
            <Button onClick={() => setShowNewCampaign(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
          
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.type}</p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sent:</span>
                      <p className="font-medium">{campaign.metrics.sent}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivered:</span>
                      <p className="font-medium">{campaign.metrics.delivered}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Opened:</span>
                      <p className="font-medium">{campaign.metrics.opened}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Replied:</span>
                      <p className="font-medium">{campaign.metrics.replied}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
