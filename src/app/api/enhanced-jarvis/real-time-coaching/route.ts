import { NextRequest, NextResponse } from 'next/server'
import { enhancedCursorJarvisService } from '@/lib/enhanced-cursor-jarvis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, transcript, context } = body

    if (!accountId || !transcript || !context) {
      return NextResponse.json(
        { error: 'Account ID, transcript, and context are required' },
        { status: 400 }
      )
    }

    const coaching = await enhancedCursorJarvisService.getRealTimeCoaching({
      accountId,
      transcript,
      context
    })

    return NextResponse.json(coaching)
  } catch (error) {
    console.error('Error getting real-time coaching:', error)
    return NextResponse.json(
      { error: 'Failed to get real-time coaching' },
      { status: 500 }
    )
  }
}
