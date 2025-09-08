import { NextRequest, NextResponse } from 'next/server'
import { emailIntegrationService } from '@/lib/email-integration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId') || 'default-account'
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const dateRange = {
      from: from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: to ? new Date(to) : new Date()
    }

    const analytics = await emailIntegrationService.getEmailAnalytics(accountId, dateRange)
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching email analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email analytics' },
      { status: 500 }
    )
  }
}
