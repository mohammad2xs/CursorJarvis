import { NextRequest, NextResponse } from 'next/server'
import { getZapierIntegrationService } from '@/lib/zapier-integration'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const { appId } = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const result = await zapierService.disconnectApp(appId)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Zapier app disconnect error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to disconnect app'
    }, { status: 500 })
  }
}
