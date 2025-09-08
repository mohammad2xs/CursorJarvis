'use client'

import React, { useState, useEffect, memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoiceCall, VoiceMetrics, RevenueForecast, RevenueOptimization, RevenueTrend, ConversationCoaching, ConversationInsights, VisualContentStrategy, ProactiveInsight, CustomerSatisfaction, NextAction } from '@/types'
import { 
  Phone, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle,
  Clock,
  BarChart3,
  MessageSquare,
  Eye,
  Lightbulb
} from 'lucide-react'

interface EnhancedCursorJarvisDashboard {
  accountId: string
  accountName: string
  tier: 1 | 2 | 3
  currentRevenue: number
  growthRate: number
  voiceInsights: {
    recentCalls: VoiceCall[]
    performanceMetrics: VoiceMetrics
    coachingRecommendations: string[]
  }
  revenueIntelligence: {
    forecast: RevenueForecast
    optimization: RevenueOptimization
    trends: RevenueTrend[]
  }
  conversationIntelligence: {
    realTimeCoaching: ConversationCoaching
    performanceInsights: ConversationInsights
  }
  visualContentStrategy: VisualContentStrategy
  proactiveInsights: ProactiveInsight[]
  customerSatisfaction: CustomerSatisfaction
  nextActions: NextAction[]
}

interface EnhancedJarvisDashboardProps {
  accountId: string
}

const EnhancedJarvisDashboard = memo(({ accountId }: EnhancedJarvisDashboardProps) => {
  const [dashboard, setDashboard] = useState<EnhancedCursorJarvisDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboard()
  }, [accountId])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/enhanced-jarvis/dashboard?accountId=${accountId}`)
      if (!response.ok) throw new Error('Failed to fetch dashboard')
      const data = await response.json()
      setDashboard(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading enhanced dashboard...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>
  if (!dashboard) return <div className="p-6">No dashboard data available</div>

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-red-100 text-red-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{dashboard.accountName}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <Badge className={getTierColor(dashboard.tier)}>
              Tier {dashboard.tier}
            </Badge>
            <span className="text-sm text-gray-600">
              Current Revenue: {formatCurrency(dashboard.currentRevenue)}
            </span>
            <span className="text-sm text-green-600">
              Growth: +{(dashboard.growthRate * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <Button onClick={fetchDashboard} variant="outline">
          Refresh Dashboard
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.currentRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +{(dashboard.growthRate * 100).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Performance</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.voiceInsights.performanceMetrics.sentimentScore}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Average sentiment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.customerSatisfaction.score}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Actions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.nextActions.length}</div>
            <p className="text-xs text-muted-foreground">
              Pending actions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="voice">Voice Intelligence</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Intelligence</TabsTrigger>
          <TabsTrigger value="insights">Proactive Insights</TabsTrigger>
          <TabsTrigger value="strategy">Visual Content Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Next Actions</span>
                </CardTitle>
                <CardDescription>
                  AI-recommended actions to drive revenue growth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.nextActions.slice(0, 5).map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {action.type === 'CALL' && <Phone className="h-4 w-4 text-blue-500" />}
                      {action.type === 'EMAIL' && <MessageSquare className="h-4 w-4 text-green-500" />}
                      {action.type === 'MEETING' && <Users className="h-4 w-4 text-purple-500" />}
                      {action.type === 'TASK' && <BarChart3 className="h-4 w-4 text-orange-500" />}
                      {action.type === 'FOLLOW_UP' && <Clock className="h-4 w-4 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium">{action.title}</h4>
                        <Badge variant={action.priority === 'HIGH' ? 'destructive' : action.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                        <span>Status: {action.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Proactive Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Proactive Insights</span>
                </CardTitle>
                <CardDescription>
                  AI-generated insights for revenue optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.proactiveInsights.slice(0, 5).map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {insight.type === 'OPPORTUNITY' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {insight.type === 'RISK' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {insight.type === 'TREND' && <Eye className="h-4 w-4 text-orange-500" />}
                      {insight.type === 'RECOMMENDATION' && <Users className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium">{insight.title}</h4>
                        <Badge variant={insight.priority === 'HIGH' ? 'destructive' : insight.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Action Required: {insight.actionRequired ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Voice Performance Metrics</CardTitle>
                <CardDescription>
                  AI analysis of your call performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Sentiment</span>
                    <span>{dashboard.voiceInsights.performanceMetrics.sentimentScore}/10</span>
                  </div>
                  <Progress value={dashboard.voiceInsights.performanceMetrics.sentimentScore * 10} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Trend</span>
                    <span className="capitalize">Stable</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objection Handling</span>
                    <span>{dashboard.voiceInsights.performanceMetrics.qualityScore}/10</span>
                  </div>
                  <Progress value={dashboard.voiceInsights.performanceMetrics.qualityScore * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Coaching Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Coaching Recommendations</CardTitle>
                <CardDescription>
                  AI-generated coaching suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.voiceInsights.coachingRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Intelligence</CardTitle>
              <CardDescription>
                AI-powered revenue analysis and forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Revenue intelligence data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proactive Insights</CardTitle>
              <CardDescription>
                AI-generated insights for revenue optimization and account growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.proactiveInsights.map((insight, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge variant={insight.priority === 'HIGH' ? 'destructive' : insight.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Type: {insight.type.replace('_', ' ')}</span>
                          <span>Action Required: {insight.actionRequired ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Content Strategy</CardTitle>
              <CardDescription>
                AI-generated Getty Images-specific visual content strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Visual content strategy will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
})

EnhancedJarvisDashboard.displayName = 'EnhancedJarvisDashboard'

export { EnhancedJarvisDashboard }
