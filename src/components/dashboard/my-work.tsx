'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Users, Calendar, Target } from 'lucide-react'
import { NBA, NBAStatus } from '@/types'
import { formatDateTime, getRelativeTime, getPriorityColor } from '@/lib/utils'

interface MyWorkProps {
  nbas: NBA[]
  onUpdateNBA: (nbaId: string, status: NBAStatus, outcome?: string) => void
}

export function MyWork({ nbas, onUpdateNBA }: MyWorkProps) {
  const [topNBAs, setTopNBAs] = useState<NBA[]>([])
  const [dueTasks, setDueTasks] = useState<any[]>([])
  const [overdueTasks, setOverdueTasks] = useState<any[]>([])
  const [spotlightAccounts, setSpotlightAccounts] = useState<any[]>([])

  useEffect(() => {
    // Get top 5 NBAs by priority
    setTopNBAs(nbas.slice(0, 5))
    
    // Mock data for tasks and accounts - in real app, fetch from API
    setDueTasks([
      { id: '1', title: 'Follow up with Acme Corp', dueDate: new Date(), type: 'CALL' },
      { id: '2', title: 'Prepare proposal for TechCorp', dueDate: new Date(), type: 'PROPOSAL' },
    ])
    
    setOverdueTasks([
      { id: '3', title: 'Send contract to Global Inc', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'EMAIL' },
    ])
    
    setSpotlightAccounts([
      { 
        id: '1', 
        name: 'Acme Corporation', 
        subIndustry: 'Tech/SaaS', 
        momentum: 'high',
        recentSignals: 3,
        lastActivity: new Date()
      },
      { 
        id: '2', 
        name: 'Global Industries', 
        subIndustry: 'Oil & Gas/Energy', 
        momentum: 'medium',
        recentSignals: 1,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ])
  }, [nbas])

  const handleNBAUpdate = (nbaId: string, status: NBAStatus) => {
    onUpdateNBA(nbaId, status)
    setTopNBAs(prev => prev.filter(nba => nba.id !== nbaId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Work</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            {nbas.filter(nba => nba.status === 'COMPLETED').length} Completed
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            <Clock className="w-3 h-3 mr-1" />
            {nbas.filter(nba => nba.status === 'PENDING').length} Pending
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="nbas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nbas">Top NBAs</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="accounts">Spotlight Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="nbas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Top 5 Next Best Actions
              </CardTitle>
              <CardDescription>
                AI-suggested actions ranked by priority and potential impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topNBAs.map((nba, index) => (
                <div key={nba.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getPriorityColor(nba.priority)}>
                        #{index + 1}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{nba.title}</h3>
                        <p className="text-sm text-gray-600">{nba.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Why:</strong> {nba.rationale}
                        </p>
                        <p className="text-xs text-gray-500">
                          <strong>Source:</strong> {nba.source}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleNBAUpdate(nba.id, 'APPROVED')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNBAUpdate(nba.id, 'SNOOZED')}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Snooze
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNBAUpdate(nba.id, 'DECLINED')}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
              {topNBAs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending NBAs. Great work!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Clock className="w-5 h-5 mr-2" />
                  Due Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dueTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.type}</p>
                    </div>
                    <Button size="sm">Complete</Button>
                  </div>
                ))}
                {dueTasks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No tasks due today</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {overdueTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded bg-red-50">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {task.type} • {getRelativeTime(task.dueDate)} overdue
                      </p>
                    </div>
                    <Button size="sm" variant="destructive">Complete</Button>
                  </div>
                ))}
                {overdueTasks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No overdue tasks</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Spotlight Accounts
              </CardTitle>
              <CardDescription>
                Accounts with high momentum and fresh signals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {spotlightAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {account.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{account.name}</h3>
                        <p className="text-sm text-gray-600">{account.subIndustry}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant={account.momentum === 'high' ? 'default' : 'secondary'}>
                            {account.momentum} momentum
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {account.recentSignals} signals • {getRelativeTime(account.lastActivity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
