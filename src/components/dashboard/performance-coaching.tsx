import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Target,
  TrendingUp,
  BookOpen,
  Users,
  Star,
  Calendar,
  Clock,
  Award,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Share2,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  GraduationCap,
  Trophy,
  Flag,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Video,
  FileText,
  Headphones,
  Book,
  Mic,
  Settings
} from 'lucide-react'
import {
  CoachingGoal,
  PerformanceInsight,
  CoachingRecommendation,
  CoachingSession,
  SkillAssessment,
  CoachingResource
} from '@/lib/performance-coaching'

interface PerformanceCoachingProps {
  userId: string
}

export function PerformanceCoaching({ userId }: PerformanceCoachingProps) {
  const [goals, setGoals] = useState<CoachingGoal[]>([])
  const [insights, setInsights] = useState<PerformanceInsight[]>([])
  const [recommendations, setRecommendations] = useState<CoachingRecommendation[]>([])
  const [sessions, setSessions] = useState<CoachingSession[]>([])
  const [assessments, setAssessments] = useState<SkillAssessment[]>([])
  const [progress, setProgress] = useState({
    goalsCompleted: 0,
    totalGoals: 0,
    skillsImproved: 0,
    sessionsCompleted: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)

  useEffect(() => {
    loadCoachingData()
  }, [userId])

  const loadCoachingData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/performance-coaching/dashboard?userId=${userId}`)
      const data = await response.json()
      
      setGoals(data.goals || [])
      setInsights(data.insights || [])
      setRecommendations(data.recommendations || [])
      setSessions(data.sessions || [])
      setAssessments(data.assessments || [])
      setProgress(data.progress || progress)
    } catch (error) {
      console.error('Error loading coaching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SALES_SKILLS': return <Target className="w-4 h-4" />
      case 'COMMUNICATION': return <MessageSquare className="w-4 h-4" />
      case 'TECHNICAL': return <Zap className="w-4 h-4" />
      case 'LEADERSHIP': return <Users className="w-4 h-4" />
      case 'PRODUCTIVITY': return <Activity className="w-4 h-4" />
      case 'RELATIONSHIP_BUILDING': return <Users className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
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

  const getInsightIcon = (insightType: string) => {
    switch (insightType) {
      case 'STRENGTH': return <Trophy className="w-4 h-4 text-green-500" />
      case 'OPPORTUNITY': return <Lightbulb className="w-4 h-4 text-blue-500" />
      case 'RISK': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'TREND': return <TrendingUp className="w-4 h-4 text-purple-500" />
      case 'PATTERN': return <BarChart3 className="w-4 h-4 text-indigo-500" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-4 h-4" />
      case 'ARTICLE': return <FileText className="w-4 h-4" />
      case 'COURSE': return <GraduationCap className="w-4 h-4" />
      case 'BOOK': return <Book className="w-4 h-4" />
      case 'PODCAST': return <Headphones className="w-4 h-4" />
      case 'PRACTICE_EXERCISE': return <Target className="w-4 h-4" />
      case 'MENTORING': return <Users className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
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
          <h2 className="text-2xl font-bold text-gray-900">Performance Coaching</h2>
          <p className="text-gray-600">Personalized development and growth recommendations</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadCoachingData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowNewGoalForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goals Completed</p>
                <p className="text-2xl font-bold text-gray-900">{progress.goalsCompleted}</p>
                <p className="text-xs text-gray-500">of {progress.totalGoals} total</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Skills Improved</p>
                <p className="text-2xl font-bold text-gray-900">{progress.skillsImproved}</p>
                <p className="text-xs text-gray-500">this quarter</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{progress.sessionsCompleted}</p>
                <p className="text-xs text-gray-500">completed</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{progress.averageRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">out of 5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
                <p className="text-xs text-gray-500">available</p>
              </div>
              <Lightbulb className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Coaching Goals */}
        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(goal.category)}
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Current Level</span>
                      <span>{goal.currentLevel}/10</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Target Level</span>
                      <span>{goal.targetLevel}/10</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Time Remaining</span>
                      <span>{goal.estimatedTimeToComplete} days</span>
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

        {/* Performance Insights */}
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
                      <Badge className={getPriorityColor(insight.impact)}>
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
                  
                  {insight.actionable && insight.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insight.dataPoints.map((point, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{point.metric}</span>
                          <span className="text-sm text-gray-600">{point.value}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Benchmark: {point.benchmark}</span>
                          <Badge variant={point.trend === 'IMPROVING' ? 'default' : point.trend === 'DECLINING' ? 'destructive' : 'secondary'}>
                            {point.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Coaching Recommendations */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="secondary">
                        {Math.round(rec.estimatedImpact * 100)}% impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Reasoning:</h4>
                      <p className="text-sm text-gray-600">{rec.reasoning}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Effort Required:</span>
                        <p className="font-medium">{rec.effortRequired}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeline:</span>
                        <p className="font-medium">{rec.timeline} days</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Skills:</span>
                        <p className="font-medium">{rec.skills.length}</p>
                      </div>
                    </div>

                    {rec.resources.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommended Resources:</h4>
                        <div className="space-y-2">
                          {rec.resources.map((resource) => (
                            <div key={resource.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                              {getResourceIcon(resource.type)}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{resource.title}</p>
                                <p className="text-xs text-gray-600">{resource.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {resource.difficulty}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Play className="w-3 h-3 mr-1" />
                        Start Learning
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Coaching Sessions */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={session.status === 'COMPLETED' ? 'default' : session.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}>
                        {session.status}
                      </Badge>
                      <Badge variant="outline">
                        {session.duration} min
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(session.scheduledAt).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {session.focusAreas.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Focus Areas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {session.focusAreas.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {session.status === 'COMPLETED' && session.feedback.rating > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">Session Rating: {session.feedback.rating}/5</span>
                        </div>
                        {session.feedback.comments && (
                          <p className="text-sm text-gray-600">{session.feedback.comments}</p>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {session.status === 'SCHEDULED' && (
                        <Button size="sm" className="flex-1">
                          <Play className="w-3 h-3 mr-1" />
                          Start Session
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Skills Assessment */}
        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{assessment.skillName}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{assessment.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        Level {assessment.currentLevel}/10
                      </Badge>
                      <Badge variant="secondary">
                        Target: {assessment.targetLevel}/10
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Level</span>
                        <span>{assessment.currentLevel}/10</span>
                      </div>
                      <Progress value={(assessment.currentLevel / 10) * 100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target Level</span>
                        <span>{assessment.targetLevel}/10</span>
                      </div>
                      <Progress value={(assessment.targetLevel / 10) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Last Assessed:</span>
                        <p className="font-medium">{new Date(assessment.lastAssessed).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Assessment Method:</span>
                        <p className="font-medium">{assessment.assessmentMethod.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {assessment.evidence.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Evidence:</h4>
                        <div className="space-y-2">
                          {assessment.evidence.map((evidence, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">{evidence.description}</p>
                                <p className="text-xs text-gray-600">{evidence.type.replace('_', ' ')}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{evidence.value}</p>
                                <p className="text-xs text-gray-600">{new Date(evidence.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Update Level
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View Plan
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
