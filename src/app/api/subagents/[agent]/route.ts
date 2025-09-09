import { NextRequest, NextResponse } from 'next/server'
import { listAvailableSubagentSlugs } from '@/lib/subagent-registry'
import { invokeSubagentServer } from '@/lib/subagent-exec'
import { withApi, fail } from '@/lib/api-utils'

export const GET = withApi(async () => {
  const agents = listAvailableSubagentSlugs()
  return NextResponse.json({ agents })
})

export const POST = withApi(async (req: NextRequest, { params }: { params: Promise<{ agent: string }> }) => {
  try {
    const { agent } = await params
    const body = await req.json().catch(() => ({}))
    const { task, context, companyId } = body || {}

    if (!task || typeof task !== 'string') {
      return fail('Missing required field: task', 400)
    }

    const result = await invokeSubagentServer({ agent, task, context, companyId })
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Subagent invoke error:', error)
    return fail((error as Error)?.message || 'Failed to invoke subagent', 500)
  }
})
