export interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: 'MANAGER' | 'SENIOR_AE' | 'AE' | 'SDR' | 'INTERN'
  department: string
  managerId?: string
  teamId: string
  avatar?: string
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
  joinDate: Date
  lastActive: Date
  timezone: string
  workingHours: {
    start: string
    end: string
    days: string[]
  }
  skills: string[]
  certifications: string[]
  performance: {
    currentQuota: number
    quotaAttainment: number
    dealsClosed: number
    revenue: number
    activities: number
    lastUpdated: Date
  }
  preferences: {
    communicationStyle: 'FORMAL' | 'CASUAL' | 'MIXED'
    preferredChannels: string[]
    notificationSettings: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
}

export interface Team {
  id: string
  name: string
  description: string
  managerId: string
  department: string
  members: TeamMember[]
  goals: TeamGoal[]
  metrics: TeamMetrics
  createdAt: Date
  updatedAt: Date
}

export interface TeamGoal {
  id: string
  teamId: string
  title: string
  description: string
  type: 'REVENUE' | 'ACTIVITY' | 'CONVERSION' | 'CUSTOMER_SATISFACTION' | 'SKILL_DEVELOPMENT'
  target: number
  current: number
  unit: string
  startDate: Date
  endDate: Date
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  assignedTo?: string
  progress: number
  lastUpdated: Date
}

export interface TeamMetrics {
  teamId: string
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  revenue: {
    target: number
    actual: number
    percentage: number
    trend: 'UP' | 'DOWN' | 'STABLE'
  }
  activities: {
    calls: number
    emails: number
    meetings: number
    demos: number
    proposals: number
  }
  deals: {
    pipeline: number
    closed: number
    averageDealSize: number
    winRate: number
    cycleTime: number
  }
  performance: {
    quotaAttainment: number
    topPerformers: string[]
    underPerformers: string[]
    improvementAreas: string[]
  }
  collaboration: {
    teamMeetings: number
    sharedDeals: number
    knowledgeSharing: number
    crossSelling: number
  }
  lastUpdated: Date
}

