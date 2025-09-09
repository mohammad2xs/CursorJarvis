import { CoreCRM, RecordType } from '../core/crm/CoreCRM';

// Agent Capability Types
export type AgentCapability = 
  | 'enrichment.waterfall'
  | 'research.account'
  | 'conversation.insights'
  | 'deal.predict'
  | 'sequence.orchestrate'
  | 'process.autonomy';

// Agent Task Context
export interface AgentTaskContext {
  recordType?: RecordType;
  recordId?: string;
  userId?: string;
  orgId?: string;
  payload: any;
}

// Agent Result
export interface AgentResult {
  ok: boolean;
  data?: any;
  error?: string;
  metadata?: {
    duration: number;
    tokensUsed?: number;
    confidence?: number;
  };
}

// Base Agent Interface
export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  version: string;
  
  // Execute the agent with given context
  execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult>;
  
  // Validate if the agent can handle this context
  canHandle(capability: AgentCapability, context: AgentTaskContext): boolean;
}

// Agent Registry Entry
export interface AgentRegistryEntry {
  agent: Agent;
  source: 'builtin' | 'external';
  registeredAt: Date;
}

// Agent Execution Context (full context passed to agents)
export interface AgentExecutionContext extends AgentTaskContext {
  capability: AgentCapability;
  coreCRM: CoreCRM;
  startTime: number;
}

// Data redaction utility
export function redactSensitiveData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveFields = ['email', 'phone', 'ssn', 'creditCard', 'password', 'token'];
  const redacted = { ...data };

  for (const key in redacted) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      if (typeof redacted[key] === 'string') {
        const value = redacted[key] as string;
        if (value.includes('@')) {
          // Email redaction
          const [username, domain] = value.split('@');
          redacted[key] = `${username.slice(0, 2)}***@${domain}`;
        } else if (/^\+?\d+$/.test(value)) {
          // Phone redaction
          redacted[key] = `***${value.slice(-4)}`;
        } else {
          redacted[key] = '***';
        }
      } else {
        redacted[key] = '***';
      }
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }

  return redacted;
}

// Abstract base agent class
export abstract class BaseAgent implements Agent {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly capabilities: AgentCapability[];
  public readonly version: string;

  constructor(
    id: string,
    name: string,
    description: string,
    capabilities: AgentCapability[],
    version: string = '1.0.0'
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.capabilities = capabilities;
    this.version = version;
  }

  abstract execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult>;

  canHandle(capability: AgentCapability, context: AgentTaskContext): boolean {
    return this.capabilities.includes(capability);
  }

  protected createSuccessResult(data: any, metadata?: any): AgentResult {
    return {
      ok: true,
      data: redactSensitiveData(data),
      metadata,
    };
  }

  protected createErrorResult(error: string | Error, metadata?: any): AgentResult {
    const errorMessage = error instanceof Error ? error.message : error;
    return {
      ok: false,
      error: errorMessage,
      metadata,
    };
  }

  protected async auditExecution(
    context: AgentExecutionContext,
    result: AgentResult
  ): Promise<void> {
    try {
      await context.coreCRM.auditAgentRun({
        agentId: this.id,
        capability: context.capability,
        recordType: context.recordType,
        recordId: context.recordId,
        userId: context.userId,
        orgId: context.orgId,
        payload: redactSensitiveData(context.payload),
        result: redactSensitiveData(result),
      });
    } catch (error) {
      console.error('Failed to audit agent execution:', error);
      // Don't throw - auditing failures shouldn't break agent execution
    }
  }
}

export default BaseAgent;