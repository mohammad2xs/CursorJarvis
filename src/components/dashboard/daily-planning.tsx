'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPriorityColor, getEnergyColor, getEnergyIcon, getTypeIcon } from '@/lib/utils'
import { Calendar, Clock, Target, Zap, CheckCircle, AlertCircle, RefreshCw, Activity, Sun, Moon, Star, Users } from 'lucide-react'
import { DailyPlan, AgendaItem, PriorityItem, EnergyBlock, FocusArea, SuccessMetric } from '@/lib/daily-planning'

interface DailyPlanningProps {
  userId: string
  date?: Date
}

export function DailyPlanning({ userId, date = new Date() }: DailyPlanningProps) {
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('agenda')
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  const loadDailyPlan = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/daily-planning/generate?userId=${userId}&date=${date.toISOString()}`)
      if (!response.ok) throw new Error('Failed to load daily plan')
      const plan = await response.json()
      setDailyPlan(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [userId, date])

  useEffect(() => {
    loadDailyPlan()
  }, [loadDailyPlan])

  const handleCompleteItem = async (itemId: string, outcome: string) => {
    try {
      const response = await fetch(`/api/daily-planning/complete-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: dailyPlan?.id, itemId, outcome })
      })
      
      if (response.ok) {
        setCompletedItems(prev => new Set(prev).add(itemId))
        // Update the item status in the plan
        if (dailyPlan) {
          const updatedPlan = { ...dailyPlan }
          // Update agenda items
          updatedPlan.morningAgenda = updatedPlan.morningAgenda.map(item => 
            item.id === itemId ? { ...item, status: 'COMPLETED' } : item
          )
          updatedPlan.afternoonAgenda = updatedPlan.afternoonAgenda.map(item => 
            item.id === itemId ? { ...item, status: 'COMPLETED' } : item
          )
          updatedPlan.eveningAgenda = updatedPlan.eveningAgenda.map(item => 
            item.id === itemId ? { ...item, status: 'COMPLETED' } : item
          )
          setDailyPlan(updatedPlan)
        }
      }
    } catch (error) {
      console.error('Error completing item:', error)
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating your daily plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadDailyPlan} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  if (!dailyPlan) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No daily plan available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Planning</h1>
          <p className="text-gray-600">
            {date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-2xl font-bold">{calculateProgress()}%</p>
          </div>
          <div className="w-16">
            <Progress value={calculateProgress()} className="h-2" />
          </div>
          <Button onClick={loadDailyPlan} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-xl font-bold">
                  {dailyPlan.morningAgenda.length + dailyPlan.afternoonAgenda.length + dailyPlan.eveningAgenda.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold">{completedItems.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Meetings</p>
                <p className="text-xl font-bold">
                  {dailyPlan.morningAgenda.filter(item => item.type === 'MEETING').length +
                   dailyPlan.afternoonAgenda.filter(item => item.type === 'MEETING').length +
                   dailyPlan.eveningAgenda.filter(item => item.type === 'MEETING').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">High Energy</p>
                <p className="text-xl font-bold">
                  {dailyPlan.morningAgenda.filter(item => item.energyLevel === 'HIGH').length +
                   dailyPlan.afternoonAgenda.filter(item => item.energyLevel === 'HIGH').length +
                   dailyPlan.eveningAgenda.filter(item => item.energyLevel === 'HIGH').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="priorities">Priorities</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="focus">Focus Areas</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Agenda Tab */}
        <TabsContent value="agenda" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Morning Agenda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                  Morning Agenda
                </CardTitle>
                <CardDescription>High energy activities and important meetings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dailyPlan.morningAgenda.map((item, index) => (
                  <AgendaItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    isCompleted={completedItems.has(item.id)}
                    onComplete={handleCompleteItem}
                  />
                ))}
                {dailyPlan.morningAgenda.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No morning items scheduled</p>
                )}
              </CardContent>
            </Card>

            {/* Afternoon Agenda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Afternoon Agenda
                </CardTitle>
                <CardDescription>Follow-ups, admin tasks, and relationship building</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dailyPlan.afternoonAgenda.map((item, index) => (
                  <AgendaItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    isCompleted={completedItems.has(item.id)}
                    onComplete={handleCompleteItem}
                  />
                ))}
                {dailyPlan.afternoonAgenda.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No afternoon items scheduled</p>
                )}
              </CardContent>
            </Card>

            {/* Evening Agenda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Moon className="w-5 h-5 mr-2 text-purple-500" />
                  Evening Agenda
                </CardTitle>
                <CardDescription>Planning, reflection, and preparation for tomorrow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dailyPlan.eveningAgenda.map((item, index) => (
                  <AgendaItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    isCompleted={completedItems.has(item.id)}
                    onComplete={handleCompleteItem}
                  />
                ))}
                {dailyPlan.eveningAgenda.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No evening items scheduled</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Priorities Tab */}
        <TabsContent value="priorities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Today&apos;s Priorities
              </CardTitle>
              <CardDescription>Ranked by impact, urgency, and effort</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyPlan.priorities.map((priority, index) => (
                <PriorityCard key={priority.id} priority={priority} index={index} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Energy Tab */}
        <TabsContent value="energy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyPlan.energyOptimization.map((block) => (
              <EnergyBlockCard key={block.id} block={block} />
            ))}
          </div>
        </TabsContent>

        {/* Focus Areas Tab */}
        <TabsContent value="focus" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyPlan.focusAreas.map((area) => (
              <FocusAreaCard key={area.id} area={area} />
            ))}
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyPlan.successMetrics.map((metric) => (
              <SuccessMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Sub-components
function AgendaItemCard({ 
  item, 
  index, 
  isCompleted, 
  onComplete 
}: { 
  item: AgendaItem
  index: number
  isCompleted: boolean
  onComplete: (itemId: string, outcome: string) => void
}) {
  const [showCompleteForm, setShowCompleteForm] = useState(false)
  const [outcome, setOutcome] = useState('')

  const handleComplete = () => {
    if (outcome.trim()) {
      onComplete(item.id, outcome)
      setShowCompleteForm(false)
      setOutcome('')
    }
  }

  return (
    <div className={`p-3 border rounded-lg ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={getPriorityColor(item.priority)}>
              #{index + 1}
            </Badge>
            <Badge variant="outline" className={getEnergyColor(item.energyLevel)}>
              {getEnergyIcon(item.energyLevel)}
              <span className="ml-1">{item.energyLevel}</span>
            </Badge>
            <Badge variant="outline">
              {getTypeIcon(item.type)}
              <span className="ml-1">{item.type}</span>
            </Badge>
          </div>
          <h4 className="font-medium">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {item.estimatedDuration}min
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {item.timeSlot}
            </span>
          </div>
          {item.context && (
            <p className="text-xs text-gray-500 mt-1">
              <strong>Context:</strong> {item.context}
            </p>
          )}
        </div>
        <div className="ml-4">
          {isCompleted ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => setShowCompleteForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Button>
          )}
        </div>
      </div>
      
      {showCompleteForm && (
        <div className="mt-3 p-3 bg-gray-50 rounded border">
          <label className="block text-sm font-medium mb-2">Outcome:</label>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Describe what was accomplished..."
            className="w-full p-2 border rounded text-sm"
            rows={2}
          />
          <div className="flex space-x-2 mt-2">
            <Button size="sm" onClick={handleComplete}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowCompleteForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function PriorityCard({ priority, index }: { priority: PriorityItem; index: number }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className="bg-blue-100 text-blue-800">
              #{index + 1}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(priority.impact === 'HIGH' ? 5 : priority.impact === 'MEDIUM' ? 3 : 1)}>
              {priority.impact} Impact
            </Badge>
            <Badge variant="outline" className={getPriorityColor(priority.urgency === 'HIGH' ? 5 : priority.urgency === 'MEDIUM' ? 3 : 1)}>
              {priority.urgency} Urgency
            </Badge>
          </div>
          <h4 className="font-medium">{priority.title}</h4>
          <p className="text-sm text-gray-600">{priority.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span>Category: {priority.category}</span>
            <span>Effort: {priority.effort}</span>
            <span>Score: {priority.score}/100</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <strong>Reasoning:</strong> {priority.reasoning}
          </p>
        </div>
        <div className="ml-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{priority.score}</p>
            <p className="text-xs text-gray-500">Score</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EnergyBlockCard({ block }: { block: EnergyBlock }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {getEnergyIcon(block.energyLevel)}
          <span className="ml-2">{block.timeSlot}</span>
        </CardTitle>
        <CardDescription>{block.context}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-1">Recommended Activities:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {block.recommendedActivities.map((activity, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-1">Avoid:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {block.avoidActivities.map((activity, index) => (
                <li key={index} className="flex items-center">
                  <AlertCircle className="w-3 h-3 mr-2 text-red-500" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Break: {block.breakDuration} min</span>
            <Badge className={getEnergyColor(block.energyLevel)}>
              {block.energyLevel} Energy
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FocusAreaCard({ area }: { area: FocusArea }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2" />
          {area.name}
        </CardTitle>
        <CardDescription>{area.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time Allocated</span>
            <span className="font-medium">{area.timeAllocated} min</span>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Goals:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {area.goals.map((goal, index) => (
                <li key={index} className="flex items-center">
                  <Star className="w-3 h-3 mr-2 text-yellow-500" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Metrics:</h4>
            <div className="flex flex-wrap gap-1">
              {area.metrics.map((metric, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {metric}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SuccessMetricCard({ metric }: { metric: SuccessMetric }) {
  const progress = metric.target > 0 ? (metric.current / metric.target) * 100 : 0
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{metric.name}</h4>
          <Badge variant="outline">
            {metric.category}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{metric.current} / {metric.target} {metric.unit}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{Math.round(progress)}% complete</span>
            <span>{metric.isDaily ? 'Daily' : 'Weekly'} target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
