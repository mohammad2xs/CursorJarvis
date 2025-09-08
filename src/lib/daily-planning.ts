import { NBA, Opportunity, Meeting, Activity } from '@/types'
import { BaseService } from './base-service'

export interface DailyPlan {
  id: string
  date: Date
  userId: string
  morningAgenda: AgendaItem[]
  afternoonAgenda: AgendaItem[]
  eveningAgenda: AgendaItem[]
  priorities: PriorityItem[]
  energyOptimization: EnergyBlock[]
  timeBlocks: TimeBlock[]
  focusAreas: FocusArea[]
  successMetrics: SuccessMetric[]
  createdAt: Date
  updatedAt: Date
}

export interface AgendaItem {
  id: string
  title: string
  description: string
  type: 'NBA' | 'MEETING' | 'TASK' | 'BREAK' | 'FOCUS_TIME' | 'ADMIN'
  priority: 1 | 2 | 3 | 4 | 5
  estimatedDuration: number // minutes
  actualDuration?: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  nbaId?: string
  meetingId?: string
  taskId?: string
  timeSlot: string
  energyLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  context: string
  expectedOutcome: string
  dependencies: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PriorityItem {
  id: string
  title: string
  description: string
  category: 'REVENUE' | 'RELATIONSHIP' | 'STRATEGIC' | 'ADMIN'
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  effort: 'HIGH' | 'MEDIUM' | 'LOW'
  deadline?: Date
  companyId?: string
  contactId?: string
  opportunityId?: string
  nbaId?: string
  score: number
  reasoning: string
}

export interface EnergyBlock {
  id: string
  timeSlot: string
  energyLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  recommendedActivities: string[]
  avoidActivities: string[]
  breakDuration: number
  context: string
}

export interface TimeBlock {
  id: string
  startTime: string
  endTime: string
  type: 'FOCUS' | 'MEETING' | 'ADMIN' | 'BREAK' | 'TRAVEL'
  title: string
  description: string
  energyLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  isFlexible: boolean
  bufferTime: number
}

export interface FocusArea {
  id: string
  name: string
  description: string
  timeAllocated: number
  goals: string[]
  metrics: string[]
  priority: number
}

export interface SuccessMetric {
  id: string
  name: string
  target: number
  current: number
  unit: string
  category: 'REVENUE' | 'ACTIVITY' | 'RELATIONSHIP' | 'LEARNING'
  isDaily: boolean
}

export interface PlanningContext {
  userPreferences: UserPreferences
  recentPerformance: PerformanceData
  currentWorkload: WorkloadData
  upcomingMeetings: Meeting[]
  pendingNBAs: NBA[]
  opportunities: Opportunity[]
  energyPatterns: EnergyPattern[]
  weather?: WeatherData
  calendar: CalendarData
}

export interface UserPreferences {
  workingHours: { start: string; end: string }
  breakFrequency: number
  focusTimeBlocks: number
  meetingPreferences: string[]
  energyPeakTimes: string[]
  avoidTimes: string[]
  timezone: string
  notificationSettings: NotificationSettings
}

export interface PerformanceData {
  recentNBAsCompleted: number
  averageTaskCompletion: number
  meetingSuccessRate: number
  revenueGenerated: number
  energyLevels: { time: string; level: number }[]
  productivityScore: number
}

export interface WorkloadData {
  totalTasks: number
  highPriorityTasks: number
  meetingsToday: number
  travelTime: number
  adminTime: number
  focusTimeAvailable: number
}

export interface EnergyPattern {
  timeSlot: string
  averageEnergy: number
  activityType: string
  performance: number
}

export interface WeatherData {
  temperature: number
  condition: string
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
}

export interface CalendarData {
  meetings: Meeting[]
  travelTime: number
  focusBlocks: TimeBlock[]
  adminBlocks: TimeBlock[]
}

export interface NotificationSettings {
  morningBriefing: boolean
  energyAlerts: boolean
  priorityUpdates: boolean
  meetingReminders: boolean
  breakReminders: boolean
}

export class DailyPlanningService extends BaseService {
  async generateDailyPlan(userId: string, date: Date = new Date()): Promise<DailyPlan> {
    return this.executeWithTimeout(async () => {
      console.log('Starting daily plan generation for:', { userId, date })
      
      const context = await this.getPlanningContext(userId, date)
      console.log('Planning context retrieved:', { 
        nbasCount: context.pendingNBAs.length,
        meetingsCount: 2, // Mock value for meetings
        opportunitiesCount: context.opportunities.length
      })
      
      // Generate AI-powered daily plan
      const plan = await this.createDailyPlan(userId, date, context)
      console.log('Daily plan created:', { planId: plan.id })
      
      // Save to database
      const savedPlan = await this.saveDailyPlan(plan)
      console.log('Daily plan saved')
      
      return savedPlan
    }, 30000)
  }

