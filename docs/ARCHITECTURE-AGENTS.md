# AI Agent Architecture

CursorJarvis implements a pluggable multi-agent architecture that enables AI-powered automation across the CRM workflow. This document describes the architecture, components, and how to extend the system.

## Overview

The agent architecture consists of several key components:

- **Agent Types**: Base interfaces and implementations for AI agents
- **Agent Registry**: Discovery and registration system for agents
- **Agent Supervisor**: Routing and execution management
- **CoreCRM**: Data access layer for CRM operations
- **API Layer**: HTTP endpoints for agent execution

## Core Components

### Agent Types (`src/agents/types.ts`)

#### Base Agent Interface
```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  version: string;
  
  execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult>;
  canHandle(capability: AgentCapability, context: AgentTaskContext): boolean;
}
```

#### Agent Capabilities
Current supported capabilities:
- `enrichment.waterfall`: Data enrichment with provider waterfall
- `research.account`: Account research and intelligence
- `conversation.insights`: Transcript analysis and insights
- `deal.predict`: Deal outcome prediction
- `sequence.orchestrate`: Multi-channel sequence automation
- `process.autonomy`: Workflow automation with guardrails

#### Base Agent Class
The `BaseAgent` abstract class provides:
- Common execution patterns
- PII redaction and safe logging
- Error handling and result formatting
- Automatic audit logging

### Agent Registry (`src/agents/registry.ts`)

The registry manages agent discovery and registration:

```typescript
class AgentRegistry {
  register(agent: Agent, source: 'builtin' | 'external'): void
  getAgent(agentId: string): Agent | null
  getAgentsByCapability(capability: AgentCapability): Agent[]
  getBestAgentForCapability(capability: AgentCapability): Agent | null
  listAgents(): AgentRegistryEntry[]
}
```

#### Agent Sources
- **Built-in**: Agents shipped with CursorJarvis
- **External**: Agents from the Subagents-collection submodule

### Agent Supervisor (`src/agents/supervisor.ts`)

The supervisor handles agent routing and execution:

```typescript
class AgentSupervisor {
  execute(capability: AgentCapability, context: AgentTaskContext): Promise<AgentResult>
  isCapabilitySupported(capability: AgentCapability): boolean
  validateContext(capability: AgentCapability, context: AgentTaskContext): ValidationResult
}
```

#### Execution Flow
1. Validate capability is supported
2. Find best agent for capability
3. Validate context for specific agent
4. Create execution context with CoreCRM
5. Execute agent
6. Handle results and audit logging

### CoreCRM Integration (`src/core/crm/CoreCRM.ts`)

Agents interact with the CRM through the CoreCRM service:

```typescript
class CoreCRM {
  // Record operations
  getRecord(type: RecordType, id: string): Promise<any>
  updateRecord(type: RecordType, id: string, fields: Record<string, any>): Promise<any>
  search(query: string): Promise<any[]>
  
  // CRM operations
  createActivity(input: ActivityInput): Promise<any>
  storeTranscript(input: TranscriptInput): Promise<any>
  writeEnrichmentSignals(recordType: RecordType, recordId: string, signals: EnrichmentSignal[]): Promise<any[]>
  enrollInSequence(sequenceId: string, recordType: RecordType, recordId: string): Promise<any>
  
  // Audit operations
  auditAgentRun(context: AgentRunContext): Promise<any>
  getAgentAuditLogs(recordType?: RecordType, recordId?: string): Promise<any[]>
}
```

## Built-in Agents

### 1. Waterfall Enrichment Agent
**Capability**: `enrichment.waterfall`, `research.account`
**Purpose**: Clay-style data enrichment using multiple providers

Features:
- Multi-provider waterfall (Clearbit, ZoomInfo, Apollo, LinkedIn)
- Cost tracking and budget enforcement
- Confidence scoring and signal aggregation
- Automatic field updates and activity creation

Example execution:
```json
{
  "capability": "enrichment.waterfall",
  "context": {
    "recordType": "ACCOUNT",
    "recordId": "acc_123",
    "payload": {
      "maxCost": 100
    }
  }
}
```

### 2. Conversation Insights Agent
**Capability**: `conversation.insights`, `deal.predict`
**Purpose**: Gong-style transcript analysis and deal prediction

Features:
- Sentiment analysis and key phrase extraction
- Objection and risk factor identification
- Deal outcome prediction
- Automated follow-up activity creation
- Deal risk score updates

Example execution:
```json
{
  "capability": "conversation.insights",
  "context": {
    "recordType": "DEAL",
    "recordId": "deal_123",
    "payload": {
      "transcript": "Customer discussion transcript...",
      "source": "zoom"
    }
  }
}
```

### 3. Sequence Orchestrator Agent
**Capability**: `sequence.orchestrate`
**Purpose**: Outreach-style multi-channel sequence automation

Features:
- Template-based sequence creation
- Multi-channel support (email, phone, LinkedIn)
- Sequence enrollment and management
- Performance analytics and optimization
- A/B testing capabilities

