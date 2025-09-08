import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ActivityType } from '@/lib/constants'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action } = await request.json()
    const { id } = await params

    const contact = await db.contact.findUnique({
      where: { id },
      include: { company: true }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Create activity based on action
    let activityType: ActivityType = 'OUTREACH'
    let activityTitle = ''
    let activityDescription = ''

    switch (action) {
      case 'connect':
        activityType = 'OUTREACH'
        activityTitle = `LinkedIn connection request sent to ${contact.firstName} ${contact.lastName}`
        activityDescription = 'Sent LinkedIn connection request with personalized message'
        break
      case 'comment':
        activityType = 'OUTREACH'
        activityTitle = `Commented on ${contact.firstName}'s LinkedIn post`
        activityDescription = 'Engaged with recent LinkedIn activity to build rapport'
        break
      case 'dm':
        activityType = 'OUTREACH'
        activityTitle = `Direct message sent to ${contact.firstName} ${contact.lastName}`
        activityDescription = 'Sent personalized direct message with value proposition'
        break
      case 'merge':
        // Handle duplicate merge logic
        activityType = 'OUTREACH'
        activityTitle = `Merged duplicate contact: ${contact.firstName} ${contact.lastName}`
        activityDescription = 'Resolved duplicate contact entry'
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Create activity record
    await db.activity.create({
      data: {
        type: activityType,
        title: activityTitle,
        description: activityDescription,
        companyId: contact.companyId,
        contactId: contact.id
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Action '${action}' completed for ${contact.firstName} ${contact.lastName}` 
    })
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    )
  }
}
