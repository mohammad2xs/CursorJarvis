import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updates = await request.json()
    const { id } = await params

    const updatedMeeting = await db.meeting.update({
      where: { id },
      data: updates,
      include: {
        company: true,
        contact: true,
        opportunity: true
      }
    })

    return NextResponse.json(updatedMeeting)
  } catch (error) {
    console.error('Error updating meeting:', error)
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const meeting = await db.meeting.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        opportunity: true
      }
    })

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Error fetching meeting:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    )
  }
}
