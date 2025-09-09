import { getAgentRegistry } from './registry';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Attempt to auto-register external Subagents from external/Subagents-collection
 */
export async function registerExternalSubagents(): Promise<void> {
  const registry = getAgentRegistry();
  const subagentsPath = path.join(process.cwd(), 'external', 'Subagents-collection');

  try {
    // Check if the subagents directory exists
    if (!fs.existsSync(subagentsPath)) {
      console.log('External Subagents-collection directory not found, skipping external agent registration');
      return;
    }

    // Check if directory has content
    const files = fs.readdirSync(subagentsPath);
    if (files.length === 0) {
      console.log('External Subagents-collection is empty, skipping external agent registration');
      return;
    }

    console.log('Attempting to register external subagents from:', subagentsPath);

    // Look for agent definition files
    const agentFiles = files.filter(file => 
      file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.json')
    );

    let registeredCount = 0;

    for (const file of agentFiles) {
      try {
        const filePath = path.join(subagentsPath, file);
        
        // Try to load the agent
        if (file.endsWith('.json')) {
          // JSON-based agent definition
          const agentDef = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          if (isValidAgentDefinition(agentDef)) {
            const agent = createAgentFromDefinition(agentDef);
            registry.register(agent, 'external');
            registeredCount++;
          }
        } else {
          // JavaScript/TypeScript module
          try {
            const agentModule = require(filePath);
            const agent = agentModule.default || agentModule;
            
            if (isValidAgent(agent)) {
              registry.register(agent, 'external');
              registeredCount++;
            }
          } catch (moduleError) {
            console.warn(`Could not load agent module ${file}:`, moduleError);
          }
        }
      } catch (error) {
        console.warn(`Error loading external agent from ${file}:`, error);
      }
    }

    console.log(`Successfully registered ${registeredCount} external subagents`);

  } catch (error) {
    console.error('Error registering external subagents:', error);
  }
}

/**
 * Check if an object is a valid agent definition
 */
function isValidAgentDefinition(def: any): boolean {
  return (
    def &&
    typeof def.id === 'string' &&
    typeof def.name === 'string' &&
    typeof def.description === 'string' &&
    Array.isArray(def.capabilities) &&
    def.capabilities.length > 0
  );
}

/**
 * Check if an object is a valid agent instance
 */
function isValidAgent(agent: any): boolean {
  return (
    agent &&
    typeof agent.id === 'string' &&
    typeof agent.name === 'string' &&
    typeof agent.description === 'string' &&
    Array.isArray(agent.capabilities) &&
    agent.capabilities.length > 0 &&
    typeof agent.execute === 'function' &&
    typeof agent.canHandle === 'function'
  );
}

/**
 * Create an agent instance from a JSON definition
 */
function createAgentFromDefinition(def: any): any {
  // This is a simplified implementation
  // In a real scenario, you'd need more sophisticated agent creation logic
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    capabilities: def.capabilities,
    version: def.version || '1.0.0',
    
    execute: async (context: any) => {
      // Placeholder implementation for JSON-defined agents
      console.log(`Executing JSON-defined agent: ${def.id}`);
      return {
        ok: true,
        data: { message: `Agent ${def.id} executed successfully (placeholder)` },
        metadata: { duration: 100 },
      };
    },
    
    canHandle: (capability: string, context: any) => {
      return def.capabilities.includes(capability);
    },
  };
}

export default registerExternalSubagents;