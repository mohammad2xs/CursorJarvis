'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, BellRing, CheckCircle, XCircle, AlertTriangle, Info, Zap, Settings, RefreshCw, Eye, MoreHorizontal, TrendingUp, BarChart3, Activity, MessageSquare, Phone, Smartphone, ExternalLink, ChevronRight, Flag, Target, DollarSign, Users, Mail as MailIcon, AlertCircle } from 'lucide-react'
import { 
  SmartNotification, 
  NotificationStats, 
  NotificationPreferences,
  NotificationCategory,
  NotificationPriority,
  NotificationChannel
} from '@/lib/smart-notifications'

interface SmartNotificationsProps {
  userId: string
  className?: string
}

export function SmartNotifications({ userId, className = '' }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedNotification, setSelectedNotification] = useState<SmartNotification | null>(null)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    loadNotificationsData()
  }, [userId])

  const loadNotificationsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [notificationsResponse, statsResponse, preferencesResponse] = await Promise.all([
        fetch(`/api/notifications?userId=${userId}`),
        fetch(`/api/notifications/stats?userId=${userId}`),
        fetch(`/api/notifications/preferences?userId=${userId}`)
      ])

      if (!notificationsResponse.ok || !statsResponse.ok || !preferencesResponse.ok) {
        throw new Error('Failed to load notifications data')
      }

      const [notificationsData, statsData, preferencesData] = await Promise.all([
        notificationsResponse.json(),
        statsResponse.json(),
        preferencesResponse.json()
      ])

      setNotifications(notificationsData.notifications || [])
      setStats(statsData.stats || null)
      setPreferences(preferencesData.preferences || null)

    } catch (err) {
      console.error('Error loading notifications data:', err)
      setError('Failed to load notifications data')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const dismissNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/dismiss`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isDismissed: true } : n)
        )
      }
    } catch (err) {
      console.error('Error dismissing notification:', err)
    }
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'high': return <Flag className="h-4 w-4 text-orange-600" />
      case 'medium': return <Info className="h-4 w-4 text-yellow-600" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'sales': return <Target className="h-4 w-4" />
      case 'marketing': return <TrendingUp className="h-4 w-4" />
      case 'customer_success': return <Users className="h-4 w-4" />
      case 'finance': return <DollarSign className="h-4 w-4" />
      case 'operations': return <Activity className="h-4 w-4" />
      case 'system': return <Settings className="h-4 w-4" />
      case 'ai_insight': return <Zap className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case 'in_app': return <Bell className="h-4 w-4" />
      case 'email': return <MailIcon className="h-4 w-4" />
      case 'sms': return <Smartphone className="h-4 w-4" />
      case 'push': return <Smartphone className="h-4 w-4" />
      case 'slack': return <MessageSquare className="h-4 w-4" />
      case 'teams': return <Users className="h-4 w-4" />
      case 'voice': return <Phone className="h-4 w-4" />
      case 'webhook': return <ExternalLink className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600'
      case 'sent': return 'text-blue-600'
      case 'pending': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      case 'bounced': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'unread') return !notification.isRead
    if (selectedTab === 'critical') return notification.priority === 'critical' || notification.priority === 'urgent'
    if (selectedTab === 'dismissed') return notification.isDismissed
    return notification.category === selectedTab
  })

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading notifications...</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Notifications</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadNotificationsData} variant="outline">
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
          <h2 className="text-2xl font-bold text-gray-900">Smart Notifications</h2>
          <p className="text-gray-600">AI-powered notifications for your sales workflow</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadNotificationsData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowPreferences(true)} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications}</p>
                  <p className="text-sm text-gray-600">{stats.todayCount} today</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unreadCount}</p>
                  <p className="text-sm text-gray-600">{stats.criticalCount} critical</p>
                </div>
                <BellRing className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(stats.deliveryRate)}%</p>
                  <p className="text-sm text-gray-600">avg response: {stats.avgResponseTime}m</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-sm text-gray-600">avg relevance</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="ai_insight">AI Insights</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
        </TabsList>

        {/* Notifications List */}
        <TabsContent value={selectedTab} className="space-y-4">
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                } ${
                  notification.isDismissed ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getPriorityIcon(notification.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                          <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(notification.category)}
                            <span className="ml-1 capitalize">{notification.category.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                        
                        {notification.description && (
                          <p className="text-sm text-gray-500 mb-3">{notification.description}</p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span>Source: {notification.source}</span>
                          <span>•</span>
                          <span>{notification.createdAt.toLocaleString()}</span>
                          {notification.metadata.aiConfidence > 0 && (
                            <>
                              <span>•</span>
                              <span>AI Confidence: {notification.metadata.aiConfidence}%</span>
                            </>
                          )}
                        </div>

                        {/* Delivery Status */}
                        {notification.deliveryStatus.length > 0 && (
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xs text-gray-500">Delivered via:</span>
                            {notification.deliveryStatus.map((status, index) => (
                              <div key={index} className="flex items-center space-x-1">
                                {getChannelIcon(status.channel)}
                                <span className={`text-xs ${getDeliveryStatusColor(status.status)}`}>
                                  {status.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        {notification.actions.length > 0 && (
                          <div className="flex items-center space-x-2">
                            {notification.actions.map((action) => (
                              <Button
                                key={action.id}
                                variant={action.type === 'primary' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  if (action.action === 'navigate' && action.url) {
                                    window.open(action.url, '_blank')
                                  }
                                }}
                              >
                                {action.label}
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => dismissNotification(notification.id)}
                        variant="outline"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setSelectedNotification(notification)}
                        variant="outline"
                        size="sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
                  <p className="text-gray-600">
                    {selectedTab === 'all' 
                      ? "You're all caught up! No notifications at the moment."
                      : `No ${selectedTab} notifications found.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <Card className="fixed inset-0 z-50 bg-white shadow-2xl max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getPriorityIcon(selectedNotification.priority)}
              <span>{selectedNotification.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">{selectedNotification.message}</p>
              
              {selectedNotification.description && (
                <p className="text-gray-600">{selectedNotification.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Priority:</span>
                  <span className="ml-2">{selectedNotification.priority}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Category:</span>
                  <span className="ml-2 capitalize">{selectedNotification.category.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Source:</span>
                  <span className="ml-2">{selectedNotification.source}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <span className="ml-2">{selectedNotification.createdAt.toLocaleString()}</span>
                </div>
              </div>

              {selectedNotification.metadata.aiConfidence > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Urgency:</span>
                      <span className="ml-2 font-medium">{selectedNotification.metadata.urgencyScore}%</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Relevance:</span>
                      <span className="ml-2 font-medium">{selectedNotification.metadata.relevanceScore}%</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Actionability:</span>
                      <span className="ml-2 font-medium">{selectedNotification.metadata.actionabilityScore}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button
                  onClick={() => setSelectedNotification(null)}
                  variant="outline"
                >
                  Close
                </Button>
                {!selectedNotification.isRead && (
                  <Button
                    onClick={() => {
                      markAsRead(selectedNotification.id)
                      setSelectedNotification(null)
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
