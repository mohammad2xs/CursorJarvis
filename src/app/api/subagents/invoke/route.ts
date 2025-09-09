import { NextRequest, NextResponse } from 'next/server'
import { invokeSubagentServer } from '@/lib/subagent-exec'
import { withApi } from '@/lib/api-utils'

export const POST = withApi(async (request: NextRequest) => {
  try {
    const params = await request.json()
    const result = await invokeSubagentServer(params)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error invoking subagent:', error)
    const params = await request.json().catch(() => ({}))
    const result = await invokeSubagentServer(params)
    return NextResponse.json(result)
  }
})
