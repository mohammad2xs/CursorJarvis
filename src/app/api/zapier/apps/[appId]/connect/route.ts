import { NextRequest, NextResponse } from 'next/server'
import { getZapierIntegrationService } from '@/lib/zapier-integration'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const { appId } = await params
    const body = await request.json()
    const { userId, credentials } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const result = await zapierService.connectApp(appId, credentials || {})

    return NextResponse.json(result)

  } catch (error) {
    console.error('Zapier app connect error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to connect app'
    }, { status: 500 })
  }
}
