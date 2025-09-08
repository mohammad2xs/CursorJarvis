import { BaseService } from './base-service'

export interface UserBehaviorPattern {
  id: string
  userId: string
  patternType: 'WORK_SCHEDULE' | 'COMMUNICATION_STYLE' | 'TASK_PREFERENCE' | 'MEETING_PATTERN' | 'ENERGY_RHYTHM'
  pattern: Record<string, unknown>
  confidence: number
  lastUpdated: Date
  sampleSize: number
  accuracy: number
}

export interface LearningInsight {
  id: string
  userId: string
  insightType: 'OPTIMIZATION' | 'PREDICTION' | 'RECOMMENDATION' | 'WARNING'
  title: string
  description: string
  confidence: number
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  actionable: boolean
  suggestedActions: string[]
  createdAt: Date
  expiresAt?: Date
}

export interface AdaptiveRecommendation {
  id: string
  userId: string
  category: 'SCHEDULING' | 'COMMUNICATION' | 'TASK_MANAGEMENT' | 'ENERGY_OPTIMIZATION' | 'LEARNING'
  title: string
  description: string
  reasoning: string
  confidence: number
  expectedImpact: number
  implementation: {
    steps: string[]
    estimatedTime: number
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  }
  metrics: {
    successRate: number
    userSatisfaction: number
    timeSaved: number
  }
  createdAt: Date
}

export interface BehaviorMetrics {
  userId: string
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  metrics: {
    productivity: {
      tasksCompleted: number
      averageTaskTime: number
      focusTime: number
      interruptions: number
    }
    communication: {
      emailsSent: number
      callsMade: number
      meetingsAttended: number
      responseTime: number
    }
    energy: {
      peakHours: string[]
      lowEnergyHours: string[]
      averageEnergy: number
      energyConsistency: number
    }
    learning: {
      newSkills: number
      knowledgeGaps: string[]
      improvementAreas: string[]
      successPatterns: string[]
    }
  }
  trends: {
    productivity: 'IMPROVING' | 'STABLE' | 'DECLINING'
    communication: 'IMPROVING' | 'STABLE' | 'DECLINING'
    energy: 'IMPROVING' | 'STABLE' | 'DECLINING'
    learning: 'IMPROVING' | 'STABLE' | 'DECLINING'
  }
  lastUpdated: Date
}

export class BehavioralLearningService extends BaseService {
  private behaviorPatterns: Map<string, UserBehaviorPattern[]> = new Map()
  private learningInsights: Map<string, LearningInsight[]> = new Map()
  private adaptiveRecommendations: Map<string, AdaptiveRecommendation[]> = new Map()
  private behaviorMetrics: Map<string, BehaviorMetrics> = new Map()

  constructor() {
    super()
  }

  /**
   * Analyze user behavior patterns from various data sources
   */
  async analyzeBehaviorPatterns(userId: string, timeRange: { from: Date; to: Date }): Promise<UserBehaviorPattern[]> {
    try {
      console.log('[BehavioralLearningService] analyzeBehaviorPatterns', { userId, timeRange })

      // Mock behavior analysis - in production, this would analyze real user data
      const patterns: UserBehaviorPattern[] = [
        {
          id: `pattern-${userId}-work-schedule`,
          userId,
          patternType: 'WORK_SCHEDULE',
          pattern: {
            preferredStartTime: '08:00',
            preferredEndTime: '17:00',
            breakFrequency: 90, // minutes
            peakProductivityHours: ['09:00-11:00', '14:00-16:00'],
            lowEnergyHours: ['12:00-13:00', '16:00-17:00']
          },
          confidence: 0.85,
          lastUpdated: new Date(),
          sampleSize: 45,
          accuracy: 0.82
        },
        {
          id: `pattern-${userId}-communication-style`,
          userId,
          patternType: 'COMMUNICATION_STYLE',
          pattern: {
            preferredChannel: 'email',
            responseTime: 2.5, // hours
            communicationFrequency: 'high',
            formalityLevel: 'professional',
            preferredMeetingLength: 30
          },
          confidence: 0.78,
          lastUpdated: new Date(),
          sampleSize: 32,
          accuracy: 0.75
        },
        {
          id: `pattern-${userId}-task-preference`,
          userId,
          patternType: 'TASK_PREFERENCE',
          pattern: {
            preferredTaskSize: 'medium',
            multitaskingTendency: 'low',
            deadlinePressure: 'moderate',
            preferredComplexity: 'medium',
            collaborationStyle: 'balanced'
          },
          confidence: 0.72,
          lastUpdated: new Date(),
          sampleSize: 28,
          accuracy: 0.70
        }
      ]

      this.behaviorPatterns.set(userId, patterns)
      return patterns

    } catch (error) {
      this.handleError(error, 'analyzeBehaviorPatterns')
      throw error
    }
  }

