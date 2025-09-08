import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  MessageSquare,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Star,
  Brain,
  Lightbulb,
  Activity,
  DollarSign,
  Crown,
  Trophy,
  User,
  BarChart3
} from 'lucide-react'
import {
  TeamMember,
  TeamGoal,
  TeamMetrics,
  ManagerInsight,
  TeamCollaboration as TeamCollaborationType,
  TeamDashboard
} from '@/lib/team-collaboration'

interface TeamCollaborationProps {
  userId: string
  teamId?: string
}

export function TeamCollaboration({ userId, teamId = 'team-1' }: TeamCollaborationProps) {
  const [dashboard, setDashboard] = useState<TeamDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [showAddCollaboration, setShowAddCollaboration] = useState(false)

  useEffect(() => {
    loadTeamData()
  }, [teamId, userId])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/team-collaboration/dashboard?teamId=${teamId}&managerId=${userId}`)
      const data = await response.json()
      
      setDashboard(data)
    } catch (error) {
      console.error('Error loading team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'MANAGER': return <Crown className="w-4 h-4 text-yellow-500" />
      case 'SENIOR_AE': return <Award className="w-4 h-4 text-blue-500" />
      case 'AE': return <User className="w-4 h-4 text-green-500" />
      case 'SDR': return <Target className="w-4 h-4 text-purple-500" />
      case 'INTERN': return <Star className="w-4 h-4 text-orange-500" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800'
      case 'TERMINATED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'DOWN': return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'STABLE': return <Activity className="w-4 h-4 text-gray-500" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load team data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{dashboard.team.name}</h2>
          <p className="text-gray-600">{dashboard.team.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadTeamData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddCollaboration(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Collaboration
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary.totalMembers}</p>
                <p className="text-xs text-gray-500">{dashboard.summary.activeMembers} active</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quota Attainment</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(dashboard.summary.quotaAttainment * 100)}%</p>
                <p className="text-xs text-gray-500">team average</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(dashboard.summary.revenueActual / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500">of ${(dashboard.summary.revenueTarget / 1000000).toFixed(1)}M target</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(dashboard.summary.winRate * 100)}%</p>
                <p className="text-xs text-gray-500">deals closed</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Revenue Target</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">${(dashboard.metrics.revenue.actual / 1000000).toFixed(1)}M</span>
                      <span className="text-xs text-gray-500">/ ${(dashboard.metrics.revenue.target / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${dashboard.metrics.revenue.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Deals Closed:</span>
                      <p className="font-bold">{dashboard.metrics.deals.closed}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Deal Size:</span>
                      <p className="font-bold">${(dashboard.metrics.deals.averageDealSize / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pipeline:</span>
                      <p className="font-bold">{dashboard.metrics.deals.pipeline}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Cycle Time:</span>
                      <p className="font-bold">{dashboard.metrics.deals.cycleTime} days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.userName} • {new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Members */}
        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.team.members.map((member) => (
              <Card key={member.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Quota Attainment</span>
                      <span className="font-bold">{Math.round(member.performance.quotaAttainment * 100)}%</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Deals Closed</span>
                      <span className="font-bold">{member.performance.dealsClosed}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Revenue</span>
                      <span className="font-bold">${(member.performance.revenue / 1000).toFixed(0)}K</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Activities</span>
                      <span className="font-bold">{member.performance.activities}</span>
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

        {/* Goals */}
        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {dashboard.team.goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getGoalStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span className="font-bold">{goal.progress.toFixed(1)}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Target:</span>
                        <p className="font-bold">{goal.target.toLocaleString()} {goal.unit}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current:</span>
                        <p className="font-bold">{goal.current.toLocaleString()} {goal.unit}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <p className="font-bold">{new Date(goal.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">End Date:</span>
                        <p className="font-bold">{new Date(goal.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Manager Insights */}
        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {dashboard.insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                      <Badge variant="outline">
                        {insight.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{insight.data.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{insight.data.value}</span>
                        {getTrendIcon(insight.data.trend)}
                      </div>
                    </div>

                    {insight.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {insight.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <Lightbulb className="w-3 h-3 mr-2 text-yellow-500 mt-0.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {insight.actionItems.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Action Items:</h4>
                        <ul className="space-y-2">
                          {insight.actionItems.map((action) => (
                            <li key={action.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm">{action.title}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{action.assignedTo}</span>
                                <Badge variant="outline" className="text-xs">
                                  {action.status}
                                </Badge>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Collaborations */}
        <TabsContent value="collaborations" className="space-y-4">
          <div className="space-y-4">
            {dashboard.collaborations.map((collaboration) => (
              <Card key={collaboration.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{collaboration.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{collaboration.description}</p>
                    </div>
                    <Badge variant="outline">
                      {collaboration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-bold">{collaboration.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Participants:</span>
                        <p className="font-bold">{collaboration.participants.length}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Initiator:</span>
                        <p className="font-bold">{collaboration.initiator}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-bold">{new Date(collaboration.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {collaboration.scheduledAt && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Scheduled: {new Date(collaboration.scheduledAt).toLocaleString()}</span>
                      </div>
                    )}

                    {collaboration.followUpActions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Follow-up Actions:</h4>
                        <ul className="space-y-1">
                          {collaboration.followUpActions.map((action) => (
                            <li key={action.id} className="flex items-center justify-between text-sm">
                              <span>{action.title}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-500">{action.assignedTo}</span>
                                <Badge variant="outline" className="text-xs">
                                  {action.status}
                                </Badge>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
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
      </Tabs>
    </div>
  )
}
