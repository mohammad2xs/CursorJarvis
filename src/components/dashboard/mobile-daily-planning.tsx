'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Brain,
  Activity,
  Coffee,
  Sun,
  Moon,
  Star,
  Users,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'
import { DailyPlan, AgendaItem, PriorityItem, EnergyBlock, FocusArea, SuccessMetric } from '@/lib/daily-planning'

interface MobileDailyPlanningProps {
  userId: string
  date?: Date
}

export function MobileDailyPlanning({ userId, date = new Date() }: MobileDailyPlanningProps) {
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('agenda')
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  const loadDailyPlan = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/daily-planning/generate?userId=${userId}&date=${date.toISOString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to load daily plan')
      }
      
      const plan = await response.json()
      setDailyPlan(plan)
    } catch (err) {
      console.error('Error loading daily plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to load daily plan')
    } finally {
      setLoading(false)
    }
  }, [userId, date])

  useEffect(() => {
    loadDailyPlan()
  }, [loadDailyPlan])

  const handleCompleteItem = async (itemId: string, outcome: string) => {
    try {
      const response = await fetch('/api/daily-planning/complete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, outcome })
      })

      if (response.ok) {
        setCompletedItems(prev => new Set([...prev, itemId]))
      }
    } catch (err) {
      console.error('Error completing item:', err)
    }
  }

  const calculateProgress = () => {
    if (!dailyPlan) return 0
    const totalItems = dailyPlan.morningAgenda.length + dailyPlan.afternoonAgenda.length + dailyPlan.eveningAgenda.length
    const completed = completedItems.size
    return totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error loading daily plan</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadDailyPlan}
              className="mt-3"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dailyPlan) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">No daily plan available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = calculateProgress()

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Planning</h1>
          <p className="text-sm text-gray-600">
            {date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadDailyPlan}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today&apos;s Progress</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{completedItems.size} completed</span>
            <span>{dailyPlan.morningAgenda.length + dailyPlan.afternoonAgenda.length + dailyPlan.eveningAgenda.length} total</span>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'agenda', label: 'Agenda', icon: Calendar },
          { id: 'priorities', label: 'Priorities', icon: Target },
          { id: 'energy', label: 'Energy', icon: Zap },
          { id: 'focus', label: 'Focus', icon: Brain }
        ].map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content Sections */}
      {activeSection === 'agenda' && (
        <div className="space-y-4">
          {/* Morning */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                Morning Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyPlan.morningAgenda.map((item) => (
                <AgendaItemCard 
                  key={item.id} 
                  item={item} 
                  onComplete={handleCompleteItem}
                  isCompleted={completedItems.has(item.id)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Afternoon */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-orange-500" />
                Afternoon Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyPlan.afternoonAgenda.map((item) => (
                <AgendaItemCard 
                  key={item.id} 
                  item={item} 
                  onComplete={handleCompleteItem}
                  isCompleted={completedItems.has(item.id)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Evening */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Moon className="h-5 w-5 mr-2 text-blue-500" />
                Evening Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyPlan.eveningAgenda.map((item) => (
                <AgendaItemCard 
                  key={item.id} 
                  item={item} 
                  onComplete={handleCompleteItem}
                  isCompleted={completedItems.has(item.id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'priorities' && (
        <div className="space-y-4">
          {dailyPlan.priorities.map((priority) => (
            <Card key={priority.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{priority.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{priority.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {priority.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {priority.impact} Impact
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{priority.score}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === 'energy' && (
        <div className="space-y-4">
          {dailyPlan.energyOptimization.map((block) => (
            <Card key={block.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{block.timeSlot}</h3>
                  <Badge 
                    variant={block.energyLevel === 'HIGH' ? 'default' : block.energyLevel === 'MEDIUM' ? 'secondary' : 'outline'}
                  >
                    {block.energyLevel} Energy
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{block.context}</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-green-600">Recommended:</span>
                    <p className="text-xs text-gray-600">{block.recommendedActivities.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-red-600">Avoid:</span>
                    <p className="text-xs text-gray-600">{block.avoidActivities.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === 'focus' && (
        <div className="space-y-4">
          {dailyPlan.focusAreas.map((area) => (
            <Card key={area.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{area.name}</h3>
                  <Badge variant="outline">{area.timeAllocated}min</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium">Goals:</span>
                    <ul className="text-xs text-gray-600 mt-1">
                      {area.goals.map((goal, index) => (
                        <li key={index}>• {goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Agenda Item Card Component
function AgendaItemCard({ 
  item, 
  onComplete, 
  isCompleted 
}: { 
  item: AgendaItem
  onComplete: (id: string, outcome: string) => void
  isCompleted: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`border rounded-lg p-3 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm">{item.title}</h4>
            {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {item.estimatedDuration}min
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {item.priority}/5
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500">Expected Outcome:</span>
              <p className="text-xs text-gray-600">{item.expectedOutcome}</p>
            </div>
            {!isCompleted && (
              <Button
                size="sm"
                onClick={() => onComplete(item.id, 'Completed successfully')}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