  /**
   * Generate learning insights based on behavior patterns
   */
  async generateLearningInsights(userId: string): Promise<LearningInsight[]> {
    try {
      console.log('[BehavioralLearningService] generateLearningInsights', { userId })

      const patterns = this.behaviorPatterns.get(userId) || []
      const insights: LearningInsight[] = []

      // Analyze work schedule patterns
      const workSchedulePattern = patterns.find(p => p.patternType === 'WORK_SCHEDULE')
      if (workSchedulePattern) {
        insights.push({
          id: `insight-${userId}-energy-optimization`,
          userId,
          insightType: 'OPTIMIZATION',
          title: 'Energy Optimization Opportunity',
          description: 'Your peak productivity hours are 9-11 AM and 2-4 PM. Consider scheduling high-priority tasks during these windows.',
          confidence: 0.85,
          impact: 'HIGH',
          actionable: true,
          suggestedActions: [
            'Block 9-11 AM for deep work',
            'Schedule meetings in 2-4 PM slot',
            'Use 12-1 PM for low-energy tasks'
          ],
          createdAt: new Date()
        })
      }

      // Analyze communication patterns
      const communicationPattern = patterns.find(p => p.patternType === 'COMMUNICATION_STYLE')
      if (communicationPattern) {
        insights.push({
          id: `insight-${userId}-communication-efficiency`,
          userId,
          insightType: 'RECOMMENDATION',
          title: 'Communication Efficiency Boost',
          description: 'Your average response time is 2.5 hours. Consider using templates for common responses to improve efficiency.',
          confidence: 0.78,
          impact: 'MEDIUM',
          actionable: true,
          suggestedActions: [
            'Create email templates for common scenarios',
            'Set up auto-responses for routine inquiries',
            'Use voice commands for quick responses'
          ],
          createdAt: new Date()
        })
      }

      // Analyze task preferences
      const taskPattern = patterns.find(p => p.patternType === 'TASK_PREFERENCE')
      if (taskPattern) {
        insights.push({
          id: `insight-${userId}-task-management`,
          userId,
          insightType: 'PREDICTION',
          title: 'Task Management Prediction',
          description: 'You perform best with medium-complexity tasks and prefer focused work sessions. Avoid multitasking during peak hours.',
          confidence: 0.72,
          impact: 'MEDIUM',
          actionable: true,
          suggestedActions: [
            'Break large tasks into medium-sized chunks',
            'Use time-blocking for focused work',
            'Minimize interruptions during peak hours'
          ],
          createdAt: new Date()
        })
      }

      this.learningInsights.set(userId, insights)
      return insights

    } catch (error) {
      this.handleError(error, 'generateLearningInsights')
      throw error
    }
  }

