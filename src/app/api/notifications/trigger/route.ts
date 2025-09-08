import { NextRequest, NextResponse } from 'next/server'
import { getSmartNotificationsService } from '@/lib/smart-notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, data, source } = body

    if (!userId || !type || !title || !message || !source) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userId, type, title, message, source'
      }, { status: 400 })
    }

    const notificationsService = getSmartNotificationsService()
    const notification = await notificationsService.triggerNotification({
      userId,
      type,
      title,
      message,
      data: data || {},
      source
    })

    return NextResponse.json({
      success: true,
      notification
    })

  } catch (error) {
    console.error('Trigger notification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to trigger notification'
    }, { status: 500 })
  }
}
