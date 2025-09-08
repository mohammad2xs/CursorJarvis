import { NextRequest, NextResponse } from 'next/server'
import { emailIntegrationService } from '@/lib/email-integration'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const templates = await emailIntegrationService.getEmailTemplates(category || undefined)
    
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}