  private async getPlanningContext(userId: string, date: Date): Promise<PlanningContext> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Get all relevant data for the day
    const pendingNBAs = await this.getPendingNBAs(userId)
    const meetings = await this.getMeetingsForDate(userId, startOfDay, endOfDay)
    const opportunities = await this.getActiveOpportunities(userId)
    const activities = await this.getRecentActivities(userId, 7) // Last 7 days
    const userPreferences = await this.getUserPreferences(userId)
    const recentPerformance = await this.getRecentPerformance(userId, 30) // Last 30 days

    const workload = this.calculateWorkload(meetings, pendingNBAs, activities)
    const energyPatterns = await this.getEnergyPatterns(userId, 30)
    const calendar = this.buildCalendarData(meetings, energyPatterns)

    return {
      userPreferences,
      recentPerformance,
      currentWorkload: workload,
      upcomingMeetings: meetings,
      pendingNBAs,
      opportunities,
      energyPatterns,
      calendar
    }
  }

  private async createDailyPlan(userId: string, date: Date, context: PlanningContext): Promise<DailyPlan> {
    const planId = `plan-${userId}-${date.toISOString().split('T')[0]}`
    
    // Generate AI-powered agenda using OpenAI (mock for now)
    // const agendaPrompt = this.buildAgendaPrompt(context)
    // const aiResponse = await openAIService.chat(agendaPrompt)
    
    // Parse AI response and create structured plan (mock response)
    const agenda = this.parseAgendaResponse("Mock AI response", context)
    
    // Generate priorities based on NBA scores and business impact
    const priorities = await this.generatePriorities(context)
    
    // Create energy-optimized time blocks
    const timeBlocks = this.createEnergyOptimizedTimeBlocks(context, agenda)
    
    // Generate focus areas based on current opportunities
    const focusAreas = this.generateFocusAreas(context)
    
    // Create success metrics for the day
    const successMetrics = this.generateSuccessMetrics(context)

    return {
      id: planId,
      date,
      userId,
      morningAgenda: agenda.morning,
      afternoonAgenda: agenda.afternoon,
      eveningAgenda: agenda.evening,
      priorities,
      energyOptimization: this.generateEnergyBlocks(context),
      timeBlocks,
      focusAreas,
      successMetrics,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private buildAgendaPrompt(context: PlanningContext): string {
    return `
    Generate a comprehensive daily agenda for a sales account executive. Consider the following context:

    USER PREFERENCES:
    - Working hours: ${context.userPreferences.workingHours.start} - ${context.userPreferences.workingHours.end}
    - Energy peak times: ${context.userPreferences.energyPeakTimes.join(', ')}
    - Break frequency: Every ${context.userPreferences.breakFrequency} minutes
    - Focus time blocks: ${context.userPreferences.focusTimeBlocks} minutes each

    CURRENT WORKLOAD:
    - Total tasks: ${context.currentWorkload.totalTasks}
    - High priority tasks: ${context.currentWorkload.highPriorityTasks}
    - Meetings today: ${context.currentWorkload.meetingsToday}
    - Travel time: ${context.currentWorkload.travelTime} minutes
    - Admin time needed: ${context.currentWorkload.adminTime} minutes

    PENDING NBAs (Next Best Actions):
    ${context.pendingNBAs.map(nba => `- ${nba.title} (Priority: ${nba.priority}, Type: ${nba.playType})`).join('\n')}

    UPCOMING MEETINGS:
    - Team Standup at 09:00 (30 min)
    - Client Call at 14:00 (60 min)

    ACTIVE OPPORTUNITIES:
    ${context.opportunities.map(opp => `- ${opp.name} (Stage: ${opp.stage}, Value: $${opp.value})`).join('\n')}

    RECENT PERFORMANCE:
    - NBA completion rate: ${context.recentPerformance.averageTaskCompletion}%
    - Meeting success rate: ${context.recentPerformance.meetingSuccessRate}%
    - Revenue generated: $${context.recentPerformance.revenueGenerated}

    ENERGY PATTERNS:
    ${context.energyPatterns.map(pattern => `- ${pattern.timeSlot}: ${pattern.averageEnergy}/10 energy, ${pattern.activityType}`).join('\n')}

    Generate a structured daily agenda with:
    1. Morning agenda (high energy activities, important meetings, focus work)
    2. Afternoon agenda (follow-ups, admin tasks, relationship building)
    3. Evening agenda (planning, reflection, preparation for tomorrow)

    For each agenda item, include:
    - Title and description
    - Type (NBA, MEETING, TASK, BREAK, FOCUS_TIME, ADMIN)
    - Priority (1-5)
    - Estimated duration in minutes
    - Energy level required (HIGH, MEDIUM, LOW)
    - Time slot recommendation
    - Context and expected outcome
    - Dependencies

    Focus on:
    - Energy optimization (high energy tasks during peak times)
    - Revenue-generating activities
    - Relationship building
    - Strategic work
    - Proper breaks and recovery time
    - Buffer time between meetings
    - Preparation for important meetings

    Return the response in a structured JSON format.
    `
  }

  private parseAgendaResponse(aiResponse: string, context: PlanningContext): {
    morning: AgendaItem[]
    afternoon: AgendaItem[]
    evening: AgendaItem[]
  } {
    try {
      // Parse AI response and create agenda items
      // This is a simplified parser - in production, you'd want more robust parsing
      const agenda = {
        morning: this.createAgendaItems(context.pendingNBAs.slice(0, 3), 'morning'),
        afternoon: this.createAgendaItems(context.pendingNBAs.slice(3, 6), 'afternoon'),
        evening: this.createAgendaItems(context.pendingNBAs.slice(6, 8), 'evening')
      }
      
      return agenda
    } catch (error) {
      console.error('Error parsing agenda response:', error)
      // Fallback to basic agenda
      return this.createFallbackAgenda(context)
    }
  }

  private createAgendaItems(nbas: NBA[], timeOfDay: string): AgendaItem[] {
    return nbas.map((nba, index) => ({
      id: `agenda-${nba.id}-${timeOfDay}`,
      title: nba.title,
      description: nba.description,
      type: 'NBA' as const,
      priority: nba.priority as 1 | 2 | 3 | 4 | 5,
      estimatedDuration: this.calculateEstimatedDuration(nba, timeOfDay),
      status: 'PENDING' as const,
      nbaId: nba.id,
      timeSlot: this.getTimeSlot(timeOfDay, index),
      energyLevel: this.getRequiredEnergyLevel(nba, timeOfDay),
      context: nba.rationale,
      expectedOutcome: this.getExpectedOutcome(nba),
      dependencies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  }

  private createFallbackAgenda(context: PlanningContext): {
    morning: AgendaItem[]
    afternoon: AgendaItem[]
    evening: AgendaItem[]
  } {
    return {
      morning: this.createAgendaItems(context.pendingNBAs.slice(0, 3), 'morning'),
      afternoon: this.createAgendaItems(context.pendingNBAs.slice(3, 6), 'afternoon'),
      evening: this.createAgendaItems(context.pendingNBAs.slice(6, 8), 'evening')
    }
  }

  private calculateEstimatedDuration(nba: NBA, timeOfDay: string): number {
    const baseDuration = 30 // Base 30 minutes
    const priorityMultiplier = nba.priority / 5
    const timeOfDayMultiplier = timeOfDay === 'morning' ? 1.2 : timeOfDay === 'afternoon' ? 1.0 : 0.8
    
    return Math.round(baseDuration * priorityMultiplier * timeOfDayMultiplier)
  }

  private getTimeSlot(timeOfDay: string, index: number): string {
    const timeSlots = {
      morning: ['08:00', '09:00', '10:00', '11:00'],
      afternoon: ['13:00', '14:00', '15:00', '16:00'],
      evening: ['17:00', '18:00', '19:00', '20:00']
    }
    
    return timeSlots[timeOfDay as keyof typeof timeSlots][index] || '09:00'
  }

  private getRequiredEnergyLevel(nba: NBA, timeOfDay: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (nba.priority >= 4) return 'HIGH'
    if (timeOfDay === 'morning') return 'HIGH'
    if (timeOfDay === 'evening') return 'LOW'
    return 'MEDIUM'
  }

  private getExpectedOutcome(nba: NBA): string {
    const outcomes = {
      'PRE_MEETING': 'Meeting preparation completed, agenda ready',
      'POST_MEETING': 'Follow-up actions completed, next steps defined',
      'NEW_LEAD': 'Initial contact established, relationship started',
      'VP_CMO_NO_TOUCH': 'Executive engagement initiated',
      'OPP_IDLE': 'Opportunity re-engaged, momentum restored',
      'ENGAGEMENT_DETECTED': 'Response to activity, relationship advanced',
      'PERPLEXITY_NEWS': 'News-driven outreach completed',
      'PERPLEXITY_HIRE': 'New hire congratulations sent'
    }
    
    return outcomes[nba.playType] || 'Action completed successfully'
  }

  private async generatePriorities(context: PlanningContext): Promise<PriorityItem[]> {
    const priorities: PriorityItem[] = []
    
    // Add NBA-based priorities
    for (const nba of context.pendingNBAs.slice(0, 5)) {
      priorities.push({
        id: `priority-${nba.id}`,
        title: nba.title,
        description: nba.description,
        category: this.getPriorityCategory(nba),
        impact: this.getImpactLevel(nba.priority),
        urgency: this.getUrgencyLevel(nba),
        effort: this.getEffortLevel(nba),
        nbaId: nba.id,
        score: nba.priority * 20, // Convert 1-5 to 20-100
        reasoning: nba.rationale
      })
    }
    
    // Add meeting-based priorities (mocked)
    priorities.push({
      id: 'priority-meeting-1',
      title: 'Prepare for Team Standup',
      description: 'Meeting preparation and research',
      category: 'RELATIONSHIP',
      impact: 'HIGH',
      urgency: 'HIGH',
      effort: 'MEDIUM',
      score: 80,
      reasoning: 'Important meeting requires preparation'
    })
    priorities.push({
      id: 'priority-meeting-2',
      title: 'Prepare for Client Call',
      description: 'Meeting preparation and research',
      category: 'RELATIONSHIP',
      impact: 'HIGH',
      urgency: 'HIGH',
      effort: 'MEDIUM',
      score: 80,
      reasoning: 'Important meeting requires preparation'
    })
    
    return priorities.sort((a, b) => b.score - a.score)
  }

  private getPriorityCategory(nba: NBA): 'REVENUE' | 'RELATIONSHIP' | 'STRATEGIC' | 'ADMIN' {
    if (nba.playType.includes('MEETING') || nba.playType.includes('LEAD')) return 'RELATIONSHIP'
    if (nba.playType.includes('OPP') || nba.playType.includes('REVENUE')) return 'REVENUE'
    if (nba.playType.includes('VP') || nba.playType.includes('STRATEGIC')) return 'STRATEGIC'
    return 'ADMIN'
  }

  private getImpactLevel(priority: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (priority >= 4) return 'HIGH'
    if (priority >= 3) return 'MEDIUM'
    return 'LOW'
  }

  private getUrgencyLevel(nba: NBA): 'HIGH' | 'MEDIUM' | 'LOW' {
    const urgentTypes = ['PRE_MEETING', 'POST_MEETING', 'OPP_IDLE']
    return urgentTypes.includes(nba.playType) ? 'HIGH' : 'MEDIUM'
  }

  private getEffortLevel(nba: NBA): 'HIGH' | 'MEDIUM' | 'LOW' {
    const highEffortTypes = ['VP_CMO_NO_TOUCH', 'STRATEGIC', 'PRE_MEETING']
    return highEffortTypes.includes(nba.playType) ? 'HIGH' : 'MEDIUM'
  }

  private createEnergyOptimizedTimeBlocks(context: PlanningContext, agenda: { morning: AgendaItem[]; afternoon: AgendaItem[]; evening: AgendaItem[] }): TimeBlock[] {
    const timeBlocks: TimeBlock[] = []
    
    // Create focus blocks during high energy times
    const highEnergyTimes = ['09:00', '14:00'] // Mock peak times
    for (const time of highEnergyTimes) {
      timeBlocks.push({
        id: `focus-${time}`,
        startTime: time,
        endTime: this.addMinutes(time, 60), // Mock 60-minute focus blocks
        type: 'FOCUS',
        title: 'Deep Focus Work',
        description: 'High-priority tasks requiring concentration',
        energyLevel: 'HIGH',
        isFlexible: false,
        bufferTime: 5
      })
    }
    
    // Add meeting blocks (mocked)
    timeBlocks.push({
      id: 'meeting-1',
      startTime: '09:00',
      endTime: '09:30',
      type: 'MEETING',
      title: 'Team Standup',
      description: 'Daily team standup meeting',
      energyLevel: 'HIGH',
      isFlexible: false,
      bufferTime: 10
    })
    timeBlocks.push({
      id: 'meeting-2',
      startTime: '14:00',
      endTime: '15:00',
      type: 'MEETING',
      title: 'Client Call',
      description: 'Client consultation call',
      energyLevel: 'HIGH',
      isFlexible: false,
      bufferTime: 10
    })
    
    return timeBlocks.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  private addMinutes(timeString: string, minutes: number): string {
    const [hours, mins] = timeString.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  private generateFocusAreas(context: PlanningContext): FocusArea[] {
    const focusAreas: FocusArea[] = []
    
    // Revenue focus
    const revenueOpps = [] // Mock empty array
    if (revenueOpps.length > 0) {
      focusAreas.push({
        id: 'revenue-focus',
        name: 'Revenue Generation',
        description: 'Focus on closing deals and generating revenue',
        timeAllocated: 120, // 2 hours
        goals: ['Close 1 deal', 'Advance 2 opportunities', 'Generate $50K pipeline'],
        metrics: ['Deals closed', 'Pipeline value', 'Meeting conversion rate'],
        priority: 1
      })
    }
    
    // Relationship building
    const newLeads = [] // Mock empty array
    if (newLeads.length > 0) {
      focusAreas.push({
        id: 'relationship-focus',
        name: 'Relationship Building',
        description: 'Build and nurture client relationships',
        timeAllocated: 90, // 1.5 hours
        goals: ['Connect with 3 new prospects', 'Follow up with 5 existing contacts', 'Schedule 2 meetings'],
        metrics: ['New connections', 'Follow-ups completed', 'Meetings scheduled'],
        priority: 2
      })
    }
    
    return focusAreas
  }

  private generateSuccessMetrics(context: PlanningContext): SuccessMetric[] {
    return [
      {
        id: 'nba-completion',
        name: 'NBA Completion Rate',
        target: 80,
        current: 0,
        unit: '%',
        category: 'ACTIVITY',
        isDaily: true
      },
      {
        id: 'meetings-completed',
        name: 'Meetings Completed',
        target: 2, // Mock value for meetings
        current: 0,
        unit: 'meetings',
        category: 'RELATIONSHIP',
        isDaily: true
      },
      {
        id: 'revenue-generated',
        name: 'Revenue Generated',
        target: 10000,
        current: 0,
        unit: '$',
        category: 'REVENUE',
        isDaily: true
      },
      {
        id: 'energy-level',
        name: 'Average Energy Level',
        target: 7,
        current: 0,
        unit: '/10',
        category: 'LEARNING',
        isDaily: true
      }
    ]
  }

  private generateEnergyBlocks(context: PlanningContext): EnergyBlock[] {
    return [
      {
        id: 'morning-high',
        timeSlot: '08:00-11:00',
        energyLevel: 'HIGH',
        recommendedActivities: ['Important meetings', 'Strategic work', 'High-priority NBAs'],
        avoidActivities: ['Admin tasks', 'Routine follow-ups'],
        breakDuration: 15,
        context: 'Peak energy time - tackle most important work'
      },
      {
        id: 'afternoon-medium',
        timeSlot: '13:00-16:00',
        energyLevel: 'MEDIUM',
        recommendedActivities: ['Follow-ups', 'Relationship building', 'Admin tasks'],
        avoidActivities: ['Complex strategic work', 'Important negotiations'],
        breakDuration: 10,
        context: 'Moderate energy - good for relationship work'
      },
      {
        id: 'evening-low',
        timeSlot: '17:00-19:00',
        energyLevel: 'LOW',
        recommendedActivities: ['Planning', 'Reflection', 'Light admin'],
        avoidActivities: ['Important calls', 'Complex tasks'],
        breakDuration: 20,
        context: 'Lower energy - focus on planning and preparation'
      }
    ]
  }

  // Helper methods for data retrieval
  private async getPendingNBAs(_userId: string): Promise<NBA[]> {
    // Mock data for now - in production, use database
    return [
      {
        id: 'nba-1',
        playType: 'PRE_MEETING',
        title: 'Pre-meeting prep for Acme Corp discovery call',
        description: 'Prepare agenda, discovery questions, and relevant case study for John Smith',
        rationale: 'Meeting scheduled in 2 hours',
        source: 'Meeting ID: mtg_123',
        status: 'PENDING',
        priority: 5,
        companyId: 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-2',
        playType: 'POST_MEETING',
        title: 'Follow up on TechCorp demo',
        description: 'Send recap, next steps, and relevant assets to Sarah Johnson',
        rationale: 'Meeting completed 1 day ago',
        source: 'Meeting ID: mtg_124',
        status: 'PENDING',
        priority: 4,
        companyId: 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-3',
        playType: 'NEW_LEAD',
        title: 'Connect with Global Industries CMO',
        description: 'Send LinkedIn connection request and comment on recent activity',
        rationale: 'New contact added 3 days ago',
        source: 'Contact ID: contact_3',
        status: 'PENDING',
        priority: 3,
        companyId: 'comp_3',
        contactId: 'contact_3',
        opportunityId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  private async getMeetingsForDate(_userId: string, start: Date, end: Date): Promise<Meeting[]> {
    // Mock data for now - in production, use database
    return [
      {
        id: 'meeting-1',
        title: 'Acme Corp Discovery Call',
        description: 'Initial discovery call with John Smith',
        type: 'DISCOVERY',
        status: 'SCHEDULED',
        scheduledAt: new Date(start.getTime() + 2 * 60 * 60 * 1000), // 2 hours from start
        duration: 60,
        meetingUrl: 'https://zoom.us/j/123456789',
        notes: '',
        outcome: null,
        companyId: 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        calendlyEventId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'meeting-2',
        title: 'TechCorp Demo',
        description: 'Product demonstration for Sarah Johnson',
        type: 'DEMO',
        status: 'SCHEDULED',
        scheduledAt: new Date(start.getTime() + 4 * 60 * 60 * 1000), // 4 hours from start
        duration: 45,
        meetingUrl: 'https://teams.microsoft.com/l/meetup-join/123456789',
        notes: '',
        outcome: null,
        companyId: 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        calendlyEventId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  private async getActiveOpportunities(_userId: string): Promise<Opportunity[]> {
    // Mock data for now - in production, use database
    return [
      {
        id: 'opp-1',
        name: 'Acme Corp Enterprise Deal',
        dealType: 'NEW_LOGO',
        stage: 'PROPOSE',
        value: 150000,
        probability: 75,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        companyId: 'comp_1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'opp-2',
        name: 'TechCorp Expansion',
        dealType: 'UPSELL',
        stage: 'EVALUATE',
        value: 75000,
        probability: 60,
        closeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        companyId: 'comp_2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  private async getRecentActivities(_userId: string, days: number): Promise<Activity[]> {
    // Mock data for now - in production, use database
    return [
      {
        id: 'activity-1',
        type: 'CALL',
        title: 'Called John Smith at Acme Corp',
        description: 'Initial discovery call to understand their needs',
        companyId: 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        outcome: 'POSITIVE',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: 'activity-2',
        type: 'EMAIL',
        title: 'Sent proposal to Sarah Johnson',
        description: 'Sent detailed proposal for TechCorp expansion',
        companyId: 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        outcome: 'PENDING',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]
  }

  private async getUserPreferences(_userId: string): Promise<UserPreferences> {
    // Default preferences - in production, load from user profile
    return {
      workingHours: { start: '08:00', end: '18:00' },
      breakFrequency: 90,
      focusTimeBlocks: 60,
      meetingPreferences: ['morning', 'afternoon'],
      energyPeakTimes: ['09:00', '10:00', '14:00'],
      avoidTimes: ['12:00', '17:00'],
      timezone: 'America/New_York',
      notificationSettings: {
        morningBriefing: true,
        energyAlerts: true,
        priorityUpdates: true,
        meetingReminders: true,
        breakReminders: true
      }
    }
  }

  private async getRecentPerformance(_userId: string, days: number): Promise<PerformanceData> {
    // Mock data for now - in production, use database
    return {
      recentNBAsCompleted: 12,
      averageTaskCompletion: 80,
      meetingSuccessRate: 85,
      revenueGenerated: 50000,
      energyLevels: [
        { time: '08:00', level: 8 },
        { time: '09:00', level: 9 },
        { time: '10:00', level: 8 },
        { time: '11:00', level: 7 },
        { time: '14:00', level: 7 },
        { time: '15:00', level: 6 },
        { time: '16:00', level: 5 },
        { time: '17:00', level: 4 }
      ],
      productivityScore: 78
    }
  }

  private calculateWorkload(meetings: Meeting[], nbas: NBA[], activities: Activity[]): WorkloadData {
    const totalTasks = nbas.length + activities.length
    const highPriorityTasks = nbas.filter(nba => nba.priority >= 4).length
    const meetingsToday = meetings.length
    const travelTime = meetings.length * 15 // Assume 15 min travel per meeting
    const adminTime = Math.max(60, totalTasks * 5) // 5 min admin per task, min 1 hour
    const focusTimeAvailable = 480 - (meetingsToday * 60) - travelTime - adminTime // 8 hours - meetings - travel - admin
    
    return {
      totalTasks,
      highPriorityTasks,
      meetingsToday,
      travelTime,
      adminTime,
      focusTimeAvailable: Math.max(0, focusTimeAvailable)
    }
  }

  private async getEnergyPatterns(_userId: string, _days: number): Promise<EnergyPattern[]> {
    // Mock energy patterns - in production, track actual energy levels
    return [
      { timeSlot: '08:00', averageEnergy: 8, activityType: 'focus', performance: 9 },
      { timeSlot: '09:00', averageEnergy: 9, activityType: 'meeting', performance: 8 },
      { timeSlot: '10:00', averageEnergy: 8, activityType: 'focus', performance: 9 },
      { timeSlot: '11:00', averageEnergy: 7, activityType: 'admin', performance: 7 },
      { timeSlot: '14:00', averageEnergy: 7, activityType: 'meeting', performance: 8 },
      { timeSlot: '15:00', averageEnergy: 6, activityType: 'follow-up', performance: 7 },
      { timeSlot: '16:00', averageEnergy: 5, activityType: 'admin', performance: 6 },
      { timeSlot: '17:00', averageEnergy: 4, activityType: 'planning', performance: 6 }
    ]
  }

  private buildCalendarData(meetings: Meeting[], energyPatterns: EnergyPattern[]): CalendarData {
    return {
      meetings,
      travelTime: meetings.length * 15,
      focusBlocks: energyPatterns
        .filter(pattern => pattern.activityType === 'focus')
        .map(pattern => ({
          id: `focus-${pattern.timeSlot}`,
          startTime: pattern.timeSlot,
          endTime: this.addMinutes(pattern.timeSlot, 60),
          type: 'FOCUS' as const,
          title: 'Focus Work',
          description: 'Deep work time',
          energyLevel: pattern.averageEnergy >= 8 ? 'HIGH' : pattern.averageEnergy >= 6 ? 'MEDIUM' : 'LOW',
          isFlexible: true,
          bufferTime: 5
        })),
      adminBlocks: energyPatterns
        .filter(pattern => pattern.activityType === 'admin')
        .map(pattern => ({
          id: `admin-${pattern.timeSlot}`,
          startTime: pattern.timeSlot,
          endTime: this.addMinutes(pattern.timeSlot, 30),
          type: 'ADMIN' as const,
          title: 'Admin Tasks',
          description: 'Administrative work',
          energyLevel: 'LOW',
          isFlexible: true,
          bufferTime: 0
        }))
    }
  }

  private async saveDailyPlan(plan: DailyPlan): Promise<DailyPlan> {
    // In production, save to database
    // For now, return the plan as-is
    return plan
  }

  async updateAgendaItem(planId: string, itemId: string, updates: Partial<AgendaItem>): Promise<AgendaItem> {
    // In production, update in database
    // For now, return mock updated item
    return {
      id: itemId,
      title: updates.title || 'Updated Item',
      description: updates.description || '',
      type: updates.type || 'TASK',
      priority: updates.priority || 3,
      estimatedDuration: updates.estimatedDuration || 30,
      status: updates.status || 'PENDING',
      timeSlot: updates.timeSlot || '09:00',
      energyLevel: updates.energyLevel || 'MEDIUM',
      context: updates.context || '',
      expectedOutcome: updates.expectedOutcome || '',
      dependencies: updates.dependencies || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async completeAgendaItem(planId: string, itemId: string, outcome: string): Promise<void> {
    // In production, mark as completed and log outcome
    console.log(`Completed agenda item ${itemId} with outcome: ${outcome}`)
  }

  async getDailyPlan(userId: string, date: Date): Promise<DailyPlan | null> {
    // In production, load from database
    // For now, generate a new plan
    return await this.generateDailyPlan(userId, date)
  }
}

export const dailyPlanningService = new DailyPlanningService()
