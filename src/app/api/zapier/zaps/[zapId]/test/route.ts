import { NextRequest, NextResponse } from 'next/server'
import { getZapierIntegrationService } from '@/lib/zapier-integration'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params
    const body = await request.json()
    const { userId, testData } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const result = await zapierService.testZap(zapId, testData || {})

    return NextResponse.json(result)

  } catch (error) {
    console.error('Zapier test zap error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test zap'
    }, { status: 500 })
  }
}
