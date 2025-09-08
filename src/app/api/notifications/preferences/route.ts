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
    const preferences = await notificationsService.updatePreferences(userId, {})

    return NextResponse.json({
      success: true,
      preferences
    })

  } catch (error) {
    console.error('Notification preferences error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification preferences'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, preferences } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const notificationsService = getSmartNotificationsService()
    const updatedPreferences = await notificationsService.updatePreferences(userId, preferences)

    return NextResponse.json({
      success: true,
      preferences: updatedPreferences
    })

  } catch (error) {
    console.error('Update notification preferences error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification preferences'
    }, { status: 500 })
  }
}
