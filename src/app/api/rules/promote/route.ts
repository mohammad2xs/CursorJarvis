import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { playType, segment } = await request.json()

    // Create or update Golden Play
    await db.goldenPlay.upsert({
      where: {
        playType_segment: {
          playType,
          segment
        }
      },
      update: {
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        playType,
        segment,
        acceptanceRate: 0.85, // Default high acceptance rate
        replyRate: 0.15, // Default reply rate
        meetingRate: 0.10, // Default meeting rate
        isActive: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Rule ${playType} promoted to Golden Play for ${segment}` 
    })
  } catch (error) {
    console.error('Error promoting rule:', error)
    return NextResponse.json(
      { error: 'Failed to promote rule' },
      { status: 500 }
    )
  }
}
