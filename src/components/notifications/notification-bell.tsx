'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Zap,
  Target,
  Users,
  DollarSign,
  Activity,
  Settings,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react'
import { SmartNotification, NotificationPriority } from '@/lib/smart-notifications'

interface NotificationBellProps {
  userId: string
  className?: string
}

export function NotificationBell({ userId, className = '' }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
    
    // Set up real-time updates (mock)
    const interval = setInterval(loadNotifications, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [userId])

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.notifications?.filter((n: SmartNotification) => !n.isRead).length || 0)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
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
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
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
        if (!notifications.find(n => n.id === notificationId)?.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'high': return <Info className="h-4 w-4 text-orange-600" />
      case 'medium': return <Info className="h-4 w-4 text-yellow-600" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return <Target className="h-4 w-4" />
      case 'marketing': return <Zap className="h-4 w-4" />
      case 'customer_success': return <Users className="h-4 w-4" />
      case 'finance': return <DollarSign className="h-4 w-4" />
      case 'operations': return <Activity className="h-4 w-4" />
      case 'system': return <Settings className="h-4 w-4" />
      case 'ai_insight': return <Zap className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
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

  const recentNotifications = notifications
    .filter(n => !n.isDismissed)
    .slice(0, 5)

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 text-orange-600" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadNotifications}
                >
                  <Clock className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
                Loading notifications...
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getPriorityIcon(notification.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {getCategoryIcon(notification.category)}
                            <span className="capitalize">
                              {notification.category.replace('_', ' ')}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(notification.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {!notification.isRead && (
                              <Button
                                onClick={() => markAsRead(notification.id)}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              onClick={() => dismissNotification(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {recentNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to full notifications page
                    window.location.href = '/notifications'
                  }}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
