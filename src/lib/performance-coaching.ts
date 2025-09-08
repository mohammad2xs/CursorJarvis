export interface CoachingGoal {
  id: string
  userId: string
  title: string
  description: string
  category: 'SALES_SKILLS' | 'COMMUNICATION' | 'TECHNICAL' | 'LEADERSHIP' | 'PRODUCTIVITY' | 'RELATIONSHIP_BUILDING'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  currentLevel: number // 1-10 scale
  targetLevel: number // 1-10 scale
  progress: number // 0-100 percentage
  estimatedTimeToComplete: number // days
  skills: string[]
  resources: CoachingResource[]
  milestones: CoachingMilestone[]
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

export interface CoachingResource {
  id: string
  title: string
  type: 'ARTICLE' | 'VIDEO' | 'COURSE' | 'BOOK' | 'PODCAST' | 'PRACTICE_EXERCISE' | 'MENTORING'
  url?: string
  duration?: number // minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  description: string
  tags: string[]
  rating: number // 1-5 stars
  completionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface CoachingMilestone {
  id: string
  title: string
  description: string
  targetDate: Date
  completed: boolean
  completedAt?: Date
  metrics: {
    name: string
    currentValue: number
    targetValue: number
    unit: string
  }[]
}

export interface CoachingSession {
  id: string
  userId: string
  coachId?: string // AI coach or human coach
  sessionType: 'AI_COACHING' | 'PEER_REVIEW' | 'MANAGER_FEEDBACK' | 'SELF_ASSESSMENT'
  title: string
  description: string
  focusAreas: string[]
  duration: number // minutes
  scheduledAt: Date
  completedAt?: Date
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  notes: string
  actionItems: CoachingActionItem[]
  feedback: {
    rating: number // 1-5
    comments: string
    strengths: string[]
    improvements: string[]
  }
}

export interface CoachingActionItem {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate: Date
  completed: boolean
  completedAt?: Date
  assignedTo: 'USER' | 'COACH' | 'MANAGER'
}

export interface PerformanceInsight {
  id: string
  userId: string
  insightType: 'STRENGTH' | 'OPPORTUNITY' | 'RISK' | 'TREND' | 'PATTERN'
  title: string
  description: string
  category: string
  confidence: number // 0-1
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  actionable: boolean
  recommendations: string[]
  dataPoints: {
    metric: string
    value: number
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING'
    benchmark: number
  }[]
  createdAt: Date
}

export interface SkillAssessment {
  id: string
  userId: string
  skillName: string
  category: string
  currentLevel: number // 1-10
  targetLevel: number // 1-10
  lastAssessed: Date
  assessmentMethod: 'SELF_ASSESSMENT' | 'PEER_REVIEW' | 'MANAGER_EVALUATION' | 'PERFORMANCE_DATA' | 'AI_ANALYSIS'
  evidence: {
    type: 'METRIC' | 'FEEDBACK' | 'OBSERVATION' | 'TEST'
    description: string
    value: number
    date: Date
  }[]
  developmentPlan: {
    activities: string[]
    timeline: number // weeks
    resources: string[]
    milestones: string[]
  }
}

export interface CoachingRecommendation {
  id: string
  userId: string
  type: 'SKILL_DEVELOPMENT' | 'PERFORMANCE_IMPROVEMENT' | 'CAREER_GROWTH' | 'BEHAVIORAL_CHANGE' | 'KNOWLEDGE_GAP'
  title: string
  description: string
  reasoning: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  estimatedImpact: number // 0-1
  effortRequired: 'LOW' | 'MEDIUM' | 'HIGH'
  timeline: number // days
  skills: string[]
  resources: CoachingResource[]
  successMetrics: {
    metric: string
    currentValue: number
    targetValue: number
    timeframe: string
  }[]
  prerequisites: string[]
  alternatives: string[]
  createdAt: Date
  expiresAt?: Date
}

export class PerformanceCoachingService {
  private coachingGoals: Map<string, CoachingGoal[]> = new Map()
  private coachingSessions: Map<string, CoachingSession[]> = new Map()
  private performanceInsights: Map<string, PerformanceInsight[]> = new Map()
  private skillAssessments: Map<string, SkillAssessment[]> = new Map()
  private coachingRecommendations: Map<string, CoachingRecommendation[]> = new Map()

  constructor() {
    // Initialize with mock data
    this.initializeMockData()
  }

  private initializeMockData() {
    const userId = 'user-1'
    
    // Mock coaching goals
    this.coachingGoals.set(userId, [
      {
        id: 'goal-1',
        userId,
        title: 'Improve Discovery Call Skills',
        description: 'Enhance ability to conduct effective discovery calls and uncover customer pain points',
        category: 'SALES_SKILLS',
        priority: 'HIGH',
        currentLevel: 6,
        targetLevel: 8,
        progress: 45,
        estimatedTimeToComplete: 30,
        skills: ['Discovery Questions', 'Active Listening', 'Pain Point Identification'],
        resources: [
          {
            id: 'res-1',
            title: 'The Art of Discovery Calls',
            type: 'COURSE',
            duration: 120,
            difficulty: 'INTERMEDIATE',
            description: 'Comprehensive course on conducting effective discovery calls',
            tags: ['Sales', 'Discovery', 'Communication'],
            rating: 4.5,
            completionStatus: 'IN_PROGRESS'
          }
        ],
        milestones: [
          {
            id: 'milestone-1',
            title: 'Complete Discovery Call Course',
            description: 'Finish the comprehensive discovery call training',
            targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            completed: false,
            metrics: [
              {
                name: 'Course Progress',
                currentValue: 60,
                targetValue: 100,
                unit: '%'
              }
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ])

    // Mock performance insights
    this.performanceInsights.set(userId, [
      {
        id: 'insight-1',
        userId,
        insightType: 'STRENGTH',
        title: 'Strong Closing Skills',
        description: 'Your closing rate has improved by 15% over the last quarter, indicating strong closing abilities',
        category: 'Sales Performance',
        confidence: 0.85,
        impact: 'HIGH',
        actionable: true,
        recommendations: [
          'Leverage this strength in team training sessions',
          'Document your closing techniques for knowledge sharing',
          'Consider mentoring junior team members'
        ],
        dataPoints: [
          {
            metric: 'Closing Rate',
            value: 0.68,
            trend: 'IMPROVING',
            benchmark: 0.55
          }
        ],
        createdAt: new Date()
      },
      {
        id: 'insight-2',
        userId,
        insightType: 'OPPORTUNITY',
        title: 'Discovery Call Improvement Opportunity',
        description: 'Discovery calls are taking 20% longer than industry average, suggesting room for efficiency improvement',
        category: 'Sales Efficiency',
        confidence: 0.78,
        impact: 'MEDIUM',
        actionable: true,
        recommendations: [
          'Practice time-boxing discovery questions',
          'Use structured discovery frameworks',
          'Record and review discovery calls for improvement'
        ],
        dataPoints: [
          {
            metric: 'Average Discovery Call Duration',
            value: 45,
            trend: 'STABLE',
            benchmark: 35
          }
        ],
        createdAt: new Date()
      }
    ])

    // Mock skill assessments
    this.skillAssessments.set(userId, [
      {
        id: 'assessment-1',
        userId,
        skillName: 'Discovery Call Skills',
        category: 'Sales Skills',
        currentLevel: 6,
        targetLevel: 8,
        lastAssessed: new Date(),
        assessmentMethod: 'PERFORMANCE_DATA',
        evidence: [
          {
            type: 'METRIC',
            description: 'Discovery call success rate',
            value: 0.65,
            date: new Date()
          },
          {
            type: 'FEEDBACK',
            description: 'Manager feedback on discovery calls',
            value: 7,
            date: new Date()
          }
        ],
        developmentPlan: {
          activities: [
            'Complete discovery call training course',
            'Practice with role-playing exercises',
            'Shadow experienced colleagues',
            'Record and review own calls'
          ],
          timeline: 4,
          resources: [
            'Discovery Call Mastery Course',
            'Role-playing practice sessions',
            'Call recording and analysis tools'
          ],
          milestones: [
            'Complete training course',
            'Conduct 10 practice calls',
            'Achieve 80% discovery call success rate'
          ]
        }
      }
    ])

    // Mock coaching recommendations
    this.coachingRecommendations.set(userId, [
      {
        id: 'rec-1',
        userId,
        type: 'SKILL_DEVELOPMENT',
        title: 'Advanced Objection Handling',
        description: 'Develop advanced techniques for handling complex objections during sales conversations',
        reasoning: 'Your current objection handling skills are at intermediate level, but advanced techniques could increase close rates by 20%',
        priority: 'HIGH',
        estimatedImpact: 0.8,
        effortRequired: 'MEDIUM',
        timeline: 21,
        skills: ['Objection Handling', 'Persuasion', 'Negotiation'],
        resources: [
          {
            id: 'res-2',
            title: 'Advanced Objection Handling Masterclass',
            type: 'COURSE',
            duration: 180,
            difficulty: 'ADVANCED',
            description: 'Comprehensive training on handling complex sales objections',
            tags: ['Sales', 'Objection Handling', 'Advanced'],
            rating: 4.8,
            completionStatus: 'NOT_STARTED'
          }
        ],
        successMetrics: [
          {
            metric: 'Objection Resolution Rate',
            currentValue: 0.65,
            targetValue: 0.85,
            timeframe: '30 days'
          }
        ],
        prerequisites: ['Basic objection handling knowledge'],
        alternatives: ['Peer mentoring', 'Manager coaching'],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    ])
  }

  /**
   * Get personalized coaching goals for a user
   */
  async getCoachingGoals(userId: string): Promise<CoachingGoal[]> {
    return this.coachingGoals.get(userId) || []
  }

  /**
   * Create a new coaching goal
   */
  async createCoachingGoal(userId: string, goal: Omit<CoachingGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CoachingGoal> {
    const newGoal: CoachingGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const goals = this.coachingGoals.get(userId) || []
    goals.push(newGoal)
    this.coachingGoals.set(userId, goals)

    return newGoal
  }

  /**
   * Update coaching goal progress
   */
  async updateGoalProgress(userId: string, goalId: string, progress: number): Promise<void> {
    const goals = this.coachingGoals.get(userId) || []
    const goal = goals.find(g => g.id === goalId)
    if (goal) {
      goal.progress = Math.min(100, Math.max(0, progress))
      goal.updatedAt = new Date()
    }
  }

  /**
   * Get performance insights for a user
   */
  async getPerformanceInsights(userId: string): Promise<PerformanceInsight[]> {
    return this.performanceInsights.get(userId) || []
  }

  /**
   * Get skill assessments for a user
   */
  async getSkillAssessments(userId: string): Promise<SkillAssessment[]> {
    return this.skillAssessments.get(userId) || []
  }

  /**
   * Update skill assessment
   */
  async updateSkillAssessment(userId: string, assessmentId: string, currentLevel: number): Promise<void> {
    const assessments = this.skillAssessments.get(userId) || []
    const assessment = assessments.find(a => a.id === assessmentId)
    if (assessment) {
      assessment.currentLevel = currentLevel
      assessment.lastAssessed = new Date()
    }
  }

  /**
   * Get personalized coaching recommendations
   */
  async getCoachingRecommendations(userId: string): Promise<CoachingRecommendation[]> {
    return this.coachingRecommendations.get(userId) || []
  }

  /**
   * Generate AI-powered coaching recommendations based on performance data
   */
  async generateCoachingRecommendations(userId: string): Promise<CoachingRecommendation[]> {
    // Mock AI-powered recommendations
    const recommendations: CoachingRecommendation[] = [
      {
        id: `ai-rec-${Date.now()}`,
        userId,
        type: 'PERFORMANCE_IMPROVEMENT',
        title: 'Optimize Email Response Time',
        description: 'Your average email response time is 2.5 hours. Reducing this to 1 hour could improve customer satisfaction by 25%',
        reasoning: 'Analysis of your communication patterns shows that faster responses correlate with higher deal closure rates',
        priority: 'MEDIUM',
        estimatedImpact: 0.6,
        effortRequired: 'LOW',
        timeline: 14,
        skills: ['Time Management', 'Communication Efficiency'],
        resources: [
          {
            id: 'res-3',
            title: 'Email Productivity Best Practices',
            type: 'ARTICLE',
            duration: 15,
            difficulty: 'BEGINNER',
            description: 'Quick guide to email productivity and response time optimization',
            tags: ['Productivity', 'Email', 'Communication'],
            rating: 4.2,
            completionStatus: 'NOT_STARTED'
          }
        ],
        successMetrics: [
          {
            metric: 'Average Email Response Time',
            currentValue: 2.5,
            targetValue: 1.0,
            timeframe: '14 days'
          }
        ],
        prerequisites: [],
        alternatives: ['Email templates', 'Auto-responses'],
        createdAt: new Date()
      }
    ]

    const existingRecs = this.coachingRecommendations.get(userId) || []
    existingRecs.push(...recommendations)
    this.coachingRecommendations.set(userId, existingRecs)

    return recommendations
  }

  /**
   * Schedule a coaching session
   */
  async scheduleCoachingSession(userId: string, session: Omit<CoachingSession, 'id' | 'userId' | 'status' | 'notes' | 'actionItems' | 'feedback'>): Promise<CoachingSession> {
    const newSession: CoachingSession = {
      ...session,
      id: `session-${Date.now()}`,
      userId,
      status: 'SCHEDULED',
      notes: '',
      actionItems: [],
      feedback: {
        rating: 0,
        comments: '',
        strengths: [],
        improvements: []
      }
    }

    const sessions = this.coachingSessions.get(userId) || []
    sessions.push(newSession)
    this.coachingSessions.set(userId, sessions)

    return newSession
  }

  /**
   * Get coaching sessions for a user
   */
  async getCoachingSessions(userId: string): Promise<CoachingSession[]> {
    return this.coachingSessions.get(userId) || []
  }

  /**
   * Complete a coaching session
   */
  async completeCoachingSession(userId: string, sessionId: string, notes: string, actionItems: CoachingActionItem[], feedback: CoachingSession['feedback']): Promise<void> {
    const sessions = this.coachingSessions.get(userId) || []
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      session.status = 'COMPLETED'
      session.completedAt = new Date()
      session.notes = notes
      session.actionItems = actionItems
      session.feedback = feedback
    }
  }

  /**
   * Get coaching dashboard data
   */
  async getCoachingDashboard(userId: string): Promise<{
    goals: CoachingGoal[]
    insights: PerformanceInsight[]
    recommendations: CoachingRecommendation[]
    sessions: CoachingSession[]
    assessments: SkillAssessment[]
    progress: {
      goalsCompleted: number
      totalGoals: number
      skillsImproved: number
      sessionsCompleted: number
      averageRating: number
    }
  }> {
    const goals = await this.getCoachingGoals(userId)
    const insights = await this.getPerformanceInsights(userId)
    const recommendations = await this.getCoachingRecommendations(userId)
    const sessions = await this.getCoachingSessions(userId)
    const assessments = await this.getSkillAssessments(userId)

    const completedGoals = goals.filter(g => g.progress === 100).length
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED')
    const averageRating = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + s.feedback.rating, 0) / completedSessions.length
      : 0

    const skillsImproved = assessments.filter(a => a.currentLevel > a.targetLevel * 0.8).length

    return {
      goals,
      insights,
      recommendations,
      sessions,
      assessments,
      progress: {
        goalsCompleted: completedGoals,
        totalGoals: goals.length,
        skillsImproved,
        sessionsCompleted: completedSessions.length,
        averageRating
      }
    }
  }
}

export const performanceCoachingService = new PerformanceCoachingService()
