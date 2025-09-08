import { subagentService } from './subagents'
import { perplexityService } from './perplexity'
import { db } from './db'
import { Company, Contact, Opportunity, Meeting, AccountSignal, Activity } from '@/types'
import { GETTY_ACCOUNTS, getAccountByName, GETTY_VISUAL_CONTENT_CATEGORIES } from './getty-accounts'

export interface AutoSubagentContext {
  company: Company
  contact?: Contact
  opportunity?: Opportunity
  meeting?: Meeting
  recentSignals?: AccountSignal[]
  recentActivities?: Activity[]
}

export interface AutoSubagentResult {
  trigger: string
  agent: string
  task: string
  result: string
  priority: number
  actionable: boolean
}

export class AutoSubagentOrchestrator {
  private readonly SALES_AGENTS = [
    'getty-images-executive', // Primary Getty Images sales agent
    'sales-executive',        // General sales agent
    'ui-ux-designer',         // For customer-centric messaging
    'api-documentor',         // For structured briefs
    'python-pro',             // For data analysis
    'typescript-expert'       // For technical positioning
  ]

  private readonly FORTUNE_1000_INDUSTRIES = [
    'Energy', 'Oil & Gas', 'Industrial', 'Aerospace', 'Defense', 
    'Manufacturing', 'Utilities', 'Mining', 'Chemicals'
  ]

  private readonly EXECUTIVE_PERSONAS = [
    'CMO', 'VP Marketing', 'VP Communications', 'ESG Leader', 
    'Brand Leader', 'Sr Director Marketing', 'Chief Marketing Officer',
    'HR Director', 'Talent Acquisition', 'Corporate Communications',
    'Internal Communications', 'External Communications'
  ]

  async processCompanyContext(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    // 1. Pre-meeting intelligence gathering
    if (context.meeting && this.isUpcomingMeeting(context.meeting)) {
      const intel = await this.generatePreMeetingIntel(context)
      results.push(...intel)
    }

    // 2. Post-meeting follow-up automation
    if (context.meeting && this.isRecentCompletedMeeting(context.meeting)) {
      const followup = await this.generatePostMeetingFollowup(context)
      results.push(...followup)
    }

    // 3. New opportunity analysis
    if (context.opportunity && this.isNewOpportunity(context.opportunity)) {
      const analysis = await this.generateOpportunityAnalysis(context)
      results.push(...analysis)
    }

    // 4. Market intelligence alerts
    const marketIntel = await this.generateMarketIntelligence(context)
    results.push(...marketIntel)

    // 5. Executive engagement opportunities
    const engagement = await this.generateExecutiveEngagement(context)
    results.push(...engagement)

    // 6. Getty Images account expansion opportunities
    const expansion = await this.generateAccountExpansion(context)
    results.push(...expansion)

    // 7. Visual content strategy recommendations
    const visualStrategy = await this.generateVisualContentStrategy(context)
    results.push(...visualStrategy)

    return results.filter(r => r.actionable).sort((a, b) => b.priority - a.priority)
  }

  private async generatePreMeetingIntel(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    if (!context.company || !context.contact) return results

    // Get latest market intelligence
    const marketIntel = await this.getMarketIntelligence(context.company.name, context.company.subIndustry)
    
    // Generate pre-meeting brief
    const briefTask = `Create a comprehensive pre-meeting brief for ${context.contact.firstName} ${context.contact.lastName} (${context.contact.role}) at ${context.company.name} in ${context.company.subIndustry}.

Include:
1. Recent company news and market position (last 30 days)
2. Likely priorities and pain points for this role
3. 5 discovery questions tailored to their industry challenges
4. 3 potential objections and how to address them
5. Relevant case studies or proof points
6. Suggested meeting agenda with time allocation

Market Intelligence: ${marketIntel}
Company Context: ${context.company.priorityLevel} priority`

    try {
      const gettyAccount = getAccountByName(context.company.name)
      const agent = gettyAccount ? 'getty-images-executive' : 'sales-executive'
      
      const briefResult = await subagentService.invokeSubagent({
        agent,
        task: briefTask,
        context: `Role: ${context.contact.role}, Industry: ${context.company.subIndustry}${gettyAccount ? `, Getty Tier ${gettyAccount.tier}` : ''}`,
        companyId: context.company.id
      })

      results.push({
        trigger: 'PRE_MEETING',
        agent: agent,
        task: briefTask,
        result: briefResult.answer,
        priority: gettyAccount ? (gettyAccount.tier === 1 ? 10 : gettyAccount.tier === 2 ? 8 : 6) : 9,
        actionable: true
      })
    } catch (error) {
      console.error('Pre-meeting brief generation failed:', error)
    }

    return results
  }

