'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Zap
} from 'lucide-react'
import { Opportunity, OpportunityWithRelations } from '@/types'
import { formatDate, formatCurrency, getStageColor, getDealTypeColor, calculateDaysSince } from '@/lib/utils'

interface DealOSProps {
  opportunities: OpportunityWithRelations[]
  onUpdateOpportunity: (oppId: string, updates: Partial<Opportunity>) => void
  onGeneratePlaybook: (oppId: string, dealType: string) => void
}

export function DealOS({ opportunities, onUpdateOpportunity, onGeneratePlaybook }: DealOSProps) {
  const [riskRadar, setRiskRadar] = useState<any[]>([])
  const [mutualActionPlans, setMutualActionPlans] = useState<Map<string, any>>(new Map())
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityWithRelations | null>(null)

  useEffect(() => {
    // Calculate risk factors for opportunities
    const risks = opportunities.map(opp => {
      const daysSinceUpdate = calculateDaysSince(opp.updatedAt)
      const daysToClose = opp.closeDate ? Math.ceil((new Date(opp.closeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
      
      const riskFactors = []
      let riskScore = 0

      if (daysSinceUpdate > 7) {
        riskFactors.push('No activity for 7+ days')
        riskScore += 3
      }
      if (opp.stage === 'DISCOVER' && daysSinceUpdate > 14) {
        riskFactors.push('Discovery stage stalled')
        riskScore += 2
      }
      if (opp.stage === 'EVALUATE' && daysSinceUpdate > 21) {
        riskFactors.push('Evaluation taking too long')
        riskScore += 2
      }
      if (daysToClose < 30 && opp.stage !== 'CLOSE_WON' && opp.stage !== 'CLOSE_LOST') {
        riskFactors.push('Close date approaching')
        riskScore += 2
      }
      if (opp.probability && opp.probability < 20) {
        riskFactors.push('Low probability')
        riskScore += 1
      }

      return {
        opportunity: opp,
        riskScore,
        riskFactors,
        daysSinceUpdate,
        daysToClose
      }
    }).filter(risk => risk.riskScore > 0).sort((a, b) => b.riskScore - a.riskScore)

    setRiskRadar(risks)
  }, [opportunities])

  const getRiskColor = (score: number) => {
    if (score >= 5) return 'text-red-600 bg-red-50'
    if (score >= 3) return 'text-orange-600 bg-orange-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  const getDealTypePlaybook = (dealType: string) => {
    const playbooks = {
      'NEW_LOGO': {
        title: 'New Logo Acquisition',
        stages: [
          { stage: 'DISCOVER', actions: ['Initial outreach', 'Discovery call', 'Needs assessment'] },
          { stage: 'EVALUATE', actions: ['Demo presentation', 'Technical evaluation', 'Stakeholder alignment'] },
          { stage: 'PROPOSE', actions: ['Proposal delivery', 'Pricing discussion', 'Contract negotiation'] },
          { stage: 'NEGOTIATE', actions: ['Legal review', 'Terms finalization', 'Approval process'] },
          { stage: 'CLOSE_WON', actions: ['Contract signing', 'Implementation kickoff', 'Success planning'] }
        ]
      },
      'RENEWAL': {
        title: 'Renewal Process',
        stages: [
          { stage: 'DISCOVER', actions: ['Usage analysis', 'Success review', 'Expansion opportunities'] },
          { stage: 'EVALUATE', actions: ['Renewal proposal', 'Value demonstration', 'Competitive analysis'] },
          { stage: 'PROPOSE', actions: ['Pricing discussion', 'Terms negotiation', 'Approval process'] },
          { stage: 'NEGOTIATE', actions: ['Contract renewal', 'Implementation planning', 'Success metrics'] },
          { stage: 'CLOSE_WON', actions: ['Renewal signed', 'Implementation', 'Ongoing success'] }
        ]
      },
      'UPSELL': {
        title: 'Upsell/Expansion',
        stages: [
          { stage: 'DISCOVER', actions: ['Usage analysis', 'Growth opportunities', 'Stakeholder mapping'] },
          { stage: 'EVALUATE', actions: ['Expansion demo', 'ROI analysis', 'Technical evaluation'] },
          { stage: 'PROPOSE', actions: ['Expansion proposal', 'Pricing discussion', 'Implementation plan'] },
          { stage: 'NEGOTIATE', actions: ['Terms negotiation', 'Approval process', 'Success planning'] },
          { stage: 'CLOSE_WON', actions: ['Expansion signed', 'Implementation', 'Success tracking'] }
        ]
      },
      'STRATEGIC': {
        title: 'Strategic Partnership',
        stages: [
          { stage: 'DISCOVER', actions: ['Strategic alignment', 'Partnership exploration', 'Value mapping'] },
          { stage: 'EVALUATE', actions: ['Partnership demo', 'Mutual value assessment', 'Stakeholder alignment'] },
          { stage: 'PROPOSE', actions: ['Partnership proposal', 'Terms discussion', 'Success metrics'] },
          { stage: 'NEGOTIATE', actions: ['Partnership agreement', 'Implementation planning', 'Success framework'] },
          { stage: 'CLOSE_WON', actions: ['Partnership signed', 'Implementation', 'Ongoing collaboration'] }
        ]
      }
    }
    return playbooks[dealType as keyof typeof playbooks] || playbooks['NEW_LOGO']
  }

  const generateMutualActionPlan = (opp: OpportunityWithRelations) => {
    const playbook = getDealTypePlaybook(opp.dealType)
    const currentStage = playbook.stages.find(s => s.stage === opp.stage)
    
    return {
      opportunity: opp,
      playbook,
      currentStage,
      nextActions: currentStage?.actions || [],
      timeline: opp.closeDate ? Math.ceil((new Date(opp.closeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 90,
      successMetrics: [
        'Stakeholder alignment achieved',
        'Technical requirements confirmed',
        'Budget approved',
        'Implementation timeline agreed'
      ]
    }
  }

  const handleGeneratePlaybook = (opp: OpportunityWithRelations) => {
    const map = mutualActionPlans
    map.set(opp.id, generateMutualActionPlan(opp))
    setMutualActionPlans(new Map(map))
    setSelectedOpportunity(opp)
  }

  const getStageProgress = (opp: OpportunityWithRelations) => {
    const stages = ['DISCOVER', 'EVALUATE', 'PROPOSE', 'NEGOTIATE', 'CLOSE_WON']
    const currentIndex = stages.indexOf(opp.stage)
    return ((currentIndex + 1) / stages.length) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deal OS</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-600">
            <Target className="w-3 h-3 mr-1" />
            {opportunities.length} Opportunities
          </Badge>
          <Badge variant="outline" className="text-red-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {riskRadar.length} At Risk
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="risk-radar">Risk Radar</TabsTrigger>
          <TabsTrigger value="playbooks">Deal Playbooks</TabsTrigger>
          <TabsTrigger value="action-plans">Mutual Action Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Sales Pipeline
              </CardTitle>
              <CardDescription>
                All opportunities by stage and value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getDealTypeColor(opp.dealType)}>
                        {opp.dealType}
                      </Badge>
                      <Badge className={getStageColor(opp.stage)}>
                        {opp.stage}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{opp.name}</h3>
                        <p className="text-sm text-gray-600">{opp.company.name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {opp.value ? formatCurrency(opp.value) : 'TBD'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {opp.closeDate ? formatDate(opp.closeDate) : 'TBD'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {opp.probability || 0}% probability
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress value={getStageProgress(opp)} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleGeneratePlaybook(opp)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Playbook
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOpportunity(opp)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      MAP
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Risk Radar
              </CardTitle>
              <CardDescription>
                Opportunities requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskRadar.map((risk, index) => (
                <div key={risk.opportunity.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getRiskColor(risk.riskScore)}>
                        Risk #{index + 1}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{risk.opportunity.name}</h3>
                        <p className="text-sm text-gray-600">{risk.opportunity.company.name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {risk.daysSinceUpdate} days since update
                          </span>
                          <span className="text-sm text-gray-500">
                            {risk.daysToClose} days to close
                          </span>
                        </div>
                        <div className="mt-2">
                          {risk.riskFactors.map((factor: string, i: number) => (
                            <Badge key={i} variant="outline" className="mr-2 text-red-600 border-red-300">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Take Action
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOpportunity(risk.opportunity)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {riskRadar.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No opportunities at risk</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playbooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Deal Type Playbooks
              </CardTitle>
              <CardDescription>
                Standardized processes for each deal type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['NEW_LOGO', 'RENEWAL', 'UPSELL', 'STRATEGIC'].map((dealType) => {
                const playbook = getDealTypePlaybook(dealType)
                return (
                  <div key={dealType} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3">{playbook.title}</h3>
                    <div className="space-y-2">
                      {playbook.stages.map((stage, index) => (
                        <div key={stage.stage} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{stage.stage}</h4>
                            <ul className="text-sm text-gray-600 mt-1">
                              {stage.actions.map((action, i) => (
                                <li key={i} className="flex items-center">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Mutual Action Plans
              </CardTitle>
              <CardDescription>
                Collaborative plans with customers for deal success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOpportunity && mutualActionPlans.has(selectedOpportunity.id) ? (
                (() => {
                  const map = mutualActionPlans.get(selectedOpportunity.id)!
                  return (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">
                          {map.opportunity.name}
                        </h3>
                        <p className="text-sm text-blue-700">
                          {map.opportunity.company.name} • {map.opportunity.dealType}
                        </p>
                        <p className="text-sm text-blue-600">
                          {map.timeline} days to close
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Stage: {map.currentStage?.stage}</h4>
                          <ul className="space-y-1">
                            {map.currentStage?.actions.map((action: string, i: number) => (
                              <li key={i} className="flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Success Metrics</h4>
                          <ul className="space-y-1">
                            {map.successMetrics.map((metric: string, i: number) => (
                              <li key={i} className="flex items-center text-sm">
                                <Target className="w-4 h-4 mr-2 text-blue-500" />
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select an opportunity to generate a Mutual Action Plan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
