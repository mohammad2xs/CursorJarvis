import { NextRequest, NextResponse } from 'next/server'
import { listAvailableSubagentSlugs } from '@/lib/subagent-registry'
import { invokeSubagentServer } from '@/lib/subagent-exec'

export async function GET() {
  const agents = listAvailableSubagentSlugs()
  return NextResponse.json({ agents })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ agent: string }> }) {
  try {
    const { agent } = await params
    const body = await req.json().catch(() => ({}))
    const { task, context, companyId } = body || {}

    if (!task || typeof task !== 'string') {
      return NextResponse.json({ error: 'Missing required field: task' }, { status: 400 })
    }

    const result = await invokeSubagentServer({ agent, task, context, companyId })
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Subagent invoke error:', error)
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to invoke subagent' }, { status: 500 })
  }
}
