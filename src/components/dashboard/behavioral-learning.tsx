import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Clock,
  Users,
  BarChart3,
  Activity,
  AlertTriangle,
  Star,
  ArrowRight,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Mail,
  BookOpen,
  TrendingDown,
  Minus
} from 'lucide-react'
import {
  UserBehaviorPattern,
  LearningInsight,
  AdaptiveRecommendation,
  BehaviorMetrics
} from '@/lib/behavioral-learning'

interface BehavioralLearningProps {
  userId: string
}

export function BehavioralLearning({ userId }: BehavioralLearningProps) {
  const [patterns, setPatterns] = useState<UserBehaviorPattern[]>([])
  const [insights, setInsights] = useState<LearningInsight[]>([])
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([])
  const [metrics, setMetrics] = useState<BehaviorMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  // Selection state omitted (UI not using it currently)
  const [feedback, setFeedback] = useState<Record<string, { rating: number; comment: string }>>({})

  const loadBehavioralData = React.useCallback(async () => {
    try {
      setLoading(true)
      
      // Load behavior analytics
      const response = await fetch(`/api/behavioral-learning/analytics?userId=${userId}`)
      const data = await response.json()
      
      setPatterns(data.patterns || [])
      setInsights(data.insights || [])
      setRecommendations(data.recommendations || [])
      setMetrics(data.metrics || null)
    } catch (error) {
      console.error('Error loading behavioral data:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadBehavioralData()
  }, [loadBehavioralData])

  const handleFeedback = async (recommendationId: string, rating: number, comment: string) => {
    try {
      await fetch('/api/behavioral-learning/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          recommendationId,
          rating,
          comment
        })
      })
      
      setFeedback(prev => ({
        ...prev,
        [recommendationId]: { rating, comment }
      }))
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const getPatternIcon = (patternType: string) => {
    switch (patternType) {
      case 'WORK_SCHEDULE': return <Clock className="w-4 h-4" />
      case 'COMMUNICATION_STYLE': return <MessageSquare className="w-4 h-4" />
      case 'TASK_PREFERENCE': return <Target className="w-4 h-4" />
      case 'MEETING_PATTERN': return <Users className="w-4 h-4" />
      case 'ENERGY_RHYTHM': return <Activity className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getInsightIcon = (insightType: string) => {
    switch (insightType) {
      case 'OPTIMIZATION': return <TrendingUp className="w-4 h-4" />
      case 'PREDICTION': return <Lightbulb className="w-4 h-4" />
      case 'RECOMMENDATION': return <Star className="w-4 h-4" />
      case 'WARNING': return <AlertTriangle className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'DECLINING': return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'STABLE': return <Minus className="w-4 h-4 text-gray-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Behavioral Learning</h2>
          <p className="text-gray-600">AI-powered insights and adaptive recommendations</p>
        </div>
        <Button onClick={loadBehavioralData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productivity</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.metrics.productivity.tasksCompleted}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(metrics.trends.productivity)}
                    <span className="text-xs text-gray-500 ml-1">tasks completed</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Energy Level</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.metrics.energy.averageEnergy.toFixed(1)}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(metrics.trends.energy)}
                    <span className="text-xs text-gray-500 ml-1">/10 average</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Communication</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.metrics.communication.emailsSent}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(metrics.trends.communication)}
                    <span className="text-xs text-gray-500 ml-1">emails sent</span>
                  </div>
                </div>
                <Mail className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.metrics.learning.newSkills.toFixed(1)}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(metrics.trends.learning)}
                    <span className="text-xs text-gray-500 ml-1">new skills</span>
                  </div>
                </div>
                <BookOpen className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patterns">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Behavior Patterns */}
        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map((pattern) => (
              <Card key={pattern.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPatternIcon(pattern.patternType)}
                      <CardTitle className="text-sm font-medium">
                        {pattern.patternType.replace('_', ' ')}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(pattern.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Accuracy</span>
                      <span>{Math.round(pattern.accuracy * 100)}%</span>
                    </div>
                    <Progress value={pattern.accuracy * 100} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Sample Size</span>
                      <span>{pattern.sampleSize}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(pattern.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getInsightIcon(insight.insightType)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} IMPACT
                      </Badge>
                      <Badge variant="secondary">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  
                  {insight.actionable && insight.suggestedActions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Suggested Actions:</h4>
                      <ul className="space-y-1">
                        {insight.suggestedActions.map((action, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">
                        {Math.round(recommendation.confidence * 100)}% confidence
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {Math.round(recommendation.expectedImpact * 100)}% impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Reasoning:</h4>
                      <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Implementation Steps:</h4>
                      <ol className="space-y-1">
                        {recommendation.implementation.steps.map((step, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Estimated Time:</span>
                        <p className="font-medium">{recommendation.implementation.estimatedTime} min</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Difficulty:</span>
                        <p className="font-medium">{recommendation.implementation.difficulty}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Time Saved:</span>
                        <p className="font-medium">{recommendation.metrics.timeSaved} min/day</p>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant={feedback[recommendation.id]?.rating === 1 ? "default" : "outline"}
                            onClick={() => handleFeedback(recommendation.id, 1, feedback[recommendation.id]?.comment || '')}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={feedback[recommendation.id]?.rating === -1 ? "default" : "outline"}
                            onClick={() => handleFeedback(recommendation.id, -1, feedback[recommendation.id]?.comment || '')}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                            value={feedback[recommendation.id]?.comment || ''}
                            onChange={(e) => handleFeedback(recommendation.id, feedback[recommendation.id]?.rating || 0, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Productivity Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Productivity Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Completed</span>
                      <span className="font-medium">{metrics.metrics.productivity.tasksCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Task Time</span>
                      <span className="font-medium">{metrics.metrics.productivity.averageTaskTime} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Focus Time</span>
                      <span className="font-medium">{metrics.metrics.productivity.focusTime}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Interruptions</span>
                      <span className="font-medium">{metrics.metrics.productivity.interruptions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Energy Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Energy Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Peak Hours</span>
                      <span className="font-medium">{metrics.metrics.energy.peakHours.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Low Energy Hours</span>
                      <span className="font-medium">{metrics.metrics.energy.lowEnergyHours.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Energy</span>
                      <span className="font-medium">{metrics.metrics.energy.averageEnergy}/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Consistency</span>
                      <span className="font-medium">{Math.round(metrics.metrics.energy.energyConsistency * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Communication Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Emails Sent</span>
                      <span className="font-medium">{metrics.metrics.communication.emailsSent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Calls Made</span>
                      <span className="font-medium">{metrics.metrics.communication.callsMade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Meetings Attended</span>
                      <span className="font-medium">{metrics.metrics.communication.meetingsAttended}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span className="font-medium">{metrics.metrics.communication.responseTime}h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>New Skills</span>
                      <span className="font-medium">{metrics.metrics.learning.newSkills}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Knowledge Gaps:</span>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {metrics.metrics.learning.knowledgeGaps.map((gap, index) => (
                          <li key={index}>• {gap}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Success Patterns:</span>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {metrics.metrics.learning.successPatterns.map((pattern, index) => (
                          <li key={index}>• {pattern}</li>
                        ))}
                      </ul>
                    </div>
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
