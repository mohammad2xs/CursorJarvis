import { NextRequest, NextResponse } from 'next/server'
import { emailIntegrationService } from '@/lib/email-integration'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const emailId = id
    const context = await request.json()
    
    const response = await emailIntegrationService.generateEmailResponse(emailId, context)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating email response:', error)
    return NextResponse.json(
      { error: 'Failed to generate email response' },
      { status: 500 }
    )
  }
}
