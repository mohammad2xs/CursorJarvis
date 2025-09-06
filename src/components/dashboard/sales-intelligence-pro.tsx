'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText, 
  Zap,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Folder,
  FolderOpen,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Settings,
  BarChart3,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Globe,
  Phone,
  Mail,
  Linkedin,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Star,
  Bookmark,
  Share2,
  Copy,
  Edit,
  Trash2,
  Archive,
  Flag,
  Eye,
  EyeOff,
  Send
} from 'lucide-react'
import { MeetingWithRelations, OpportunityWithRelations, NBA, CompanyWithRelations } from '@/types'
import { formatDateTime, getRelativeTime, getStageColor } from '@/lib/utils'
import { nbaBrain } from '@/lib/nba-brain'
import { brandStudio } from '@/lib/brand-studio'
import { perplexityService } from '@/lib/perplexity'

interface SalesIntelligenceProProps {
  meetings: MeetingWithRelations[]
  opportunities: OpportunityWithRelations[]
  companies: CompanyWithRelations[]
  onUpdateMeeting: (meetingId: string, updates: Partial<MeetingWithRelations>) => void
  onUpdateOpportunity: (oppId: string, updates: Partial<OpportunityWithRelations>) => void
  onGenerateRecap: (meetingId: string) => void
}

interface ProjectFolder {
  id: string
  name: string
  type: 'account' | 'campaign' | 'deal' | 'research'
  color: string
  items: (MeetingWithRelations | OpportunityWithRelations | CompanyWithRelations)[]
  createdAt: Date
  updatedAt: Date
}

interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  transcript: string
  analysis: string
}