Example execution:
```json
{
  "capability": "sequence.orchestrate",
  "context": {
    "payload": {
      "action": "create",
      "name": "Enterprise Outreach",
      "profile": "Enterprise Decision Makers",
      "template": "executive"
    }
  }
}
```

### 4. Process Autonomy Agent
**Capability**: `process.autonomy`
**Purpose**: Pipefy-style workflow automation with guardrails

Features:
- Goal-oriented workflow execution
- Built-in guardrails and approval gates
- Lead qualification workflows
- Deal health checks
- Account expansion automation
- Renewal preparation workflows

Example execution:
```json
{
  "capability": "process.autonomy",
  "context": {
    "recordType": "LEAD",
    "recordId": "lead_123",
    "payload": {
      "goal": "qualify_lead",
      "parameters": {
        "maxEnrichmentCost": 50,
        "requireManagerApproval": true
      }
    }
  }
}
```

## API Integration

### Agent Execution Endpoint
**POST /api/agents/run**

Execute an agent capability with the given context.

Request:
```json
{
  "capability": "enrichment.waterfall",
  "context": {
    "recordType": "ACCOUNT",
    "recordId": "acc_123",
    "userId": "user_123",
    "orgId": "org_123",
    "payload": {
      "maxCost": 100
    }
  }
}
```

Response:
```json
{
  "ok": true,
  "data": {
    "enrichmentSummary": {
      "signalsAdded": 5,
      "fieldsUpdated": 2,
      "confidence": 0.85
    }
  },
  "metadata": {
    "duration": 1250,
    "tokensUsed": 450,
    "confidence": 0.85
  }
}
```

### Agent Discovery Endpoint
**GET /api/agents/run**

Get information about available capabilities and agents.

Response:
```json
{
  "ok": true,
  "data": {
    "capabilities": ["enrichment.waterfall", "conversation.insights"],
    "agents": [
      {
        "capability": "enrichment.waterfall",
        "agent": {
          "id": "enrichment-waterfall",
          "name": "Waterfall Enrichment Agent",
          "description": "Clay-style waterfall enrichment..."
        }
      }
    ],
    "stats": {
      "totalAgents": 4,
      "builtinAgents": 4,
      "externalAgents": 0,
      "capabilities": 6
    }
  }
}
```

## Extending the System

### Adding New Agents

1. **Create Agent Class**
```typescript
class MyCustomAgent extends BaseAgent {
  constructor() {
    super(
      'my-custom-agent',
      'My Custom Agent',
      'Description of what this agent does',
      ['my.capability'],
      '1.0.0'
    );
  }

  async execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult> {
    // Implementation
  }

  canHandle(capability: AgentCapability, context: AgentTaskContext): boolean {
    return capability === 'my.capability' && /* validation logic */;
  }
}
```

2. **Register Agent**
```typescript
// In register.builtin.ts
import MyCustomAgent from './my-custom/agent';

export function registerBuiltinAgents(): void {
  const registry = getAgentRegistry();
  registry.register(new MyCustomAgent(), 'builtin');
}
```

3. **Update Types**
```typescript
// In types.ts
export type AgentCapability = 
  | 'enrichment.waterfall'
  | 'my.capability' // Add new capability
  | ...;
```

### Adding External Agents

External agents can be added via the Subagents-collection submodule:

1. **Agent Definition** (JSON format)
```json
{
  "id": "external-agent",
  "name": "External Agent",
  "description": "Agent from external collection",
  "capabilities": ["external.capability"],
  "version": "1.0.0"
}
```

2. **Agent Implementation** (JavaScript/TypeScript)
```javascript
module.exports = {
  id: 'external-agent',
  name: 'External Agent',
  capabilities: ['external.capability'],
  
  execute: async (context) => {
    // Implementation
    return { ok: true, data: {} };
  },
  
  canHandle: (capability, context) => {
    return capability === 'external.capability';
  }
};
```

### Best Practices

1. **Error Handling**
   - Always use try-catch blocks
   - Return structured error responses
   - Log errors appropriately

2. **Data Safety**
   - Use PII redaction for sensitive data
   - Validate inputs thoroughly
   - Implement proper access controls

3. **Performance**
   - Implement timeouts for long-running operations
   - Use streaming for large responses
   - Monitor token usage and costs

4. **Audit Trail**
   - Log all agent executions
   - Include metadata for debugging
   - Track performance metrics

## Security Considerations

### PII Protection
- Automatic redaction in BaseAgent class
- Safe logging practices
- Secure data transmission

### Access Control
- User and organization context
- Capability-based permissions
- Audit logging for compliance

### Guardrails
- Cost limits and budget enforcement
- Approval workflows for high-risk actions
- Rate limiting and throttling

## Monitoring and Debugging

### Agent Testing UI
Access the agent testing console at `/agents` to:
- Execute agents interactively
- View execution history
- Debug agent responses
- Monitor performance metrics

### Audit Logs
All agent executions are logged to the `AgentAuditLog` table:
- Input parameters (redacted)
- Output results (redacted)
- Execution metadata
- User and organization context

### Performance Monitoring
Track key metrics:
- Execution duration
- Token usage
- Error rates
- Success rates by capability