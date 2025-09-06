import { db } from './db'
import { NBA, NBAContext, NBAScore, PlayType, NBAStatus, Company, Contact, Opportunity, AccountSignal, Activity } from '@/types'
import { calculateDaysSince } from './utils'
import { autoSubagentOrchestrator } from './auto-subagents'
import { BaseService, CompanyContext } from './base-service'
import { executeParallel } from './utils'

export class NBABrain extends BaseService {
  private createNBA(partialNBA: Partial<NBA>): NBA {
    return {
      id: `nba-${Date.now()}-${Math.random()}`,
      playType: partialNBA.playType || 'NEW_LEAD',
      title: partialNBA.title || '',
      description: partialNBA.description || '',
      rationale: partialNBA.rationale || '',
      source: partialNBA.source || '',
      status: partialNBA.status || 'PENDING',
      priority: partialNBA.priority || 1,
      companyId: partialNBA.companyId || '',
      contactId: partialNBA.contactId || null,
      opportunityId: partialNBA.opportunityId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...partialNBA
    }
  }

  async generateNBAs(companyId: string): Promise<NBA[]> {
    return this.executeWithTimeout(async () => {
      const context = await this.getNBAContext(companyId)
      const nbas: NBA[] = []

      // Generate NBAs based on different triggers in parallel for better performance
      const nbaGenerators = [
        () => this.generatePreMeetingNBAs(context),
        () => this.generatePostMeetingNBAs(context),
        () => this.generateNewLeadNBAs(context),
        () => this.generateVPCMONoTouchNBAs(context),
        () => this.generateOppIdleNBAs(context),
        () => this.generateEngagementDetectedNBAs(context),
        () => this.generatePerplexityNewsNBAs(context),
        () => this.generatePerplexityHireNBAs(context)
      ]

      const generatedNBAs = await executeParallel(nbaGenerators)
      nbas.push(...generatedNBAs.flat())

      // Auto-generate subagent insights
      await this.generateAutoSubagentInsights(context)

      // Score and prioritize NBAs
      const scoredNBAs = await this.scoreNBAs(nbas, context)
      
      // Save to database
      const savedNBAs = await this.saveNBAs(scoredNBAs)

      return savedNBAs
    }, 60000) // 60 second timeout for NBA generation
  }

  private async getNBAContext(companyId: string): Promise<NBAContext> {
    const context = await this.getCompanyContext(companyId, {
      includeContacts: true,
      includeOpportunities: true,
      includeSignals: true,
      includeActivities: true,
      signalsDays: 30,
      activitiesLimit: 10
    })

    return {
      company: context.company,
      contact: context.contact,
      opportunity: context.opportunity,
      recentSignals: context.recentSignals,
      recentActivities: context.recentActivities
    }
  }

  private async generatePreMeetingNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for upcoming meetings
    const upcomingMeetings = await db.meeting.findMany({
      where: {
        companyId: context.company.id,
        status: 'SCHEDULED',
        scheduledAt: {
          gte: new Date(),
          lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
        }
      },
      include: { contact: true }
    })

    for (const meeting of upcomingMeetings) {
      nbas.push(this.createNBA({
        playType: 'PRE_MEETING',
        title: `Pre-meeting prep for ${meeting.title}`,
        description: `Prepare agenda, discovery questions, and relevant case study for ${meeting.contact?.firstName || 'contact'}`,
        rationale: `Meeting scheduled in ${Math.ceil((meeting.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60))} hours`,
        source: `Meeting ID: ${meeting.id}`,
        priority: 5,
        companyId: context.company.id,
        contactId: meeting.contactId,
        opportunityId: meeting.opportunityId
      }))
    }

