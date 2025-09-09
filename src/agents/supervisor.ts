import { CoreCRM } from '../core/crm/CoreCRM';
import { AgentCapability, AgentTaskContext, AgentResult, AgentExecutionContext } from './types';
import { getAgentRegistry } from './registry';

/**
 * Agent Supervisor - Routes agent requests and manages execution
 */
export class AgentSupervisor {
  private coreCRM: CoreCRM;

  constructor(coreCRM: CoreCRM) {
    this.coreCRM = coreCRM;
  }

  /**
   * Execute an agent capability with the given context
   */
  async execute(capability: AgentCapability, context: AgentTaskContext): Promise<AgentResult> {
    const startTime = Date.now();
    const registry = getAgentRegistry();

    try {
      // Find an agent that can handle this capability
      const agent = registry.getBestAgentForCapability(capability);
      
      if (!agent) {
        return {
          ok: false,
          error: `No agent found for capability: ${capability}`,
          metadata: { duration: Date.now() - startTime },
        };
      }

      // Check if the agent can handle this specific context
      if (!agent.canHandle(capability, context)) {
        return {
          ok: false,
          error: `Agent ${agent.id} cannot handle this context for capability: ${capability}`,
          metadata: { duration: Date.now() - startTime },
        };
      }

      console.log(`Executing agent ${agent.id} for capability ${capability}`);

      // Create execution context
      const executionContext: AgentExecutionContext = {
        ...context,
        capability,
        coreCRM: this.coreCRM,
        startTime,
      };

      // Execute the agent
      const result = await agent.execute(executionContext);

      // Add execution metadata
      result.metadata = {
        ...result.metadata,
        duration: Date.now() - startTime,
      };

      // Audit the execution (in BaseAgent)
      console.log(`Agent ${agent.id} execution completed:`, { 
        success: result.ok, 
        duration: result.metadata.duration 
      });

      return result;

    } catch (error) {
      console.error(`Error executing agent for capability ${capability}:`, error);
      
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: { duration: Date.now() - startTime },
      };
    }
  }

  /**
   * Check if a capability is supported
   */
  isCapabilitySupported(capability: AgentCapability): boolean {
    const registry = getAgentRegistry();
    return registry.getBestAgentForCapability(capability) !== null;
  }

  /**
   * List all supported capabilities
   */
  getSupportedCapabilities(): AgentCapability[] {
    const registry = getAgentRegistry();
    return registry.listCapabilities();
  }

  /**
   * Get agent information for a capability
   */
  getAgentInfo(capability: AgentCapability): { id: string; name: string; description: string } | null {
    const registry = getAgentRegistry();
    const agent = registry.getBestAgentForCapability(capability);
    
    if (!agent) {
      return null;
    }

    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
    };
  }

  /**
   * Validate context for a capability
   */
  validateContext(capability: AgentCapability, context: AgentTaskContext): { valid: boolean; error?: string } {
    const registry = getAgentRegistry();
    const agent = registry.getBestAgentForCapability(capability);
    
    if (!agent) {
      return { valid: false, error: `No agent found for capability: ${capability}` };
    }

    if (!agent.canHandle(capability, context)) {
      return { valid: false, error: `Invalid context for capability: ${capability}` };
    }

    return { valid: true };
  }

  /**
   * Get execution history for a record
   */
  async getExecutionHistory(recordType?: string, recordId?: string, limit: number = 10): Promise<any[]> {
    try {
      return await this.coreCRM.getAgentAuditLogs(
        recordType as any, 
        recordId, 
        limit
      );
    } catch (error) {
      console.error('Error fetching execution history:', error);
      return [];
    }
  }
}

export default AgentSupervisor;