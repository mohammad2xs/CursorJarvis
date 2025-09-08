'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  Webhook,
  RefreshCw,
  TestTube,
  AlertTriangle,
  Info,
  Link,
  Unlink,
  Eye,
  Edit,
  Copy,
  Download
} from 'lucide-react'
import { 
  ZapierApp, 
  ZapierZap, 
  ZapierExecution, 
  ZapierWebhook 
} from '@/lib/zapier-integration'

interface ZapierIntegrationProps {
  userId: string
  className?: string
}

export function ZapierIntegration({ userId, className = '' }: ZapierIntegrationProps) {
  const [apps, setApps] = useState<ZapierApp[]>([])
  const [zaps, setZaps] = useState<ZapierZap[]>([])
  const [executions, setExecutions] = useState<ZapierExecution[]>([])
  const [webhooks, setWebhooks] = useState<ZapierWebhook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('apps')
  const [selectedZap, setSelectedZap] = useState<ZapierZap | null>(null)
  const [isCreatingZap, setIsCreatingZap] = useState(false)

  useEffect(() => {
    loadZapierData()
  }, [userId])

  const loadZapierData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [appsResponse, zapsResponse, executionsResponse, webhooksResponse] = await Promise.all([
        fetch(`/api/zapier/apps?userId=${userId}`),
        fetch(`/api/zapier/zaps?userId=${userId}`),
        fetch(`/api/zapier/executions?userId=${userId}`),
        fetch(`/api/zapier/webhooks?userId=${userId}`)
      ])

      if (!appsResponse.ok || !zapsResponse.ok || !executionsResponse.ok || !webhooksResponse.ok) {
        throw new Error('Failed to load Zapier data')
      }

      const [appsData, zapsData, executionsData, webhooksData] = await Promise.all([
        appsResponse.json(),
        zapsResponse.json(),
        executionsResponse.json(),
        webhooksResponse.json()
      ])

      setApps(appsData.apps || [])
      setZaps(zapsData.zaps || [])
      setExecutions(executionsData.executions || [])
      setWebhooks(webhooksData.webhooks || [])

    } catch (err) {
      console.error('Error loading Zapier data:', err)
      setError('Failed to load Zapier data')
    } finally {
      setLoading(false)
    }
  }

  const connectApp = async (appId: string) => {
    try {
      const response = await fetch(`/api/zapier/apps/${appId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          credentials: {} // Mock credentials
        })
      })

      if (response.ok) {
        await loadZapierData()
      }
    } catch (err) {
      console.error('Error connecting app:', err)
    }
  }

  const disconnectApp = async (appId: string) => {
    try {
      const response = await fetch(`/api/zapier/apps/${appId}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        await loadZapierData()
      }
    } catch (err) {
      console.error('Error disconnecting app:', err)
    }
  }

  const toggleZap = async (zapId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/zapier/zaps/${zapId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          isActive
        })
      })

      if (response.ok) {
        await loadZapierData()
      }
    } catch (err) {
      console.error('Error toggling zap:', err)
    }
  }

  const testZap = async (zapId: string) => {
    try {
      const response = await fetch(`/api/zapier/zaps/${zapId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          testData: { test: true }
        })
      })

      if (response.ok) {
        await loadZapierData()
      }
    } catch (err) {
      console.error('Error testing zap:', err)
    }
  }

  const deleteZap = async (zapId: string) => {
    try {
      const response = await fetch(`/api/zapier/zaps/${zapId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        await loadZapierData()
      }
    } catch (err) {
      console.error('Error deleting zap:', err)
    }
  }

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200'
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'expired': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getZapStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'disabled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getExecutionStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case 'skipped': return <Clock className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading Zapier integration...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Zapier</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadZapierData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Zapier Integration</h2>
          <p className="text-gray-600">Automate your sales workflows with 5000+ apps</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadZapierData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreatingZap(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Zap
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Apps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apps.filter(app => app.isConnected).length}
                </p>
                <p className="text-sm text-gray-600">of {apps.length} available</p>
              </div>
              <Link className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Zaps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {zaps.filter(zap => zap.isActive).length}
                </p>
                <p className="text-sm text-gray-600">of {zaps.length} total</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {zaps.reduce((sum, zap) => sum + zap.runCount, 0)}
                </p>
                <p className="text-sm text-gray-600">this month</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {zaps.length > 0 ? Math.round(
                    zaps.reduce((sum, zap) => sum + zap.successCount, 0) / 
                    zaps.reduce((sum, zap) => sum + zap.runCount, 0) * 100
                  ) : 0}%
                </p>
                <p className="text-sm text-gray-600">average</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apps">Apps</TabsTrigger>
          <TabsTrigger value="zaps">Zaps</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* Apps Tab */}
        <TabsContent value="apps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                        <p className="text-sm text-gray-600">{app.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getConnectionStatusColor(app.connectionStatus)}>
                      {app.connectionStatus}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Triggers:</span>
                      <span className="font-medium">{app.triggers.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Actions:</span>
                      <span className="font-medium">{app.actions.length}</span>
                    </div>
                    {app.lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="font-medium">
                          {app.lastSync.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {app.isConnected ? (
                      <Button
                        onClick={() => disconnectApp(app.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        onClick={() => connectApp(app.id)}
                        size="sm"
                        className="flex-1"
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Zaps Tab */}
        <TabsContent value="zaps" className="space-y-4">
          <div className="space-y-4">
            {zaps.map((zap) => (
              <Card key={zap.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{zap.name}</h3>
                        <Badge variant="outline" className={getZapStatusColor(zap.status)}>
                          {zap.status}
                        </Badge>
                        {zap.isActive && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{zap.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Runs:</span>
                          <span className="ml-2 font-medium">{zap.runCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Success:</span>
                          <span className="ml-2 font-medium text-green-600">{zap.successCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Errors:</span>
                          <span className="ml-2 font-medium text-red-600">{zap.errorCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Run:</span>
                          <span className="ml-2 font-medium">
                            {zap.lastRun ? zap.lastRun.toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => toggleZap(zap.id, !zap.isActive)}
                        variant="outline"
                        size="sm"
                      >
                        {zap.isActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => testZap(zap.id)}
                        variant="outline"
                        size="sm"
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                      <Button
                        onClick={() => setSelectedZap(zap)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => {/* Edit zap */}}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteZap(zap.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions" className="space-y-4">
          <div className="space-y-4">
            {executions.slice(0, 20).map((execution) => (
              <Card key={execution.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getExecutionStatusIcon(execution.status)}
                      <div>
                        <p className="font-medium text-gray-900">
                          Zap Execution #{execution.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Started: {execution.startedAt.toLocaleString()}
                        </p>
                        {execution.completedAt && (
                          <p className="text-sm text-gray-600">
                            Duration: {execution.duration}ms
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        execution.status === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
                        execution.status === 'error' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }>
                        {execution.status}
                      </Badge>
                      {execution.errorMessage && (
                        <p className="text-sm text-red-600 mt-1">
                          {execution.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{webhook.name}</h3>
                        <Badge variant="outline" className={
                          webhook.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                        }>
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        URL: <code className="bg-gray-100 px-2 py-1 rounded">{webhook.url}</code>
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Events:</span>
                          <span className="ml-2 font-medium">{webhook.events.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Received:</span>
                          <span className="ml-2 font-medium">{webhook.receivedCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Received:</span>
                          <span className="ml-2 font-medium">
                            {webhook.lastReceived ? webhook.lastReceived.toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
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
