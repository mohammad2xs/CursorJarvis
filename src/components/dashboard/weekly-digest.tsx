'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  BarChart3,
  Zap,
  Users,
  Calendar,
  DollarSign,
  Brain
} from 'lucide-react'
import { WeeklyDigest } from '@/types'

interface WeeklyDigestProps {
  digest: WeeklyDigest
  onPromoteRule: (playType: string, segment: string) => void
  onRetireRule: (playType: string, segment: string) => void
}

export function WeeklyDigestComponent({ digest, onPromoteRule, onRetireRule }: WeeklyDigestProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateDigest = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/digest/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const newDigest = await response.json()
        // In a real app, update the digest state
        console.log('Generated new digest:', newDigest)
      }
    } catch (error) {
      console.error('Error generating digest:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weekly Jarvis Digest</h1>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleGenerateDigest}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate New'}
          </Button>
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="rules">Rule Changes</TabsTrigger>
          <TabsTrigger value="perplexity">Perplexity Wins</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Top Plays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{digest.topPlays.length}</div>
                <p className="text-xs text-gray-500">Active play types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Stalls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{digest.stalls.length}</div>
                <p className="text-xs text-gray-500">Opportunities at risk</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pillars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{digest.pillarPerformance.length}</div>
                <p className="text-xs text-gray-500">Sub-industries tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Perplexity Wins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{digest.perplexityWins.length}</div>
                <p className="text-xs text-gray-500">AI-driven successes</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                This Week's Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digest.nextWeekFocus.map((focus, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{focus.subIndustry}</h3>
                      <Badge variant="outline">Priority</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{focus.priority}</p>
                    <ul className="space-y-1">
                      {focus.actions.map((action, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <Target className="w-3 h-3 mr-2 text-blue-500" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Top Performing Plays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digest.topPlays.map((play, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-600">
                        #{index + 1}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{play.playType}</h3>
                        <p className="text-sm text-gray-600">
                          {play.count} executions • {play.successRate}% success rate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {play.successRate}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Pipeline Stalls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digest.stalls.map((stall, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-orange-600">
                        {stall.count}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{stall.type}</h3>
                        <p className="text-sm text-gray-600">{stall.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Zap className="w-4 h-4 mr-1" />
                      Take Action
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Pillar Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digest.pillarPerformance.map((pillar, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{pillar.subIndustry}</h3>
                      <Badge variant="outline">
                        {pillar.revenue ? `$${pillar.revenue.toLocaleString()}` : 'TBD'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        {pillar.meetings} meetings
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-2 text-green-500" />
                        {pillar.opportunities} opportunities
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-purple-500" />
                        {pillar.revenue ? `$${pillar.revenue.toLocaleString()}` : 'TBD'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                Rules to Promote
              </CardTitle>
              <CardDescription>
                High-performing plays ready for Golden Play status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digest.ruleChanges.promote.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-600">
                        Promote
                      </Badge>
                      <div>
                        <h3 className="font-medium">{rule.playType}</h3>
                        <p className="text-sm text-gray-600">{rule.segment}</p>
                        <p className="text-sm text-green-700">{rule.reason}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onPromoteRule(rule.playType, rule.segment)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Promote
                    </Button>
                  </div>
                ))}
                {digest.ruleChanges.promote.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No rules ready for promotion</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Rules to Retire
              </CardTitle>
              <CardDescription>
                Underperforming plays to be retired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digest.ruleChanges.retire.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-red-600">
                        Retire
                      </Badge>
                      <div>
                        <h3 className="font-medium">{rule.playType}</h3>
                        <p className="text-sm text-gray-600">{rule.segment}</p>
                        <p className="text-sm text-red-700">{rule.reason}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onRetireRule(rule.playType, rule.segment)}
                      variant="destructive"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Retire
                    </Button>
                  </div>
                ))}
                {digest.ruleChanges.retire.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No rules need retirement</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perplexity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-600">
                <Brain className="w-5 h-5 mr-2" />
                Perplexity Wins
              </CardTitle>
              <CardDescription>
                AI-driven insights that led to successful actions and meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digest.perplexityWins.map((win, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-purple-50">
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-purple-600">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Win
                      </Badge>
                      <div className="flex-1">
                        <h3 className="font-medium">{win.signal}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Action:</strong> {win.action}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Outcome:</strong> {win.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {digest.perplexityWins.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No Perplexity wins this week</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
