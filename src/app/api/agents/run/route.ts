import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CoreCRM } from '../../../../core/crm/CoreCRM';
import { AgentSupervisor } from '../../../../agents/supervisor';
import { AgentCapability, AgentTaskContext, AgentResult } from '../../../../agents/types';
import { registerBuiltinAgents } from '../../../../agents/register.builtin';
import { registerExternalSubagents } from '../../../../agents/register.subagents';

// Initialize agents on module load
let agentsInitialized = false;

async function initializeAgents() {
  if (!agentsInitialized) {
    console.log('Initializing agents...');
    
    // Register built-in agents
    registerBuiltinAgents();
    
    // Attempt to register external subagents
    try {
      await registerExternalSubagents();
    } catch (error) {
      console.warn('Failed to register external subagents:', error);
    }
    
    agentsInitialized = true;
    console.log('Agents initialized successfully');
  }
}

/**
 * POST /api/agents/run
 * Execute an agent capability with the given context
 */
export async function POST(request: NextRequest) {
  try {
    // Initialize agents if not already done
    await initializeAgents();

    // Parse request body
    const body = await request.json();
    const { capability, context }: { capability: AgentCapability; context: AgentTaskContext } = body;

    // Validate required fields
    if (!capability) {
      return NextResponse.json(
        { ok: false, error: 'Capability is required' },
        { status: 400 }
      );
    }

    if (!context) {
      return NextResponse.json(
        { ok: false, error: 'Context is required' },
        { status: 400 }
      );
    }

    console.log(`API: Executing agent capability: ${capability}`);

    // Create CoreCRM instance
    const prisma = new PrismaClient();
    const coreCRM = new CoreCRM(prisma);

    // Create agent supervisor
    const supervisor = new AgentSupervisor(coreCRM);

    // Validate capability is supported
    if (!supervisor.isCapabilitySupported(capability)) {
      return NextResponse.json(
        { ok: false, error: `Capability not supported: ${capability}` },
        { status: 400 }
      );
    }

    // Validate context for this capability
    const validation = supervisor.validateContext(capability, context);
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, error: validation.error },
        { status: 400 }
      );
    }

    // Execute the agent
    const result: AgentResult = await supervisor.execute(capability, context);

    // Clean up
    await coreCRM.disconnect();
    await prisma.$disconnect();

    // Return result
    if (result.ok) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('Error in agent execution API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
        metadata: { timestamp: new Date().toISOString() },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/run
 * Get information about available capabilities and agents
 */
export async function GET() {
  try {
    // Initialize agents if not already done
    await initializeAgents();

    // Create a temporary supervisor to get capability info
    const prisma = new PrismaClient();
    const coreCRM = new CoreCRM(prisma);
    const supervisor = new AgentSupervisor(coreCRM);

    // Get supported capabilities
    const capabilities = supervisor.getSupportedCapabilities();
    
    // Get agent info for each capability
    const agentInfo = capabilities.map(capability => ({
      capability,
      agent: supervisor.getAgentInfo(capability),
    }));

    // Get registry stats
    const { getAgentRegistry } = await import('../../../../agents/registry');
    const registry = getAgentRegistry();
    const stats = registry.getStats();

    // Clean up
    await coreCRM.disconnect();
    await prisma.$disconnect();

    return NextResponse.json({
      ok: true,
      data: {
        capabilities,
        agents: agentInfo,
        stats,
      },
    });

  } catch (error) {
    console.error('Error getting agent info:', error);
    
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/agents/run
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}