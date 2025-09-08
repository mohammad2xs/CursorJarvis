import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Linkedin,
  Users,
  MessageSquare,
  TrendingUp,
  Target,
  Zap,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Edit,
  User,
  Building,
  MapPin,
  Award,
  ThumbsUp,
  Share2,
  Lightbulb
} from 'lucide-react'
import {
  LinkedInProfile,
  LinkedInCampaign,
  PhantomBusterPhantom,
  SocialSellingInsights
} from '@/lib/phantombuster-integration'

interface SocialSellingDashboardProps {
  userId: string
}

export function SocialSellingDashboard({ userId }: SocialSellingDashboardProps) {
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([])
  const [campaigns, setCampaigns] = useState<LinkedInCampaign[]>([])
  const [phantoms, setPhantoms] = useState<PhantomBusterPhantom[]>([])
  const [insights, setInsights] = useState<SocialSellingInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIndustry, setFilterIndustry] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState<string>('all')
  const [showNewCampaign, setShowNewCampaign] = useState(false)

  useEffect(() => {
    loadSocialSellingData()
  }, [userId])

  const loadSocialSellingData = async () => {
    try {
      setLoading(true)
      
      const [profilesRes, campaignsRes, phantomsRes, insightsRes] = await Promise.all([
        fetch(`/api/social-selling/profiles?userId=${userId}`),
        fetch(`/api/social-selling/campaigns?userId=${userId}`),
        fetch(`/api/social-selling/phantoms?userId=${userId}`),
        fetch(`/api/social-selling/insights?userId=${userId}`)
      ])
      
      const [profilesData, campaignsData, phantomsData, insightsData] = await Promise.all([
        profilesRes.json(),
        campaignsRes.json(),
        phantomsRes.json(),
        insightsRes.json()
      ])
      
      setProfiles(profilesData)
      setCampaigns(campaignsData)
      setPhantoms(phantomsData)
      setInsights(insightsData)
    } catch (error) {
      console.error('Error loading social selling data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'CONNECTION': return <Users className="w-4 h-4" />
      case 'MESSAGE': return <MessageSquare className="w-4 h-4" />
      case 'FOLLOW': return <User className="w-4 h-4" />
      case 'LIKE': return <ThumbsUp className="w-4 h-4" />
      case 'COMMENT': return <MessageSquare className="w-4 h-4" />
      case 'SHARE': return <Share2 className="w-4 h-4" />
      case 'ENDORSE': return <Award className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getPhantomStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      case 'ERROR': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.currentPosition.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = filterIndustry === 'all' || profile.industry === filterIndustry
    const matchesLocation = filterLocation === 'all' || profile.location.includes(filterLocation)
    return matchesSearch && matchesIndustry && matchesLocation
  })

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
          <h2 className="text-2xl font-bold text-gray-900">Social Selling Dashboard</h2>
          <p className="text-gray-600">LinkedIn automation and social selling powered by PhantomBuster</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadSocialSellingData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowNewCampaign(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">LinkedIn Profiles</p>
                <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
                <p className="text-xs text-gray-500">Total prospects</p>
              </div>
              <Linkedin className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'ACTIVE').length}
                </p>
                <p className="text-xs text-gray-500">Running now</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PhantomBuster Phantoms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {phantoms.filter(p => p.status === 'ACTIVE').length}
                </p>
                <p className="text-xs text-gray-500">Automation active</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {insights ? Math.round(insights.responseRate * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">LinkedIn messages</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search profiles, companies, headlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Manufacturing">Manufacturing</option>
          </select>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Locations</option>
            <option value="San Francisco">San Francisco</option>
            <option value="New York">New York</option>
            <option value="Austin">Austin</option>
            <option value="Chicago">Chicago</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">LinkedIn Profiles</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="phantoms">PhantomBuster</TabsTrigger>
          <TabsTrigger value="insights">Analytics</TabsTrigger>
        </TabsList>

        {/* LinkedIn Profiles */}
        <TabsContent value="profiles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{profile.fullName}</CardTitle>
                        <p className="text-sm text-gray-600">{profile.currentPosition.title}</p>
                        <p className="text-xs text-gray-500">{profile.currentPosition.company}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {profile.isPremium && (
                        <Badge variant="outline" className="text-xs">
                          Premium
                        </Badge>
                      )}
                      {profile.isVerified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {profile.headline}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      {profile.industry}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {profile.connections.toLocaleString()} connections
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {profile.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getCampaignTypeIcon(campaign.type)}
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <p className="text-sm text-gray-600">{campaign.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline">
                        {campaign.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Targets:</span>
                        <p className="font-bold">{campaign.metrics.totalTargets}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <p className="font-bold">{campaign.metrics.actionsCompleted}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <p className="font-bold">{Math.round(campaign.metrics.successRate * 100)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Response Rate:</span>
                        <p className="font-bold">{Math.round(campaign.metrics.responseRate * 100)}%</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
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

        {/* PhantomBuster Phantoms */}
        <TabsContent value="phantoms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phantoms.map((phantom) => (
              <Card key={phantom.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{phantom.name}</CardTitle>
                      <p className="text-sm text-gray-600">{phantom.description}</p>
                    </div>
                    <Badge className={getPhantomStatusColor(phantom.status)}>
                      {phantom.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium">{phantom.category}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Frequency:</span>
                      <span className="ml-2 font-medium">{phantom.frequency}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Runs:</span>
                        <p className="font-medium">{phantom.results.totalRuns}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <p className="font-medium">
                          {Math.round((phantom.results.successfulRuns / phantom.results.totalRuns) * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="insights" className="space-y-4">
          {insights && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profile Views</span>
                      <span className="font-bold">{insights.profileViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Connection Requests</span>
                      <span className="font-bold">{insights.connectionRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Messages Sent</span>
                      <span className="font-bold">{insights.messagesSent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-bold">{Math.round(insights.responseRate * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Posts Created</span>
                      <span className="font-bold">{insights.postsCreated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Engagement</span>
                      <span className="font-bold">{insights.postsEngagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Engagement Rate</span>
                      <span className="font-bold">{Math.round(insights.engagementRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Network Growth</span>
                      <span className="font-bold">{Math.round(insights.networkGrowth * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights.recommendedActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