  private async generatePostMeetingFollowup(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    if (!context.company || !context.contact) return results

    const followupTask = `Create a professional post-meeting follow-up strategy for ${context.contact.firstName} ${context.contact.lastName} at ${context.company.name}.

Include:
1. Meeting recap email (concise, bullet-pointed)
2. Next steps with clear owners and timelines
3. 3 value-add resources to send (whitepapers, case studies, tools)
4. Follow-up sequence for the next 30 days
5. LinkedIn engagement strategy

Context: ${context.company.subIndustry} industry, ${context.contact.role} role`

    try {
      const followupResult = await subagentService.invokeSubagent({
        agent: 'sales-executive',
        task: followupTask,
        context: `Meeting completed recently, need immediate follow-up`,
        companyId: context.company.id
      })

      results.push({
        trigger: 'POST_MEETING',
        agent: 'sales-executive',
        task: followupTask,
        result: followupResult.answer,
        priority: 8,
        actionable: true
      })
    } catch (error) {
      console.error('Post-meeting followup generation failed:', error)
    }

    return results
  }

  private async generateOpportunityAnalysis(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    if (!context.opportunity || !context.company) return results

    const analysisTask = `Analyze this new opportunity: ${context.opportunity.name} at ${context.company.name} in ${context.company.subIndustry}.

Provide:
1. Win probability assessment (1-10) with reasoning
2. Key stakeholders to engage and their likely concerns
3. Competitive landscape analysis
4. 3 strategic approaches to advance this deal
5. Risk factors and mitigation strategies
6. Recommended next actions with timeline

Deal Context: ${context.opportunity.stage} stage, $${context.opportunity.value} value`

    try {
      const analysisResult = await subagentService.invokeSubagent({
        agent: 'sales-executive',
        task: analysisTask,
        context: `New opportunity analysis needed`,
        companyId: context.company.id
      })

      results.push({
        trigger: 'NEW_OPPORTUNITY',
        agent: 'sales-executive',
        task: analysisTask,
        result: analysisResult.answer,
        priority: 7,
        actionable: true
      })
    } catch (error) {
      console.error('Opportunity analysis generation failed:', error)
    }

    return results
  }

  private async generateMarketIntelligence(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    if (!context.company) return results

    // Check if we need fresh market intelligence
    const lastIntel = await this.getLastMarketIntel(context.company.id)
    const hoursSinceLastIntel = lastIntel ? 
      (Date.now() - lastIntel.getTime()) / (1000 * 60 * 60) : 24

    if (hoursSinceLastIntel < 6) return results // Don't spam with intel

    const intelTask = `Generate market intelligence brief for ${context.company.name} in ${context.company.subIndustry}.

Focus on:
1. Recent news, earnings, or announcements (last 14 days)
2. Industry trends affecting their business
3. Competitive moves or threats
4. Regulatory changes or ESG developments
5. Leadership changes or organizational updates
6. 3 conversation starters for sales outreach

Target personas: ${this.EXECUTIVE_PERSONAS.join(', ')}`

    try {
      const intelResult = await subagentService.invokeSubagent({
        agent: 'sales-executive',
        task: intelTask,
        context: `Fortune 1000 ${context.company.subIndustry} company intelligence`,
        companyId: context.company.id
      })

      results.push({
        trigger: 'MARKET_INTEL',
        agent: 'sales-executive',
        task: intelTask,
        result: intelResult.answer,
        priority: 6,
        actionable: true
      })

      // Store the intel timestamp
      await this.storeMarketIntelTimestamp(context.company.id)
    } catch (error) {
      console.error('Market intelligence generation failed:', error)
    }

    return results
  }

