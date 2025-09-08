import { NextRequest, NextResponse } from 'next/server'
import { getZapierIntegrationService } from '@/lib/zapier-integration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const webhookStats = await zapierService.getWebhookStats()

    return NextResponse.json({
      success: true,
      webhooks: [], // Mock webhooks for now
      stats: webhookStats
    })

  } catch (error) {
    console.error('Zapier webhooks error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch webhooks'
    }, { status: 500 })
  }
}
