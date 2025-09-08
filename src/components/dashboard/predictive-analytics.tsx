'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Users,
  Target,
  BarChart3,
  Brain,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Shield,
  Clock,
  Star
} from 'lucide-react'
import { 
  DealClosurePrediction, 
  ChurnRiskPrediction, 
  AnalyticsInsights,
  RiskFactor 
} from '@/lib/predictive-analytics'

interface PredictiveAnalyticsProps {
  userId: string
  className?: string
}

export function PredictiveAnalytics({ userId, className = '' }: PredictiveAnalyticsProps) {
  const [dealPredictions, setDealPredictions] = useState<DealClosurePrediction[]>([])
  const [churnPredictions, setChurnPredictions] = useState<ChurnRiskPrediction[]>([])
  const [insights, setInsights] = useState<AnalyticsInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    loadAnalyticsData()
  }, [userId])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [dealsResponse, churnResponse, insightsResponse] = await Promise.all([
        fetch(`/api/analytics/deal-closure?userId=${userId}`),
        fetch(`/api/analytics/churn-risk?userId=${userId}`),
        fetch(`/api/analytics/insights?userId=${userId}`)
      ])

      if (!dealsResponse.ok || !churnResponse.ok || !insightsResponse.ok) {
        throw new Error('Failed to load analytics data')
      }

      const [deals, churn, insightsData] = await Promise.all([
        dealsResponse.json(),
        churnResponse.json(),
        insightsResponse.json()
      ])

      setDealPredictions(deals.predictions || [])
      setChurnPredictions(churn.predictions || [])
      setInsights(insightsData.insights || null)

    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600'
    if (probability >= 60) return 'text-yellow-600'
    if (probability >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'decreasing': return <ArrowDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading predictive analytics...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadAnalyticsData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics</h2>
          <p className="text-gray-600">AI-powered insights for deal closure and churn risk</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.totalDeals}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(insights.totalValue)}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Closure Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(insights.averageClosureProbability)}%</p>
                  <p className="text-sm text-gray-600">{insights.highProbabilityDeals} high probability</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">At-Risk Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.atRiskAccounts}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(insights.revenueAtRisk)} at risk</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.totalAccounts}</p>
                  <p className="text-sm text-gray-600">{Math.round((insights.totalAccounts - insights.atRiskAccounts) / insights.totalAccounts * 100)}% healthy</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deals">Deal Predictions</TabsTrigger>
          <TabsTrigger value="churn">Churn Risk</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Top Risk Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights?.topRiskFactors.slice(0, 5).map((factor, index) => (
                    <div key={factor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className={getRiskLevelColor(factor.impact)}>
                            {factor.impact}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{factor.name}</p>
                          <p className="text-xs text-gray-600">{factor.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{Math.round(factor.weight * 100)}%</p>
                        <p className="text-xs text-gray-500">weight</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights?.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deal Predictions Tab */}
        <TabsContent value="deals" className="space-y-4">
          <div className="space-y-4">
            {dealPredictions.map((deal) => (
              <Card key={deal.dealId} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{deal.dealName}</h3>
                      <p className="text-sm text-gray-600">{deal.accountName}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline">{deal.stage}</Badge>
                        <span className="text-sm text-gray-600">{formatCurrency(deal.value)}</span>
                        <span className="text-sm text-gray-600">Due: {deal.closeDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-2xl font-bold ${getProbabilityColor(deal.closureProbability)}`}>
                          {deal.closureProbability}%
                        </span>
                        <span className="text-sm text-gray-500">closure</span>
                      </div>
                      <div className="w-32">
                        <Progress value={deal.closureProbability} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-lg font-semibold">{deal.confidence}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Days in Stage</p>
                      <p className="text-lg font-semibold">{deal.daysInStage}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-lg font-semibold">{deal.stakeholderEngagement}%</p>
                    </div>
                  </div>

                  {deal.riskFactors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Factors</h4>
                      <div className="space-y-2">
                        {deal.riskFactors.map((factor) => (
                          <div key={factor.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getRiskLevelColor(factor.impact)}>
                                {factor.impact}
                              </Badge>
                              <span className="text-sm font-medium">{factor.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(factor.weight * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Take Action
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getRiskLevelColor(deal.competitiveThreat)}>
                        {deal.competitiveThreat} threat
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Churn Risk Tab */}
        <TabsContent value="churn" className="space-y-4">
          <div className="space-y-4">
            {churnPredictions.map((account) => (
              <Card key={account.accountId} className={`border-l-4 ${
                account.riskLevel === 'critical' ? 'border-l-red-500' :
                account.riskLevel === 'high' ? 'border-l-orange-500' :
                account.riskLevel === 'medium' ? 'border-l-yellow-500' :
                'border-l-green-500'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{account.accountName}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className={getRiskLevelColor(account.riskLevel)}>
                          {account.riskLevel} risk
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {account.daysSinceLastActivity} days since activity
                        </span>
                        {account.contractRenewalDate && (
                          <span className="text-sm text-gray-600">
                            Renewal: {account.contractRenewalDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-2xl font-bold ${getProbabilityColor(account.churnProbability)}`}>
                          {account.churnProbability}%
                        </span>
                        <span className="text-sm text-gray-500">churn risk</span>
                      </div>
                      <div className="w-32">
                        <Progress value={account.churnProbability} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-lg font-semibold">{account.confidence}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-lg font-semibold">{account.engagementScore}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Sentiment</p>
                      <p className="text-lg font-semibold">{account.sentimentScore > 0 ? '+' : ''}{account.sentimentScore}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Revenue at Risk</p>
                      <p className="text-lg font-semibold">{formatCurrency(account.revenueAtRisk)}</p>
                    </div>
                  </div>

                  {account.riskFactors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Factors</h4>
                      <div className="space-y-2">
                        {account.riskFactors.map((factor) => (
                          <div key={factor.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getRiskLevelColor(factor.impact)}>
                                {factor.impact}
                              </Badge>
                              <span className="text-sm font-medium">{factor.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(factor.weight * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Retain
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {account.keyStakeholders.length} stakeholders
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights?.trends.map((trend, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{trend.metric}</h3>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(trend.trend)}
                      <span className="text-sm font-medium text-gray-600">
                        {trend.change > 0 ? '+' : ''}{trend.change}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{trend.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getRiskLevelColor(trend.significance)}>
                      {trend.significance} significance
                    </Badge>
                    <span className="text-xs text-gray-500">{trend.period}</span>
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
