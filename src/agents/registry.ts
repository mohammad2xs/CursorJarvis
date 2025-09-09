import { Agent, AgentCapability, AgentRegistryEntry } from './types';

/**
 * Agent Registry - Manages registration and discovery of agents
 */
export class AgentRegistry {
  private agents: Map<string, AgentRegistryEntry> = new Map();
  private capabilityMap: Map<AgentCapability, Agent[]> = new Map();

  /**
   * Register an agent in the registry
   */
  register(agent: Agent, source: 'builtin' | 'external' = 'builtin'): void {
    const entry: AgentRegistryEntry = {
      agent,
      source,
      registeredAt: new Date(),
    };

    // Register agent by ID
    this.agents.set(agent.id, entry);

    // Index by capabilities
    for (const capability of agent.capabilities) {
      if (!this.capabilityMap.has(capability)) {
        this.capabilityMap.set(capability, []);
      }
      const agents = this.capabilityMap.get(capability)!;
      
      // Avoid duplicates
      if (!agents.find(a => a.id === agent.id)) {
        agents.push(agent);
      }
    }

    console.log(`Registered agent: ${agent.id} (${source}) with capabilities: ${agent.capabilities.join(', ')}`);
  }

  /**
   * Unregister an agent from the registry
   */
  unregister(agentId: string): boolean {
    const entry = this.agents.get(agentId);
    if (!entry) {
      return false;
    }

    // Remove from main registry
    this.agents.delete(agentId);

    // Remove from capability map
    for (const capability of entry.agent.capabilities) {
      const agents = this.capabilityMap.get(capability);
      if (agents) {
        const index = agents.findIndex(a => a.id === agentId);
        if (index >= 0) {
          agents.splice(index, 1);
        }
        
        // Clean up empty capability entries
        if (agents.length === 0) {
          this.capabilityMap.delete(capability);
        }
      }
    }

    console.log(`Unregistered agent: ${agentId}`);
    return true;
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): Agent | null {
    return this.agents.get(agentId)?.agent || null;
  }

  /**
   * Get all agents that support a specific capability
   */
  getAgentsByCapability(capability: AgentCapability): Agent[] {
    return this.capabilityMap.get(capability) || [];
  }

  /**
   * Get the best agent for a capability (first registered, built-in preferred)
   */
  getBestAgentForCapability(capability: AgentCapability): Agent | null {
    const agents = this.getAgentsByCapability(capability);
    if (agents.length === 0) {
      return null;
    }

    // Prefer built-in agents over external ones
    const builtinAgents = agents.filter(agent => {
      const entry = this.agents.get(agent.id);
      return entry?.source === 'builtin';
    });

    if (builtinAgents.length > 0) {
      return builtinAgents[0];
    }

    return agents[0];
  }

  /**
   * List all registered agents
   */
  listAgents(): AgentRegistryEntry[] {
    return Array.from(this.agents.values());
  }

  /**
   * List all supported capabilities
   */
  listCapabilities(): AgentCapability[] {
    return Array.from(this.capabilityMap.keys());
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalAgents: number;
    builtinAgents: number;
    externalAgents: number;
    capabilities: number;
  } {
    const entries = this.listAgents();
    const builtinAgents = entries.filter(e => e.source === 'builtin').length;
    const externalAgents = entries.filter(e => e.source === 'external').length;

    return {
      totalAgents: entries.length,
      builtinAgents,
      externalAgents,
      capabilities: this.capabilityMap.size,
    };
  }

  /**
   * Clear all agents (useful for testing)
   */
  clear(): void {
    this.agents.clear();
    this.capabilityMap.clear();
  }
}

// Global registry instance
let globalRegistry: AgentRegistry | null = null;

/**
 * Get the global agent registry instance
 */
export function getAgentRegistry(): AgentRegistry {
  if (!globalRegistry) {
    globalRegistry = new AgentRegistry();
  }
  return globalRegistry;
}

/**
 * Reset the global registry (for testing)
 */
export function resetAgentRegistry(): void {
  globalRegistry = new AgentRegistry();
}

export default AgentRegistry;