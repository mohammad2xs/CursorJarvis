import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function getPriorityColor(priority: number) {
  switch (priority) {
    case 5:
      return "text-red-600 bg-red-50"
    case 4:
      return "text-orange-600 bg-orange-50"
    case 3:
      return "text-yellow-600 bg-yellow-50"
    case 2:
      return "text-blue-600 bg-blue-50"
    case 1:
      return "text-gray-600 bg-gray-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getEnergyColor(energyLevel: number | string) {
  if (typeof energyLevel === 'string') {
    switch (energyLevel.toUpperCase()) {
      case 'HIGH':
        return "text-green-600 bg-green-50"
      case 'MEDIUM':
        return "text-blue-600 bg-blue-50"
      case 'LOW':
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }
  
  switch (energyLevel) {
    case 5:
      return "text-green-600 bg-green-50"
    case 4:
      return "text-blue-600 bg-blue-50"
    case 3:
      return "text-yellow-600 bg-yellow-50"
    case 2:
      return "text-orange-600 bg-orange-50"
    case 1:
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getEnergyIcon(energyLevel: number | string) {
  if (typeof energyLevel === 'string') {
    switch (energyLevel.toUpperCase()) {
      case 'HIGH':
        return "⚡"
      case 'MEDIUM':
        return "🔥"
      case 'LOW':
        return "😴"
      default:
        return "❓"
    }
  }
  
  switch (energyLevel) {
    case 5:
      return "⚡"
    case 4:
      return "🔥"
    case 3:
      return "💪"
    case 2:
      return "😴"
    case 1:
      return "😵"
    default:
      return "❓"
  }
}

export function getTypeIcon(type: string) {
  switch (type.toUpperCase()) {
    case 'MEETING':
      return "📅"
    case 'TASK':
      return "✅"
    case 'CALL':
      return "📞"
    case 'EMAIL':
      return "📧"
    case 'RESEARCH':
      return "🔍"
    case 'FOLLOW_UP':
      return "🔄"
    case 'DEMO':
      return "🎯"
    case 'PROPOSAL':
      return "📋"
    default:
      return "📝"
  }
}

export function getStageColor(stage: string) {
  switch (stage) {
    case "DISCOVER":
      return "text-blue-600 bg-blue-50"
    case "EVALUATE":
      return "text-yellow-600 bg-yellow-50"
    case "PROPOSE":
      return "text-orange-600 bg-orange-50"
    case "NEGOTIATE":
      return "text-purple-600 bg-purple-50"
    case "CLOSE_WON":
      return "text-green-600 bg-green-50"
    case "CLOSE_LOST":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getDealTypeColor(dealType: string) {
  switch (dealType) {
    case "NEW_LOGO":
      return "text-green-600 bg-green-50"
    case "RENEWAL":
      return "text-blue-600 bg-blue-50"
    case "UPSELL":
      return "text-purple-600 bg-purple-50"
    case "STRATEGIC":
      return "text-orange-600 bg-orange-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getSubIndustryColor(subIndustry: string) {
  switch (subIndustry) {
    case "Aerospace & Defense":
      return "text-blue-600 bg-blue-50"
    case "Oil & Gas/Energy":
      return "text-orange-600 bg-orange-50"
    case "Healthcare/MedSys":
      return "text-green-600 bg-green-50"
    case "Consumer/CPG":
      return "text-purple-600 bg-purple-50"
    case "Tech/SaaS":
      return "text-indigo-600 bg-indigo-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function calculateDaysSince(date: Date | string) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffTime = Math.abs(now.getTime() - targetDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function isOverdue(dueDate: Date | string | null) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export function getRelativeTime(date: Date | string) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffTime = now.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

/**
 * Execute multiple operations in parallel with error handling
 * Preserves tuple types so heterogeneous results keep order-specific types.
 */
export async function executeParallel<T extends readonly (() => Promise<unknown>)[]>(
  operations: T
): Promise<{ [K in keyof T]: T[K] extends () => Promise<infer R> ? R : never }> {
  try {
    const results = await Promise.all(operations.map(op => op()))
    return results as unknown as { [K in keyof T]: T[K] extends () => Promise<infer R> ? R : never }
  } catch (error) {
    console.error('Error in parallel execution:', error)
    throw error
  }
}

/**
 * Execute operation with timeout
 */
export async function executeWithTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
  })

  return Promise.race([operation(), timeoutPromise])
}
