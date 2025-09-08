import { NextRequest, NextResponse } from 'next/server'
import { emailIntegrationService } from '@/lib/email-integration'

export async function POST(request: NextRequest) {
  try {
    const { accountId, to, subject, body, cc, bcc, attachments, priority, scheduledAt } = await request.json()
    
    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'To, subject, and body are required' },
        { status: 400 }
      )
    }

    const result = await emailIntegrationService.sendEmail(
      accountId || 'default-account',
      to,
      subject,
      body,
      {
        cc,
        bcc,
        attachments,
        priority,
        scheduledAt
      }
    )
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