    return nbas
  }

  private async generatePostMeetingNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for recent meetings that need follow-up
    const recentMeetings = await db.meeting.findMany({
      where: {
        companyId: context.company.id,
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Last 2 days
        }
      },
      include: { contact: true }
    })

    for (const meeting of recentMeetings) {
      nbas.push(this.createNBA({
        playType: 'POST_MEETING',
        title: `Follow up on ${meeting.title}`,
        description: `Send recap, next steps, and relevant assets to ${meeting.contact?.firstName || 'contact'}`,
        rationale: `Meeting completed ${calculateDaysSince(meeting.createdAt)} days ago`,
        source: `Meeting ID: ${meeting.id}`,
        priority: 4,
        companyId: context.company.id,
        contactId: meeting.contactId,
        opportunityId: meeting.opportunityId
      }))
    }

    return nbas
  }

  private async generateNewLeadNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for new contacts without recent activities
    const newContacts = await db.contact.findMany({
      where: {
        companyId: context.company.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        activities: {
          where: {
            type: 'OUTREACH'
          }
        }
      }
    })

    for (const contact of newContacts) {
      if (contact.activities.length === 0) {
        nbas.push(this.createNBA({
          playType: 'NEW_LEAD',
          title: `Connect with ${contact.firstName} ${contact.lastName}`,
          description: `Send LinkedIn connection request and comment on recent activity`,
          rationale: `New contact added ${calculateDaysSince(contact.createdAt)} days ago`,
          source: `Contact ID: ${contact.id}`,
          priority: 3,
          companyId: context.company.id,
          contactId: contact.id
        }))
      }
    }

    return nbas
  }

  private async generateVPCMONoTouchNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for VP/CMO contacts with no recent touch
    const vpCmoContacts = await db.contact.findMany({
      where: {
        companyId: context.company.id,
        role: {
          in: ['VP', 'CMO', 'CRO', 'CEO']
        }
      },
      include: {
        activities: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Last 14 days
            }
          }
        }
      }
    })

    for (const contact of vpCmoContacts) {
      if (contact.activities.length === 0) {
        nbas.push(this.createNBA({
          playType: 'VP_CMO_NO_TOUCH',
          title: `Executive outreach to ${contact.firstName} ${contact.lastName}`,
          description: `Share executive POV aligned to ${context.company.subIndustry} pillar`,
          rationale: `No touch for ${calculateDaysSince(contact.createdAt)} days`,
          source: `Contact ID: ${contact.id}`,
          priority: 4,
          companyId: context.company.id,
          contactId: contact.id
        }))
      }
    }

    return nbas
  }

  private async generateOppIdleNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for idle opportunities
    const idleOpportunities = await db.opportunity.findMany({
      where: {
        companyId: context.company.id,
        stage: {
          in: ['DISCOVER', 'EVALUATE']
        },
        updatedAt: {
          lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    })

    for (const opportunity of idleOpportunities) {
      nbas.push(this.createNBA({
        playType: 'OPP_IDLE',
        title: `Re-engage ${opportunity.name}`,
        description: `Schedule 20-min hypothesis call with 3-slide outline`,
        rationale: `Opportunity idle for ${calculateDaysSince(opportunity.updatedAt)} days`,
        source: `Opportunity ID: ${opportunity.id}`,
        priority: 3,
        companyId: context.company.id,
        opportunityId: opportunity.id
      }))
    }

    return nbas
  }

  private async generateEngagementDetectedNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for recent engagement signals
    const engagementSignals = context.recentSignals.filter(signal => 
      signal.tags.includes('engagement') || 
      signal.title.toLowerCase().includes('viewed') ||
      signal.title.toLowerCase().includes('reacted') ||
      signal.title.toLowerCase().includes('commented')
    )

    for (const signal of engagementSignals) {
      nbas.push(this.createNBA({
        playType: 'ENGAGEMENT_DETECTED',
        title: `Follow up on engagement: ${signal.title}`,
        description: `Send tailored DM with benefit + micro-ask within 48h`,
        rationale: `Engagement detected: ${signal.title}`,
        source: `Signal ID: ${signal.id}`,
        priority: 4,
        companyId: context.company.id
      }))
    }

    return nbas
  }

  private async generatePerplexityNewsNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for recent news signals
    const newsSignals = context.recentSignals.filter(signal => 
      signal.tags.includes('news') || 
      signal.tags.includes('esg') ||
      signal.source === 'perplexity'
    )

    for (const signal of newsSignals) {
      if (context.company.subIndustry === 'Oil & Gas/Energy' && signal.tags.includes('esg')) {
        nbas.push(this.createNBA({
          playType: 'PERPLEXITY_NEWS',
          title: `ESG opportunity: ${signal.title}`,
          description: `Share sustainability POV + case study`,
          rationale: `ESG news detected: ${signal.title}`,
          source: `Signal ID: ${signal.id}`,
          priority: 3,
          companyId: context.company.id
        }))
      }
    }

    return nbas
  }

  private async generatePerplexityHireNBAs(context: NBAContext): Promise<NBA[]> {
    const nbas: NBA[] = []
    
    // Check for hiring signals
    const hireSignals = context.recentSignals.filter(signal => 
      signal.tags.includes('hiring') || 
      signal.title.toLowerCase().includes('hire') ||
      signal.title.toLowerCase().includes('appointed')
    )

    for (const signal of hireSignals) {
      nbas.push(this.createNBA({
        playType: 'PERPLEXITY_HIRE',
        title: `New leader congrats: ${signal.title}`,
        description: `Send warm congratulations + 20-min discovery ask`,
        rationale: `New hire detected: ${signal.title}`,
        source: `Signal ID: ${signal.id}`,
        priority: 3,
        companyId: context.company.id
      }))
    }

    return nbas
  }

  private async scoreNBAs(nbas: Partial<NBA>[], context: NBAContext): Promise<Partial<NBA>[]> {
    return nbas.map(nba => {
      const score = this.calculateNBAScore(nba, context)
      return {
        ...nba,
        priority: score.total
      }
    }).sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  private calculateNBAScore(nba: Partial<NBA>, context: NBAContext): NBAScore {
    let recency = 0
    let engagement = 0
    let potential = 0
    let momentum = 0
    let triggers = 0

    // Recency scoring (0-20)
    if (nba.playType === 'PRE_MEETING') recency = 20
    else if (nba.playType === 'POST_MEETING') recency = 15
    else if (nba.playType === 'NEW_LEAD') recency = 10
    else recency = 5

    // Engagement scoring (0-20)
    const recentActivities = context.recentActivities.length
    engagement = Math.min(recentActivities * 2, 20)

    // Potential scoring (0-20)
    if (context.company.priorityLevel === 'STRATEGIC') potential = 20
    else if (context.company.priorityLevel === 'GROWTH') potential = 15
    else potential = 10

    // Momentum scoring (0-20)
    const recentSignals = context.recentSignals.length
    momentum = Math.min(recentSignals * 2, 20)

    // Triggers scoring (0-20)
    if (nba.playType === 'PRE_MEETING') triggers = 20
    else if (nba.playType === 'VP_CMO_NO_TOUCH') triggers = 15
    else if (nba.playType === 'ENGAGEMENT_DETECTED') triggers = 15
    else triggers = 10

    const total = recency + engagement + potential + momentum + triggers

    return { recency, engagement, potential, momentum, triggers, total }
  }

  private async saveNBAs(nbas: Partial<NBA>[]): Promise<NBA[]> {
    const savedNBAs: NBA[] = []

    for (const nba of nbas) {
      try {
        const saved = await db.nBA.create({
          data: {
            playType: nba.playType!,
            title: nba.title!,
            description: nba.description!,
            rationale: nba.rationale!,
            source: nba.source!,
            status: 'PENDING',
            priority: nba.priority!,
            companyId: nba.companyId!,
            contactId: nba.contactId,
            opportunityId: nba.opportunityId
          }
        })
        savedNBAs.push(saved)
      } catch (error) {
        console.error('Error saving NBA:', error)
      }
    }

    return savedNBAs
  }

  async updateNBAStatus(nbaId: string, status: NBAStatus, outcome?: string): Promise<NBA> {
    const nba = await db.nBA.findUnique({ where: { id: nbaId } })
    if (!nba) throw new Error('NBA not found')
    
    return db.nBA.update({
      where: { id: nbaId },
      data: {
        status,
        ...(outcome && { description: `${nba.description}\n\nOutcome: ${outcome}` })
      }
    })
  }

  async getTopNBAs(limit: number = 5): Promise<NBA[]> {
    return db.nBA.findMany({
      where: { status: 'PENDING' },
      orderBy: { priority: 'desc' },
      take: limit,
      include: {
        company: true,
        contact: true,
        opportunity: true
      }
    })
  }

  private async generateAutoSubagentInsights(context: NBAContext): Promise<void> {
    try {
      const autoResults = await autoSubagentOrchestrator.processCompanyContext({
        company: context.company,
        contact: context.contact || undefined,
        opportunity: context.opportunity || undefined,
        recentSignals: context.recentSignals,
        recentActivities: context.recentActivities
      })

      // Store auto-generated insights as account signals
      for (const result of autoResults) {
        await db.accountSignal.create({
          data: {
            title: `Auto-Subagent: ${result.trigger}`,
            summary: result.result.substring(0, 500),
            source: 'auto_subagent',
            url: '',
            detectedAt: new Date(),
            tags: [result.trigger.toLowerCase(), 'auto_generated'],
            provenance: JSON.stringify({
              agent: result.agent,
              task: result.task,
              priority: result.priority
            }),
            companyId: context.company.id
          }
        })
      }
    } catch (error) {
      console.error('Auto-subagent insights generation failed:', error)
    }
  }
}

export const nbaBrain = new NBABrain()
