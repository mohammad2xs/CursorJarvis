import { NextRequest, NextResponse } from 'next/server'
import { getSmartNotificationsService } from '@/lib/smart-notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const notificationsService = getSmartNotificationsService()
    const result = await notificationsService.dismissNotification(id, userId)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Dismiss notification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to dismiss notification'
    }, { status: 500 })
  }
}
