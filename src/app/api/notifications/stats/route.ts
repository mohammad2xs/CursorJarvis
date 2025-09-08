import { NextRequest, NextResponse } from 'next/server'
import { getSmartNotificationsService } from '@/lib/smart-notifications'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const notificationsService = getSmartNotificationsService()
    const stats = await notificationsService.getNotificationStats(userId)

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Notification stats error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification stats'
    }, { status: 500 })
  }
}