  /**
   * Generate adaptive recommendations based on learned patterns
   */
  async generateAdaptiveRecommendations(userId: string): Promise<AdaptiveRecommendation[]> {
    try {
      console.log('[BehavioralLearningService] generateAdaptiveRecommendations', { userId })

      const patterns = this.behaviorPatterns.get(userId) || []
      const recommendations: AdaptiveRecommendation[] = []

      // Scheduling recommendations
      const workSchedulePattern = patterns.find(p => p.patternType === 'WORK_SCHEDULE')
      if (workSchedulePattern) {
        recommendations.push({
          id: `rec-${userId}-smart-scheduling`,
          userId,
          category: 'SCHEDULING',
          title: 'Smart Scheduling System',
          description: 'Automatically schedule tasks based on your energy patterns and productivity peaks',
          reasoning: 'Your energy patterns show clear peaks at 9-11 AM and 2-4 PM. This system will optimize your calendar accordingly.',
          confidence: 0.85,
          expectedImpact: 0.25, // 25% productivity improvement
          implementation: {
            steps: [
              'Enable automatic task scheduling',
              'Set energy-based time blocks',
              'Configure break reminders',
              'Test and adjust preferences'
            ],
            estimatedTime: 15, // minutes
            difficulty: 'EASY'
          },
          metrics: {
            successRate: 0.82,
            userSatisfaction: 0.88,
            timeSaved: 45 // minutes per day
          },
          createdAt: new Date()
        })
      }

      // Communication recommendations
      const communicationPattern = patterns.find(p => p.patternType === 'COMMUNICATION_STYLE')
      if (communicationPattern) {
        recommendations.push({
          id: `rec-${userId}-communication-automation`,
          userId,
          category: 'COMMUNICATION',
          title: 'Communication Automation',
          description: 'Set up smart templates and automated responses based on your communication style',
          reasoning: 'Your preference for email communication and 2.5-hour response time can be optimized with automation.',
          confidence: 0.78,
          expectedImpact: 0.20, // 20% efficiency improvement
          implementation: {
            steps: [
              'Create personalized email templates',
              'Set up smart response suggestions',
              'Configure auto-responses for common scenarios',
              'Enable voice-to-text for quick responses'
            ],
            estimatedTime: 30,
            difficulty: 'MEDIUM'
          },
          metrics: {
            successRate: 0.75,
            userSatisfaction: 0.85,
            timeSaved: 30
          },
          createdAt: new Date()
        })
      }

      // Energy optimization recommendations
      recommendations.push({
        id: `rec-${userId}-energy-optimization`,
        userId,
        category: 'ENERGY_OPTIMIZATION',
        title: 'Energy Management System',
        description: 'Implement dynamic energy tracking and optimization recommendations',
        reasoning: 'Consistent energy management leads to 30% better performance and reduced burnout.',
        confidence: 0.80,
        expectedImpact: 0.30,
        implementation: {
          steps: [
            'Enable energy tracking',
            'Set up energy-based task prioritization',
            'Configure break reminders',
            'Monitor and adjust patterns'
          ],
          estimatedTime: 20,
          difficulty: 'EASY'
        },
        metrics: {
          successRate: 0.80,
          userSatisfaction: 0.90,
          timeSaved: 60
        },
        createdAt: new Date()
      })

      this.adaptiveRecommendations.set(userId, recommendations)
      return recommendations

    } catch (error) {
      this.handleError(error, 'generateAdaptiveRecommendations')
      throw error
    }
  }

