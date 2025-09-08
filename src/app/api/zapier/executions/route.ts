import { NextRequest, NextResponse } from 'next/server'
import { getZapierIntegrationService } from '@/lib/zapier-integration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const zapId = searchParams.get('zapId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const executions = await zapierService.getExecutions(zapId || undefined)

    return NextResponse.json({
      success: true,
      executions
    })

  } catch (error) {
    console.error('Zapier executions error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch executions'
    }, { status: 500 })
  }
}
