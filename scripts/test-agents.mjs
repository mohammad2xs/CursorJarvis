#!/usr/bin/env node

/**
 * Simple test script to validate the AI agent implementation
 * Run with: node scripts/test-agents.mjs
 */

import { registerBuiltinAgents } from '../src/agents/register.builtin.js';
import { getAgentRegistry } from '../src/agents/registry.js';
import { AgentSupervisor } from '../src/agents/supervisor.js';

// Mock CoreCRM for testing
class MockCoreCRM {
  async getRecord(type, id) {
    console.log(`MockCRM: Getting ${type} record ${id}`);
    return {
      id,
      name: 'Test Record',
      email: 'test@example.com',
      company: 'Test Company',
      enrichmentSignals: [],
      activities: [],
      transcripts: [],
    };
  }

  async updateRecord(type, id, fields) {
    console.log(`MockCRM: Updating ${type} record ${id}`, fields);
    return { id, ...fields };
  }

  async createActivity(input) {
    console.log('MockCRM: Creating activity', input);
    return { id: 'activity_123', ...input };
  }

  async writeEnrichmentSignals(recordType, recordId, signals) {
    console.log(`MockCRM: Writing ${signals.length} signals to ${recordType}:${recordId}`);
    return signals.map((signal, i) => ({ id: `signal_${i}`, ...signal }));
  }

  async storeTranscript(input) {
    console.log('MockCRM: Storing transcript', input);
    return { id: 'transcript_123', ...input };
  }

  async auditAgentRun(context) {
    console.log('MockCRM: Auditing agent run', context.agentId, context.capability);
    return { id: 'audit_123', ...context };
  }

  async disconnect() {
    console.log('MockCRM: Disconnected');
  }
}

async function testAgents() {
  console.log('🤖 Testing CursorJarvis AI Agents\n');

  // Register agents
  console.log('📝 Registering built-in agents...');
  registerBuiltinAgents();

  const registry = getAgentRegistry();
  const stats = registry.getStats();
  
  console.log(`✅ Registered ${stats.totalAgents} agents with ${stats.capabilities} capabilities\n`);

  // Create supervisor with mock CRM
  const mockCRM = new MockCoreCRM();
  const supervisor = new AgentSupervisor(mockCRM);

  // Test cases
  const testCases = [
    {
      name: 'Enrichment Waterfall',
      capability: 'enrichment.waterfall',
      context: {
        recordType: 'ACCOUNT',
        recordId: 'test_account_123',
        payload: { maxCost: 50 }
      }
    },
    {
      name: 'Conversation Insights',
      capability: 'conversation.insights',
      context: {
        recordType: 'DEAL',
        recordId: 'test_deal_123',
        payload: {
          transcript: 'Customer seems very interested in our solution. They mentioned budget is approved and they want to move forward quickly. However, they are also evaluating competitors.',
          source: 'zoom'
        }
      }
    },
    {
      name: 'Sequence Creation',
      capability: 'sequence.orchestrate',
      context: {
        payload: {
          action: 'create',
          name: 'Test Enterprise Sequence',
          profile: 'Enterprise Decision Makers',
          template: 'executive'
        }
      }
    },
    {
      name: 'Lead Qualification',
      capability: 'process.autonomy',
      context: {
        recordType: 'LEAD',
        recordId: 'test_lead_123',
        payload: {
          goal: 'qualify_lead',
          parameters: {
            maxEnrichmentCost: 100,
            requireManagerApproval: false
          }
        }
      }
    }
  ];

  // Run tests
  for (const testCase of testCases) {
    console.log(`🧪 Testing: ${testCase.name}`);
    console.log(`   Capability: ${testCase.capability}`);
    
    try {
      const result = await supervisor.execute(testCase.capability, testCase.context);
      
      if (result.ok) {
        console.log(`   ✅ Success (${result.metadata?.duration}ms)`);
        console.log(`   📊 Data keys: ${Object.keys(result.data || {}).join(', ')}`);
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
    }
    
    console.log('');
  }

  // Test capability discovery
  console.log('🔍 Capability Discovery:');
  const capabilities = supervisor.getSupportedCapabilities();
  capabilities.forEach(cap => {
    const agentInfo = supervisor.getAgentInfo(cap);
    console.log(`   ${cap}: ${agentInfo?.name || 'Unknown'}`);
  });

  console.log('\n🎉 Agent testing completed!');
  await mockCRM.disconnect();
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  testAgents().catch(console.error);
}