export interface ManagerInsight {
  id: string
  managerId: string
  teamId: string
  type: 'PERFORMANCE' | 'COLLABORATION' | 'RISK' | 'OPPORTUNITY' | 'COACHING'
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED'
  data: {
    metric: string
    value: number
    target?: number
    trend: 'UP' | 'DOWN' | 'STABLE'
    comparison: number
  }
  recommendations: string[]
  actionItems: {
    id: string
    title: string
    assignedTo: string
    dueDate: Date
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamCollaboration {
  id: string
  teamId: string
  type: 'MEETING' | 'DEAL_SHARING' | 'KNOWLEDGE_SHARING' | 'MENTORING' | 'TRAINING'
  title: string
  description: string
  participants: string[]
  initiator: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  scheduledAt?: Date
  completedAt?: Date
  duration?: number
  outcome?: string
  followUpActions: {
    id: string
    title: string
    assignedTo: string
    dueDate: Date
    status: 'PENDING' | 'COMPLETED'
  }[]
  resources: {
    id: string
    name: string
    type: 'DOCUMENT' | 'PRESENTATION' | 'RECORDING' | 'LINK'
    url: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamDashboard {
  team: Team
  metrics: TeamMetrics
  insights: ManagerInsight[]
  collaborations: TeamCollaboration[]
  recentActivity: {
    id: string
    type: 'DEAL_CLOSED' | 'MEETING_SCHEDULED' | 'GOAL_UPDATED' | 'COLLABORATION_CREATED'
    title: string
    description: string
    userId: string
    userName: string
    timestamp: Date
  }[]
  summary: {
    totalMembers: number
    activeMembers: number
    quotaAttainment: number
    revenueTarget: number
    revenueActual: number
    dealsClosed: number
    averageDealSize: number
    winRate: number
    topPerformer: string
    improvementNeeded: string[]
  }
}

export class TeamCollaborationService {
  private teams: Map<string, Team> = new Map()
  private teamMembers: Map<string, TeamMember[]> = new Map()
  private managerInsights: Map<string, ManagerInsight[]> = new Map()
  private teamCollaborations: Map<string, TeamCollaboration[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const teamId = 'team-1'
    
    // Mock team members
    const members: TeamMember[] = [
      {
        id: 'member-1',
        userId: 'user-1',
        name: 'John Smith',
        email: 'john.smith@company.com',
        role: 'MANAGER',
        department: 'Sales',
        teamId,
        status: 'ACTIVE',
        joinDate: new Date('2023-01-15'),
        lastActive: new Date(),
        timezone: 'America/New_York',
        workingHours: {
          start: '09:00',
          end: '17:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        skills: ['Enterprise Sales', 'CRM Management', 'Team Leadership'],
        certifications: ['Salesforce Certified', 'HubSpot Certified'],
        performance: {
          currentQuota: 1000000,
          quotaAttainment: 0.85,
          dealsClosed: 12,
          revenue: 850000,
          activities: 245,
          lastUpdated: new Date()
        },
        preferences: {
          communicationStyle: 'MIXED',
          preferredChannels: ['email', 'slack'],
          notificationSettings: {
            email: true,
            push: true,
            sms: false
          }
        }
      },
      {
        id: 'member-2',
        userId: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'SENIOR_AE',
        department: 'Sales',
        managerId: 'user-1',
        teamId,
        status: 'ACTIVE',
        joinDate: new Date('2023-03-20'),
        lastActive: new Date(),
        timezone: 'America/New_York',
        workingHours: {
          start: '08:30',
          end: '17:30',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        skills: ['Enterprise Sales', 'Account Management', 'Negotiation'],
        certifications: ['Salesforce Certified'],
        performance: {
          currentQuota: 750000,
          quotaAttainment: 0.92,
          dealsClosed: 8,
          revenue: 690000,
          activities: 198,
          lastUpdated: new Date()
        },
        preferences: {
          communicationStyle: 'FORMAL',
          preferredChannels: ['email', 'phone'],
          notificationSettings: {
            email: true,
            push: false,
            sms: true
          }
        }
      },
      {
        id: 'member-3',
        userId: 'user-3',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        role: 'AE',
        department: 'Sales',
        managerId: 'user-1',
        teamId,
        status: 'ACTIVE',
        joinDate: new Date('2023-06-10'),
        lastActive: new Date(),
        timezone: 'America/Los_Angeles',
        workingHours: {
          start: '09:00',
          end: '18:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        skills: ['SMB Sales', 'Lead Qualification', 'CRM Management'],
        certifications: ['HubSpot Certified'],
        performance: {
          currentQuota: 500000,
          quotaAttainment: 0.78,
          dealsClosed: 6,
          revenue: 390000,
          activities: 156,
          lastUpdated: new Date()
        },
        preferences: {
          communicationStyle: 'CASUAL',
          preferredChannels: ['slack', 'phone'],
          notificationSettings: {
            email: false,
            push: true,
            sms: false
          }
        }
      }
    ]

    this.teamMembers.set(teamId, members)

    // Mock team
    const team: Team = {
      id: teamId,
      name: 'Enterprise Sales Team',
      description: 'High-performing team focused on enterprise clients',
      managerId: 'user-1',
      department: 'Sales',
      members,
      goals: [
        {
          id: 'goal-1',
          teamId,
          title: 'Q4 Revenue Target',
          description: 'Achieve $2M in Q4 revenue',
          type: 'REVENUE',
          target: 2000000,
          current: 1930000,
          unit: 'USD',
          startDate: new Date('2024-10-01'),
          endDate: new Date('2024-12-31'),
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          progress: 96.5,
          lastUpdated: new Date()
        },
        {
          id: 'goal-2',
          teamId,
          title: 'Team Training Completion',
          description: 'Complete advanced sales training for all team members',
          type: 'SKILL_DEVELOPMENT',
          target: 100,
          current: 75,
          unit: '%',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-12-31'),
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          progress: 75,
          lastUpdated: new Date()
        }
      ],
      metrics: {
        teamId,
        period: 'MONTHLY',
        revenue: {
          target: 2000000,
          actual: 1930000,
          percentage: 96.5,
          trend: 'UP'
        },
        activities: {
          calls: 245,
          emails: 892,
          meetings: 156,
          demos: 34,
          proposals: 18
        },
        deals: {
          pipeline: 45,
          closed: 26,
          averageDealSize: 85000,
          winRate: 0.68,
          cycleTime: 45
        },
        performance: {
          quotaAttainment: 0.85,
          topPerformers: ['user-2'],
          underPerformers: ['user-3'],
          improvementAreas: ['Lead Qualification', 'Follow-up Process']
        },
        collaboration: {
          teamMeetings: 12,
          sharedDeals: 8,
          knowledgeSharing: 15,
          crossSelling: 3
        },
        lastUpdated: new Date()
      },
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date()
    }

    this.teams.set(teamId, team)

    // Mock manager insights
    this.managerInsights.set(teamId, [
      {
        id: 'insight-1',
        managerId: 'user-1',
        teamId,
        type: 'PERFORMANCE',
        title: 'Sarah Johnson Exceeding Quota',
        description: 'Sarah has consistently exceeded her quota for 3 consecutive months',
        priority: 'HIGH',
        status: 'NEW',
        data: {
          metric: 'Quota Attainment',
          value: 0.92,
          target: 0.8,
          trend: 'UP',
          comparison: 0.15
        },
        recommendations: [
          'Consider promoting Sarah to Senior AE role',
          'Use Sarah as mentor for other team members',
          'Increase quota target for next quarter'
        ],
        actionItems: [
          {
            id: 'action-1',
            title: 'Schedule promotion discussion with HR',
            assignedTo: 'user-1',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'PENDING'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'insight-2',
        managerId: 'user-1',
        teamId,
        type: 'COACHING',
        title: 'Mike Chen Needs Support',
        description: 'Mike is struggling with lead qualification and needs additional training',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        data: {
          metric: 'Quota Attainment',
          value: 0.78,
          target: 0.8,
          trend: 'DOWN',
          comparison: -0.02
        },
        recommendations: [
          'Schedule weekly 1:1 coaching sessions',
          'Pair Mike with Sarah for mentoring',
          'Provide additional lead qualification training'
        ],
        actionItems: [
          {
            id: 'action-2',
            title: 'Schedule weekly coaching with Mike',
            assignedTo: 'user-1',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            status: 'PENDING'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    // Mock team collaborations
    this.teamCollaborations.set(teamId, [
      {
        id: 'collab-1',
        teamId,
        type: 'MEETING',
        title: 'Weekly Team Standup',
        description: 'Weekly team sync to review progress and blockers',
        participants: ['user-1', 'user-2', 'user-3'],
        initiator: 'user-1',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        followUpActions: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'collab-2',
        teamId,
        type: 'MENTORING',
        title: 'Sarah Mentoring Mike',
        description: 'Sarah will mentor Mike on enterprise sales techniques',
        participants: ['user-2', 'user-3'],
        initiator: 'user-1',
        status: 'IN_PROGRESS',
        followUpActions: [
          {
            id: 'followup-1',
            title: 'Complete sales technique assessment',
            assignedTo: 'user-3',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'PENDING'
          }
        ],
        resources: [
          {
            id: 'resource-1',
            name: 'Enterprise Sales Playbook',
            type: 'DOCUMENT',
            url: '/resources/enterprise-sales-playbook.pdf'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  }

  /**
   * Get team dashboard data
   */
  async getTeamDashboard(teamId: string, managerId: string): Promise<TeamDashboard | null> {
    const team = this.teams.get(teamId)
    if (!team) return null

    const metrics = team.metrics
    const insights = this.managerInsights.get(teamId) || []
    const collaborations = this.teamCollaborations.get(teamId) || []

    // Mock recent activity
    const recentActivity = [
      {
        id: 'activity-1',
        type: 'DEAL_CLOSED' as const,
        title: 'Deal Closed',
        description: 'Sarah closed $150K deal with Acme Corp',
        userId: 'user-2',
        userName: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'activity-2',
        type: 'MEETING_SCHEDULED' as const,
        title: 'Meeting Scheduled',
        description: 'Team standup scheduled for tomorrow',
        userId: 'user-1',
        userName: 'John Smith',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]

    const summary = {
      totalMembers: team.members.length,
      activeMembers: team.members.filter(m => m.status === 'ACTIVE').length,
      quotaAttainment: metrics.performance.quotaAttainment,
      revenueTarget: metrics.revenue.target,
      revenueActual: metrics.revenue.actual,
      dealsClosed: metrics.deals.closed,
      averageDealSize: metrics.deals.averageDealSize,
      winRate: metrics.deals.winRate,
      topPerformer: metrics.performance.topPerformers[0] || '',
      improvementNeeded: metrics.performance.improvementAreas
    }

    return {
      team,
      metrics,
      insights,
      collaborations,
      recentActivity,
      summary
    }
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return this.teamMembers.get(teamId) || []
  }

  /**
   * Get manager insights
   */
  async getManagerInsights(teamId: string, managerId: string): Promise<ManagerInsight[]> {
    return this.managerInsights.get(teamId) || []
  }

  /**
   * Create team collaboration
   */
  async createTeamCollaboration(
    teamId: string,
    collaboration: Omit<TeamCollaboration, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TeamCollaboration> {
    const newCollaboration: TeamCollaboration = {
      ...collaboration,
      id: `collab-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const collaborations = this.teamCollaborations.get(teamId) || []
    collaborations.push(newCollaboration)
    this.teamCollaborations.set(teamId, collaborations)

    return newCollaboration
  }

  /**
   * Update team goal progress
   */
  async updateTeamGoalProgress(teamId: string, goalId: string, progress: number): Promise<void> {
    const team = this.teams.get(teamId)
    if (!team) return

    const goal = team.goals.find(g => g.id === goalId)
    if (goal) {
      goal.progress = progress
      goal.current = (goal.target * progress) / 100
      goal.lastUpdated = new Date()
      
      if (progress >= 100) {
        goal.status = 'COMPLETED'
      } else if (progress > 0) {
        goal.status = 'IN_PROGRESS'
      }
    }
  }

  /**
   * Generate team performance insights
   */
  async generateTeamInsights(teamId: string, managerId: string): Promise<ManagerInsight[]> {
    const team = this.teams.get(teamId)
    if (!team) return []

    const insights: ManagerInsight[] = []

    // Analyze team performance
    const avgQuotaAttainment = team.members.reduce((sum, member) => 
      sum + member.performance.quotaAttainment, 0) / team.members.length

    if (avgQuotaAttainment > 0.9) {
      insights.push({
        id: `insight-${Date.now()}-1`,
        managerId,
        teamId,
        type: 'PERFORMANCE',
        title: 'Team Exceeding Expectations',
        description: 'Team is performing above target with strong quota attainment',
        priority: 'HIGH',
        status: 'NEW',
        data: {
          metric: 'Average Quota Attainment',
          value: avgQuotaAttainment,
          target: 0.8,
          trend: 'UP',
          comparison: 0.1
        },
        recommendations: [
          'Consider increasing team targets for next quarter',
          'Recognize top performers publicly',
          'Share best practices across organization'
        ],
        actionItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // Analyze collaboration patterns
    const collaborations = this.teamCollaborations.get(teamId) || []
    const recentCollaborations = collaborations.filter(c => 
      c.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )

    if (recentCollaborations.length < 2) {
      insights.push({
        id: `insight-${Date.now()}-2`,
        managerId,
        teamId,
        type: 'COLLABORATION',
        title: 'Low Team Collaboration',
        description: 'Team collaboration has decreased recently',
        priority: 'MEDIUM',
        status: 'NEW',
        data: {
          metric: 'Weekly Collaborations',
          value: recentCollaborations.length,
          target: 3,
          trend: 'DOWN',
          comparison: -1
        },
        recommendations: [
          'Schedule more team meetings',
          'Encourage knowledge sharing',
          'Create collaboration incentives'
        ],
        actionItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return insights
  }
}

export const teamCollaborationService = new TeamCollaborationService()
