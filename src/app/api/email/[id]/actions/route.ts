import { NextRequest, NextResponse } from 'next/server'
import { emailIntegrationService } from '@/lib/email-integration'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const emailId = id
    const actions = await emailIntegrationService.generateEmailActions(emailId)
    
    return NextResponse.json(actions)
  } catch (error) {
    console.error('Error generating email actions:', error)
    return NextResponse.json(
      { error: 'Failed to generate email actions' },
      { status: 500 }
    )
  }
}
