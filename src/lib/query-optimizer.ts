import { db } from './db'
import { Prisma } from '@prisma/client'
import { Company, Contact, Opportunity, NBA, Activity, Meeting, AccountSignal } from '@/types'

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: Record<string, 'asc' | 'desc'>
  where?: Record<string, unknown>
  include?: Record<string, boolean | object>
  select?: Record<string, boolean>
}

export interface PaginationOptions {
  page?: number
  pageSize?: number
  maxPageSize?: number
}

export interface QueryResult<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class QueryOptimizer {
  /**
   * Optimize company queries with proper indexing and pagination
   */
  static async getCompanies(
    options: QueryOptions & PaginationOptions = {}
  ): Promise<QueryResult<Company>> {
    const {
      page = 1,
      pageSize = 20,
      maxPageSize = 100,
      limit,
      offset,
      orderBy = { createdAt: 'desc' },
      where = {},
      include = {}
    } = options

    const safePageSize = Math.min(pageSize, maxPageSize)
    const skip = offset || (page - 1) * safePageSize
    const take = limit || safePageSize

    // Get total count for pagination
    const total = await db.company.count({ where })

    // Get data with optimized query
    const data = await db.company.findMany({
      where,
      include,
      orderBy,
      skip,
      take
    })

    const totalPages = Math.ceil(total / safePageSize)

    return {
      data,
      pagination: {
        page,
        pageSize: safePageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Optimize contact queries with company joins
   */
  static async getContacts(
    options: QueryOptions & PaginationOptions = {}
  ): Promise<QueryResult<Contact>> {
    const {
      page = 1,
      pageSize = 20,
      maxPageSize = 100,
      limit,
      offset,
      orderBy = { createdAt: 'desc' },
      where = {},
      include = { company: true }
    } = options

    const safePageSize = Math.min(pageSize, maxPageSize)
    const skip = offset || (page - 1) * safePageSize
    const take = limit || safePageSize

    const total = await db.contact.count({ where })

    const data = await db.contact.findMany({
      where,
      include,
      orderBy,
      skip,
      take
    })

    const totalPages = Math.ceil(total / safePageSize)

    return {
      data,
      pagination: {
        page,
        pageSize: safePageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Optimize opportunity queries with related data
   */
  static async getOpportunities(
    options: QueryOptions & PaginationOptions = {}
  ): Promise<QueryResult<Opportunity>> {
    const {
      page = 1,
      pageSize = 20,
      maxPageSize = 100,
      limit,
      offset,
      orderBy = { createdAt: 'desc' },
      where = {},
      include = { 
        company: true, 
        contact: true 
      }
    } = options

    const safePageSize = Math.min(pageSize, maxPageSize)
    const skip = offset || (page - 1) * safePageSize
    const take = limit || safePageSize

    const total = await db.opportunity.count({ where })

    const data = await db.opportunity.findMany({
      where,
      include,
      orderBy,
      skip,
      take
    })

    const totalPages = Math.ceil(total / safePageSize)

    return {
      data,
      pagination: {
        page,
        pageSize: safePageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Get NBA data with optimized queries
   */
  static async getNBAs(
    options: QueryOptions & PaginationOptions = {}
  ): Promise<QueryResult<NBA>> {
    const {
      page = 1,
      pageSize = 20,
      maxPageSize = 100,
      limit,
      offset,
      orderBy = { priority: 'desc', createdAt: 'desc' },
      where = {},
      include = { company: true }
    } = options

    const safePageSize = Math.min(pageSize, maxPageSize)
    const skip = offset || (page - 1) * safePageSize
    const take = limit || safePageSize

    const total = await db.nBA.count({ where })

    const data = await db.nBA.findMany({
      where,
      include,
      orderBy,
      skip,
      take
    })

    const totalPages = Math.ceil(total / safePageSize)

    return {
      data,
      pagination: {
        page,
        pageSize: safePageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Get account signals with time-based filtering
   */
  static async getAccountSignals(
    companyId: string,
    options: {
      days?: number
      limit?: number
      signalTypes?: string[]
      orderBy?: Record<string, 'asc' | 'desc'>
    } = {}
  ): Promise<AccountSignal[]> {
    const {
      days = 30,
      limit = 50,
      signalTypes = [],
      orderBy = { detectedAt: 'desc' }
    } = options

    const where: Record<string, unknown> = {
      companyId,
      detectedAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    }

    if (signalTypes.length > 0) {
      where.type = { in: signalTypes }
    }

    return await db.accountSignal.findMany({
      where,
      orderBy,
      take: limit
    })
  }

  /**
   * Get activities with optimized queries
   */
  static async getActivities(
    options: QueryOptions & PaginationOptions = {}
  ): Promise<QueryResult<Activity>> {
    const {
      page = 1,
      pageSize = 20,
      maxPageSize = 100,
      limit,
      offset,
      orderBy = { createdAt: 'desc' },
      where = {},
      include = { company: true, contact: true, opportunity: true }
    } = options

    const safePageSize = Math.min(pageSize, maxPageSize)
    const skip = offset || (page - 1) * safePageSize
    const take = limit || safePageSize

    const total = await db.activity.count({ where })

    const data = await db.activity.findMany({
      where,
      include,
      orderBy,
      skip,
      take
    })

    const totalPages = Math.ceil(total / safePageSize)

    return {
      data,
      pagination: {
        page,
        pageSize: safePageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Get meetings with optimized queries
   */
  static async getMeetings(
    options: QueryOptions & PaginationOptions = {}
  ): Promise<QueryResult<Meeting>> {
    const {
      page = 1,
      pageSize = 20,
      maxPageSize = 100,
      limit,
      offset,
      orderBy = { scheduledAt: 'desc' },
      where = {},
      include = { company: true, contact: true }
    } = options

    const safePageSize = Math.min(pageSize, maxPageSize)
    const skip = offset || (page - 1) * safePageSize
    const take = limit || safePageSize

    const total = await db.meeting.count({ where })

    const data = await db.meeting.findMany({
      where,
      include,
      orderBy,
      skip,
      take
    })

    const totalPages = Math.ceil(total / safePageSize)

    return {
      data,
      pagination: {
        page,
        pageSize: safePageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Execute raw SQL queries for complex operations
   */
  static async executeRawQuery<T = unknown>(
    query: string,
    params: unknown[] = []
  ): Promise<T[]> {
    return await db.$queryRaw<T[]>(Prisma.sql([query], ...params))
  }

  /**
   * Get aggregated statistics
   */
  static async getCompanyStats(companyId: string): Promise<{
    totalContacts: number
    totalOpportunities: number
    totalActivities: number
    totalSignals: number
    totalMeetings: number
    totalNbas: number
    recentActivityCount: number
    upcomingMeetingsCount: number
  }> {
    const [
      totalContacts,
      totalOpportunities,
      totalActivities,
      totalSignals,
      totalMeetings,
      totalNbas,
      recentActivityCount,
      upcomingMeetingsCount
    ] = await Promise.all([
      db.contact.count({ where: { companyId } }),
      db.opportunity.count({ where: { companyId } }),
      db.activity.count({ where: { companyId } }),
      db.accountSignal.count({ where: { companyId } }),
      db.meeting.count({ where: { companyId } }),
      db.nBA.count({ where: { companyId } }),
      db.activity.count({
        where: {
          companyId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      db.meeting.count({
        where: {
          companyId,
          status: 'SCHEDULED',
          scheduledAt: {
            gte: new Date()
          }
        }
      })
    ])

    return {
      totalContacts,
      totalOpportunities,
      totalActivities,
      totalSignals,
      totalMeetings,
      totalNbas,
      recentActivityCount,
      upcomingMeetingsCount
    }
  }

  /**
   * Get dashboard data with optimized queries
   */
  static async getDashboardData(companyId: string): Promise<{
    company: Company
    recentActivities: Activity[]
    recentSignals: AccountSignal[]
    upcomingMeetings: Meeting[]
    recentNbas: NBA[]
    stats: Record<string, unknown>
  }> {
    const [
      company,
      recentActivities,
      recentSignals,
      upcomingMeetings,
      recentNbas,
      stats
    ] = await Promise.all([
      db.company.findUniqueOrThrow({
        where: { id: companyId },
        include: {
          contacts: { take: 5, orderBy: { createdAt: 'desc' } },
          opportunities: { take: 5, orderBy: { createdAt: 'desc' } }
        }
      }),
      db.activity.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { contact: true, opportunity: true }
      }),
      db.accountSignal.findMany({
        where: {
          companyId,
          detectedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { detectedAt: 'desc' },
        take: 10
      }),
      db.meeting.findMany({
        where: {
          companyId,
          status: 'SCHEDULED',
          scheduledAt: {
            gte: new Date()
          }
        },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
        include: { contact: true }
      }),
      db.nBA.findMany({
        where: { companyId },
        orderBy: { priority: 'desc', createdAt: 'desc' },
        take: 10,
        include: { company: true }
      }),
      this.getCompanyStats(companyId)
    ])

    return {
      company,
      recentActivities,
      recentSignals,
      upcomingMeetings,
      recentNbas,
      stats
    }
  }

  /**
   * Batch operations for better performance
   */
  static async batchCreate<T, M extends { createMany: (args: { data: T[]; skipDuplicates?: boolean }) => Promise<{ count: number }> }>(
    model: M,
    data: T[]
  ): Promise<{ count: number }> {
    return await model.createMany({
      data,
      skipDuplicates: true
    })
  }

  static async batchUpdate<T, M extends { update: (args: { where: Record<string, unknown>; data: T }) => Promise<unknown> }>(
    model: M,
    data: Array<{ where: Record<string, unknown>; data: T }>
  ): Promise<void> {
    await Promise.all(
      data.map(({ where, data }) => model.update({ where, data }))
    )
  }

  static async batchDelete<M extends { deleteMany: (args: { where: Record<string, unknown> }) => Promise<{ count: number }> }>(
    model: M,
    where: Record<string, unknown>
  ): Promise<{ count: number }> {
    return await model.deleteMany({ where })
  }
}

export default QueryOptimizer
