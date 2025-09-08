'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target, 
  Users, 
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Star,
  ArrowRight,
  Brain,
  Lightbulb
} from 'lucide-react'
import { RiskFactor } from '@/lib/predictive-analytics'

interface RiskMitigationProps {
  riskFactors: RiskFactor[]
  onMitigationAction?: (action: string, riskFactorId: string) => void
  className?: string
}

export function RiskMitigation({ 
  riskFactors, 
  onMitigationAction,
  className = '' 
}: RiskMitigationProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskFactor | null>(null)
  const [mitigationStrategies, setMitigationStrategies] = useState<string[]>([])

  useEffect(() => {
    if (selectedRisk) {
      generateMitigationStrategies(selectedRisk)
    }
  }, [selectedRisk])

  const generateMitigationStrategies = async (riskFactor: RiskFactor) => {
    try {
      const response = await fetch('/api/analytics/mitigation-strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          riskFactors: [riskFactor]
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMitigationStrategies(data.strategies || [])
      } else {
        // Fallback strategies
        setMitigationStrategies(getFallbackStrategies(riskFactor))
      }
    } catch (error) {
      console.error('Error generating mitigation strategies:', error)
      setMitigationStrategies(getFallbackStrategies(riskFactor))
    }
  }

  const getFallbackStrategies = (riskFactor: RiskFactor): string[] => {
    const strategies: string[] = []
    
    if (riskFactor.mitigationStrategy) {
      strategies.push(riskFactor.mitigationStrategy)
    }

    switch (riskFactor.category) {
      case 'engagement':
        strategies.push('Increase touchpoint frequency and quality')
        strategies.push('Conduct stakeholder engagement assessment')
        strategies.push('Schedule executive check-in meeting')
        break
      case 'competition':
        strategies.push('Develop competitive differentiation strategy')
        strategies.push('Schedule executive meetings to reinforce value')
        strategies.push('Prepare competitive battle cards')
        break
      case 'stakeholder':
        strategies.push('Conduct stakeholder mapping and alignment')
        strategies.push('Identify and engage new champions')
        strategies.push('Schedule relationship building activities')
        break
      case 'timing':
        strategies.push('Create urgency with limited-time offers')
        strategies.push('Implement pilot program to accelerate decision')
        strategies.push('Schedule executive meeting to address timeline')
        break
      case 'technical':
        strategies.push('Conduct technical deep-dive session')
        strategies.push('Provide proof of concept or pilot')
        strategies.push('Schedule technical validation meeting')
        break
      case 'financial':
        strategies.push('Prepare detailed ROI analysis')
        strategies.push('Create flexible payment options')
        strategies.push('Schedule CFO meeting to discuss budget')
        break
    }

    return strategies
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement': return <Users className="h-4 w-4" />
      case 'competition': return <Target className="h-4 w-4" />
      case 'stakeholder': return <Users className="h-4 w-4" />
      case 'timing': return <Clock className="h-4 w-4" />
      case 'technical': return <Zap className="h-4 w-4" />
      case 'financial': return <DollarSign className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getActionIcon = (strategy: string) => {
    if (strategy.toLowerCase().includes('meeting') || strategy.toLowerCase().includes('call')) {
      return <Phone className="h-4 w-4" />
    }
    if (strategy.toLowerCase().includes('email') || strategy.toLowerCase().includes('message')) {
      return <Mail className="h-4 w-4" />
    }
    if (strategy.toLowerCase().includes('schedule') || strategy.toLowerCase().includes('calendar')) {
      return <Calendar className="h-4 w-4" />
    }
    if (strategy.toLowerCase().includes('analysis') || strategy.toLowerCase().includes('report')) {
      return <Brain className="h-4 w-4" />
    }
    return <Lightbulb className="h-4 w-4" />
  }

  const handleMitigationAction = (strategy: string, riskFactorId: string) => {
    onMitigationAction?.(strategy, riskFactorId)
    // You could also track this action, send notifications, etc.
  }

  const criticalRisks = riskFactors.filter(r => r.impact === 'critical')
  const highRisks = riskFactors.filter(r => r.impact === 'high')
  const mediumRisks = riskFactors.filter(r => r.impact === 'medium')
  const lowRisks = riskFactors.filter(r => r.impact === 'low')

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalRisks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High</p>
                <p className="text-2xl font-bold text-orange-600">{highRisks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">{mediumRisks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low</p>
                <p className="text-2xl font-bold text-green-600">{lowRisks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors List */}
      <div className="space-y-4">
        {riskFactors.map((risk) => (
          <Card 
            key={risk.id} 
            className={`cursor-pointer transition-colors ${
              selectedRisk?.id === risk.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedRisk(risk)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getCategoryIcon(risk.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{risk.name}</h3>
                      <Badge variant="outline" className={getImpactColor(risk.impact)}>
                        {risk.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {risk.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Weight:</span>
                        <span className="text-sm font-medium">{Math.round(risk.weight * 100)}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Mitigatable:</span>
                        <span className="text-sm font-medium">
                          {risk.isMitigatable ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24">
                    <Progress value={risk.weight * 100} className="h-2" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mitigation Strategies */}
      {selectedRisk && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Mitigation Strategies for {selectedRisk.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Risk Description:</strong> {selectedRisk.description}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Impact:</strong> {selectedRisk.impact} • <strong>Weight:</strong> {Math.round(selectedRisk.weight * 100)}%
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Recommended Actions</h4>
                {mitigationStrategies.map((strategy, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(strategy)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{strategy}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMitigationAction(strategy, selectedRisk.id)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Execute
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedRisk.mitigationStrategy && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">AI-Generated Strategy</h4>
                  <p className="text-sm text-green-700">{selectedRisk.mitigationStrategy}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {mitigationStrategies.length} strategies available
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRisk(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
