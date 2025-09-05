import { NextRequest, NextResponse } from 'next/server'
import { enhancedCursorJarvisService } from '@/lib/enhanced-cursor-jarvis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    const dashboard = await enhancedCursorJarvisService.generateEnhancedDashboard(accountId)

    return NextResponse.json(dashboard)
  } catch (error) {
    console.error('Error generating enhanced dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to generate enhanced dashboard' },
      { status: 500 }
    )
  }
}
