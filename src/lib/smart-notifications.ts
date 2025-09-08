import { BaseService } from './base-service'

export interface SmartNotification {
  id: string
  userId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  description?: string
  category: NotificationCategory
  source: NotificationSource
  data: Record<string, unknown>
  isRead: boolean
  isDismissed: boolean
  createdAt: Date
  expiresAt?: Date
  actions: NotificationAction[]
  channels: NotificationChannel[]
  deliveryStatus: DeliveryStatus[]
  metadata: NotificationMetadata
}

export type NotificationType = 
  | 'deal_closure_risk'
  | 'deal_closure_opportunity'
  | 'churn_risk_alert'
  | 'nba_priority'
  | 'meeting_reminder'
  | 'meeting_insight'
  | 'email_response_needed'
  | 'follow_up_required'
  | 'competitor_mention'
  | 'budget_approval'
  | 'contract_renewal'
  | 'pipeline_health'
  | 'performance_insight'
  | 'system_alert'
  | 'integration_update'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical' | 'urgent'

export type NotificationCategory = 
  | 'sales'
  | 'marketing'
  | 'customer_success'
  | 'finance'
  | 'operations'
  | 'system'
  | 'ai_insight'

export type NotificationSource = 
  | 'ai_engine'
  | 'predictive_analytics'
  | 'email_monitor'
  | 'calendar_sync'
  | 'crm_update'
  | 'external_api'
  | 'user_action'
  | 'system_event'

export interface NotificationAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
  action: string
  url?: string
  data?: Record<string, unknown>
  isEnabled: boolean
}

export type NotificationChannel = 
  | 'in_app'
  | 'email'
  | 'sms'
  | 'push'
  | 'slack'
  | 'teams'
  | 'voice'
  | 'webhook'

export interface DeliveryStatus {
  channel: NotificationChannel
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  timestamp: Date
  error?: string
  retryCount: number
  nextRetry?: Date
}

export interface NotificationMetadata {
  urgencyScore: number // 0-100
  relevanceScore: number // 0-100
  actionabilityScore: number // 0-100
  timeSensitivity: 'low' | 'medium' | 'high' | 'critical'
  businessImpact: 'low' | 'medium' | 'high' | 'critical'
  aiConfidence: number // 0-100
  contextTags: string[]
  relatedEntities: Array<{
    type: 'deal' | 'contact' | 'account' | 'opportunity' | 'meeting'
    id: string
    name: string
  }>
}

export interface NotificationRule {
  id: string
  name: string
  description: string
  isActive: boolean
  conditions: NotificationCondition[]
  actions: NotificationRuleAction[]
  priority: NotificationPriority
  channels: NotificationChannel[]
  cooldownMinutes: number
  maxPerDay: number
  userId?: string
  createdAt: Date
  updatedAt: Date
}

export interface NotificationCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: string | number | boolean | string[]
  logic?: 'AND' | 'OR'
}

export interface NotificationRuleAction {
  type: 'create_notification' | 'send_email' | 'send_sms' | 'send_slack' | 'webhook'
  config: Record<string, unknown>
}

