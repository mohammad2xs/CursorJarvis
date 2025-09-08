import { db } from './db'
import { Company, Contact, Opportunity, AccountSignal, Activity, Meeting, NBA } from '@/types'
import { CACHE_TTL } from './constants'

export interface CompanyContextOptions {
  includeContacts?: boolean
  includeOpportunities?: boolean
  includeSignals?: boolean
  includeActivities?: boolean
  includeMeetings?: boolean
  includeNbas?: boolean
  signalsDays?: number
  activitiesLimit?: number
  meetingsLimit?: number
  nbasLimit?: number
  signalsLimit?: number
}

export interface CompanyContext {
  company: Company & {
    contacts?: Contact[]
    opportunities?: Opportunity[]
    accountSignals?: AccountSignal[]
    activities?: Activity[]
    meetings?: Meeting[]
    nbas?: NBA[]
  }
  contact?: Contact | null
  opportunity?: Opportunity | null
  recentSignals: AccountSignal[]
  recentActivities: Activity[]
  recentMeetings?: Meeting[]
  recentNbas?: NBA[]
}

export interface ContextCache {
  [key: string]: {
    data: CompanyContext
    timestamp: number
    ttl: number
  }
}

class ContextFetcher {
  private cache: ContextCache = {}
  private readonly defaultCacheTTL = CACHE_TTL.MEDIUM