  private async generateExecutiveEngagement(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    if (!context.company || !context.contact) return results

    // Check if this is a high-value executive
    if (!this.EXECUTIVE_PERSONAS.some(role => 
      context.contact?.role?.toLowerCase().includes(role.toLowerCase())
    )) return results

    const engagementTask = `Create executive engagement strategy for ${context.contact.firstName} ${context.contact.lastName} (${context.contact.role}) at ${context.company.name}.

Include:
1. 3 LinkedIn content engagement opportunities
2. Executive-level value proposition (2-3 sentences)
3. Industry-specific insights to share
4. 2 strategic questions to ask in next conversation
5. Recommended meeting format (executive brief vs demo)

Industry: ${context.company.subIndustry}, Company Size: Fortune 1000`

    try {
      const engagementResult = await subagentService.invokeSubagent({
        agent: 'sales-executive',
        task: engagementTask,
        context: `Executive engagement for ${context.contact.role}`,
        companyId: context.company.id
      })

      results.push({
        trigger: 'EXECUTIVE_ENGAGEMENT',
        agent: 'sales-executive',
        task: engagementTask,
        result: engagementResult.answer,
        priority: 8,
        actionable: true
      })
    } catch (error) {
      console.error('Executive engagement generation failed:', error)
    }

    return results
  }

  private async generateAccountExpansion(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    if (!context.company) return results

    // Check if this is a known Getty Images account
    const gettyAccount = getAccountByName(context.company.name)
    if (!gettyAccount) return results

    const expansionTask = `Analyze Getty Images account expansion opportunities for ${context.company.name} (Tier ${gettyAccount.tier}, Priority ${gettyAccount.priority}).

Account Context:
- Industry: ${gettyAccount.industry}
- Subsidiaries: ${gettyAccount.subsidiaries.join(', ')}
- Key Departments: ${gettyAccount.keyDepartments.join(', ')}
- Current Visual Content Needs: ${gettyAccount.visualContentNeeds.join(', ')}
- Growth Potential: ${gettyAccount.growthPotential}

Provide:
1. Revenue expansion opportunities (specific dollar potential)
2. New departments to target (HR, ESG, Internal Communications, Engineering)
3. Subsidiary expansion strategy
4. Cross-selling opportunities within existing departments
5. Competitive displacement strategy (vs Shutterstock, Adobe Stock, iStock)
6. Visual content portfolio expansion recommendations
7. Next 90-day action plan with specific stakeholders

Focus on immediate revenue impact and long-term account growth.`

    try {
      const expansionResult = await subagentService.invokeSubagent({
        agent: 'getty-images-executive',
        task: expansionTask,
        context: `Getty Images account expansion for ${gettyAccount.tier === 1 ? 'Tier 1' : gettyAccount.tier === 2 ? 'Tier 2' : 'Tier 3'} account`,
        companyId: context.company.id
      })

      results.push({
        trigger: 'ACCOUNT_EXPANSION',
        agent: 'getty-images-executive',
        task: expansionTask,
        result: expansionResult.answer,
        priority: gettyAccount.tier === 1 ? 9 : gettyAccount.tier === 2 ? 7 : 5,
        actionable: true
      })
    } catch (error) {
      console.error('Account expansion generation failed:', error)
    }

    return results
  }