export function SalesIntelligencePro({ 
  meetings, 
  opportunities, 
  companies, 
  onUpdateMeeting, 
  onUpdateOpportunity, 
  onGenerateRecap 
}: SalesIntelligenceProProps) {
  // Core state
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentNBA, setCurrentNBA] = useState<NBA | null>(null)
  
  // NBA Brain state
  const [nbas, setNbas] = useState<NBA[]>([])
  const [nbaLoading, setNbaLoading] = useState(false)
  
  // Recording state
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    transcript: '',
    analysis: ''
  })
  
  // Project folders
  const [folders, setFolders] = useState<ProjectFolder[]>([
    {
      id: 'strategic-accounts',
      name: 'Strategic Accounts',
      type: 'account',
      color: 'blue',
      items: companies.filter(c => c.priorityLevel === 'STRATEGIC'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'q4-campaigns',
      name: 'Q4 Campaigns',
      type: 'campaign',
      color: 'green',
      items: opportunities.filter(o => o.stage === 'DISCOVER'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'hot-deals',
      name: 'Hot Deals',
      type: 'deal',
      color: 'red',
      items: opportunities.filter(o => o.probability && o.probability > 70),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    type?: 'nba' | 'brief' | 'analysis' | 'research'
  }>>([])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Load NBAs on mount
  useEffect(() => {
    loadNBAs()
  }, [companies])

  const loadNBAs = async () => {
    setNbaLoading(true)
    try {
      const allNBAs: NBA[] = []
      for (const company of companies.slice(0, 5)) { // Limit to top 5 companies
        const companyNBAs = await nbaBrain.generateNBAs(company.id)
        allNBAs.push(...companyNBAs)
      }
      setNbas(allNBAs.sort((a, b) => b.priority - a.priority))
    } catch (error) {
      console.error('Error loading NBAs:', error)
    } finally {
      setNbaLoading(false)
    }
  }

  const handleChatSubmit = async (message: string) => {
    if (!message.trim()) return

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)

    try {
      // Simulate AI response based on message content
      let response = ''
      let type: 'nba' | 'brief' | 'analysis' | 'research' = 'analysis'

      if (message.toLowerCase().includes('nba') || message.toLowerCase().includes('next best action')) {
        response = `Here are your top 3 Next Best Actions:\n\n${nbas.slice(0, 3).map((nba, i) => 
          `${i + 1}. **${nba.title}** (Priority: ${nba.priority})\n   ${nba.description}\n   Rationale: ${nba.rationale}`
        ).join('\n\n')}`
        type = 'nba'
      } else if (message.toLowerCase().includes('meeting') || message.toLowerCase().includes('brief')) {
        response = `I can help you prepare for your upcoming meetings. You have ${meetings.length} meetings scheduled. Would you like me to generate a brief for any specific meeting?`
        type = 'brief'
      } else if (message.toLowerCase().includes('deal') || message.toLowerCase().includes('pipeline')) {
        response = `Your pipeline shows ${opportunities.length} opportunities with a total value of $${opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0).toLocaleString()}. ${opportunities.filter(o => o.stage === 'CLOSE_WON').length} deals have been won this quarter.`
        type = 'analysis'
      } else {
        response = `I'm your AI sales assistant. I can help you with:\n- Next Best Actions and recommendations\n- Meeting preparation and briefs\n- Pipeline analysis and deal insights\n- Brand messaging and content generation\n- Account research and intelligence\n\nWhat would you like to work on?`
      }

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
        type
      }

      setTimeout(() => {
        setChatMessages(prev => [...prev, aiMessage])
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error('Error generating AI response:', error)
      setIsTyping(false)
    }
  }

  const startRecording = () => {
    setRecording(prev => ({ ...prev, isRecording: true, isPaused: false }))
    // Simulate recording duration
    const interval = setInterval(() => {
      setRecording(prev => {
        if (prev.isRecording && !prev.isPaused) {
          return { ...prev, duration: prev.duration + 1 }
        }
        return prev
      })
    }, 1000)
    
    // Store interval for cleanup
    ;(window as any).recordingInterval = interval
  }

  const pauseRecording = () => {
    setRecording(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }

  const stopRecording = () => {
    setRecording(prev => ({ ...prev, isRecording: false, isPaused: false }))
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval)
    }
    
    // Simulate transcript generation
    setTimeout(() => {
      setRecording(prev => ({
        ...prev,
        transcript: "This is a simulated transcript of your sales call. The AI would analyze this content to provide insights and next steps.",
        analysis: "Key insights: Customer showed interest in our premium features. Next steps: Send pricing proposal and schedule technical demo."
      }))
    }, 2000)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const filteredItems = useMemo(() => {
    if (!selectedFolder) return []
    const folder = folders.find(f => f.id === selectedFolder)
    if (!folder) return []
    
    if (!searchQuery) return folder.items
    
    return folder.items.filter(item => {
      if ('name' in item) {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase())
      }
      if ('title' in item) {
        return item.title.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return false
    })
  }, [selectedFolder, folders, searchQuery])

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Project Folders */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sales Intelligence Pro</h2>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedFolder === folder.id
                  ? 'bg-blue-50 border-blue-200 border'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedFolder === folder.id ? (
                    <FolderOpen className={`w-5 h-5 text-${folder.color}-600`} />
                  ) : (
                    <Folder className={`w-5 h-5 text-${folder.color}-600`} />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{folder.name}</p>
                    <p className="text-sm text-gray-500">{folder.items.length} items</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                  selectedFolder === folder.id ? 'rotate-90' : ''
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Recording Controls */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Call Recording</span>
              <Badge variant={recording.isRecording ? "destructive" : "secondary"}>
                {recording.isRecording ? 'Recording' : 'Ready'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {!recording.isRecording ? (
                <Button onClick={startRecording} size="sm" className="flex-1">
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button onClick={pauseRecording} size="sm" variant="outline">
                    {recording.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                  <Button onClick={stopRecording} size="sm" variant="destructive">
                    <Square className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatDuration(recording.duration)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="nba-brain" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>NBA Brain</span>
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Meetings</span>
              </TabsTrigger>
              <TabsTrigger value="deals" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Deals</span>
              </TabsTrigger>
              <TabsTrigger value="brand" className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Brand Studio</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>AI Chat</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{opportunities.length}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{meetings.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Next 7 days
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">NBA Score</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {nbas.length > 0 ? Math.round(nbas.reduce((sum, nba) => sum + nba.priority, 0) / nbas.length) : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average priority
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top NBAs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>Top Next Best Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nbas.slice(0, 5).map((nba) => (
                      <div key={nba.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline" className="text-blue-600">
                              {nba.playType}
                            </Badge>
                            <span className="font-medium">{nba.title}</span>
                            <Badge variant="secondary">Priority {nba.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{nba.description}</p>
                          <p className="text-xs text-gray-500">{nba.rationale}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NBA Brain Tab */}
            <TabsContent value="nba-brain" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">NBA Brain</h2>
                <Button onClick={loadNBAs} disabled={nbaLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${nbaLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {nbas.map((nba) => (
                  <Card key={nba.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-blue-600">
                          {nba.playType}
                        </Badge>
                        <Badge variant="secondary">Priority {nba.priority}</Badge>
                      </div>
                      <CardTitle className="text-lg">{nba.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{nba.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Rationale:</span>
                          <p className="text-sm text-gray-600">{nba.rationale}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Source:</span>
                          <p className="text-sm text-gray-600">{nba.source}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Button size="sm" className="flex-1">
                          Execute
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Meeting OS</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Meeting
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {meetings.map((meeting) => (
                  <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-blue-600">
                          {meeting.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(meeting.scheduledAt)}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <Users className="w-4 h-4 inline mr-2" />
                          {meeting.contact?.firstName} {meeting.contact?.lastName} • {meeting.company.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-2" />
                          {meeting.duration} minutes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="flex-1">
                          <Brain className="w-4 h-4 mr-2" />
                          Generate Brief
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Deals Tab */}
            <TabsContent value="deals" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Deal OS</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Deal
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {opportunities.map((opp) => (
                  <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getStageColor(opp.stage)}>
                          {opp.stage}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          ${opp.amount?.toLocaleString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{opp.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <Users className="w-4 h-4 inline mr-2" />
                          {opp.company.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Close: {opp.closeDate ? new Date(opp.closeDate).toLocaleDateString() : 'TBD'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 inline mr-2" />
                          {opp.probability}% probability
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="flex-1">
                          <Target className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Brand Studio Tab */}
            <TabsContent value="brand" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Brand Studio</h2>
                <Button>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Value Propositions</CardTitle>
                    <CardDescription>
                      Generate industry-specific value propositions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Industry</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>Tech/SaaS</option>
                          <option>Aerospace & Defense</option>
                          <option>Oil & Gas/Energy</option>
                          <option>Healthcare/MedSys</option>
                          <option>Consumer/CPG</option>
                        </select>
                      </div>
                      <Button className="w-full">
                        Generate Value Prop
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Discovery Questions</CardTitle>
                    <CardDescription>
                      AI-generated questions for your meetings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Deal Type</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>NEW_LOGO</option>
                          <option>RENEWAL</option>
                          <option>UPSELL</option>
                          <option>STRATEGIC</option>
                        </select>
                      </div>
                      <Button className="w-full">
                        Generate Questions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">AI Sales Assistant</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col h-96">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask me anything about your sales pipeline, meetings, or deals..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleChatSubmit(chatInput)
                      }
                    }}
                    className="flex-1"
                    rows={2}
                  />
                  <Button 
                    onClick={() => handleChatSubmit(chatInput)}
                    disabled={!chatInput.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
