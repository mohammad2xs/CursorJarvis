import { NextRequest, NextResponse } from 'next/server'
import { getSmartNotificationsService } from '@/lib/smart-notifications'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category') as 'sales' | 'marketing' | 'customer_success' | 'finance' | 'operations' | 'system' | null
    const priority = searchParams.get('priority') as 'low' | 'medium' | 'high' | 'critical' | 'urgent' | null
    const isRead = searchParams.get('isRead') ? searchParams.get('isRead') === 'true' : undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const notificationsService = getSmartNotificationsService()
    const notifications = await notificationsService.getNotifications(userId, {
      category: category || undefined,
      priority: priority || undefined,
      isRead,
      limit,
      offset
    })

    return NextResponse.json({
      success: true,
      notifications
    })

  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notification } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    if (!notification) {
      return NextResponse.json({
        success: false,
        error: 'Notification data is required'
      }, { status: 400 })
    }

    const notificationsService = getSmartNotificationsService()
    const newNotification = await notificationsService.createNotification(notification)

    return NextResponse.json({
      success: true,
      notification: newNotification
    })

  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 })
  }
}
