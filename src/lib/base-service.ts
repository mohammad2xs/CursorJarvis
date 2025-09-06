import { db } from './db'
import { Company, Contact, Opportunity, AccountSignal, Activity, Meeting, NBA } from '@/types'
import { CACHE_TTL } from './constants'
import { companyCache, contactCache, opportunityCache, cacheUtils } from './cache-manager'

export interface CompanyContext {
  company: Company & {
    contacts: Contact[]
    opportunities: Opportunity[]
    accountSignals: AccountSignal[]
    activities: Activity[]
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

export interface ServiceCache {
  [key: string]: {
    data: any
    timestamp: number
    ttl: number
  }
}

export abstract class BaseService {
  protected cache: ServiceCache = {}
  protected readonly defaultCacheTTL = CACHE_TTL.MEDIUM

  /**
   * Get company context with all related data
   */
  protected async getCompanyContext(
    companyId: string,
    options: {
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
    } = {}
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
      nbasLimit = 10
    } = options

    const cacheKey = `company_context_${companyId}_${JSON.stringify(options)}`
    
    // Check cache first
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return cached
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
      include: {
        contacts: includeContacts,
        opportunities: includeOpportunities,
        accountSignals: includeSignals ? {
          where: {
            detectedAt: {
              gte: new Date(Date.now() - signalsDays * 24 * 60 * 60 * 1000)
            }
          },
          orderBy: { detectedAt: 'desc' },
          take: 20
        } : false,
        activities: includeActivities ? {
          orderBy: { createdAt: 'desc' },
          take: activitiesLimit
        } : false,
        meetings: includeMeetings ? {
          orderBy: { scheduledAt: 'desc' },
          take: meetingsLimit
        } : false,
        nbas: includeNbas ? {
          orderBy: { createdAt: 'desc' },
          take: nbasLimit
        } : false
      }
    })

    if (!company) {
      throw new Error('Company not found')
    }

    const context: CompanyContext = {
      company: company as any,
      contact: company.contacts?.[0] || null,
      opportunity: company.opportunities?.[0] || null,
      recentSignals: company.accountSignals || [],
      recentActivities: company.activities || [],
      recentMeetings: company.meetings || [],
      recentNbas: company.nbas || []
    }

    // Cache the result
    this.setCache(cacheKey, context, this.defaultCacheTTL)

    return context
  }

  /**
   * Get company by ID with basic info only
   */
  protected async getCompany(companyId: string): Promise<Company> {
    const cacheKey = `company_${companyId}`
    
    const cached = companyCache.get<Company>(cacheKey)
    if (cached) {
      return cached
    }

    const company = await db.company.findUnique({
      where: { id: companyId }
    })

    if (!company) {
      throw new Error('Company not found')
    }

    companyCache.set(cacheKey, company, CACHE_TTL.LONG)
    return company
  }

  /**
   * Get contact by ID
   */
  protected async getContact(contactId: string): Promise<Contact> {
    const cacheKey = `contact_${contactId}`
    
    const cached = contactCache.get<Contact>(cacheKey)
    if (cached) {
      return cached
    }

    const contact = await db.contact.findUnique({
      where: { id: contactId },
      include: { company: true }
    })

    if (!contact) {
      throw new Error('Contact not found')
    }

    contactCache.set(cacheKey, contact, CACHE_TTL.LONG)
    return contact
  }

  /**
   * Get opportunity by ID
   */
  protected async getOpportunity(opportunityId: string): Promise<Opportunity> {
    const cacheKey = `opportunity_${opportunityId}`
    
    const cached = opportunityCache.get<Opportunity>(cacheKey)
    if (cached) {
      return cached
    }

    const opportunity = await db.opportunity.findUnique({
      where: { id: opportunityId },
      include: { 
        company: true,
        contact: true
      }
    })

    if (!opportunity) {
      throw new Error('Opportunity not found')
    }

    opportunityCache.set(cacheKey, opportunity, CACHE_TTL.LONG)
    return opportunity
  }

  /**
   * Create activity record
   */
  protected async createActivity(data: {
    companyId: string
    contactId?: string
    opportunityId?: string
    type: string
    title: string
    description: string
    metadata?: any
  }): Promise<Activity> {
    const activity = await db.activity.create({
      data: {
        companyId: data.companyId,
        contactId: data.contactId,
        opportunityId: data.opportunityId,
        type: data.type,
        title: data.title,
        description: data.description,
        metadata: data.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Invalidate related caches
    cacheUtils.clearCompanyCache(data.companyId)

    return activity
  }

  /**
   * Update activity record
   */
  protected async updateActivity(
    activityId: string,
    data: Partial<Activity>
  ): Promise<Activity> {
    const activity = await db.activity.update({
      where: { id: activityId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    // Invalidate related caches
    cacheUtils.clearCompanyCache(activity.companyId)

    return activity
  }

  /**
   * Create account signal
   */
  protected async createAccountSignal(data: {
    companyId: string
    type: string
    title: string
    description: string
    source: string
    confidence: number
    metadata?: any
  }): Promise<AccountSignal> {
    const signal = await db.accountSignal.create({
      data: {
        companyId: data.companyId,
        type: data.type,
        title: data.title,
        description: data.description,
        source: data.source,
        confidence: data.confidence,
        metadata: data.metadata || {},
        detectedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Invalidate related caches
    cacheUtils.clearCompanyCache(data.companyId)

    return signal
  }

  /**
   * Handle errors with consistent logging and formatting
   */
  protected handleError(error: unknown, context: string): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const fullContext = `${this.constructor.name}.${context}`
    
    console.error(`[${fullContext}] ${errorMessage}`, error)
    
    throw new Error(`${fullContext}: ${errorMessage}`)
  }

  /**
   * Execute database transaction with error handling
   */
  protected async executeTransaction<T>(
    transaction: (tx: any) => Promise<T>
  ): Promise<T> {
    try {
      return await db.$transaction(transaction)
    } catch (error) {
      this.handleError(error, 'executeTransaction')
    }
  }

  /**
   * Execute multiple operations in parallel with error handling
   */
  protected async executeParallel<T>(
    operations: (() => Promise<T>)[]
  ): Promise<T[]> {
    try {
      return await Promise.all(operations.map(op => op()))
    } catch (error) {
      this.handleError(error, 'executeParallel')
    }
  }

  /**
   * Execute operations with timeout
   */
  protected async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number = 30000
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
    })

    try {
      return await Promise.race([operation(), timeoutPromise])
    } catch (error) {
      this.handleError(error, 'executeWithTimeout')
    }
  }

  /**
   * Cache management methods
   */
  protected getFromCache<T>(key: string): T | null {
    const cached = this.cache[key]
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      delete this.cache[key]
      return null
    }

    return cached.data
  }

  protected setCache<T>(key: string, data: T, ttl: number = this.defaultCacheTTL): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl
    }
  }

  protected invalidateCache(pattern: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.includes(pattern)) {
        delete this.cache[key]
      }
    })
  }

  protected invalidateCompanyCache(companyId: string): void {
    cacheUtils.clearCompanyCache(companyId)
  }

  protected clearCache(): void {
    this.cache = {}
  }

  /**
   * Utility methods for common operations
   */
  protected formatDate(date: Date | string): string {
    return new Date(date).toISOString()
  }

  protected calculateDaysSince(date: Date | string): number {
    const now = new Date()
    const targetDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - targetDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  protected isOverdue(dueDate: Date | string | null): boolean {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  protected generateId(prefix: string = 'id'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Validation helpers
   */
  protected validateRequiredFields(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => 
      !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')
    )

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
  }

  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  protected validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  protected validateUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}