  private async generateVisualContentStrategy(context: AutoSubagentContext): Promise<AutoSubagentResult[]> {
    const results: AutoSubagentResult[] = []
    
    if (!context.company) return results

    const gettyAccount = getAccountByName(context.company.name)
    if (!gettyAccount) return results

    const strategyTask = `Create Getty Images visual content strategy for ${context.company.name} in ${gettyAccount.industry}.

Account Profile:
- Tier: ${gettyAccount.tier}
- Priority: ${gettyAccount.priority}
- Industry: ${gettyAccount.industry}
- Current Content Needs: ${gettyAccount.visualContentNeeds.join(', ')}
- Key Departments: ${gettyAccount.keyDepartments.join(', ')}

Strategy Requirements:
1. Visual content recommendations by department and use case
2. Getty Images exclusive content opportunities
3. Content calendar suggestions for key campaigns
4. Industry-specific visual trends and opportunities
5. Competitive advantage over Shutterstock/Adobe Stock/iStock
6. Rights management and licensing recommendations
7. Content performance metrics and ROI tracking
8. Budget allocation recommendations by content category

Focus on driving visual content consumption and revenue growth.`

    try {
      const strategyResult = await subagentService.invokeSubagent({
        agent: 'getty-images-executive',
        task: strategyTask,
        context: `Visual content strategy for ${gettyAccount.industry} industry`,
        companyId: context.company.id
      })

      results.push({
        trigger: 'VISUAL_CONTENT_STRATEGY',
        agent: 'getty-images-executive',
        task: strategyTask,
        result: strategyResult.answer,
        priority: gettyAccount.tier === 1 ? 8 : gettyAccount.tier === 2 ? 6 : 4,
        actionable: true
      })
    } catch (error) {
      console.error('Visual content strategy generation failed:', error)
    }

    return results
  }

  private async getMarketIntelligence(companyName: string, industry: string): Promise<string> {
    try {
      const query = `Latest news, earnings, leadership changes, and industry developments for ${companyName} in ${industry} (last 30 days). Focus on Fortune 1000 energy, industrial, aerospace, and defense companies.`
      const response = await perplexityService.query(query)
      return response.answer
    } catch (error) {
      console.error('Market intelligence query failed:', error)
      return 'Market intelligence unavailable'
    }
  }

  private async getLastMarketIntel(companyId: string): Promise<Date | null> {
    try {
      const lastIntel = await db.accountSignal.findFirst({
        where: {
          companyId,
          source: 'auto_subagent',
          title: { contains: 'Market Intelligence' }
        },
        orderBy: { detectedAt: 'desc' }
      })
      return lastIntel?.detectedAt || null
    } catch (error) {
      console.error('Error fetching last market intel:', error)
      return null
    }
  }

  private async storeMarketIntelTimestamp(companyId: string): Promise<void> {
    try {
      await db.accountSignal.create({
        data: {
          title: 'Market Intelligence Update',
          summary: 'Auto-generated market intelligence',
          source: 'auto_subagent',
          url: '',
          detectedAt: new Date(),
          tags: ['market_intel', 'auto_generated'],
          provenance: JSON.stringify({ timestamp: new Date() }),
          companyId
        }
      })
    } catch (error) {
      console.error('Error storing market intel timestamp:', error)
    }
  }

  private isUpcomingMeeting(meeting: Meeting): boolean {
    const now = new Date()
    const meetingTime = new Date(meeting.scheduledAt)
    const hoursUntil = (meetingTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntil > 0 && hoursUntil <= 24 // Next 24 hours
  }

  private isRecentCompletedMeeting(meeting: Meeting): boolean {
    const now = new Date()
    const meetingTime = new Date(meeting.createdAt)
    const hoursSince = (now.getTime() - meetingTime.getTime()) / (1000 * 60 * 60)
    return meeting.status === 'COMPLETED' && hoursSince <= 2 // Last 2 hours
  }

  private isNewOpportunity(opportunity: Opportunity): boolean {
    const now = new Date()
    const createdTime = new Date(opportunity.createdAt)
    const hoursSince = (now.getTime() - createdTime.getTime()) / (1000 * 60 * 60)
    return hoursSince <= 24 // Last 24 hours
  }
}

export const autoSubagentOrchestrator = new AutoSubagentOrchestrator()