  /**
   * Get comprehensive company context with all related data
   */
  async getCompanyContext(
    companyId: string,
    options: CompanyContextOptions = {}
  ): Promise<CompanyContext> {
    const {
      includeContacts = true,
      includeOpportunities = true,
      includeSignals = true,
      includeActivities = true,
      includeMeetings = false,
      includeNbas = false,
      signalsDays = 30,
      activitiesLimit = 10,
      meetingsLimit = 5,
      nbasLimit = 10,
      signalsLimit = 20
    } = options

    const cacheKey = `company_context_${companyId}_${JSON.stringify(options)}`
    
    // Check cache first (temporarily disabled for build fix)
    // const cached = this.getFromCache(cacheKey)
    // if (cached) {
    //   return cached
    // }

    // Build include object dynamically
    const include: Record<string, unknown> = {}
    
    if (includeContacts) {
      include.contacts = true
    }
    
    if (includeOpportunities) {
      include.opportunities = true
    }
    
    if (includeSignals) {
      include.accountSignals = {
        where: {
          detectedAt: {
            gte: new Date(Date.now() - signalsDays * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { detectedAt: 'desc' },
        take: signalsLimit
      }
    }
    
    if (includeActivities) {
      include.activities = {
        orderBy: { createdAt: 'desc' },
        take: activitiesLimit
      }
    }
    
    if (includeMeetings) {
      include.meetings = {
        orderBy: { scheduledAt: 'desc' },
        take: meetingsLimit
      }
    }
    
    if (includeNbas) {
      include.nbas = {
        orderBy: { createdAt: 'desc' },
        take: nbasLimit
      }
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
      include
    })

    if (!company) {
      throw new Error('Company not found')
    }

    const context: CompanyContext = {
      company: company as Company,
      contact: (company.contacts?.[0] as Contact) || null,
      opportunity: (company.opportunities?.[0] as Opportunity) || null,
      recentSignals: (company.accountSignals as AccountSignal[]) || [],
      recentActivities: (company.activities as Activity[]) || [],
      recentMeetings: (company.meetings as Meeting[]) || [],
      recentNbas: (company.nbas as NBA[]) || []
    }

    // Cache the result
    this.setCache(cacheKey, context, this.defaultCacheTTL)

    return context
  }

  /**
   * Get multiple companies context in parallel
   */
  async getMultipleCompaniesContext(
    companyIds: string[],
    options: CompanyContextOptions = {}
  ): Promise<CompanyContext[]> {
    const contexts = await Promise.all(
      companyIds.map(id => this.getCompanyContext(id, options))
    )
    return contexts
  }

  /**
   * Get company with minimal data (just basic info)
   */
  async getCompanyBasic(companyId: string): Promise<Company> {
    const cacheKey = `company_basic_${companyId}`
    
    // const cached = this.getFromCache(cacheKey)
    // if (cached) {
    //   return cached.company
    // }

    const company = await db.company.findUnique({
      where: { id: companyId }
    })

    if (!company) {
      throw new Error('Company not found')
    }

    this.setCache(cacheKey, { company, recentSignals: [], recentActivities: [] } as CompanyContext, CACHE_TTL.LONG)
    return company
  }

  /**
   * Get contacts for a company
   */
  async getCompanyContacts(companyId: string, limit: number = 50): Promise<Contact[]> {
    const cacheKey = `company_contacts_${companyId}_${limit}`
    
    // const cached = this.getFromCache(cacheKey)
    // if (cached) {
    //   return cached.company.contacts || []
    // }

    const contacts = await db.contact.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Cache with minimal context
    this.setCache(cacheKey, {
      company: { id: companyId } as Company,
      contacts,
      recentSignals: [],
      recentActivities: []
    } as CompanyContext, CACHE_TTL.MEDIUM)

    return contacts
  }

  /**
   * Get opportunities for a company
   */
  async getCompanyOpportunities(companyId: string, limit: number = 50): Promise<Opportunity[]> {
    const cacheKey = `company_opportunities_${companyId}_${limit}`
    
    // const cached = this.getFromCache(cacheKey)
    // if (cached) {
    //   return cached.company.opportunities || []
    // }

    const opportunities = await db.opportunity.findMany({
      where: { companyId },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Cache with minimal context
    this.setCache(cacheKey, {
      company: { id: companyId } as Company,
      opportunities,
      recentSignals: [],
      recentActivities: []
    } as CompanyContext, CACHE_TTL.MEDIUM)

    return opportunities
  }

  /**
   * Get recent account signals for a company
   */
  async getCompanySignals(
    companyId: string, 
    days: number = 30, 
    limit: number = 20
  ): Promise<AccountSignal[]> {
    const cacheKey = `company_signals_${companyId}_${days}_${limit}`
    
    // const cached = this.getFromCache(cacheKey)
    // if (cached) {
    //   return cached.recentSignals
    // }

    const signals = await db.accountSignal.findMany({
      where: {
        companyId,
        detectedAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { detectedAt: 'desc' },
      take: limit
    })

    // Cache with minimal context
    this.setCache(cacheKey, {
      company: { id: companyId } as Company,
      recentSignals: signals,
      recentActivities: []
    } as CompanyContext, CACHE_TTL.SHORT)

    return signals
  }

  /**
   * Get recent activities for a company
   */
  async getCompanyActivities(companyId: string, limit: number = 20): Promise<Activity[]> {
    const cacheKey = `company_activities_${companyId}_${limit}`
    
    // const cached = this.getFromCache(cacheKey)
    // if (cached) {
    //   return cached.recentActivities
    // }

    const activities = await db.activity.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Cache with minimal context
    this.setCache(cacheKey, {
      company: { id: companyId } as Company,
      recentSignals: [],
      recentActivities: activities
    } as CompanyContext, CACHE_TTL.SHORT)

    return activities
  }

  /**
   * Get NBA context for a company
   */
  async getNBAContext(companyId: string): Promise<{
    company: Company
    contact: Contact | null
    opportunity: Opportunity | null
    recentSignals: AccountSignal[]
    recentActivities: Activity[]
  }> {
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
      contact: context.contact || null,
      opportunity: context.opportunity || null,
      recentSignals: context.recentSignals,
      recentActivities: context.recentActivities
    }
  }

  /**
   * Invalidate cache for a specific company
   */
  invalidateCompanyCache(companyId: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.includes(`company_${companyId}`)) {
        delete this.cache[key]
      }
    })
  }

  /**
   * Invalidate all cache
   */
  clearCache(): void {
    this.cache = {}
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number
    keys: string[]
    hitRate?: number
  } {
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache)
    }
  }

  /**
   * Private cache methods
   */
  private getFromCache(key: string): CompanyContext | null {
    const cached = this.cache[key]
    if (!cached || !cached.data) return null

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      delete this.cache[key]
      return null
    }

    return cached.data
  }

  private setCache(key: string, data: CompanyContext, ttl: number = this.defaultCacheTTL): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl
    }
  }
}

// Export singleton instance
export const contextFetcher = new ContextFetcher()

// Export class for testing
export { ContextFetcher }
