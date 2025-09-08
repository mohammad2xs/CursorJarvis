import { NextRequest, NextResponse } from 'next/server'
import { getZapierIntegrationService } from '@/lib/zapier-integration'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params
    const body = await request.json()
    const { userId, ...updates } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const updatedZap = await zapierService.updateZap(zapId, updates)

    return NextResponse.json({
      success: true,
      zap: updatedZap
    })

  } catch (error) {
    console.error('Zapier update zap error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update zap'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const result = await zapierService.deleteZap(zapId)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Zapier delete zap error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete zap'
    }, { status: 500 })
  }
}