  /**
   * Track and analyze behavior metrics
   */
  async trackBehaviorMetrics(userId: string, period: 'DAILY' | 'WEEKLY' | 'MONTHLY'): Promise<BehaviorMetrics> {
    try {
      console.log('[BehavioralLearningService] trackBehaviorMetrics', { userId, period })

      // Mock behavior metrics - in production, this would analyze real user data
      const metrics: BehaviorMetrics = {
        userId,
        period,
        metrics: {
          productivity: {
            tasksCompleted: period === 'DAILY' ? 8 : period === 'WEEKLY' ? 40 : 160,
            averageTaskTime: 45, // minutes
            focusTime: period === 'DAILY' ? 4.5 : period === 'WEEKLY' ? 22.5 : 90, // hours
            interruptions: period === 'DAILY' ? 12 : period === 'WEEKLY' ? 60 : 240
          },
          communication: {
            emailsSent: period === 'DAILY' ? 15 : period === 'WEEKLY' ? 75 : 300,
            callsMade: period === 'DAILY' ? 3 : period === 'WEEKLY' ? 15 : 60,
            meetingsAttended: period === 'DAILY' ? 2 : period === 'WEEKLY' ? 10 : 40,
            responseTime: 2.5 // hours
          },
          energy: {
            peakHours: ['09:00-11:00', '14:00-16:00'],
            lowEnergyHours: ['12:00-13:00', '16:00-17:00'],
            averageEnergy: 7.2,
            energyConsistency: 0.75
          },
          learning: {
            newSkills: period === 'DAILY' ? 0.2 : period === 'WEEKLY' ? 1 : 4,
            knowledgeGaps: ['Advanced Analytics', 'AI Tools', 'Sales Psychology'],
            improvementAreas: ['Time Management', 'Communication', 'Technical Skills'],
            successPatterns: ['Morning Deep Work', 'Afternoon Meetings', 'Evening Planning']
          }
        },
        trends: {
          productivity: 'IMPROVING',
          communication: 'STABLE',
          energy: 'IMPROVING',
          learning: 'IMPROVING'
        },
        lastUpdated: new Date()
      }

      this.behaviorMetrics.set(userId, metrics)
      return metrics

    } catch (error) {
      this.handleError(error, 'trackBehaviorMetrics')
      throw error
    }
  }

  /**
   * Get personalized recommendations based on current behavior
   */
  async getPersonalizedRecommendations(userId: string): Promise<AdaptiveRecommendation[]> {
    try {
      console.log('[BehavioralLearningService] getPersonalizedRecommendations', { userId })

      // Analyze current behavior patterns
      await this.analyzeBehaviorPatterns(userId, {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date()
      })

      // Generate adaptive recommendations
      const recommendations = await this.generateAdaptiveRecommendations(userId)

      // Sort by expected impact and confidence
      return recommendations.sort((a, b) => 
        (b.expectedImpact * b.confidence) - (a.expectedImpact * a.confidence)
      )

    } catch (error) {
      this.handleError(error, 'getPersonalizedRecommendations')
      throw error
    }
  }

  /**
   * Update behavior patterns based on user feedback
   */
  async updateBehaviorPatterns(userId: string, feedback: {
    patternId: string
    accuracy: number
    userSatisfaction: number
    implementationSuccess: boolean
  }): Promise<void> {
    try {
      console.log('[BehavioralLearningService] updateBehaviorPatterns', { userId, feedback })

      const patterns = this.behaviorPatterns.get(userId) || []
      const pattern = patterns.find(p => p.id === feedback.patternId)
      
      if (pattern) {
        // Update pattern accuracy and confidence based on feedback
        pattern.accuracy = (pattern.accuracy + feedback.accuracy) / 2
        pattern.confidence = Math.min(1.0, pattern.confidence + (feedback.userSatisfaction - 0.5) * 0.1)
        pattern.sampleSize += 1
        pattern.lastUpdated = new Date()
      }

    } catch (error) {
      this.handleError(error, 'updateBehaviorPatterns')
      throw error
    }
  }

  /**
   * Get behavior analytics and insights
   */
  async getBehaviorAnalytics(userId: string): Promise<{
    patterns: UserBehaviorPattern[]
    insights: LearningInsight[]
    recommendations: AdaptiveRecommendation[]
    metrics: BehaviorMetrics
  }> {
    try {
      console.log('[BehavioralLearningService] getBehaviorAnalytics', { userId })

      const patterns = this.behaviorPatterns.get(userId) || []
      const insights = this.learningInsights.get(userId) || []
      const recommendations = this.adaptiveRecommendations.get(userId) || []
      const metrics = this.behaviorMetrics.get(userId) || await this.trackBehaviorMetrics(userId, 'WEEKLY')

      return {
        patterns,
        insights,
        recommendations,
        metrics
      }

    } catch (error) {
      this.handleError(error, 'getBehaviorAnalytics')
      throw error
    }
  }
}

export const behavioralLearningService = new BehavioralLearningService()
