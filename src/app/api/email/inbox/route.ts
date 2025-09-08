import { NextRequest, NextResponse } from 'next/server'
import { emailIntegrationService } from '@/lib/email-integration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId') || 'default-account'
    const category = searchParams.get('category')
    const isRead = searchParams.get('isRead')
    const searchQuery = searchParams.get('search')

    const filters: {
      category?: string
      isRead?: boolean
      searchQuery?: string
    } = {}
    if (category) filters.category = category
    if (isRead !== null) filters.isRead = isRead === 'true'
    if (searchQuery) filters.searchQuery = searchQuery

    const emails = await emailIntegrationService.getEmails(accountId, filters)
    
    return NextResponse.json(emails)
  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}