export interface NotificationPreferences {
  userId: string
  channels: Partial<Record<NotificationChannel, boolean>>
  categories: Partial<Record<NotificationCategory, boolean>>
  types: Partial<Record<NotificationType, boolean>>
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
    timezone: string
  }
  frequency: {
    maxPerHour: number
    maxPerDay: number
    batchSimilar: boolean
  }
  aiFiltering: {
    enabled: boolean
    minRelevanceScore: number
    minUrgencyScore: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface NotificationStats {
  totalNotifications: number
  unreadCount: number
  criticalCount: number
  todayCount: number
  byCategory: Record<NotificationCategory, number>
  byPriority: Record<NotificationPriority, number>
  byChannel: Record<NotificationChannel, number>
  deliveryRate: number
  avgResponseTime: number
  topSources: Array<{
    source: NotificationSource
    count: number
    percentage: number
  }>
}

export class SmartNotificationsService extends BaseService {
  private notifications: Map<string, SmartNotification> = new Map()
  private rules: Map<string, NotificationRule> = new Map()
  private preferences: Map<string, NotificationPreferences> = new Map()
  private stats: Map<string, NotificationStats> = new Map()

  constructor() {
    super('SmartNotificationsService')
    this.initializeRules()
    this.initializePreferences()
  }

  private initializeRules(): void {
    const rules: NotificationRule[] = [
      {
        id: 'rule-1',
        name: 'Deal Closure Risk Alert',
        description: 'Alert when a high-value deal is at risk of not closing',
        isActive: true,
        conditions: [
          {
            field: 'deal.value',
            operator: 'greater_than',
            value: 100000
          },
          {
            field: 'deal.closureProbability',
            operator: 'less_than',
            value: 40,
            logic: 'AND'
          }
        ],
        actions: [
          {
            type: 'create_notification',
            config: {
              type: 'deal_closure_risk',
              priority: 'high',
              channels: ['in_app', 'email', 'slack']
            }
          }
        ],
        priority: 'high',
        channels: ['in_app', 'email', 'slack'],
        cooldownMinutes: 30,
        maxPerDay: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'rule-2',
        name: 'Churn Risk Alert',
        description: 'Alert when an account shows signs of churning',
        isActive: true,
        conditions: [
          {
            field: 'account.churnProbability',
            operator: 'greater_than',
            value: 70
          }
        ],
        actions: [
          {
            type: 'create_notification',
            config: {
              type: 'churn_risk_alert',
              priority: 'critical',
              channels: ['in_app', 'email', 'sms', 'voice']
            }
          }
        ],
        priority: 'critical',
        channels: ['in_app', 'email', 'sms', 'voice'],
        cooldownMinutes: 15,
        maxPerDay: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'rule-3',
        name: 'High Priority NBA',
        description: 'Alert for high-priority Next Best Actions',
        isActive: true,
        conditions: [
          {
            field: 'nba.priority',
            operator: 'equals',
            value: 'high'
          },
          {
            field: 'nba.dueDate',
            operator: 'less_than',
            value: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            logic: 'AND'
          }
        ],
        actions: [
          {
            type: 'create_notification',
            config: {
              type: 'nba_priority',
              priority: 'medium',
              channels: ['in_app', 'push']
            }
          }
        ],
        priority: 'medium',
        channels: ['in_app', 'push'],
        cooldownMinutes: 60,
        maxPerDay: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'rule-4',
        name: 'Meeting Insights',
        description: 'Alert for important meeting insights and follow-ups',
        isActive: true,
        conditions: [
          {
            field: 'meeting.insightType',
            operator: 'in',
            value: ['action_required', 'decision_made', 'next_steps']
          }
        ],
        actions: [
          {
            type: 'create_notification',
            config: {
              type: 'meeting_insight',
              priority: 'medium',
              channels: ['in_app', 'email']
            }
          }
        ],
        priority: 'medium',
        channels: ['in_app', 'email'],
        cooldownMinutes: 0,
        maxPerDay: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    rules.forEach(rule => {
      this.rules.set(rule.id, rule)
    })
  }

  private initializePreferences(): void {
    const defaultPreferences: NotificationPreferences = {
      userId: 'default',
      channels: {
        in_app: true,
        email: true,
        push: true,
        slack: false,
        sms: false,
        voice: false,
        teams: false,
        webhook: false
      },
      categories: {
        sales: true,
        marketing: true,
        customer_success: true,
        finance: false,
        operations: false,
        system: true,
        ai_insight: true
      },
      types: {
        deal_closure_risk: true,
        deal_closure_opportunity: true,
        churn_risk_alert: true,
        nba_priority: true,
        meeting_reminder: true,
        meeting_insight: true,
        email_response_needed: true,
        follow_up_required: true,
        competitor_mention: true,
        budget_approval: true,
        contract_renewal: true,
        pipeline_health: true,
        performance_insight: true,
        system_alert: true,
        integration_update: false
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
        timezone: 'America/New_York'
      },
      frequency: {
        maxPerHour: 10,
        maxPerDay: 50,
        batchSimilar: true
      },
      aiFiltering: {
        enabled: true,
        minRelevanceScore: 60,
        minUrgencyScore: 40
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.preferences.set('default', defaultPreferences)
  }

  /**
   * Create a new notification
   */
  async createNotification(notification: Omit<SmartNotification, 'id' | 'createdAt' | 'deliveryStatus'>): Promise<SmartNotification> {
    try {
      console.log(`[${this.serviceName}] Creating notification: ${notification.title}`)
      
      const newNotification: SmartNotification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        deliveryStatus: []
      }

      // Apply AI filtering and prioritization
      const processedNotification = await this.processNotification(newNotification)
      
      // Check user preferences
      const preferences = this.preferences.get(notification.userId) || this.preferences.get('default')!
      if (!this.shouldDeliverNotification(processedNotification, preferences)) {
        console.log(`[${this.serviceName}] Notification filtered out by preferences`)
        return processedNotification
      }

      // Apply rate limiting
      if (!this.checkRateLimit(notification.userId, processedNotification)) {
        console.log(`[${this.serviceName}] Notification rate limited`)
        return processedNotification
      }

      // Queue for delivery
      await this.queueNotificationDelivery(processedNotification)

      this.notifications.set(processedNotification.id, processedNotification)
      console.log(`[${this.serviceName}] Notification created: ${processedNotification.id}`)
      
      return processedNotification

    } catch (error) {
      console.error(`[${this.serviceName}] Error creating notification:`, error)
      throw this.handleError('createNotification', error)
    }
  }

  /**
   * Process notification with AI filtering and prioritization
   */
  private async processNotification(notification: SmartNotification): Promise<SmartNotification> {
    // Calculate urgency score based on type and data
    const urgencyScore = this.calculateUrgencyScore(notification)
    
    // Calculate relevance score based on user context
    const relevanceScore = this.calculateRelevanceScore(notification)
    
    // Calculate actionability score
    const actionabilityScore = this.calculateActionabilityScore(notification)

    // Update metadata
    notification.metadata = {
      ...notification.metadata,
      urgencyScore,
      relevanceScore,
      actionabilityScore,
      timeSensitivity: this.getTimeSensitivity(urgencyScore),
      businessImpact: this.getBusinessImpact(notification.type, notification.data),
      aiConfidence: Math.round((urgencyScore + relevanceScore + actionabilityScore) / 3)
    }

    // Adjust priority based on AI analysis
    notification.priority = this.adjustPriority(notification, urgencyScore)

    return notification
  }

  /**
   * Calculate urgency score (0-100)
   */
  private calculateUrgencyScore(notification: SmartNotification): number {
    let score = 0

    // Base score by type
    const typeScores: Record<NotificationType, number> = {
      deal_closure_risk: 85,
      churn_risk_alert: 90,
      deal_closure_opportunity: 70,
      nba_priority: 60,
      meeting_reminder: 50,
      meeting_insight: 55,
      email_response_needed: 65,
      follow_up_required: 70,
      competitor_mention: 60,
      budget_approval: 75,
      contract_renewal: 80,
      pipeline_health: 45,
      performance_insight: 40,
      system_alert: 85,
      integration_update: 30
    }

    score = typeScores[notification.type] || 50

    // Adjust based on data context
    const data = notification.data as { dealValue?: number; daysUntilDue?: number; churnProbability?: number }
    if (typeof data.dealValue === 'number' && data.dealValue > 500000) {
      score += 10
    }

    if (typeof data.daysUntilDue === 'number' && data.daysUntilDue < 1) {
      score += 15
    }

    if (typeof data.churnProbability === 'number' && data.churnProbability > 80) {
      score += 20
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * Calculate relevance score (0-100)
   */
  private calculateRelevanceScore(notification: SmartNotification): number {
    // Mock implementation - in production, this would use ML models
    // to analyze user behavior, preferences, and context
    return 75
  }

  /**
   * Calculate actionability score (0-100)
   */
  private calculateActionabilityScore(notification: SmartNotification): number {
    let score = 0

    // Higher score for notifications with clear actions
    if (notification.actions.length > 0) {
      score += 30
    }

    // Higher score for notifications with specific data
    if (Object.keys(notification.data).length > 3) {
      score += 20
    }

    // Higher score for time-sensitive notifications
    if (notification.expiresAt) {
      const hoursUntilExpiry = (notification.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursUntilExpiry < 24) {
        score += 25
      }
    }

    // Base score
    score += 25

    return Math.min(100, score)
  }

  /**
   * Get time sensitivity level
   */
  private getTimeSensitivity(urgencyScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (urgencyScore >= 85) return 'critical'
    if (urgencyScore >= 70) return 'high'
    if (urgencyScore >= 50) return 'medium'
    return 'low'
  }

  /**
   * Get business impact level
   */
  private getBusinessImpact(type: NotificationType, data: Record<string, unknown>): 'low' | 'medium' | 'high' | 'critical' {
    const highImpactTypes: NotificationType[] = [
      'deal_closure_risk',
      'churn_risk_alert',
      'budget_approval',
      'contract_renewal'
    ]

    if (highImpactTypes.includes(type)) {
      return 'high'
    }

    if (data.dealValue && typeof data.dealValue === 'number' && data.dealValue > 1000000) {
      return 'critical'
    }

    return 'medium'
  }

  /**
   * Adjust priority based on AI analysis
   */
  private adjustPriority(notification: SmartNotification, urgencyScore: number): NotificationPriority {
    if (urgencyScore >= 90) return 'urgent'
    if (urgencyScore >= 80) return 'critical'
    if (urgencyScore >= 60) return 'high'
    if (urgencyScore >= 40) return 'medium'
    return 'low'
  }

  /**
   * Check if notification should be delivered based on preferences
   */
  private shouldDeliverNotification(notification: SmartNotification, preferences: NotificationPreferences): boolean {
    // Check if category is enabled
    if (preferences.categories[notification.category] === false) {
      return false
    }

    // Check if type is enabled
    if (preferences.types[notification.type] === false) {
      return false
    }

    // Check AI filtering
    if (preferences.aiFiltering.enabled) {
      if (notification.metadata.relevanceScore < preferences.aiFiltering.minRelevanceScore) {
        return false
      }
      if (notification.metadata.urgencyScore < preferences.aiFiltering.minUrgencyScore) {
        return false
      }
    }

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date()
      const currentHour = now.getHours()
      const startHour = parseInt(preferences.quietHours.start.split(':')[0])
      const endHour = parseInt(preferences.quietHours.end.split(':')[0])
      
      if (currentHour >= startHour || currentHour < endHour) {
        // Only allow critical/urgent notifications during quiet hours
        if (notification.priority !== 'critical' && notification.priority !== 'urgent') {
          return false
        }
      }
    }

    return true
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(userId: string, notification: SmartNotification): boolean {
    const preferences = this.preferences.get(userId) || this.preferences.get('default')!
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Count notifications in the last hour
    const recentNotifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId && n.createdAt > oneHourAgo)

    if (recentNotifications.length >= preferences.frequency.maxPerHour) {
      return false
    }

    // Count notifications in the last day
    const todayNotifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId && n.createdAt > oneDayAgo)

    if (todayNotifications.length >= preferences.frequency.maxPerDay) {
      return false
    }

    return true
  }

  /**
   * Queue notification for delivery
   */
  private async queueNotificationDelivery(notification: SmartNotification): Promise<void> {
    const preferences = this.preferences.get(notification.userId) || this.preferences.get('default')!
    
    for (const channel of notification.channels) {
      if (preferences.channels[channel]) {
        const deliveryStatus: DeliveryStatus = {
          channel,
          status: 'pending',
          timestamp: new Date(),
          retryCount: 0
        }
        
        notification.deliveryStatus.push(deliveryStatus)
        
        // Simulate delivery
        setTimeout(() => {
          this.deliverNotification(notification, channel)
        }, Math.random() * 1000)
      }
    }
  }

  /**
   * Deliver notification through specific channel
   */
  private async deliverNotification(notification: SmartNotification, channel: NotificationChannel): Promise<void> {
    try {
      console.log(`[${this.serviceName}] Delivering notification ${notification.id} via ${channel}`)
      
      // Mock delivery - in production, this would integrate with actual services
      const deliveryStatus = notification.deliveryStatus.find(ds => ds.channel === channel)
      if (deliveryStatus) {
        deliveryStatus.status = 'sent'
        deliveryStatus.timestamp = new Date()
      }

      // Simulate delivery success/failure
      if (Math.random() > 0.1) { // 90% success rate
        if (deliveryStatus) {
          deliveryStatus.status = 'delivered'
        }
      } else {
        if (deliveryStatus) {
          deliveryStatus.status = 'failed'
          deliveryStatus.error = 'Delivery failed'
          deliveryStatus.retryCount++
          deliveryStatus.nextRetry = new Date(Date.now() + 5 * 60 * 1000) // Retry in 5 minutes
        }
      }

    } catch (error) {
      console.error(`[${this.serviceName}] Error delivering notification:`, error)
    }
  }

  /**
   * Get notifications for user
   */
  async getNotifications(userId: string, filters?: {
    category?: NotificationCategory
    priority?: NotificationPriority
    isRead?: boolean
    limit?: number
    offset?: number
  }): Promise<SmartNotification[]> {
    try {
      console.log(`[${this.serviceName}] Fetching notifications for user: ${userId}`)
      
      let notifications = Array.from(this.notifications.values())
        .filter(n => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      if (filters) {
        if (filters.category) {
          notifications = notifications.filter(n => n.category === filters.category)
        }
        if (filters.priority) {
          notifications = notifications.filter(n => n.priority === filters.priority)
        }
        if (filters.isRead !== undefined) {
          notifications = notifications.filter(n => n.isRead === filters.isRead)
        }
      }

      if (filters?.limit) {
        const offset = filters.offset || 0
        notifications = notifications.slice(offset, offset + filters.limit)
      }

      return notifications

    } catch (error) {
      console.error(`[${this.serviceName}] Error fetching notifications:`, error)
      throw this.handleError('getNotifications', error)
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<{ success: boolean }> {
    try {
      const notification = this.notifications.get(notificationId)
      if (!notification || notification.userId !== userId) {
        throw new Error('Notification not found')
      }

      notification.isRead = true
      this.notifications.set(notificationId, notification)

      return { success: true }

    } catch (error) {
      console.error(`[${this.serviceName}] Error marking notification as read:`, error)
      throw this.handleError('markAsRead', error)
    }
  }

  /**
   * Dismiss notification
   */
  async dismissNotification(notificationId: string, userId: string): Promise<{ success: boolean }> {
    try {
      const notification = this.notifications.get(notificationId)
      if (!notification || notification.userId !== userId) {
        throw new Error('Notification not found')
      }

      notification.isDismissed = true
      this.notifications.set(notificationId, notification)

      return { success: true }

    } catch (error) {
      console.error(`[${this.serviceName}] Error dismissing notification:`, error)
      throw this.handleError('dismissNotification', error)
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string): Promise<NotificationStats> {
    try {
      const notifications = Array.from(this.notifications.values())
        .filter(n => n.userId === userId)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayNotifications = notifications.filter(n => n.createdAt >= today)
      const unreadNotifications = notifications.filter(n => !n.isRead)
      const criticalNotifications = notifications.filter(n => 
        n.priority === 'critical' || n.priority === 'urgent'
      )

      // Calculate delivery rate
      const totalDeliveries = notifications.reduce((sum, n) => sum + n.deliveryStatus.length, 0)
      const successfulDeliveries = notifications.reduce((sum, n) => 
        sum + n.deliveryStatus.filter(ds => ds.status === 'delivered').length, 0
      )
      const deliveryRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries) * 100 : 0

      // Calculate average response time (mock)
      const avgResponseTime = 2.5 // minutes

      // Count by category
      const byCategory = notifications.reduce((acc, n) => {
        acc[n.category] = (acc[n.category] || 0) + 1
        return acc
      }, {} as Record<NotificationCategory, number>)

      // Count by priority
      const byPriority = notifications.reduce((acc, n) => {
        acc[n.priority] = (acc[n.priority] || 0) + 1
        return acc
      }, {} as Record<NotificationPriority, number>)

      // Count by channel
      const byChannel = notifications.reduce((acc, n) => {
        n.deliveryStatus.forEach(ds => {
          acc[ds.channel] = (acc[ds.channel] || 0) + 1
        })
        return acc
      }, {} as Record<NotificationChannel, number>)

      // Top sources
      const sourceCounts = notifications.reduce((acc, n) => {
        acc[n.source] = (acc[n.source] || 0) + 1
        return acc
      }, {} as Record<NotificationSource, number>)

      const topSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({
          source: source as NotificationSource,
          count,
          percentage: (count / notifications.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const stats: NotificationStats = {
        totalNotifications: notifications.length,
        unreadCount: unreadNotifications.length,
        criticalCount: criticalNotifications.length,
        todayCount: todayNotifications.length,
        byCategory,
        byPriority,
        byChannel,
        deliveryRate,
        avgResponseTime,
        topSources
      }

      return stats

    } catch (error) {
      console.error(`[${this.serviceName}] Error getting notification stats:`, error)
      throw this.handleError('getNotificationStats', error)
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const existing = this.preferences.get(userId) || this.preferences.get('default')!
      const updated = {
        ...existing,
        ...preferences,
        userId,
        updatedAt: new Date()
      }

      this.preferences.set(userId, updated)
      return updated

    } catch (error) {
      console.error(`[${this.serviceName}] Error updating preferences:`, error)
      throw this.handleError('updatePreferences', error)
    }
  }

  /**
   * Create notification rule
   */
  async createRule(rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationRule> {
    try {
      const newRule: NotificationRule = {
        ...rule,
        id: `rule-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.rules.set(newRule.id, newRule)
      return newRule

    } catch (error) {
      console.error(`[${this.serviceName}] Error creating rule:`, error)
      throw this.handleError('createRule', error)
    }
  }

  /**
   * Trigger notification based on event
   */
  async triggerNotification(event: {
    userId: string
    type: NotificationType
    title: string
    message: string
    data: Record<string, unknown>
    source: NotificationSource
  }): Promise<SmartNotification | null> {
    try {
      // Find matching rules
      const matchingRules = Array.from(this.rules.values())
        .filter(rule => rule.isActive && this.evaluateRule(rule, event))

      if (matchingRules.length === 0) {
        return null
      }

      // Use the highest priority rule
      const rule = matchingRules.sort((a, b) => {
        const priorityOrder = { urgent: 5, critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })[0]

      // Create notification
      const notification = await this.createNotification({
        userId: event.userId,
        type: event.type,
        priority: rule.priority,
        title: event.title,
        message: event.message,
        category: this.getCategoryFromType(event.type),
        source: event.source,
        data: event.data,
        isRead: false,
        isDismissed: false,
        actions: this.generateActions(event.type, event.data),
        channels: rule.channels,
        metadata: {
          urgencyScore: 0,
          relevanceScore: 0,
          actionabilityScore: 0,
          timeSensitivity: 'medium',
          businessImpact: 'medium',
          aiConfidence: 0,
          contextTags: [],
          relatedEntities: []
        }
      })

      return notification

    } catch (error) {
      console.error(`[${this.serviceName}] Error triggering notification:`, error)
      throw this.handleError('triggerNotification', error)
    }
  }

  /**
   * Evaluate if rule matches event
   */
  private evaluateRule(rule: NotificationRule, event: Record<string, unknown>): boolean {
    // Mock implementation - in production, this would evaluate conditions
    return true
  }

  /**
   * Get category from notification type
   */
  private getCategoryFromType(type: NotificationType): NotificationCategory {
    const typeToCategory: Record<NotificationType, NotificationCategory> = {
      deal_closure_risk: 'sales',
      deal_closure_opportunity: 'sales',
      churn_risk_alert: 'customer_success',
      nba_priority: 'sales',
      meeting_reminder: 'sales',
      meeting_insight: 'sales',
      email_response_needed: 'sales',
      follow_up_required: 'sales',
      competitor_mention: 'sales',
      budget_approval: 'finance',
      contract_renewal: 'finance',
      pipeline_health: 'sales',
      performance_insight: 'sales',
      system_alert: 'system',
      integration_update: 'system'
    }

    return typeToCategory[type] || 'system'
  }

  /**
   * Generate actions for notification
   */
  private generateActions(type: NotificationType, data: Record<string, unknown>): NotificationAction[] {
    const actions: NotificationAction[] = []

    switch (type) {
      case 'deal_closure_risk':
        actions.push({
          id: 'view-deal',
          label: 'View Deal',
          type: 'primary',
          action: 'navigate',
          url: `/deals/${data.dealId}`,
          isEnabled: true
        })
        actions.push({
          id: 'take-action',
          label: 'Take Action',
          type: 'secondary',
          action: 'navigate',
          url: `/deals/${data.dealId}/actions`,
          isEnabled: true
        })
        break

      case 'churn_risk_alert':
        actions.push({
          id: 'view-account',
          label: 'View Account',
          type: 'primary',
          action: 'navigate',
          url: `/accounts/${data.accountId}`,
          isEnabled: true
        })
        actions.push({
          id: 'retention-plan',
          label: 'Create Retention Plan',
          type: 'secondary',
          action: 'navigate',
          url: `/accounts/${data.accountId}/retention`,
          isEnabled: true
        })
        break

      case 'nba_priority':
        actions.push({
          id: 'view-nba',
          label: 'View NBA',
          type: 'primary',
          action: 'navigate',
          url: `/nbas/${data.nbaId}`,
          isEnabled: true
        })
        actions.push({
          id: 'complete-nba',
          label: 'Complete',
          type: 'secondary',
          action: 'complete',
          data: { nbaId: data.nbaId },
          isEnabled: true
        })
        break

      default:
        actions.push({
          id: 'view-details',
          label: 'View Details',
          type: 'primary',
          action: 'navigate',
          url: '/notifications',
          isEnabled: true
        })
    }

    return actions
  }
}

// Global service instance
let smartNotificationsService: SmartNotificationsService | null = null

export const getSmartNotificationsService = (): SmartNotificationsService => {
  if (!smartNotificationsService) {
    smartNotificationsService = new SmartNotificationsService()
  }
  return smartNotificationsService
}

export const destroySmartNotificationsService = (): void => {
  smartNotificationsService = null
}
