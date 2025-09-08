'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Play, 
  Pause, 
  Save, 
  Trash2, 
  Settings, 
  ArrowRight,
  Zap,
  Webhook,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Edit,
  Copy,
  Download
} from 'lucide-react'
import { ZapierWorkflow, ZapierApp, ZapierTrigger, ZapierAction } from '@/lib/zapier-integration'

interface ZapierWorkflowBuilderProps {
  userId: string
  onSave?: (workflow: ZapierWorkflow) => void
  onCancel?: () => void
  className?: string
}

export function ZapierWorkflowBuilder({ 
  userId, 
  onSave, 
  onCancel,
  className = '' 
}: ZapierWorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<Partial<ZapierWorkflow>>({
    name: '',
    description: '',
    steps: [],
    isActive: false,
    isEnabled: false
  })
  const [apps, setApps] = useState<ZapierApp[]>([])
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadApps()
  }, [userId])

  const loadApps = async () => {
    try {
      const response = await fetch(`/api/zapier/apps?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setApps(data.apps || [])
      }
    } catch (err) {
      console.error('Error loading apps:', err)
    }
  }

  const addStep = (type: 'trigger' | 'action' | 'filter' | 'delay' | 'conditional') => {
    const newStep = {
      id: `step-${Date.now()}`,
      type,
      name: `New ${type}`,
      config: {},
      position: { x: 0, y: 0 }
    }

    setWorkflow(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }))
  }

  const updateStep = (stepId: string, updates: Partial<ZapierWorkflow['steps'][0]>) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      ) || []
    }))
  }

  const removeStep = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.filter(step => step.id !== stepId) || []
    }))
  }

  const saveWorkflow = async () => {
    try {
      setIsSaving(true)
      setError(null)

      if (!workflow.name || !workflow.description) {
        setError('Name and description are required')
        return
      }

      if (!workflow.steps || workflow.steps.length === 0) {
        setError('At least one step is required')
        return
      }

      const response = await fetch('/api/zapier/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          workflow: {
            ...workflow,
            createdAt: new Date(),
            updatedAt: new Date(),
            runCount: 0,
            successCount: 0,
            errorCount: 0
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        onSave?.(data.workflow)
      } else {
        setError('Failed to save workflow')
      }

    } catch (err) {
      console.error('Error saving workflow:', err)
      setError('Failed to save workflow')
    } finally {
      setIsSaving(false)
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Webhook className="h-4 w-4" />
      case 'action': return <Zap className="h-4 w-4" />
      case 'filter': return <Filter className="h-4 w-4" />
      case 'delay': return <Clock className="h-4 w-4" />
      case 'conditional': return <CheckCircle className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'action': return 'bg-green-100 text-green-800 border-green-200'
      case 'filter': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'delay': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'conditional': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Builder</h2>
          <p className="text-gray-600">Create automated workflows with visual drag-and-drop</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={saveWorkflow} disabled={isSaving}>
            {isSaving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Workflow
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Details */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflow.name || ''}
                onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setWorkflow(prev => ({ ...prev, isActive: !prev.isActive }))}
                  variant={workflow.isActive ? "default" : "outline"}
                  size="sm"
                >
                  {workflow.isActive ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Active
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Inactive
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={workflow.description || ''}
              onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe what this workflow does"
            />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflow.steps?.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className={getStepColor(step.type)}>
                      {getStepIcon(step.type)}
                      <span className="ml-1 capitalize">{step.type}</span>
                    </Badge>
                    <span className="font-medium">{step.name}</span>
                  </div>
                  
                  {step.app && (
                    <div className="text-sm text-gray-600">
                      App: {step.app}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setSelectedStep(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => removeStep(step.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {workflow.steps?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No steps added yet. Start building your workflow!</p>
              </div>
            )}
          </div>

          {/* Add Step Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => addStep('trigger')}
                variant="outline"
                size="sm"
              >
                <Webhook className="h-4 w-4 mr-2" />
                Add Trigger
              </Button>
              <Button
                onClick={() => addStep('action')}
                variant="outline"
                size="sm"
              >
                <Zap className="h-4 w-4 mr-2" />
                Add Action
              </Button>
              <Button
                onClick={() => addStep('filter')}
                variant="outline"
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
              <Button
                onClick={() => addStep('delay')}
                variant="outline"
                size="sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Add Delay
              </Button>
              <Button
                onClick={() => addStep('conditional')}
                variant="outline"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Configuration Modal */}
      {selectedStep !== null && (
        <Card className="fixed inset-0 z-50 bg-white shadow-2xl">
          <CardHeader>
            <CardTitle>Configure Step</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step Name
                </label>
                <input
                  type="text"
                  value={workflow.steps?.[selectedStep]?.name || ''}
                  onChange={(e) => updateStep(workflow.steps?.[selectedStep]?.id || '', { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App
                </label>
                <select
                  value={workflow.steps?.[selectedStep]?.app || ''}
                  onChange={(e) => updateStep(workflow.steps?.[selectedStep]?.id || '', { app: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an app</option>
                  {apps.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button
                  onClick={() => setSelectedStep(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setSelectedStep(null)}
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
