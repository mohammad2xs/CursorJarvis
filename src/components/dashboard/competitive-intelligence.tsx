import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, AlertTriangle, Target, Eye, ExternalLink, RefreshCw, Plus, Bell, Users, Brain, Lightbulb, ArrowRight, Crown, Sword, Trophy, Info, Building, Check } from 'lucide-react'
import { CompetitiveDashboard } from '@/lib/competitive-intelligence'

interface CompetitiveIntelligenceProps {
  userId: string
}

export function CompetitiveIntelligence({ userId }: CompetitiveIntelligenceProps) {
  const [dashboard, setDashboard] = useState<CompetitiveDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [, setSelectedCompetitor] = useState<string | null>(null)
  const [, setShowAddCompetitor] = useState(false)

  const loadCompetitiveData = React.useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/competitive-intelligence/dashboard?userId=${userId}`)
      const data = await response.json()
      
      setDashboard(data)
    } catch (error) {
      console.error('Error loading competitive data:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadCompetitiveData()
  }, [loadCompetitiveData])

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMarketPositionIcon = (position: string) => {
    switch (position) {
      case 'LEADER': return <Crown className="w-4 h-4 text-yellow-500" />
      case 'CHALLENGER': return <Sword className="w-4 h-4 text-blue-500" />
      case 'FOLLOWER': return <Users className="w-4 h-4 text-gray-500" />
      case 'NICHER': return <Target className="w-4 h-4 text-purple-500" />
      default: return <Building className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // sentiment icon not used currently

  const markAlertAsRead = async (alertId: string) => {
    try {
      await fetch(`/api/competitive-intelligence/alerts/${alertId}/read`, {
        method: 'POST'
      })
      loadCompetitiveData()
    } catch (error) {
      console.error('Error marking alert as read:', error)
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
        <p className="text-gray-500">Failed to load competitive intelligence data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Competitive Intelligence</h2>
          <p className="text-gray-600">Market monitoring and competitor analysis</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadCompetitiveData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddCompetitor(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Competitors</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary.totalCompetitors}</p>
                <p className="text-xs text-gray-500">{dashboard.summary.highThreatCompetitors} high threat</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary.recentAlerts}</p>
                <p className="text-xs text-gray-500">unread</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(dashboard.summary.winRate * 100)}%</p>
                <p className="text-xs text-gray-500">vs competitors</p>
              </div>
              <Trophy className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Trends</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.summary.marketTrends}</p>
                <p className="text-xs text-gray-500">tracked</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
        </TabsList>

        {/* Competitors */}
        <TabsContent value="competitors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.competitors.map((competitor) => (
              <Card key={competitor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getMarketPositionIcon(competitor.marketPosition)}
                      <CardTitle className="text-lg">{competitor.name}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getThreatLevelColor(competitor.threatLevel)}>
                        {competitor.threatLevel}
                      </Badge>
                      <Badge variant="outline">
                        {Math.round(competitor.winRate * 100)}% win rate
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{competitor.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Industry</span>
                      <span>{competitor.industry}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Pricing</span>
                      <span>${competitor.pricing.range.min}-${competitor.pricing.range.max}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Features</span>
                      <span>{competitor.features.length}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Recent News</span>
                      <span>{competitor.recentNews.length}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Website
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Competitive Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {dashboard.competitiveAlerts.map((alert) => (
              <Card key={alert.id} className={alert.isRead ? 'opacity-75' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getImpactColor(alert.impact)}>
                        {alert.impact}
                      </Badge>
                      <Badge variant="outline">
                        {alert.urgency}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">{alert.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Source: {alert.source}</span>
                        <span>{new Date(alert.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        {alert.url && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Read More
                          </Button>
                        )}
                        {!alert.isRead && (
                          <Button size="sm" onClick={() => markAlertAsRead(alert.id)}>
                            <Check className="w-3 h-3 mr-1" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>

                    {alert.recommendedActions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
                        <ul className="space-y-1">
                          {alert.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                              {action}
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

        {/* Market Trends */}
        <TabsContent value="trends" className="space-y-4">
          <div className="space-y-4">
            {dashboard.marketTrends.map((trend) => (
              <Card key={trend.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{trend.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getImpactColor(trend.impact)}>
                        {trend.impact}
                      </Badge>
                      <Badge variant="outline">
                        {trend.magnitude}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{trend.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeframe:</span>
                        <p className="font-medium">{trend.timeframe}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Confidence:</span>
                        <p className="font-medium">{Math.round(trend.confidence * 100)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Updated:</span>
                        <p className="font-medium">{new Date(trend.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Insights:</h4>
                        <ul className="space-y-1">
                          {trend.keyInsights.map((insight, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <Lightbulb className="w-3 h-3 mr-2 text-yellow-500 mt-0.5" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Opportunities:</h4>
                        <ul className="space-y-1">
                          {trend.opportunities.map((opportunity, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <TrendingUp className="w-3 h-3 mr-2 text-green-500 mt-0.5" />
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {trend.threats.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Threats:</h4>
                        <ul className="space-y-1">
                          {trend.threats.map((threat, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <AlertTriangle className="w-3 h-3 mr-2 text-red-500 mt-0.5" />
                              {threat}
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

        {/* Market Intelligence */}
        <TabsContent value="intelligence" className="space-y-4">
          <div className="space-y-4">
            {dashboard.marketIntelligence.map((intel) => (
              <Card key={intel.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{intel.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{intel.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        {intel.category}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {Math.round(intel.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Insights:</h4>
                        <ul className="space-y-1">
                          {intel.insights.map((insight, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <Brain className="w-3 h-3 mr-2 text-blue-500 mt-0.5" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Data Points:</h4>
                        <div className="space-y-2">
                          {intel.data.map((point, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium">{point.metric}</span>
                              <div className="text-right">
                                <p className="text-sm font-bold">{point.value} {point.unit}</p>
                                <p className="text-xs text-gray-500">{point.period}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Implications:</h4>
                        <ul className="space-y-1">
                          {intel.implications.map((implication, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <Info className="w-3 h-3 mr-2 text-blue-500 mt-0.5" />
                              {implication}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {intel.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <ArrowRight className="w-3 h-3 mr-2 text-green-500 mt-0.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
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
