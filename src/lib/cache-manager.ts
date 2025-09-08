import { CACHE_TTL } from './constants'

export interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

export interface CacheStats {
  size: number
  hitRate: number
  missRate: number
  evictions: number
  memoryUsage: number
}

export interface CacheOptions {
  ttl?: number
  maxSize?: number
  enableStats?: boolean
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map()
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    sets: 0
  }
  private maxSize: number
  private enableStats: boolean

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000
    this.enableStats = options.enableStats || true
  }

  /**
   * Get value from cache
   */
  get<T = unknown>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      if (this.enableStats) this.stats.misses++
      return null
    }

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      if (this.enableStats) this.stats.misses++
      return null
    }

    if (this.enableStats) this.stats.hits++
    return entry.data as T
  }

  /**
   * Set value in cache
   */
  set<T = unknown>(key: string, data: T, ttl: number = CACHE_TTL.MEDIUM): void {
    // Check if we need to evict
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key
    }

    this.cache.set(key, entry)
    if (this.enableStats) this.stats.sets++
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
    if (this.enableStats) {
      this.stats = {
        hits: 0,
        misses: 0,
        evictions: 0,
        sets: 0
      }
    }
  }

  /**
   * Clear expired entries
   */
  clearExpired(): number {
    const now = Date.now()
    let cleared = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        cleared++
      }
    }

    return cleared
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0
    const missRate = total > 0 ? (this.stats.misses / total) * 100 : 0

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round(missRate * 100) / 100,
      evictions: this.stats.evictions,
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: string | RegExp): number {
    let invalidated = 0
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern)

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        invalidated++
      }
    }

    return invalidated
  }

  /**
   * Set multiple values at once
   */
  setMany<T = unknown>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl = CACHE_TTL.MEDIUM }) => {
      this.set(key, data, ttl)
    })
  }

  /**
   * Get multiple values at once
   */
  getMany<T = unknown>(keys: string[]): Map<string, T | null> {
    const result = new Map<string, T | null>()
    
    keys.forEach(key => {
      result.set(key, this.get<T>(key))
    })

    return result
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(): void {
    if (this.cache.size === 0) return

    // Find oldest entry
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      if (this.enableStats) this.stats.evictions++
    }
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0
    
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2 // UTF-16 characters
      totalSize += JSON.stringify(entry).length * 2
    }

    return totalSize
  }
}

// Create singleton instances for different cache types
export const companyCache = new CacheManager({
  ttl: CACHE_TTL.LONG,
  maxSize: 500,
  enableStats: true
})

export const contactCache = new CacheManager({
  ttl: CACHE_TTL.MEDIUM,
  maxSize: 1000,
  enableStats: true
})

export const opportunityCache = new CacheManager({
  ttl: CACHE_TTL.MEDIUM,
  maxSize: 500,
  enableStats: true
})

export const nbaCache = new CacheManager({
  ttl: CACHE_TTL.SHORT,
  maxSize: 1000,
  enableStats: true
})

export const signalCache = new CacheManager({
  ttl: CACHE_TTL.SHORT,
  maxSize: 2000,
  enableStats: true
})

export const activityCache = new CacheManager({
  ttl: CACHE_TTL.SHORT,
  maxSize: 1000,
  enableStats: true
})

export const meetingCache = new CacheManager({
  ttl: CACHE_TTL.MEDIUM,
  maxSize: 500,
  enableStats: true
})

// Global cache manager for general use
export const globalCache = new CacheManager({
  ttl: CACHE_TTL.MEDIUM,
  maxSize: 2000,
  enableStats: true
})

// Cache decorator for functions
export function cached<T extends unknown[], R>(
  cache: CacheManager,
  keyGenerator: (...args: T) => string,
  ttl?: number
) {
  return function (target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: T): Promise<R> {
      const key = keyGenerator(...args)
      const cached = cache.get<R>(key)
      
      if (cached !== null) {
        return cached
      }

      const result = await method.apply(this, args)
      cache.set(key, result, ttl)
      return result
    }
  }
}

// Cache utility functions
export const cacheUtils = {
  /**
   * Generate cache key for company context
   */
  companyContextKey: (companyId: string, options: Record<string, unknown> = {}) => 
    `company_context_${companyId}_${JSON.stringify(options)}`,

  /**
   * Generate cache key for NBA context
   */
  nbaContextKey: (companyId: string) => 
    `nba_context_${companyId}`,

  /**
   * Generate cache key for dashboard data
   */
  dashboardKey: (companyId: string) => 
    `dashboard_${companyId}`,

  /**
   * Generate cache key for company stats
   */
  statsKey: (companyId: string) => 
    `stats_${companyId}`,

  /**
   * Clear all company-related cache
   */
  clearCompanyCache: (companyId: string) => {
    const pattern = new RegExp(`.*${companyId}.*`)
    companyCache.invalidatePattern(pattern)
    contactCache.invalidatePattern(pattern)
    opportunityCache.invalidatePattern(pattern)
    nbaCache.invalidatePattern(pattern)
    signalCache.invalidatePattern(pattern)
    activityCache.invalidatePattern(pattern)
    meetingCache.invalidatePattern(pattern)
    globalCache.invalidatePattern(pattern)
  },

  /**
   * Clear all caches
   */
  clearAllCaches: () => {
    companyCache.clear()
    contactCache.clear()
    opportunityCache.clear()
    nbaCache.clear()
    signalCache.clear()
    activityCache.clear()
    meetingCache.clear()
    globalCache.clear()
  },

  /**
   * Get all cache statistics
   */
  getAllStats: () => ({
    company: companyCache.getStats(),
    contact: contactCache.getStats(),
    opportunity: opportunityCache.getStats(),
    nba: nbaCache.getStats(),
    signal: signalCache.getStats(),
    activity: activityCache.getStats(),
    meeting: meetingCache.getStats(),
    global: globalCache.getStats()
  })
}

export default CacheManager
