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
    const zaps = await zapierService.getZaps()

    return NextResponse.json({
      success: true,
      zaps
    })

  } catch (error) {
    console.error('Zapier zaps error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch zaps'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, zap } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    if (!zap) {
      return NextResponse.json({
        success: false,
        error: 'Zap data is required'
      }, { status: 400 })
    }

    const zapierService = getZapierIntegrationService()
    const newZap = await zapierService.createZap(zap)

    return NextResponse.json({
      success: true,
      zap: newZap
    })

  } catch (error) {
    console.error('Zapier create zap error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create zap'
    }, { status: 500 })
  }
}
