import { getAgentRegistry } from './registry';

// Import built-in agents
import WaterfallEnrichmentAgent from './enrichment/waterfall';
import ConversationInsightsAgent from './conversation/insights';
import SequenceOrchestratorAgent from './sequences/orchestrator';
import ProcessAutonomyAgent from './process/autonomy';

/**
 * Register all built-in agents
 */
export function registerBuiltinAgents(): void {
  const registry = getAgentRegistry();

  // Register enrichment agents
  registry.register(new WaterfallEnrichmentAgent(), 'builtin');

  // Register conversation intelligence agents
  registry.register(new ConversationInsightsAgent(), 'builtin');

  // Register sales execution agents
  registry.register(new SequenceOrchestratorAgent(), 'builtin');

  // Register process autonomy agents
  registry.register(new ProcessAutonomyAgent(), 'builtin');

  console.log('Built-in agents registered successfully');
}

export default registerBuiltinAgents;