export interface SubagentInvokeParams {
  agent: string
  task: string
  context?: string
  companyId?: string
}

export interface SubagentInvokeResult {
  answer: string
  sources?: { title: string; url: string; snippet: string }[]
}

// Browser-compatible subagent service
export class SubagentService {
  private static instance: SubagentService

  static getInstance(): SubagentService {
    if (!SubagentService.instance) {
      SubagentService.instance = new SubagentService()
    }
    return SubagentService.instance
  }

  async invokeSubagent(params: SubagentInvokeParams): Promise<SubagentInvokeResult> {
    try {
      const response = await fetch('/api/subagents/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`Failed to invoke subagent: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error invoking subagent:', error)
      return {
        answer: `I'm sorry, I couldn't process that request right now. Please try again later.`,
        sources: []
      }
    }
  }

  async listAvailableSubagents(): Promise<string[]> {
    try {
      const response = await fetch('/api/subagents/list')
      
      if (!response.ok) {
        throw new Error(`Failed to list subagents: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error listing subagents:', error)
      return []
    }
  }
}

// Export singleton instance
export const subagentService = SubagentService.getInstance()

// Legacy function for backward compatibility
export async function invokeSubagent(params: SubagentInvokeParams): Promise<SubagentInvokeResult> {
  return subagentService.invokeSubagent(params)
}

export function listAvailableSubagents(): string[] {
  // This will return an empty array in browser environment
  // Use subagentService.listAvailableSubagents() for async version
  return []
}


