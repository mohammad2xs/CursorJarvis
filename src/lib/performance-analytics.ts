export interface PerformanceMetrics {
  userId: string
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  startDate: Date
  endDate: Date
  sales: {
    revenue: number
    dealsClosed: number
    dealsWon: number
    dealsLost: number
    averageDealSize: number
    salesCycleLength: number
    conversionRate: number
    winRate: number
    quotaAttainment: number
    pipelineValue: number
    newOpportunities: number
    qualifiedLeads: number
  }
  activities: {
    callsMade: number
    emailsSent: number
    meetingsScheduled: number
    meetingsAttended: number
    demosCompleted: number
    proposalsSent: number
    followUpsCompleted: number
    nbasCompleted: number
    tasksCompleted: number
    socialMediaPosts: number
    socialMediaEngagements: number
  }
  communication: {
    responseTime: number
    responseRate: number
    emailOpenRate: number
    emailClickRate: number
    meetingAttendanceRate: number
    followUpCompletionRate: number
    socialEngagementRate: number
    clientSatisfactionScore: number
  }
  productivity: {
    tasksCompleted: number
    tasksOverdue: number
    focusTime: number
    interruptions: number
    energyLevel: number
    peakProductivityHours: string[]
    timeSpentOnHighValueActivities: number
    timeSpentOnAdministrativeTasks: number
    automationUsage: number
  }
  learning: {
    skillsImproved: number
    trainingCompleted: number
    certificationsEarned: number
    knowledgeGapsIdentified: number
    behavioralInsightsGenerated: number
    coachingSessionsAttended: number
    performanceImprovements: number
  }
  technology: {
    aiInteractions: number
    voiceCommandsUsed: number
    automationTriggers: number
    systemUptime: number
    errorRate: number
    featureAdoption: number
    integrationUsage: number
  }
  goals: {
    totalGoals: number
    goalsAchieved: number
    goalsInProgress: number
    goalsOverdue: number
    goalCompletionRate: number
    averageGoalProgress: number
  }
  trends: {
    revenueGrowth: number
    activityGrowth: number
    productivityGrowth: number
    learningGrowth: number
    technologyAdoptionGrowth: number
  }
  rankings: {
    teamRank: number
    companyRank: number
    industryBenchmark: number
    percentile: number
  }
  insights: {
    topPerformingActivities: string[]
    improvementAreas: string[]
    recommendations: string[]
    riskFactors: string[]
    opportunities: string[]
    strengths: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface PerformanceComparison {
  current: PerformanceMetrics
  previous: PerformanceMetrics
  benchmark: PerformanceMetrics
  improvements: {
    revenue: number
    activities: number
    productivity: number
    communication: number
    learning: number
    technology: number
  }
  declines: {
    revenue: number
    activities: number
    productivity: number
    communication: number
    learning: number
    technology: number
  }
  insights: string[]
  recommendations: string[]
}

export interface PerformanceReport {
  id: string
  userId: string
  reportType: 'INDIVIDUAL' | 'TEAM' | 'MANAGER' | 'EXECUTIVE' | 'CUSTOM'
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  startDate: Date
  endDate: Date
  metrics: PerformanceMetrics
  comparison?: PerformanceComparison
  visualizations: {
    charts: Array<{
      id: string
      type: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'SCATTER' | 'HEATMAP' | 'GAUGE'
      title: string
      data: unknown
      config: unknown
    }>
    dashboards: Array<{
      id: string
      title: string
      widgets: unknown[]
    }>
  }
  summary: {
    keyAchievements: string[]
    challenges: string[]
    nextSteps: string[]
    overallScore: number
    performanceGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F'
  }
  generatedAt: Date
  expiresAt: Date
}

export interface PerformanceGoal {
  id: string
  userId: string
  title: string
  description: string
  category: 'SALES' | 'ACTIVITY' | 'PRODUCTIVITY' | 'LEARNING' | 'COMMUNICATION' | 'TECHNOLOGY'
  type: 'REVENUE' | 'ACTIVITY' | 'SKILL' | 'BEHAVIOR' | 'EFFICIENCY' | 'ENGAGEMENT'
  target: number
  current: number
  unit: string
  startDate: Date
  endDate: Date
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_TRACK' | 'AT_RISK' | 'COMPLETED' | 'OVERDUE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  progress: number
  milestones: Array<{
    id: string
    title: string
    target: number
    current: number
    completed: boolean
    dueDate: Date
  }>
  dependencies: string[]
  assignedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PerformanceAlert {
  id: string
  userId: string
  type: 'PERFORMANCE_DROP' | 'GOAL_AT_RISK' | 'MILESTONE_MISSED' | 'EXCEPTIONAL_PERFORMANCE' | 'SYSTEM_ISSUE'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  metric: string
  currentValue: number
  expectedValue: number
  threshold: number
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  recommendations: string[]
  actions: string[]
  isRead: boolean
  isResolved: boolean
  createdAt: Date
  updatedAt: Date
}

export class PerformanceAnalyticsService {
  private metrics: Map<string, PerformanceMetrics[]> = new Map()
  private goals: Map<string, PerformanceGoal[]> = new Map()
  private alerts: Map<string, PerformanceAlert[]> = new Map()
  private reports: Map<string, PerformanceReport[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const userId = 'user-1'
    
    // Mock performance metrics
    this.metrics.set(userId, [
      {
        userId,
        period: 'WEEKLY',
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-01-14'),
        sales: {
          revenue: 125000,
          dealsClosed: 3,
          dealsWon: 2,
          dealsLost: 1,
          averageDealSize: 62500,
          salesCycleLength: 45,
          conversionRate: 0.67,
          winRate: 0.67,
          quotaAttainment: 0.83,
          pipelineValue: 350000,
          newOpportunities: 8,
          qualifiedLeads: 12
        },
        activities: {
          callsMade: 25,
          emailsSent: 45,
          meetingsScheduled: 8,
          meetingsAttended: 7,
          demosCompleted: 3,
          proposalsSent: 2,
          followUpsCompleted: 15,
          nbasCompleted: 18,
          tasksCompleted: 32,
          socialMediaPosts: 5,
          socialMediaEngagements: 45
        },
        communication: {
          responseTime: 2.5,
          responseRate: 0.85,
          emailOpenRate: 0.72,
          emailClickRate: 0.18,
          meetingAttendanceRate: 0.88,
          followUpCompletionRate: 0.92,
          socialEngagementRate: 0.12,
          clientSatisfactionScore: 4.6
        },
        productivity: {
          tasksCompleted: 32,
          tasksOverdue: 2,
          focusTime: 18.5,
          interruptions: 12,
          energyLevel: 7.2,
          peakProductivityHours: ['09:00-11:00', '14:00-16:00'],
          timeSpentOnHighValueActivities: 12.5,
          timeSpentOnAdministrativeTasks: 3.2,
          automationUsage: 0.75
        },
        learning: {
          skillsImproved: 2,
          trainingCompleted: 1,
          certificationsEarned: 0,
          knowledgeGapsIdentified: 3,
          behavioralInsightsGenerated: 5,
          coachingSessionsAttended: 2,
          performanceImprovements: 4
        },
        technology: {
          aiInteractions: 156,
          voiceCommandsUsed: 23,
          automationTriggers: 45,
          systemUptime: 0.99,
          errorRate: 0.02,
          featureAdoption: 0.68,
          integrationUsage: 0.82
        },
        goals: {
          totalGoals: 8,
          goalsAchieved: 3,
          goalsInProgress: 4,
          goalsOverdue: 1,
          goalCompletionRate: 0.375,
          averageGoalProgress: 0.65
        },
        trends: {
          revenueGrowth: 0.15,
          activityGrowth: 0.08,
          productivityGrowth: 0.12,
          learningGrowth: 0.25,
          technologyAdoptionGrowth: 0.18
        },
        rankings: {
          teamRank: 2,
          companyRank: 15,
          industryBenchmark: 0.75,
          percentile: 85
        },
        insights: {
          topPerformingActivities: ['Client Meetings', 'Proposal Writing', 'Follow-up Calls'],
          improvementAreas: ['Email Response Time', 'Social Media Engagement', 'Administrative Tasks'],
          recommendations: [
            'Increase social media posting frequency',
            'Automate more administrative tasks',
            'Focus on high-value activities during peak hours'
          ],
          riskFactors: ['Overdue tasks increasing', 'Email response time above target'],
          opportunities: ['New market segment identified', 'Upselling potential in existing accounts'],
          strengths: ['Strong client relationships', 'High meeting attendance rate']
        },
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      }
    ])

    // Mock performance goals
    this.goals.set(userId, [
      {
        id: 'goal-1',
        userId,
        title: 'Q1 Revenue Target',
        description: 'Achieve $500K in revenue for Q1 2024',
        category: 'SALES',
        type: 'REVENUE',
        target: 500000,
        current: 375000,
        unit: 'USD',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        status: 'ON_TRACK',
        priority: 'HIGH',
        progress: 0.75,
        milestones: [
          {
            id: 'milestone-1',
            title: 'January Target',
            target: 150000,
            current: 150000,
            completed: true,
            dueDate: new Date('2024-01-31')
          },
          {
            id: 'milestone-2',
            title: 'February Target',
            target: 150000,
            current: 125000,
            completed: false,
            dueDate: new Date('2024-02-29')
          }
        ],
        dependencies: [],
        assignedBy: 'manager-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: 'goal-2',
        userId,
        title: 'Improve Email Response Time',
        description: 'Reduce average email response time to under 2 hours',
        category: 'COMMUNICATION',
        type: 'EFFICIENCY',
        target: 2,
        current: 2.5,
        unit: 'hours',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-29'),
        status: 'AT_RISK',
        priority: 'MEDIUM',
        progress: 0.6,
        milestones: [
          {
            id: 'milestone-3',
            title: 'Week 1-2: 2.3 hours',
            target: 2.3,
            current: 2.5,
            completed: false,
            dueDate: new Date('2024-01-14')
          }
        ],
        dependencies: [],
        assignedBy: 'user-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-14')
      }
    ])

    // Mock performance alerts
    this.alerts.set(userId, [
      {
        id: 'alert-1',
        userId,
        type: 'GOAL_AT_RISK',
        severity: 'MEDIUM',
        title: 'Email Response Time Goal At Risk',
        description: 'Current response time of 2.5 hours exceeds target of 2 hours',
        metric: 'email_response_time',
        currentValue: 2.5,
        expectedValue: 2.0,
        threshold: 2.0,
        impact: 'NEGATIVE',
        recommendations: [
          'Set up email templates for common responses',
          'Use voice commands for quick replies',
          'Block time for email responses'
        ],
        actions: ['Review email templates', 'Enable voice commands', 'Schedule email blocks'],
        isRead: false,
        isResolved: false,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: 'alert-2',
        userId,
        type: 'EXCEPTIONAL_PERFORMANCE',
        severity: 'LOW',
        title: 'Outstanding Client Satisfaction Score',
        description: 'Client satisfaction score of 4.6 exceeds team average of 4.2',
        metric: 'client_satisfaction',
        currentValue: 4.6,
        expectedValue: 4.2,
        threshold: 4.0,
        impact: 'POSITIVE',
        recommendations: [
          'Share best practices with team',
          'Document successful strategies',
          'Mentor junior team members'
        ],
        actions: ['Schedule team knowledge sharing', 'Update best practices doc'],
        isRead: true,
        isResolved: false,
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13')
      }
    ])
  }

  /**
   * Get performance metrics for a user
   */
  async getPerformanceMetrics(
    userId: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    startDate?: Date,
    endDate?: Date
  ): Promise<PerformanceMetrics[]> {
    const userMetrics = this.metrics.get(userId) || []
    
    let filtered = userMetrics.filter(m => m.period === period)
    
    if (startDate) {
      filtered = filtered.filter(m => m.startDate >= startDate)
    }
    
    if (endDate) {
      filtered = filtered.filter(m => m.endDate <= endDate)
    }
    
    return filtered
  }

  /**
   * Get performance goals for a user
   */
  async getPerformanceGoals(userId: string): Promise<PerformanceGoal[]> {
    return this.goals.get(userId) || []
  }

  /**
   * Get performance alerts for a user
   */
  async getPerformanceAlerts(userId: string): Promise<PerformanceAlert[]> {
    return this.alerts.get(userId) || []
  }

  /**
   * Get performance comparison
   */
  async getPerformanceComparison(
    userId: string,
    currentPeriod: PerformanceMetrics,
    previousPeriod: PerformanceMetrics
  ): Promise<PerformanceComparison> {
    const improvements = {
      revenue: currentPeriod.sales.revenue - previousPeriod.sales.revenue,
      activities: currentPeriod.activities.callsMade - previousPeriod.activities.callsMade,
      productivity: currentPeriod.productivity.focusTime - previousPeriod.productivity.focusTime,
      communication: currentPeriod.communication.responseRate - previousPeriod.communication.responseRate,
      learning: currentPeriod.learning.skillsImproved - previousPeriod.learning.skillsImproved,
      technology: currentPeriod.technology.aiInteractions - previousPeriod.technology.aiInteractions
    }

    const declines = {
      revenue: Math.max(0, previousPeriod.sales.revenue - currentPeriod.sales.revenue),
      activities: Math.max(0, previousPeriod.activities.callsMade - currentPeriod.activities.callsMade),
      productivity: Math.max(0, previousPeriod.productivity.focusTime - currentPeriod.productivity.focusTime),
      communication: Math.max(0, previousPeriod.communication.responseRate - currentPeriod.communication.responseRate),
      learning: Math.max(0, previousPeriod.learning.skillsImproved - currentPeriod.learning.skillsImproved),
      technology: Math.max(0, previousPeriod.technology.aiInteractions - currentPeriod.technology.aiInteractions)
    }

    const insights = []
    if (improvements.revenue > 0) insights.push(`Revenue increased by $${improvements.revenue.toLocaleString()}`)
    if (improvements.activities > 0) insights.push(`Activity level increased by ${improvements.activities} calls`)
    if (declines.productivity > 0) insights.push(`Focus time decreased by ${declines.productivity} hours`)

    const recommendations = []
    if (declines.productivity > 0) recommendations.push('Consider blocking focus time in calendar')
    if (declines.communication > 0) recommendations.push('Review communication processes and templates')
    if (improvements.technology > 0) recommendations.push('Great job leveraging AI tools!')

    return {
      current: currentPeriod,
      previous: previousPeriod,
      benchmark: this.generateBenchmarkMetrics(),
      improvements,
      declines,
      insights,
      recommendations
    }
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(
    userId: string,
    reportType: 'INDIVIDUAL' | 'TEAM' | 'MANAGER' | 'EXECUTIVE' | 'CUSTOM',
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceReport> {
    const metrics = await this.getPerformanceMetrics(userId, period, startDate, endDate)
    const latestMetrics = metrics[metrics.length - 1] || this.generateMockMetrics(userId, period, startDate, endDate)
    
    const report: PerformanceReport = {
      id: `report-${Date.now()}`,
      userId,
      reportType,
      period,
      startDate,
      endDate,
      metrics: latestMetrics,
      visualizations: {
        charts: this.generateCharts(latestMetrics),
        dashboards: this.generateDashboards(latestMetrics)
      },
      summary: {
        keyAchievements: latestMetrics.insights.strengths,
        challenges: latestMetrics.insights.riskFactors,
        nextSteps: latestMetrics.insights.recommendations,
        overallScore: this.calculateOverallScore(latestMetrics),
        performanceGrade: this.calculatePerformanceGrade(latestMetrics)
      },
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }

    const reports = this.reports.get(userId) || []
    reports.push(report)
    this.reports.set(userId, reports)

    return report
  }

  /**
   * Generate benchmark metrics
   */
  private generateBenchmarkMetrics(): PerformanceMetrics {
    return {
      userId: 'benchmark',
      period: 'WEEKLY',
      startDate: new Date(),
      endDate: new Date(),
      sales: {
        revenue: 100000,
        dealsClosed: 2,
        dealsWon: 1.5,
        dealsLost: 0.5,
        averageDealSize: 50000,
        salesCycleLength: 60,
        conversionRate: 0.5,
        winRate: 0.75,
        quotaAttainment: 0.8,
        pipelineValue: 300000,
        newOpportunities: 6,
        qualifiedLeads: 10
      },
      activities: {
        callsMade: 20,
        emailsSent: 40,
        meetingsScheduled: 6,
        meetingsAttended: 5,
        demosCompleted: 2,
        proposalsSent: 1,
        followUpsCompleted: 12,
        nbasCompleted: 15,
        tasksCompleted: 25,
        socialMediaPosts: 3,
        socialMediaEngagements: 30
      },
      communication: {
        responseTime: 3.0,
        responseRate: 0.8,
        emailOpenRate: 0.65,
        emailClickRate: 0.15,
        meetingAttendanceRate: 0.85,
        followUpCompletionRate: 0.85,
        socialEngagementRate: 0.10,
        clientSatisfactionScore: 4.2
      },
      productivity: {
        tasksCompleted: 25,
        tasksOverdue: 3,
        focusTime: 15,
        interruptions: 15,
        energyLevel: 6.5,
        peakProductivityHours: ['09:00-11:00', '14:00-16:00'],
        timeSpentOnHighValueActivities: 10,
        timeSpentOnAdministrativeTasks: 4,
        automationUsage: 0.5
      },
      learning: {
        skillsImproved: 1,
        trainingCompleted: 0.5,
        certificationsEarned: 0,
        knowledgeGapsIdentified: 2,
        behavioralInsightsGenerated: 3,
        coachingSessionsAttended: 1,
        performanceImprovements: 2
      },
      technology: {
        aiInteractions: 100,
        voiceCommandsUsed: 15,
        automationTriggers: 30,
        systemUptime: 0.95,
        errorRate: 0.05,
        featureAdoption: 0.5,
        integrationUsage: 0.6
      },
      goals: {
        totalGoals: 6,
        goalsAchieved: 2,
        goalsInProgress: 3,
        goalsOverdue: 1,
        goalCompletionRate: 0.33,
        averageGoalProgress: 0.5
      },
      trends: {
        revenueGrowth: 0.05,
        activityGrowth: 0.02,
        productivityGrowth: 0.03,
        learningGrowth: 0.08,
        technologyAdoptionGrowth: 0.05
      },
      rankings: {
        teamRank: 5,
        companyRank: 25,
        industryBenchmark: 0.5,
        percentile: 50
      },
      insights: {
        topPerformingActivities: [],
        improvementAreas: [],
        recommendations: [],
        riskFactors: [],
        opportunities: [],
        strengths: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Generate mock metrics
   */
  private generateMockMetrics(
    userId: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    startDate: Date,
    endDate: Date
  ): PerformanceMetrics {
    return {
      userId,
      period,
      startDate,
      endDate,
      sales: {
        revenue: 0,
        dealsClosed: 0,
        dealsWon: 0,
        dealsLost: 0,
        averageDealSize: 0,
        salesCycleLength: 0,
        conversionRate: 0,
        winRate: 0,
        quotaAttainment: 0,
        pipelineValue: 0,
        newOpportunities: 0,
        qualifiedLeads: 0
      },
      activities: {
        callsMade: 0,
        emailsSent: 0,
        meetingsScheduled: 0,
        meetingsAttended: 0,
        demosCompleted: 0,
        proposalsSent: 0,
        followUpsCompleted: 0,
        nbasCompleted: 0,
        tasksCompleted: 0,
        socialMediaPosts: 0,
        socialMediaEngagements: 0
      },
      communication: {
        responseTime: 0,
        responseRate: 0,
        emailOpenRate: 0,
        emailClickRate: 0,
        meetingAttendanceRate: 0,
        followUpCompletionRate: 0,
        socialEngagementRate: 0,
        clientSatisfactionScore: 0
      },
      productivity: {
        tasksCompleted: 0,
        tasksOverdue: 0,
        focusTime: 0,
        interruptions: 0,
        energyLevel: 0,
        peakProductivityHours: [],
        timeSpentOnHighValueActivities: 0,
        timeSpentOnAdministrativeTasks: 0,
        automationUsage: 0
      },
      learning: {
        skillsImproved: 0,
        trainingCompleted: 0,
        certificationsEarned: 0,
        knowledgeGapsIdentified: 0,
        behavioralInsightsGenerated: 0,
        coachingSessionsAttended: 0,
        performanceImprovements: 0
      },
      technology: {
        aiInteractions: 0,
        voiceCommandsUsed: 0,
        automationTriggers: 0,
        systemUptime: 0,
        errorRate: 0,
        featureAdoption: 0,
        integrationUsage: 0
      },
      goals: {
        totalGoals: 0,
        goalsAchieved: 0,
        goalsInProgress: 0,
        goalsOverdue: 0,
        goalCompletionRate: 0,
        averageGoalProgress: 0
      },
      trends: {
        revenueGrowth: 0,
        activityGrowth: 0,
        productivityGrowth: 0,
        learningGrowth: 0,
        technologyAdoptionGrowth: 0
      },
      rankings: {
        teamRank: 0,
        companyRank: 0,
        industryBenchmark: 0,
        percentile: 0
      },
      insights: {
        topPerformingActivities: [],
        improvementAreas: [],
        recommendations: [],
        riskFactors: [],
        opportunities: [],
        strengths: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Generate charts for visualizations
   */
  private generateCharts(metrics: PerformanceMetrics): Array<{
    id: string
    type: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'SCATTER' | 'HEATMAP' | 'GAUGE'
    title: string
    data: unknown
    config: unknown
  }> {
    return [
      {
        id: 'revenue-chart',
        type: 'LINE',
        title: 'Revenue Trend',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Revenue',
            data: [100000, 110000, 120000, 125000],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)'
          }]
        },
        config: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      },
      {
        id: 'activities-chart',
        type: 'BAR',
        title: 'Weekly Activities',
        data: {
          labels: ['Calls', 'Emails', 'Meetings', 'Demos', 'Proposals'],
          datasets: [{
            label: 'Count',
            data: [25, 45, 7, 3, 2],
            backgroundColor: 'rgba(59, 130, 246, 0.8)'
          }]
        },
        config: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    ]
  }

  /**
   * Generate dashboards
   */
  private generateDashboards(metrics: PerformanceMetrics): Array<{
    id: string
    title: string
    widgets: unknown[]
  }> {
    return [
      {
        id: 'sales-dashboard',
        title: 'Sales Performance',
        widgets: [
          { type: 'metric', title: 'Revenue', value: metrics.sales.revenue, format: 'currency' },
          { type: 'metric', title: 'Deals Closed', value: metrics.sales.dealsClosed, format: 'number' },
          { type: 'gauge', title: 'Quota Attainment', value: metrics.sales.quotaAttainment, max: 1 }
        ]
      }
    ]
  }

  /**
   * Calculate overall performance score
   */
  private calculateOverallScore(metrics: PerformanceMetrics): number {
    const weights = {
      sales: 0.3,
      activities: 0.2,
      productivity: 0.2,
      communication: 0.15,
      learning: 0.1,
      technology: 0.05
    }

    const salesScore = (metrics.sales.quotaAttainment + metrics.sales.winRate + metrics.sales.conversionRate) / 3
    const activityScore = Math.min(metrics.activities.callsMade / 30, 1) // Normalize to 30 calls max
    const productivityScore = metrics.productivity.focusTime / 20 // Normalize to 20 hours max
    const communicationScore = (metrics.communication.responseRate + metrics.communication.clientSatisfactionScore / 5) / 2
    const learningScore = Math.min(metrics.learning.skillsImproved / 5, 1) // Normalize to 5 skills max
    const technologyScore = metrics.technology.featureAdoption

    return (
      salesScore * weights.sales +
      activityScore * weights.activities +
      productivityScore * weights.productivity +
      communicationScore * weights.communication +
      learningScore * weights.learning +
      technologyScore * weights.technology
    ) * 100
  }

  /**
   * Calculate performance grade
   */
  private calculatePerformanceGrade(metrics: PerformanceMetrics): 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F' {
    const score = this.calculateOverallScore(metrics)
    
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A-'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B-'
    if (score >= 65) return 'C+'
    if (score >= 60) return 'C'
    if (score >= 55) return 'C-'
    if (score >= 50) return 'D+'
    if (score >= 45) return 'D'
    if (score >= 40) return 'D-'
    return 'F'
  }
}

export const performanceAnalyticsService = new PerformanceAnalyticsService()
