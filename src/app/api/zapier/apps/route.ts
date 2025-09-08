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
    const apps = await zapierService.getApps()

    return NextResponse.json({
      success: true,
      apps
    })

  } catch (error) {
    console.error('Zapier apps error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch apps'
    }, { status: 500 })
  }
}
