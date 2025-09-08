import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Zap,
  Lightbulb,
  Clock,
  DollarSign,
  RefreshCw,
  Download,
  Plus,
  FileText
} from 'lucide-react'
import {
  PerformanceMetrics,
  PerformanceGoal,
  PerformanceAlert,
  PerformanceReport
} from '@/lib/performance-analytics'

interface PerformanceAnalyticsDashboardProps {
  userId: string
}

export function PerformanceAnalyticsDashboard({ userId }: PerformanceAnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [goals, setGoals] = useState<PerformanceGoal[]>([])
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [reports, setReports] = useState<PerformanceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('WEEKLY')
  const [showNewGoal, setShowNewGoal] = useState(false)

  useEffect(() => {
    loadPerformanceData()
  }, [userId, selectedPeriod])

  const loadPerformanceData = async () => {
    try {
      setLoading(true)
      
      const [metricsRes, goalsRes, alertsRes, reportsRes] = await Promise.all([
        fetch(`/api/performance-analytics/metrics?userId=${userId}&period=${selectedPeriod}`),
        fetch(`/api/performance-analytics/goals?userId=${userId}`),
        fetch(`/api/performance-analytics/alerts?userId=${userId}`),
        fetch(`/api/performance-analytics/reports?userId=${userId}`)
      ])
      
      const [metricsData, goalsData, alertsData, reportsData] = await Promise.all([
        metricsRes.json(),
        goalsRes.json(),
        alertsRes.json(),
        reportsRes.json()
      ])
      
      setMetrics(metricsData[0] || null)
      setGoals(goalsData)
      setAlerts(alertsData)
      setReports(reportsData)
    } catch (error) {
      console.error('Error loading performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'bg-green-100 text-green-800'
      case 'AT_RISK': return 'bg-yellow-100 text-yellow-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    if (grade.startsWith('D')) return 'text-orange-600'
    return 'text-red-600'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No performance data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-gray-600">Comprehensive performance tracking and insights</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
          <Button onClick={loadPerformanceData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowNewGoal(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.sales.revenue)}</p>
                <p className="text-xs text-gray-500">
                  {formatPercentage(metrics.sales.quotaAttainment)} of quota
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deals Closed</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.sales.dealsClosed}</p>
                <p className="text-xs text-gray-500">
                  {formatPercentage(metrics.sales.winRate)} win rate
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activities</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activities.callsMade}</p>
                <p className="text-xs text-gray-500">calls made</p>
              </div>
              <Phone className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance Score</p>
                <p className="text-2xl font-bold text-gray-900">85</p>
                <p className={`text-xs font-medium ${getPerformanceGradeColor('A-')}`}>
                  Grade: A-
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'CRITICAL' ? 'bg-red-500' :
                    alert.severity === 'HIGH' ? 'bg-orange-500' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    <div className="flex space-x-2 mt-2">
                      {alert.recommendations.slice(0, 2).map((rec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pipeline Value</p>
                      <p className="text-xl font-bold">{formatCurrency(metrics.sales.pipelineValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Deal Size</p>
                      <p className="text-xl font-bold">{formatCurrency(metrics.sales.averageDealSize)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-xl font-bold">{formatPercentage(metrics.sales.conversionRate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sales Cycle</p>
                      <p className="text-xl font-bold">{metrics.sales.salesCycleLength} days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Emails Sent</p>
                      <p className="text-xl font-bold">{metrics.activities.emailsSent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Meetings</p>
                      <p className="text-xl font-bold">{metrics.activities.meetingsAttended}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Demos</p>
                      <p className="text-xl font-bold">{metrics.activities.demosCompleted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Proposals</p>
                      <p className="text-xl font-bold">{metrics.activities.proposalsSent}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Productivity Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Focus Time</p>
                      <p className="text-xl font-bold">{metrics.productivity.focusTime}h</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tasks Completed</p>
                      <p className="text-xl font-bold">{metrics.productivity.tasksCompleted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Energy Level</p>
                      <p className="text-xl font-bold">{metrics.productivity.energyLevel}/10</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Automation Usage</p>
                      <p className="text-xl font-bold">{formatPercentage(metrics.productivity.automationUsage)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Communication Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Response Time</p>
                      <p className="text-xl font-bold">{metrics.communication.responseTime}h</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Rate</p>
                      <p className="text-xl font-bold">{formatPercentage(metrics.communication.responseRate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email Open Rate</p>
                      <p className="text-xl font-bold">{formatPercentage(metrics.communication.emailOpenRate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Client Satisfaction</p>
                      <p className="text-xl font-bold">{metrics.communication.clientSatisfactionScore}/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{formatPercentage(goal.progress)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress * 100}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current:</span>
                        <span className="ml-2 font-medium">{formatNumber(goal.current)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Target:</span>
                        <span className="ml-2 font-medium">{formatNumber(goal.target)}</span>
                      </div>
                    </div>
                    {goal.milestones.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Milestones</h4>
                        <div className="space-y-2">
                          {goal.milestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center justify-between text-sm">
                              <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                                {milestone.title}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">
                                  {formatNumber(milestone.current)} / {formatNumber(milestone.target)}
                                </span>
                                {milestone.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activities */}
        <TabsContent value="activities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Calls Made</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activities.callsMade}</p>
                  </div>
                  <Phone className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activities.emailsSent}</p>
                  </div>
                  <Mail className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activities.meetingsAttended}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Demos</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activities.demosCompleted}</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Proposals</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activities.proposalsSent}</p>
                  </div>
                  <FileText className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Follow-ups</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activities.followUpsCompleted}</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.insights.topPerformingActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-900">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.insights.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-yellow-600">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-900">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.insights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm text-gray-900">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.insights.opportunities.map((opp, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-900">{opp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-4">
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.reportType} Report</CardTitle>
                      <p className="text-sm text-gray-600">
                        {report.period} • {report.startDate.toLocaleDateString()} - {report.endDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        {report.summary.performanceGrade}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Overall Score:</span>
                        <p className="font-bold">{report.summary.overallScore}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Key Achievements:</span>
                        <p className="font-bold">{report.summary.keyAchievements.length}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Challenges:</span>
                        <p className="font-bold">{report.summary.challenges.length}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Generated:</span>
                        <p className="font-bold">{report.generatedAt.toLocaleDateString()}</p>
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
